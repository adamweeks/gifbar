import React from 'react';
import PropTypes from 'prop-types';
import {Image, StyleSheet} from 'react-native';

import classNames from 'classnames';
import styles from './styles.css';
import giphyImage from './giphy.gif';

const rnStyles = StyleSheet.create({
  img: {height: 23}
});


function footerNav({leftNav, rightNav, title}) {
  const leftClass = classNames({
    [`${styles.button}`]: true,
    [`${styles.buttonDisabled}`]: leftNav && leftNav.disabled
  });
  const rightClass = classNames({
    [`${styles.button}`]: true,
    [`${styles.buttonDisabled}`]: rightNav && rightNav.disabled
  });
  return (
    <div className={styles.footer}>
      <div className={styles.side}>
        {leftNav && (
          <div className={leftClass} onClick={leftNav.onClick}>
            {leftNav.image && (
              <img className={styles.imgButton} src={leftNav.image} />
            )}
            {!leftNav.image && leftNav.title}
          </div>
        )}
      </div>
      <div className={styles.main}>
        <div className={styles.title}>
          {title}
        </div>
        <div className={styles.attribution}>
          <Image source={giphyImage} style={rnStyles.img} />

        </div>
      </div>
      <div className={styles.side}>
        {rightNav && (
          <div className={rightClass} onClick={rightNav.onClick}>
            {rightNav.image && (
              <img className={styles.imgButton} src={rightNav.image} />
            )}
            {!rightNav.image && rightNav.title}
          </div>
        )}
      </div>
    </div>
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
