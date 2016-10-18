import React, {Component} from 'react';

import SearchBar from '../../components/search-bar';
import SearchResults from '../../components/search-results';
import SearchPagination from '../../components/search-pagination';

import GiphySearch from '../../giphy-search';
import {getReadableFileSizeString} from '../../utils';

const GIPHY_API_KEY = `dc6zaTOxFJmzC`;

const BrowserWindow = electron.remote.BrowserWindow;

class Main extends Component {
    constructor(props) {
        super(props);

        this.giphySearch = new GiphySearch(GIPHY_API_KEY);
        this.doSearch = this.doSearch.bind(this);
        this.hideCurrentWindow = this.hideCurrentWindow.bind(this);
        this.openModal = this.openModal.bind(this);
        this.showModal = this.showModal.bind(this);
        this.state = {gifs: []};
    }

    doSearch(searchTerm) {
        this.giphySearch.doSearch(searchTerm).then((results) => {
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
            this.setState({gifs});
        });
    }

    showModal(gif) {
        this.openModal(gif.fullSizedImageUrl, gif.imageSizes.fullSize.width, gif.imageSizes.fullSize.height);
    }

    openModal(url, width = 200, height = 200) {
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

    render() {
        return (
            <div>
                <SearchBar doSearch={this.doSearch} />
                <SearchResults openModal={this.showModal} results={this.state.gifs}/>
                <SearchPagination />
            </div>
        );
    }
}

export default Main;