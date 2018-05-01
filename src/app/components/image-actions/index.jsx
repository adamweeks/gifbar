import React from 'react';
import PropTypes from 'prop-types';
import {TouchableHighlight, Image, View} from 'react-native';


import copyIcon from './Copy-128.png';
import starIcon from './Shape-Star2-128.png';
import trashIcon from './Garbage-Closed-128.png';

const styles = {
  actionItems: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    flexDirection: 'row'
  },
  button: {
    height: 50,
    width: 50
  },
  image: {
    height: '100%',
    width: '100%'
  }
};

function ImageActions({handleCopy, handleFavorite, handleRemoveFavorite, showFavorite, showRemoveFavorite}) {
  return (
    <View style={styles.actionItems}>
      {showFavorite &&
        <TouchableHighlight style={styles.button} onPress={handleFavorite} accessibilityLabel='Click to favorite'>
          <Image style={styles.image} source={starIcon} />
        </TouchableHighlight>
      }
      {showRemoveFavorite &&
        <TouchableHighlight style={styles.button} onPress={handleRemoveFavorite} accessibilityLabel='Remove from favorite'>
          <Image style={styles.image} source={trashIcon} />
        </TouchableHighlight>
      }
      <TouchableHighlight style={styles.button} onPress={handleCopy} accessibilityLabel='Click to copy the Url'>
        <Image style={styles.image} source={copyIcon} />
      </TouchableHighlight>
    </View>
  );
}

ImageActions.propTypes = {
  handleCopy: PropTypes.func.isRequired,
  handleFavorite: PropTypes.func,
  handleRemoveFavorite: PropTypes.func,
  showFavorite: PropTypes.bool,
  showRemoveFavorite: PropTypes.bool
};

export default ImageActions;
