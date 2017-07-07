import React, {Component} from 'react';
import PropTypes from 'prop-types';

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
        const {error, openModal, copyUrl} = this.props;
        let display;
        if (error.message) {
            display = (
                <div>
                    <p>{error.message}</p>
                    <p><img src={error.imageUrl} /></p>
                </div>
            )
        }
        else {
            const displayMap = (image) => {
                return <ImageDisplay
                            handleClick={openModal.bind(this, image)}
                            image={image}
                            key={image.id}
                            onCopy={copyUrl.bind(this, image)}
                        />
            };
            const displayLeft = this.state.searchResultsLeft.map(displayMap);
            const displayRight = this.state.searchResultsRight.map(displayMap);
            display = (
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
        return display;

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
    copyUrl: PropTypes.func.isRequired,
    error: PropTypes.object,
    openModal: PropTypes.func.isRequired,
    results: PropTypes.array.isRequired
}

export default SearchResults