[![Stories in Ready](https://badge.waffle.io/adamweeks/gifbar.png?label=ready&title=Ready)](https://waffle.io/adamweeks/gifbar)
# Angular 2 + Electron Sample

This is an Angular 2 and Electron sample app

## Installation

To get started, clone the repo to your target directory. This app uses Webpack, and a few commands have been provided as scripts in `package.json`.

```bash
npm install

# To build only
npm run build

# To watch for changes
npm run watch

# Start the Electron app
npm run electron
```

## Notes
Currently, the build process is not working properly and requires
manual intervention.

Make sure to add these to the build folder:
```
cp -R node_modules/electron-positioner/ build/node_modules/electron-positioner
cp -R node_modules/extend/ build/node_modules/extend
```