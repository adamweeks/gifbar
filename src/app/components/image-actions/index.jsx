import React, {Component} from 'react';
import PropTypes from 'prop-types';

import styles from './styles.css';
import copyIcon from '../../images/Copy-128.png';
import starIcon from '../../images/Shape-Star2-128.png';

class ImageActions extends Component {
  render() {
    const {handleCopy, handleFavorite} = this.props;
    return (
      <div className={styles.actionItems}>
        <button className={styles.button} onClick={handleFavorite} title='Click to favorite'>
          <img className={styles.image} src={starIcon} />
        </button>
        <button className={styles.button} onClick={handleCopy} title='Click to copy the Url'>
          <img className={styles.image} src={copyIcon} />
        </button>
      </div>
    );
  }
}

ImageActions.propTypes = {
  handleCopy: PropTypes.func.isRequired,
  handleFavorite: PropTypes.func.isRequired
};

export default ImageActions;
