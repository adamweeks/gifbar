import React, {Component} from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator'
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';

const styles = StyleSheet.create({
  clearButton: {
    borderColor: '#c2c0c2',
    borderRadius: 4,
    borderWidth: 1,
    height: 25,
    width: 25
  },
  text: {
    fontFamily: 'Roboto, sans-serif',
    lineHeight: 25,
    textAlign: 'center'
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    flex: 1,
    padding: 5,
    marginRight: 5
  },
  main: {
    flex: 1,
    flexDirection: 'row',
    padding: 5
  }
});

class SearchBar extends Component {

  constructor(props) {
    super(props);
    this.state = {value: ``};
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
    if (this.refs.searchBar) {
      this.refs.searchBar.focus();
    }
    this.props.onFocus();
  }


  render () {
    return (
      <View style={styles.main}>
        <TextInput
          autoFocus
          id='searchBar'
          onFocus={this.handleFocus}
          onKeyPress={this.handleKeyDown}
          onChange={this.handleChange}
          placeholder='Search for gifs'
          ref='searchBar'
          style={styles.input}
          value={this.state.value}
        />
        <TouchableOpacity
          onPress={this.clearSearch}
          style={styles.clearButton}
        >
          <Text style={styles.text}>X</Text>
        </TouchableOpacity>
      </View>
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
      if (event.nativeEvent.key === 'Enter') {
        this.doSearch();
        event.preventDefault();
      }
      if (event.nativeEvent.key === 'Escape') {
        if (this.state.value.length > 0) {
          this.clearSearch();
        }
        else {
          this.props.doExit();
        }
        event.preventDefault();
      }
      if (event.nativeEvent.metaKey && event.nativeEvent.key === 'a' ) {
        event.target.select();
      }
    }

    @autobind
    clearSearch() {
      this.setState({value: ``});
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
