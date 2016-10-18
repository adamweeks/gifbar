/* global: electon */
import React, {Component, PropTypes} from 'react';

import ImageDisplay from '../../components/image-display';

class MainImageDisplay extends Component {

    // TODO: Revert this back to simple image display (copyurl goes to main)
    copyUrl(image) {
        const hashTag = electron.remote.getGlobal('sharedObject').includeHashTag ? ' #gifbar' : '';
        electron.clipboard.writeText(`${image.fullSizedImageUrl}${hashTag}`);
    }

    render() {
        const {image} = this.props;

        return (
            <div>
                <ImageDisplay
                    handleClick={this.props.openModal.bind(this, image)}
                    image={image}
                    onCopy={this.copyUrl.bind(this, image)}
                />
            </div>
        );
    }
}

MainImageDisplay.propTypes = {
    image: PropTypes.object.isRequired,
    openModal: PropTypes.func.isRequired
};

export default MainImageDisplay;