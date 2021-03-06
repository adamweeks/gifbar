const path = require(`path`);
const events = require(`events`);

const electron = require(`electron`);
const {ipcMain, app, Tray, Menu, globalShortcut, BrowserWindow, Notification, shell} = electron;
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';

const settings = require(`electron-settings`);

const extend = require(`extend`);
const Positioner = require(`electron-positioner`);
const AutoLaunch = require(`auto-launch-patched`);
const url = require(`url`);

const indexFile = require(`./index.html`);
const gifbarIcon = require(`./gifbar-icon.png`);
require(`./gifbar-icon@2x.png`);
require(`./Icon.icns`);
require(`./modal.html`);

// electron requires a basic package.json that has a main entry point
require(`./package.json`);

const env = require(`../env.json`);

const shortcut = `CommandOrControl+Alt+G`;

const options = {
  dir: app.getAppPath(),
  width: 436,
  height: 600,
  resizable: false,
  tooltip: `GifBar`,
  preloadWindow: true,
  icon: path.join(__dirname, gifbarIcon)
};

create(options);

function create (opts) {
  if (!opts[`window-position`]) opts[`window-position`] = (process.platform === `win32`) ? `trayBottomCenter` : `trayCenter`;

  app.on(`ready`, appReady);
  app.on(`will-quit`, willQuit);

  var menubar = new events.EventEmitter();
  menubar.app = app;
  return menubar;

  function appReady () {
    installExtension(REACT_DEVELOPER_TOOLS)

    global.sharedObject = {
      alwaysOnTop:    settings.get(`alwaysOnTop`, false),
      hideNSFW:       settings.get(`hideNSFW`, true),
      hideAlert:      settings.get(`hideAlert`, false),
      includeHashTag: settings.get(`includeHashTag`, true),
      hideOnCopy:     settings.get(`hideOnCopy`, true),
      launchAtLogin:  false, // setting not necessary as the OS handles that.
      globalShortcut: settings.get(`globalShortcut`, true),
      giphyAPIKey:    env.GIPHY_API_KEY
    };
    global.sharedObject.autoHideEnabled = !global.sharedObject.alwaysOnTop;

    // Hide dock icon
    if (app.dock) app.dock.hide();

    var cachedBounds; // cachedBounds are needed for double-clicked event

    menubar.tray = new Tray(opts.icon);
    menubar.tray.on(`click`, clicked);
    menubar.tray.on(`double-click`, clicked);
    menubar.tray.on(`right-click`, showDetailMenu);
    menubar.tray.setToolTip(opts.tooltip);

    if (opts.preloadWindow || opts[`preload-window`]) {
      createWindow();
    }

    globalShortcut.register(shortcut, function() {
      if (menubar.window && menubar.window.isVisible() && menubar.window.isFocused()) {
        return hideWindow();
      }

      if (global.sharedObject.globalShortcut) {
        showWindow(cachedBounds);
      }
    });

    var gifbarAutoLauncher = new AutoLaunch({
      name: `GifBar`,
    });

    gifbarAutoLauncher.isEnabled()
      .then(function(isEnabled) {
        if (isEnabled) {
          global.sharedObject.launchAtLogin = true;
        }
      });

    menubar.showWindow = showWindow;
    menubar.hideWindow = hideWindow;
    menubar.emit(`ready`);

    notify(`GIFBar Ready!`);

    function clicked (e, bounds) {
      if (e.altKey || e.shiftKey || e.ctrlKey || e.metaKey) {
        return hideWindow();
      }
      if (menubar.window && menubar.window.isVisible() && menubar.window.isFocused()) {
        return hideWindow();
      }
      cachedBounds = bounds || cachedBounds;
      showWindow(cachedBounds);
    }

    function createWindow () {
      menubar.emit(`create-window`);
      var defaults = {
        show: false,
        frame: false
      };

      var winOpts = extend(defaults, opts);
      menubar.window = new BrowserWindow(winOpts);

      menubar.positioner = new Positioner(menubar.window);

      setWindowAlwaysOnTop();

      if (opts[`show-on-all-workspaces`] !== false) {
        menubar.window.setVisibleOnAllWorkspaces(true);
      }

      menubar.window.on(`blur`, autoHideWindow);
      menubar.window.on(`close`, windowClear);
      menubar.window.loadURL(
        url.format({
          pathname: path.join(__dirname, indexFile),
          protocol: `file:`,
          slashes: true
        })
      );
      menubar.emit(`after-create-window`);
    }

    function setWindowAlwaysOnTop() {
      menubar.window.setAlwaysOnTop(global.sharedObject.alwaysOnTop, `floating`);
      global.sharedObject.autoHideEnabled = !global.sharedObject.alwaysOnTop;
    }

    function showWindow (trayPos) {
      if (!menubar.window) {
        createWindow();
      }

      menubar.emit(`show`);

      if (trayPos && trayPos.x !== 0) {
        // Cache the bounds
        cachedBounds = trayPos;
      } else if (cachedBounds) {
        // Cached value will be used if showWindow is called without bounds data
        trayPos = cachedBounds;
      }

      // Default the window to the right if `trayPos` bounds are undefined or null.
      var noBoundsPosition = null;
      if ((trayPos === undefined || trayPos.x === 0) && opts[`window-position`].substr(0, 4) === `tray`) {
        noBoundsPosition = (process.platform === `win32`) ? `bottomRight` : `topRight`;
      }

      var position = menubar.positioner.calculate(noBoundsPosition || opts[`window-position`], trayPos);

      var x = (opts.x !== undefined) ? opts.x : position.x;
      var y = (opts.y !== undefined) ? opts.y : position.y;

      menubar.window.setPosition(x, y);
      menubar.window.show();
      menubar.emit(`after-show`);
      // Send an event that we have shown the window
      menubar.window.webContents.send(`after-show`);
      return;
    }

    function hideWindow() {
      if (!menubar.window) return;
      menubar.emit(`hide`);
      menubar.window.hide();
      menubar.emit(`after-hide`);
    }

    function autoHideWindow() {
      if (global.sharedObject.autoHideEnabled) {
        hideWindow();
      }
    }

    function windowClear () {
      delete menubar.window;
      menubar.emit(`after-close`);
    }

    function showDetailMenu () {
      var contextMenu = Menu.buildFromTemplate([
        {
          label: `Preferences`,
          enabled: false
        },
        {
          label: `Always on Top`,
          type: `checkbox`,
          checked: global.sharedObject.alwaysOnTop,
          click: function() {
            global.sharedObject.alwaysOnTop = !global.sharedObject.alwaysOnTop;
            setWindowAlwaysOnTop();
            settings.set(`alwaysOnTop`, global.sharedObject.alwaysOnTop);
          }
        },
        {
          label: `Hide NSFW`,
          type: `checkbox`,
          checked: global.sharedObject.hideNSFW,
          click: function() {
            global.sharedObject.hideNSFW = !global.sharedObject.hideNSFW;
            settings.set(`hideNSFW`, global.sharedObject.hideNSFW);
          }
        },
        {
          label: `Append #gifbar on copy`,
          type: `checkbox`,
          checked: global.sharedObject.includeHashTag,
          click: function() {
            global.sharedObject.includeHashTag = !global.sharedObject.includeHashTag;
            settings.set(`includeHashTag`, global.sharedObject.includeHashTag);
          }
        },
        {
          label: `Show alert on copy`,
          type: `checkbox`,
          checked: !global.sharedObject.hideAlert,
          click: function() {
            global.sharedObject.hideAlert = !global.sharedObject.hideAlert;
            settings.set(`hideAlert`, global.sharedObject.hideAlert);
          }
        },
        {
          label: `Hide window on copy`,
          type: `checkbox`,
          checked: global.sharedObject.hideOnCopy,
          click: function() {
            global.sharedObject.hideOnCopy = !global.sharedObject.hideOnCopy;
            settings.set(`hideOnCopy`, global.sharedObject.hideOnCopy);
          }
        },
        {
          label: `Global Shortcut ⌘-Alt-G`,
          type: `checkbox`,
          checked: global.sharedObject.globalShortcut,
          click: function() {
            global.sharedObject.globalShortcut = !global.sharedObject.globalShortcut;
            settings.set(`globalShortcut`, global.sharedObject.globalShortcut);
          }
        },
        {
          label: `Launch at Login`,
          type: `checkbox`,
          checked: global.sharedObject.launchAtLogin,
          click: function() {
            global.sharedObject.launchAtLogin = !global.sharedObject.launchAtLogin;
            if (global.sharedObject.launchAtLogin) {
              gifbarAutoLauncher.enable();
            } else {
              gifbarAutoLauncher.disable();
            }
          }
        },
        {
          type: `separator`
        },
        {
          role: `help`,
          submenu: [
            {
              label: `Github`,
              click () { shell.openExternal(`https://github.com/adamweeks/gifbar`) }
            },
            {
              label: `Toggle DevTools`,
              accelerator: `Alt+Command+I`,
              click: function() {
                menubar.window.show();
                menubar.window.toggleDevTools();
              }
            },
          ]
        },
        {
          type: `separator`
        },
        {
          label: `Quit`,
          accelerator: `Command+Q`,
          selector: `terminate:`
        }
      ]);

      menubar.tray.popUpContextMenu(contextMenu);
    }
  }

  function willQuit() {
    globalShortcut.unregister(shortcut);
  }
}

ipcMain.on(`notify`, (event, message) => {
  notify(message);
})

/**
 * Displays a system notification if supported
 * @param {string} message
 */
function notify(message) {
  if (!Notification.isSupported()) {
    return;
  }
  const options = {
    title: `GIFBar`,
    body: message,
    silent: true
  }
  const notification = new Notification(options);
  notification.show();
}
