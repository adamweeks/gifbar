import React from 'react';

import {Image} from 'react-native';

import image from './giphy.gif';
import styles from './styles.css';

const Attribution = () => {
  return (
    <div>
      <Image source={image} />
    </div>
  );
};

export default Attribution;
