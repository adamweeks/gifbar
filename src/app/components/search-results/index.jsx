import React, {Component} from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator'

import ImageDisplay from '../image-display';
import {viewModes} from '../../utils';

import styles from './styles.css';

class SearchResults extends Component {
  constructor(props) {
    super(props);

    const {left, right} = this.layoutImages(props.results);
    this.state = {
      searchResultsLeft: left,
      searchResultsRight: right
    };
  }


  render () {
    const {
      favoriteImage,
      removeFavorite,
      status,
      openModal,
      copyUrl,
      viewMode
    } = this.props;
    let display;
    if (status && status.message) {
      display = (
        <div>
          <p>{status.message}</p>
          <p><img src={status.imageUrl} /></p>
        </div>
      )
    }
    else {
      const displayMap = (image) => {
        return <ImageDisplay
          image={image}
          key={image.id}
          onCopy={copyUrl}
          onFavorite={favoriteImage}
          onRemoveFavorite={removeFavorite}
          onOpenModal={openModal}
          showFavorite={viewMode!==viewModes.favorites}
          showRemoveFavorite={viewMode===viewModes.favorites}
        />
      };
      const displayLeft = this.state.searchResultsLeft.map(displayMap);
      const displayRight = this.state.searchResultsRight.map(displayMap);
      display = (
        <div className={styles.imageGrid}>
          <div className={styles.col}>
            {displayLeft}
          </div>
          <div className={styles.col}>
            {displayRight}
          </div>
        </div>
      )
    }
    return display;

  }

  componentWillReceiveProps(nextProps) {
    const {results} = nextProps;
    const {left, right} = this.layoutImages(results);
    this.setState({
      searchResultsLeft: left,
      searchResultsRight: right
    });
  }

    @autobind
  layoutImages(results) {
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
    return {left, right};
  }

}

SearchResults.propTypes = {
  copyUrl: PropTypes.func.isRequired,
  favoriteImage: PropTypes.func.isRequired,
  removeFavorite: PropTypes.func.isRequired,
  status: PropTypes.object,
  openModal: PropTypes.func.isRequired,
  results: PropTypes.array.isRequired,
  viewMode: PropTypes.string.isRequired
}

export default SearchResults
