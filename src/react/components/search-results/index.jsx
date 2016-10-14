import React, {Component, PropTypes} from 'react'

class SearchResults extends Component {
    render () {
        const display = this.props.results.map((gif) => {
            return <div>{JSON.stringify(gif)}</div>
        });
        return (
            <div>
                SearchResults
                <div>
                    {display}
                </div>
            </div>
        )
    }
}

SearchResults.propTypes = {
    results: PropTypes.array.isRequired
}

export default SearchResults
