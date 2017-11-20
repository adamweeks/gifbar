import React, {Component} from 'react';
import PropTypes from 'prop-types';

import styles from './styles.css';
import copyIcon from './Copy-128.png';
import starIcon from './Shape-Star2-128.png';
import trashIcon from './Garbage-Closed-128.png';

class ImageActions extends Component {
  render() {
    const {handleCopy, handleFavorite, handleRemoveFavorite, showFavorite, showRemoveFavorite} = this.props;
    return (
      <div className={styles.actionItems}>
        {showFavorite &&
          <button className={styles.button} onClick={handleFavorite} title='Click to favorite'>
            <img className={styles.image} src={starIcon} />
          </button>
        }
        {showRemoveFavorite &&
          <button className={styles.button} onClick={handleRemoveFavorite} title='Remove from favorite'>
            <img className={styles.image} src={trashIcon} />
          </button>
        }
        <button className={styles.button} onClick={handleCopy} title='Click to copy the Url'>
          <img className={styles.image} src={copyIcon} />
        </button>
      </div>
    );
  }
}

ImageActions.propTypes = {
  handleCopy: PropTypes.func.isRequired,
  handleFavorite: PropTypes.func,
  handleRemoveFavorite: PropTypes.func,
  showFavorite: PropTypes.bool,
  showRemoveFavorite: PropTypes.bool
};

export default ImageActions;
