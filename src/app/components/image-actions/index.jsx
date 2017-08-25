import React, {Component} from 'react';
import PropTypes from 'prop-types';

import styles from './styles.css';

class ImageActions extends Component {
  render() {
    const {handleClick} = this.props;
    return (
      <div className={styles.actionItems}>
        <button onClick={handleClick} title="Click to copy the Url">Copy</button>
      </div>
    );
  }
}

ImageActions.propTypes = {
  handleClick: PropTypes.func.isRequired
};

export default ImageActions;