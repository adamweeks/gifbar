import React, {Component, PropTypes} from 'react'
import './styles.css';

import ImageActions from '../image-actions';
import ImageInfo from '../image-info';

class ImageDisplay extends Component {
    constructor(props) {
        super(props);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.state = {
            hovered: false
        }
    }

    handleMouseOver() {
        this.setState({
            hovered: true
        });
    }

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
            height: image.imageSizes.smallSize.height + 'px'
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
                className="image-container"
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
