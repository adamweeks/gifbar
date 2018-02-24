import React from 'react';
import PropTypes from 'prop-types';
import {Image, Text, TouchableHighlight, View} from 'react-native';

import giphyImage from './powered-by.png';

const styles = {
  button: {
    width: 45,
    height: 45
  },
  disabled: {},
  footer: {
    flexDirection: 'row',
    height: '100%'
  },
  image: {
    height: 18
  },
  main: {
    alignSelf: 'center',
    flexDirection: 'column',
    flex: 3
  },
  side: {

  },
  mainText: {
    textAlign: 'center',
    fontFamily: 'Helvetica Neue, sans-serif'
  }

};


function footerNav({leftNav, rightNav, title}) {
  return (
    <View style={styles.footer}>
      <View style={styles.side}>
        {leftNav && (
          <TouchableHighlight disabled={leftNav && leftNav.disabled} onPress={leftNav.onClick} style={styles.button}>
            <Image source={leftNav.image} style={styles.button} />
          </TouchableHighlight>
        )}
      </View>
      <View style={styles.main}>
        <Text style={styles.mainText}>{title}</Text>
        <View style={styles.attribution}>
          <Image draggable={false} resizeMode={Image.resizeMode.contain} source={{uri: giphyImage, height: 18}} style={styles.image} />
        </View>
      </View>
      <View style={styles.side}>
        {rightNav && (
          <TouchableHighlight disabled={rightNav && rightNav.disabled} onPress={rightNav.onClick} style={styles.button}>
            <Image source={rightNav.image} style={styles.button} />
          </TouchableHighlight>
        )}
      </View>
    </View>
  );
}

footerNav.propTypes = {
  leftNav: PropTypes.shape({
    image: PropTypes.string,
    title: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
  }),
  rightNav: PropTypes.shape({
    image: PropTypes.string,
    title: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
  }),
  title: PropTypes.string,
};

export default footerNav;
