import React, {Component} from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator'
import {Image, View} from 'react-native';

import ImageActions from '../image-actions';
import ImageInfo from '../image-info';

const styles = {
  image: {
    backgroundColor: '#ccc',
    width: 200
  },
  imageDisplay: {
    marginTop: 3,
    marginBottom: 3
  }
};

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
      height: image.imageSizes.smallSize.height
    };

    let info;
    if (hovered) {
      info = (
        <View>
          <ImageInfo info={image.fullSizedImageFileSize} />
          <ImageActions
            handleCopy={this.handleCopy}
            handleFavorite={this.handleFavorite}
            handleRemoveFavorite={this.handleRemoveFavorite}
            showFavorite={showFavorite}
            showRemoveFavorite={showRemoveFavorite}
          />
        </View>
      );
    }

    return (
      <View
        className={styles.imageContainer}
        onMouseOver={this.handleMouseOver}
        onMouseLeave={this.handleMouseLeave}
        style={styles.imageDisplay}
      >
        <Image resizeMode={Image.resizeMode.contain} style={[styles.image, divStyle]} source={image.displayUrl} onClick={this.handleOpenModal} />
        {info}
      </View>

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
