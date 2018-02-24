import React from 'react';
import PropTypes from 'prop-types';
import {Text, View} from 'react-native';

const styles = {
  info: {
    backgroundColor: 'white',
    fontFamily: 'Helvetica Neue',
    fontSize: 20,
    height: 22,
    lineHeight: 20,
    opacity: 0.6,
    paddingLeft: 5,
    paddingRight: 5
  },
  imageInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0
  }
};


function ImageInfo({info}) {
  return (
    <View style={styles.imageInfo}>
      <Text style={styles.info}>
        { info }
      </Text>
    </View>
  );
}

ImageInfo.propTypes = {
  info: PropTypes.string.isRequired
};

export default ImageInfo;
