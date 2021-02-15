import React, {Component} from 'react';
import autobind from 'autobind-decorator';
import {ipcRenderer} from 'electron';
import {View} from 'react-native';

import SearchBar from '../../components/search-bar';
import SearchResults from '../../components/search-results';
import StaticFooter from '../../components/static-footer';

import {doGiphySearch, fetchGiphyTrending} from '../../giphy-search';
import {getGlobalElectronProperty, setGlobalElectronProperty, viewModes} from '../../utils';
import {getFavorites, removeFavorite, storeFavorite} from '../../favorites';

import loadingImage from '../../images/loading.gif';
const styles = {
  footer: {
    alignSelf: 'flex-end',
    backgroundColor: '#e8e6e8',
    borderTopColor: '#c2c0c2',
    height: 45,
    width: '100%'
  },
  main: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white'
  },
  searchBar: {
    backgroundColor: '#e8e6e8',
    borderBottomColor: '#c2c0c2',
    height: 35
  },
  searchResults: {
    flex: 1,
    overflow: 'scroll'
  }
};

const SEARCH_LIMIT = 25;
const BrowserWindow = electron.remote.BrowserWindow;

const initialState = {
  currentSearchTerm: ``,
  gifs: [],
  status: {},
  offset: 0,
  shouldFocus: false,
  title: null,
  totalResults: 0,
  trendingGifs: [],
  isTrending: true,
  viewMode: viewModes.trending
};

class Main extends Component {
  constructor(props) {
    super(props);

    this.rating = getGlobalElectronProperty(`hideNSFW`) ? `g` : `r`;

    this.state = initialState;

    electron.ipcRenderer.on(`after-show`, () => {
      this.setState({shouldFocus: true});
    });
  }

  componentWillMount() {
    document.addEventListener(`keydown`, (event) => {
      if (event.key === `Escape`) {
        this.doClear();
      }
    });
    if (getGlobalElectronProperty(`fetchTrending`)) {
      this.fetchTrending(0);
    }
  }

  @autobind
  doClear() {
    if (this.state.currentSearchTerm === `` && this.state.viewMode === viewModes.trending) {
      this.hideCurrentWindow();
    }
    this.setState(Object.assign({}, initialState, {gifs: this.state.trendingGifs, trendingGifs: this.state.trendingGifs}));
  }

  /**
   * Handles the actual searching on giphy
   *
   * @param {any} searchTerm
   *
   * @memberOf Main

    */
  @autobind
  doSearch(searchTerm) {
    this.searchRequest(searchTerm, 0);
  }

  @autobind
  changeOffset(offset) {
    this.setState({offset});
    if (this.state.viewMode === viewModes.favorites) {
      this.displayFavorites(null, offset);
    } else {
      this.searchRequest(this.state.currentSearchTerm, offset);
    }
  }

  @autobind
  searchRequest(searchTerm, offset) {
    if (searchTerm) {
      this.setState({
        status: {
          message: `Searching for "${searchTerm}"...`,
          imageUrl: loadingImage,
        },
        viewMode: viewModes.searchResults
      });

      doGiphySearch(searchTerm, offset, this.rating, SEARCH_LIMIT).then(({gifs, pagination}) => {
        if (gifs.length === 0) {
          this.setState({
            gifs:   [],
            isTrending: false,
            offset,
            status: {
              message:  `Could not find any gifs for "${searchTerm}".`,
              imageUrl: `https://media3.giphy.com/media/l3V0HLYPfIKIVDyBG/giphy.gif`,
              isError:  true,
            },
          });
        }
        else {
          this.setState({
            currentSearchTerm: searchTerm,
            gifs,
            isTrending: false,
            offset,
            status: {},
            totalResults: pagination.total_count
          });
        }
        window.scrollTo(0,0);
      });
    }
    else {
      this.setState({
        status: {
          message: `Please enter a search term.`,
          imageUrl: `http://media4.giphy.com/media/12zV7u6Bh0vHpu/giphy.gif`,
          isError:  true,
        }
      });
    }
  }

  /**
   * Shows the detail window
   *
   * @param {any} gif
   *
   * @memberOf Main
   */
  @autobind
  showModal(gif) {
    const alwaysOnTop = getGlobalElectronProperty(`alwaysOnTop`);
    if (!alwaysOnTop) {
      // The main window shouldn't disappear when clicking to preview a gif.
      setGlobalElectronProperty(`autoHideEnabled`, false);
    }

    const url = gif.fullSizedImageUrl;
    const width = gif.imageSizes.fullSize.width ? gif.imageSizes.fullSize.width : 200;
    const height = gif.imageSizes.fullSize.height ? gif.imageSizes.fullSize.height : 200;
    let webPreferences = {
      zoomFactor: 1.0
    };
    let options = {
      width: width,
      height: height,
      maxWidth: width,
      maxHeight: height,
      resizable: false,
      title: `Image`,
      webPreferences: webPreferences,
      useContentSize: true
    };

    let win = new BrowserWindow(options);

    win.on(`closed`, () => {
      win = null;
    });
    let fileUrl = `file://${dirname}/modal.html?url=${url}&width=${width}&height=${height}`;
    win.loadURL(fileUrl);
    win.show();
    win.setAlwaysOnTop(alwaysOnTop, `floating`);

    // restore window hiding stuff.
    setGlobalElectronProperty(`autoHideEnabled`, !alwaysOnTop);
  }

