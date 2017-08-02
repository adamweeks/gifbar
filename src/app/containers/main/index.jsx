import React, {Component} from 'react';
import autobind from 'autobind-decorator';
import {ipcRenderer} from 'electron';

import SearchBar from '../../components/search-bar';
import SearchResults from '../../components/search-results';
import SearchPagination from '../../components/search-pagination';

import GiphySearch from '../../giphy-search';
import {getReadableFileSizeString, getGlobalElectronProperty, setGlobalElectronProperty} from '../../utils';

import loadingImage from '../../images/loading.gif';

const GIPHY_API_KEY = `dc6zaTOxFJmzC`;
const SEARCH_LIMIT = 25;
const BrowserWindow = electron.remote.BrowserWindow;

const initialState = {
    currentSearchTerm: ``,
    gifs: [],
    status: {},
    offset: 0,
    shouldFocus: false,
    totalResults: 0
};

class Main extends Component {
    constructor(props) {
        super(props);

        this.giphySearch = new GiphySearch(GIPHY_API_KEY);

        this.state = initialState;

        electron.ipcRenderer.on('after-show', () => {
            this.setState({shouldFocus: true});
        });
    }

    @autobind
    doClear() {
        if (this.state.currentSearchTerm === ``) {
            this.hideCurrentWindow();
        }
        this.setState(initialState);
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
        this.searchRequest(searchTerm, this.state.offset);
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

            const rating = getGlobalElectronProperty('hideNSFW') ? 'g' : 'r';
            this.giphySearch.doSearch(searchTerm, offset, rating, SEARCH_LIMIT).then((results) => {
                if (results.data.length === 0) {
                    this.setState({
                        gifs:   [],
                        status: {
                            message:  `Could not find any gifs for "${searchTerm}".`,
                            imageUrl: 'https://media3.giphy.com/media/l3V0HLYPfIKIVDyBG/giphy.gif',
                            isError:  true,
                        },
                    });
                }
                else {
                    const gifs = results.data.map((giphyObject) => {
                        return {
                            id: giphyObject.id,
                            displayUrl: giphyObject.images.fixed_width.url,
                            fullSizedImageUrl: giphyObject.images.original.url,
                            fullSizedImageFileSize: getReadableFileSizeString(giphyObject.images.original.size),
                            sourceUrl: giphyObject.url,
                            imageSizes: {
                                fullSize: {
                                    width: parseInt(giphyObject.images.original.width),
                                    height: parseInt(giphyObject.images.original.height)
                                },
                                smallSize: {
                                    width: parseInt(giphyObject.images.fixed_width.width),
                                    height: parseInt(giphyObject.images.fixed_width.height)
                                }
                            }
                        };
                    });

                    this.setState({
                        currentSearchTerm: searchTerm,
                        gifs,
                        status: {},
                        totalResults: results.pagination.total_count
                    });
                }
                window.scrollTo(0,0);
            });
        }
        else {
            this.setState({
                status: {
                    message: 'Please enter a search term.',
                    imageUrl: 'http://media4.giphy.com/media/12zV7u6Bh0vHpu/giphy.gif',
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
        const alwaysOnTop = getGlobalElectronProperty('alwaysOnTop');
        if (!alwaysOnTop) {
            // The main window shouldn't disappear when clicking to preview a gif.
            setGlobalElectronProperty('autoHideEnabled', false);
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
            title: "Image",
            webPreferences: webPreferences,
            useContentSize: true
        };

        let win = new BrowserWindow(options);

        win.on('closed', () => {
            win = null;
        });
        let fileUrl = `file://${dirname}/modal.html?url=${url}&width=${width}&height=${height}`;
        win.loadURL(fileUrl);
        win.show();
        win.setAlwaysOnTop(alwaysOnTop, 'floating');

        // restore window hiding stuff.
        setGlobalElectronProperty('autoHideEnabled', !alwaysOnTop);
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
        const hashTag = getGlobalElectronProperty('includeHashTag') ? ' #gifbar' : '';
        electron.clipboard.writeText(`${image.fullSizedImageUrl}${hashTag}`);
        if (getGlobalElectronProperty('hideOnCopy')) {
            this.hideCurrentWindow();
        }
        ipcRenderer.send('notify', 'GIF Copied!');
    }

    @autobind
    handleSearchBarFocus() {
        this.setState({shouldFocus: false});
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
        const showPagination = this.state.totalResults > 0;
        return (
            <div>
                <SearchBar
                    doClear={this.doClear}
                    doExit={this.hideCurrentWindow}
                    doSearch={this.doSearch}
                    onFocus={this.handleSearchBarFocus}
                    shouldFocus={this.state.shouldFocus}
                />
                <SearchResults
                    copyUrl={this.copyUrl}
                    status={this.state.status}
                    openModal={this.showModal}
                    results={this.state.gifs}
                />
                {
                    showPagination &&
                    <SearchPagination
                        amount={SEARCH_LIMIT}
                        changeOffset={this.changeOffset}
                        currentOffset={this.state.offset}
                        forwardAvailable={forwardAvailable}
                        previousAvailable={previousAvailable}
                        totalResults={this.state.totalResults}
                    />
                }
            </div>
        );
    }
}

export default Main;
