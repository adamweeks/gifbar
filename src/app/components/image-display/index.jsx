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

  @autobind
  handleCopy() {
    this.props.onCopy(this.props.image);
  }

  @autobind
  handleFavorite() {
    this.props.onFavorite(this.props.image);
  }

  @autobind
  handleOpenModal() {
    this.props.onOpenModal(this.props.image);
  }

  @autobind
  handleRemoveFavorite() {
    this.props.onRemoveFavorite(this.props.image);
  }

  render () {
    const {
      image,
      showFavorite,
      showRemoveFavorite
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
          <ImageActions
            handleCopy={this.handleCopy}
            handleFavorite={this.handleFavorite}
            handleRemoveFavorite={this.handleRemoveFavorite}
            showFavorite={showFavorite}
            showRemoveFavorite={showRemoveFavorite}
          />
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
        <img className={styles.image} src={image.displayUrl} onClick={this.handleOpenModal} />
        {info}
      </div>

    )
  }
}

ImageDisplay.propTypes = {
  image: PropTypes.object.isRequired,
  onCopy: PropTypes.func.isRequired,
  onFavorite: PropTypes.func,
  onOpenModal: PropTypes.func.isRequired,
  onRemoveFavorite: PropTypes.func,
  showFavorite: PropTypes.bool,
  showRemoveFavorite: PropTypes.bool
}

export default ImageDisplay
