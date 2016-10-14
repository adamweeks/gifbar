import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import SearchBar from './components/search-bar';
import SearchResults from './components/search-results';
import SearchPagination from './components/search-pagination';

import GiphySearch from './giphy-search';
import {getReadableFileSizeString} from './utils';

const GIPHY_API_KEY = `dc6zaTOxFJmzC`;

class Main extends Component {
    constructor(props) {
        super(props);

        this.giphySearch = new GiphySearch(GIPHY_API_KEY);
        this.doSearch = this.doSearch.bind(this);

        this.state = {gifs: []};
    }

    doSearch(searchTerm) {
        this.giphySearch.doSearch(searchTerm).then((results) => {
            const gifs = results.data.map((giphyObject) => {
                return {
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

    render() {
        return (
            <div>
                <SearchBar doSearch={this.doSearch} />
                <SearchResults results={this.state.gifs}/>
                <SearchPagination />
            </div>
        );
    }
}

export default Main;

ReactDOM.render(<Main />, document.getElementById('main'));