import React, {Component} from 'react';
import autobind from 'autobind-decorator';
import {ipcRenderer} from 'electron';
import SearchBar from '../../components/search-bar';
import SearchResults from '../../components/search-results';
import StaticFooter from '../../components/static-footer';

import {doGiphySearch, fetchGiphyTrending} from '../../giphy-search';
import {getGlobalElectronProperty, setGlobalElectronProperty} from '../../utils';

import loadingImage from '../../images/loading.gif';
import style from './styles.css';

const SEARCH_LIMIT = 25;
const BrowserWindow = electron.remote.BrowserWindow;

const initialState = {
  currentSearchTerm: ``,
  gifs: [],
  status: {},
  offset: 0,
  shouldFocus: false,
  totalResults: 0,
  trendingGifs: [],
  isTrending: true
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
    if (this.state.currentSearchTerm === ``) {
      this.hideCurrentWindow();
    }
    this.setState(Object.assign({}, initialState, {trendingGifs: this.state.trendingGifs}));
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
        }
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
  handleSearchBarFocus() {
    this.setState({shouldFocus: false});
  }

  @autobind
  fetchTrending(offset) {
    fetchGiphyTrending(offset, this.rating, SEARCH_LIMIT).then(({gifs}) => {
      this.setState({
        trendingGifs: gifs,
        isTrending: true,
        offset
      })
    });
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

    const paginationResults = this.calcPaginationAvailability(this.state.totalResults, this.state.gifs.length, this.state.offset);
    const previousAvailable = paginationResults.previousAvailable;
    const forwardAvailable = paginationResults.forwardAvailable;
    const showPagination = this.state.isTrending ? false : this.state.totalResults > 0;
    const results = this.state.isTrending ? this.state.trendingGifs : this.state.gifs;
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
            status={this.state.status}
            openModal={this.showModal}
            results={results}
          />
        </div>
        <div className={style.attribution}>
          <StaticFooter
            changeOffset={this.changeOffset}
            count={SEARCH_LIMIT}
            currentOffset={this.state.offset}
            isTrending={this.state.isTrending}
            navPrevEnabled={previousAvailable}
            navForwardEnabled={forwardAvailable}
            showNav={showPagination}
            totalResults={this.state.totalResults}
          />
        </div>
      </div>
    );
  }
}

export default Main;
