import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
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

    componentDidMount() {
        this.doFocus();
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.shouldFocus && !this.props.shouldFocus) {
            this.doFocus();
        }
    }

    doFocus() {
        ReactDOM.findDOMNode(this.refs.searchBar).focus();
        this.props.onFocus();
    }


    render () {
        return (
            <div>
                <form>
                    <input
                        id="searchBar"
                        ref="searchBar"
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