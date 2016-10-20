import React, {Component} from 'react';

import SearchBar from '../../components/search-bar';
import SearchResults from '../../components/search-results';
import SearchPagination from '../../components/search-pagination';

import GiphySearch from '../../giphy-search';
import {getReadableFileSizeString, getGlobalElectronProperty} from '../../utils';

const GIPHY_API_KEY = `dc6zaTOxFJmzC`;

const BrowserWindow = electron.remote.BrowserWindow;

class Main extends Component {
    constructor(props) {
        super(props);

        this.giphySearch = new GiphySearch(GIPHY_API_KEY);
        this.copyUrl = this.copyUrl.bind(this);
        this.doSearch = this.doSearch.bind(this);
        this.hideCurrentWindow = this.hideCurrentWindow.bind(this);
        this.showModal = this.showModal.bind(this);
        this.state = {gifs: [], error: false};
    }

    /**
     * Handles the actual searching on giphy
     *
     * @param {any} searchTerm
     *
     * @memberOf Main

     */
    doSearch(searchTerm, offset = 0) {
        if (searchTerm) {
            const rating = getGlobalElectronProperty('hideNSFW') ? 'g' : 'r';
            this.giphySearch.doSearch(searchTerm, offset, rating).then((results) => {
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
                this.setState({gifs, error: false});
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

    render() {
        return (
            <div>
                <SearchBar doExit={this.hideCurrentWindow} doSearch={this.doSearch} />
                <SearchResults copyUrl={this.copyUrl} error={this.state.error} openModal={this.showModal} results={this.state.gifs}/>
                <SearchPagination />
            </div>
        );
    }
}

export default Main;