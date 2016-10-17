/* global: electon */
import React, {Component, PropTypes} from 'react';

import ImageDisplay from '../../components/image-display';

class MainImageDisplay extends Component {

    copyUrl(image) {
        const hashTag = electron.remote.getGlobal('sharedObject').includeHashTag ? ' #gifbar' : '';
        electron.clipboard.writeText(`${image.fullSizedImageUrl}${hashTag}`);
    }

    openModal(image) {
        // TODO: Function
    }

    render() {
        const {image} = this.props;

        return (
            <div>
                <ImageDisplay handleOnClick={this.openModal.bind(this, image)} image={image} onCopy={this.copyUrl.bind(this, image)} />
            </div>
        );
    }
}

MainImageDisplay.propTypes = {
    image: PropTypes.object.isRequired
};

export default MainImageDisplay;