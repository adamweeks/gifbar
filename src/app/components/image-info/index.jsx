import React, {Component} from 'react';
import PropTypes from 'prop-types';

import styles from './styles.css';

class ImageInfo extends Component {
  render() {
    return (
      <div className={styles.info}>
        { this.props.info }
      </div>
    );
  }
}

ImageInfo.propTypes = {
  info: PropTypes.string.isRequired
};

export default ImageInfo;