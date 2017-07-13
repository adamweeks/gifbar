import React, {Component} from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator'

import './styles.css';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;
const A_KEY = 65;

class SearchBar extends Component {

    constructor(props) {
        super(props);
        this.state = {value: ''};
    }

    componentDidMount() {
        this.doFocus();
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.shouldFocus && !this.props.shouldFocus) {
            this.doFocus();
        }
    }

    doFocus() {
        // Refs don't render properly in jest
        // TODO: https://stackoverflow.com/questions/40852131/refs-are-null-in-jest-snapshot-tests-with-react-test-renderer/40854433#40854433
        if (this.searchBar) {
            this.searchBar.focus();
        }
        this.props.onFocus();
    }


    render () {
        return (
            <div>
                <form>
                    <input
                        id="searchBar"
                        ref={node => this.searchBar = node}
                        type="text"
                        placeholder="Search for gifs"
                        value={this.state.value}
                        onFocus={this.handleFocus}
                        onKeyDown={this.handleKeyDown}
                        onChange={this.handleChange}
                    />
                    <button type="button" className="cancel" onClick={this.clearSearch}>X</button>
                </form>
            </div>
        )
    }

    @autobind
    handleChange(event) {
        this.setState({value: event.target.value});
    }

    @autobind
    handleFocus(event) {
        event.target.select();
    }

    @autobind
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
        if (event.metaKey && event.keyCode === A_KEY ) {
            event.target.select();
        }
    }

    @autobind
    clearSearch() {
        this.setState({value: ''});
        this.props.doClear();
    }

    doSearch() {
        this.props.doSearch(this.state.value);
    }
}

export default SearchBar

SearchBar.propTypes = {
    doClear: PropTypes.func.isRequired,
    doExit: PropTypes.func.isRequired,
    doSearch: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    shouldFocus: PropTypes.bool
}