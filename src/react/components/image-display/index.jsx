import React, {Component, PropTypes} from 'react'
import './styles.css';

class ImageDisplay extends Component {
    render () {
        const {image} = this.props;
        return (
            <div>
                <div className="image-container">
                    <img src={image.displayUrl} />
                </div>
            </div>
        )
    }
}

ImageDisplay.propTypes = {
    image: PropTypes.object.isRequired
}

export default ImageDisplay
