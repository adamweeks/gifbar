import React, {Component, PropTypes} from 'react'

import ImageDisplay from '../image-display';

import './styles.css';

class SearchResults extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchResultsLeft: [],
            searchResultsRight: []
        }
    }

    render () {
        const displayMap = (gif) => {
            return <ImageDisplay image={gif} key={gif.id} />
        };
        const displayLeft = this.state.searchResultsLeft.map(displayMap);
        const displayRight = this.state.searchResultsRight.map(displayMap);
        return (
             <div className="image-grid">
                <div className="col">
                    {displayLeft}
                </div>
                <div className="col">
                    {displayRight}
                </div>
            </div>
        )
    }

    componentWillReceiveProps(nextProps) {
        const {results} = nextProps;
        let left = [], right = [];
        let leftHeight = 0, rightHeight = 0;
        let currentSide = 0;
        results.forEach((result) => {
            currentSide = 0;
            if (leftHeight > rightHeight) {
                currentSide = 1;
            }
            if (currentSide) {
                right.push(result);
                rightHeight += result.imageSizes.smallSize.height;
            }
            else {
                left.push(result);
                leftHeight += result.imageSizes.smallSize.height;
            }
        });
        this.setState({
            searchResultsLeft: left,
            searchResultsRight: right
        });
    }

}

SearchResults.propTypes = {
    results: PropTypes.array.isRequired
}

export default SearchResults
