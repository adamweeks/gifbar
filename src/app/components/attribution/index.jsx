import React from 'react';

import image from './giphy.gif';
import styles from './styles.css';

const Attribution = () => {
  return (
    <div>
      <img className={styles.attribution} src={image} />
    </div>
  );
};

export default Attribution;