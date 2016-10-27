import React, {Component, PropTypes} from 'react';

import './styles.css';

class ImageInfo extends Component {
    render() {
        return (
            <div className="info">
                { this.props.info }
            </div>
        );
    }
}

ImageInfo.propTypes = {
    info: PropTypes.string.isRequired
};

export default ImageInfo;