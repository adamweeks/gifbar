import React, {Component} from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator'

import styles from './styles.css';

import ImageActions from '../image-actions';
import ImageInfo from '../image-info';

class ImageDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hovered: false
    }
  }

    @autobind
  handleMouseOver() {
    this.setState({
      hovered: true
    });
  }

    @autobind
  handleMouseLeave() {
    this.setState({
      hovered: false
    });
  }

  render () {
    const {
      handleClick,
      image,
      onCopy
    } = this.props;

    const {
      hovered
    } = this.state;

    const divStyle = {
      height: image.imageSizes.smallSize.height + `px`
    };

    let info;
    if (hovered) {
      info = (
        <div>
          <ImageInfo info={image.fullSizedImageFileSize} />
          <ImageActions handleClick={onCopy} />
        </div>
      );
    }

    return (
      <div
        className={styles.imageContainer}
        style={divStyle}
        onMouseOver={this.handleMouseOver}
        onMouseLeave={this.handleMouseLeave}
      >
        <img src={image.displayUrl} onClick={handleClick} />
        {info}
      </div>

    )
  }
}

ImageDisplay.propTypes = {
  handleClick: PropTypes.func.isRequired,
  image: PropTypes.object.isRequired,
  onCopy: PropTypes.func.isRequired
}

export default ImageDisplay
