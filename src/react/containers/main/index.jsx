import React, {Component} from 'react';

import SearchBar from '../../components/search-bar';
import SearchResults from '../../components/search-results';
import SearchPagination from '../../components/search-pagination';

import GiphySearch from '../../giphy-search';
import {getReadableFileSizeString, getGlobalElectronProperty} from '../../utils';

const GIPHY_API_KEY = `dc6zaTOxFJmzC`;
const SEARCH_LIMIT = 25;
const BrowserWindow = electron.remote.BrowserWindow;

const initialState = {
    currentSearchTerm: ``,
    gifs: [],
    error: {},
    offset: 0,
    shouldFocus: false,
    totalResults: 0
};

class Main extends Component {
    constructor(props) {
        super(props);

        this.giphySearch = new GiphySearch(GIPHY_API_KEY);

        this.changeOffset = this.changeOffset.bind(this);
        this.copyUrl = this.copyUrl.bind(this);
        this.doClear = this.doClear.bind(this);
        this.doSearch = this.doSearch.bind(this);
        this.handleSearchBarFocus = this.handleSearchBarFocus.bind(this);
        this.hideCurrentWindow = this.hideCurrentWindow.bind(this);
        this.searchRequest = this.searchRequest.bind(this);
        this.showModal = this.showModal.bind(this);

        this.state = initialState;

        electron.ipcRenderer.on('after-show', () => {
            this.setState({shouldFocus: true});
        });
    }

    doClear() {
        this.setState(initialState);
    }

    /**
     * Handles the actual searching on giphy
     *
     * @param {any} searchTerm
     *
     * @memberOf Main

     */
    doSearch(searchTerm) {
        this.searchRequest(searchTerm, this.state.offset);
    }


    changeOffset(offset) {
        this.setState({offset});
        this.searchRequest(this.state.currentSearchTerm, offset);
    }

    searchRequest(searchTerm, offset) {
        if (searchTerm) {
            const rating = getGlobalElectronProperty('hideNSFW') ? 'g' : 'r';
            this.giphySearch.doSearch(searchTerm, offset, rating, SEARCH_LIMIT).then((results) => {
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
                const pagination = results.pagination;
                this.setState({
                    currentSearchTerm: searchTerm,
                    gifs,
                    error: {},
                    totalResults: pagination.total_count
                });
                window.scrollTo(0,0);
            });
        }
        else {
            const error = {
                message: 'Please enter a search term.',
                imageUrl: 'http://media4.giphy.com/media/12zV7u6Bh0vHpu/giphy.gif'
            }
            this.setState({gifs: [], error})
        }
    }

    /**
     * Shows the detail window
     *
     * @param {any} gif
     *
     * @memberOf Main
     */
    showModal(gif) {
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
    }

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
    copyUrl(image) {
        const hashTag = getGlobalElectronProperty('includeHashTag') ? ' #gifbar' : '';
        electron.clipboard.writeText(`${image.fullSizedImageUrl}${hashTag}`);
    }

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
                    error={this.state.error}
                    openModal={this.showModal}
                    results={this.state.gifs}
                />
                <SearchPagination
                    amount={SEARCH_LIMIT}
                    changeOffset={this.changeOffset}
                    currentOffset={this.state.offset}
                    forwardAvailable={forwardAvailable}
                    previousAvailable={previousAvailable}
                    totalResults={this.state.totalResults}
                />
            </div>
        );
    }
}

export default Main;