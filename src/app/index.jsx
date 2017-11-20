import React from 'react';
import ReactDOM from 'react-dom';

import Main from './containers/main';

import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
installExtension(REACT_DEVELOPER_TOOLS);

ReactDOM.render(<Main />, document.getElementById(`main`));
