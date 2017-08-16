import React from 'react';

import image from './giphy.gif';
import './styles.css';

const Attribution = () => {
    return (
        <div>
            <img className="attribution" src={image} />
        </div>
    );
};

export default Attribution;