import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import SearchBar from './components/search-bar';
import SearchResults from './components/search-results';
import SearchPagination from './components/search-pagination';

class Main extends Component {
    render() {
        return (
            <div>
                <SearchBar />
                <SearchResults />
                <SearchPagination />
            </div>
        );
    }
}

export default Main;

ReactDOM.render(<Main />, document.getElementById('main'));