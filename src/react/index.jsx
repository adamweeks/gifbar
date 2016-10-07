import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import SearchBar from './components/search-bar';
import SearchResults from './components/search-results';
import SearchPagination from './components/search-pagination';

import GiphySearch from './giphy-search';

const GIPHY_API_KEY = `dc6zaTOxFJmzC`;

class Main extends Component {
    constructor(props) {
        super(props);

        this.giphySearch = new GiphySearch(GIPHY_API_KEY);
        this.doSearch = this.doSearch.bind(this);
    }


    doSearch(searchTerm) {
        this.giphySearch.doSearch(searchTerm).then((result) => {
            console.log(result);
        });
    }

    render() {
        return (
            <div>
                <SearchBar doSearch={this.doSearch} />
                <SearchResults />
                <SearchPagination />
            </div>
        );
    }
}

export default Main;

ReactDOM.render(<Main />, document.getElementById('main'));