import React, {Component} from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator'

import {Image, Text, View} from 'react-native';

import ImageDisplay from '../image-display';
import {viewModes} from '../../utils';

const styles = {
  imageGrid: {
    flexDirection: 'row',
    flexGrow: 1,
    flexShrink: 0,
    justifyContent: 'space-around'
  },
  col: {
    flexDirection: 'column'
  }
};

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
        <View>
          <Text>{status.message}</Text>
          <Image source={status.imageUrl} />
        </View>
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
        <View style={styles.imageGrid}>
          <View style={styles.col}>
            {displayLeft}
          </View>
          <View style={styles.col}>
            {displayRight}
          </View>
        </View>
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
