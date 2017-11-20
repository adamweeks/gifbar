import React, {Component} from 'react';
import autobind from 'autobind-decorator';
import {ipcRenderer} from 'electron';
import SearchBar from '../../components/search-bar';
import SearchResults from '../../components/search-results';
import StaticFooter from '../../components/static-footer';

import {doGiphySearch, fetchGiphyTrending} from '../../giphy-search';
import {getGlobalElectronProperty, setGlobalElectronProperty} from '../../utils';
import {getFavorites, storeFavorite} from '../../favorites';

import loadingImage from '../../images/loading.gif';
import style from './styles.css';

const SEARCH_LIMIT = 25;
const BrowserWindow = electron.remote.BrowserWindow;
const viewModes = {
  searchResults: 0,
  trending: 1,
  favorites: 2
};

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
    this.fetchTrending(0);
    document.addEventListener(`keydown`, (event) => {
      if (event.key === `Escape`) {
        this.doClear();
      }
    });
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
    this.searchRequest(this.state.currentSearchTerm, offset);
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
  displayFavorites() {
    const favorites = getFavorites();
    this.setState({
      gifs: favorites,
      isTrending: false,
      offset: 0,
      status: {},
      title: `Favorites`,
      viewMode: viewModes.favorites
    });
  }

  @autobind
  favoriteImage(image) {
    storeFavorite(image);
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
    const showPagination = this.state.viewMode === viewModes.searchResults && this.state.totalResults > 0;
    return (
      <div className={style.mainContainer}>
        <div className={style.searchBar}>
          <SearchBar
            doClear={this.doClear}
            doExit={this.hideCurrentWindow}
            doSearch={this.doSearch}
            onFocus={this.handleSearchBarFocus}
            shouldFocus={this.state.shouldFocus}
          />
        </div>
        <div className={style.results}>
          <SearchResults
            copyUrl={this.copyUrl}
            favoriteImage={this.favoriteImage}
            openModal={this.showModal}
            results={this.state.gifs}
            status={this.state.status}
          />
        </div>
        <div className={style.attribution}>
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
            viewMode={this.viewMode}
          />
        </div>
      </div>
    );
  }
}

export default Main;
