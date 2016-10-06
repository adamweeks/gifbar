import React, {Component} from 'react'

import './styles.css';

class SearchBar extends Component {
    render () {
        return (
            <div>
                <form>
                    <input
                        id="searchBar"
                        placeholder="Search for gifs"
                        />
                    <button type="button" className="cancel">X</button>
                </form>
            </div>
        )
    }
}

export default SearchBar