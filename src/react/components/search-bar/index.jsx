import React, {Component, PropTypes} from 'react'

import './styles.css';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

class SearchBar extends Component {

    constructor(props) {
        super(props);
        this.state = {value: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.clearSearch = this.clearSearch.bind(this);
    }

    render () {
        return (
            <div>
                <form>
                    <input
                        id="searchBar"
                        type="text"
                        placeholder="Search for gifs"
                        value={this.state.value}
                        onKeyDown={this.handleKeyDown}
                        onChange={this.handleChange}
                    />
                    <button type="button" className="cancel" onClick={this.clearSearch}>X</button>
                </form>
            </div>
        )
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleKeyDown(event) {
        if (event.keyCode === ENTER_KEY) {
            this.doSearch();
            event.preventDefault();
        }
        if (event.keyCode === ESCAPE_KEY) {
            if (this.state.value.length > 0) {
                this.clearSearch();
            }
            else {
                this.props.doExit();
            }
            event.preventDefault();
        }
    }

    clearSearch() {
        this.setState({value: ''});
    }

    doSearch() {
        this.props.doSearch(this.state.value);
    }
}

export default SearchBar

SearchBar.propTypes = {
    doExit: PropTypes.func.isRequired,
    doSearch: PropTypes.func.isRequired
}