  @autobind
  hideCurrentWindow() {
    let win = BrowserWindow.getFocusedWindow();
    win.hide();
  }

  /**
   * Copies image object's url to system clipboard
   *
   * @param {any} image
   *
   * @memberOf Main
   */
  @autobind
  copyUrl(image) {
    const hashTag = getGlobalElectronProperty(`includeHashTag`) ? ` #gifbar` : ``;
    electron.clipboard.writeText(`${image.fullSizedImageUrl}${hashTag}`);
    if (getGlobalElectronProperty(`hideOnCopy`)) {
      this.hideCurrentWindow();
    }
    ipcRenderer.send(`notify`, `GIF Copied!`);
  }

  @autobind
  displayFavorites(event, offset=0) {
    const {favorites, totalCount} = getFavorites(SEARCH_LIMIT, offset);
    this.setState({
      gifs: favorites,
      isTrending: false,
      offset: offset,
      status: {},
      title: `Favorites`,
      viewMode: viewModes.favorites,
      totalResults: totalCount
    });
  }

  favoriteImage(image) {
    storeFavorite(image);
  }

  @autobind
  removeFavoriteImage(image) {
    removeFavorite(image);
    this.displayFavorites();
  }

  @autobind
  handleSearchBarFocus() {
    this.setState({shouldFocus: false});
  }

  @autobind
  fetchTrending(offset) {
    this.setState({
      status: {
        message:  `Loading trending gifs...`,
      },
    });
    fetchGiphyTrending(offset, this.rating, SEARCH_LIMIT)
      .then(({gifs}) => {
        this.setState({
          gifs,
          isTrending: true,
          offset,
          status: {},
          trendingGifs: gifs,
          viewMode: viewModes.trending
        })
      })
      .catch(() => {
        this.setState({
          status: {
            message:  `Could not load trending gifs, giphy not found!`,
            imageUrl: `https://media3.giphy.com/media/l3V0HLYPfIKIVDyBG/giphy.gif`,
            isError:  true,
          },
        })
      });
  }

  @autobind
  refreshTrending() {
    this.fetchTrending(0);
  }

  calcPaginationAvailability(totalResults, currentResultCount, offset) {
    let result = {
      forwardAvailable: false,
      previousAvailable: false
    };

    if (totalResults === 0) {
      return result;
    }

    if (currentResultCount + offset < totalResults) {
      result.forwardAvailable = true;
    }

    if (offset >= currentResultCount) {
      result.previousAvailable = true;
    }

    return result;
  }

  render() {
    const {previousAvailable, forwardAvailable} = this.calcPaginationAvailability(this.state.totalResults, this.state.gifs.length, this.state.offset);
    const showPagination = (this.state.viewMode === viewModes.searchResults || this.state.viewMode === viewModes.favorites) && this.state.totalResults > 0;
    return (
      <View style={styles.main}>
        <View style={styles.searchBar}>
          <SearchBar
            doClear={this.doClear}
            doExit={this.hideCurrentWindow}
            doSearch={this.doSearch}
            onFocus={this.handleSearchBarFocus}
            shouldFocus={this.state.shouldFocus}
          />
        </View>
        <View style={styles.searchResults}>
          <SearchResults
            copyUrl={this.copyUrl}
            favoriteImage={this.favoriteImage}
            openModal={this.showModal}
            removeFavorite={this.removeFavoriteImage}
            results={this.state.gifs}
            status={this.state.status}
            viewMode={this.state.viewMode}
          />
        </View>
        <View style={styles.footer}>
          <StaticFooter
            changeOffset={this.changeOffset}
            count={SEARCH_LIMIT}
            currentOffset={this.state.offset}
            displayFavorites={this.displayFavorites}
            handleRefresh={this.refreshTrending}
            isTrending={this.state.isTrending}
            navPrevEnabled={previousAvailable}
            navForwardEnabled={forwardAvailable}
            showNav={showPagination}
            title={this.state.title}
            totalResults={this.state.totalResults}
            viewMode={this.state.viewMode}
          />
        </View>
      </View>
    );
  }
}

export default Main;
