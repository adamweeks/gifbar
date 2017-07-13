import React from 'react';
import renderer from 'react-test-renderer';

import Main from '.';

describe(`Main component`, () => {
  electron.remote.BrowserWindow = jest.fn();
  electron.ipcRenderer = {
    on: jest.fn()
  };
  const component = renderer.create(
    <Main
      info={`Image Info`}
    />
  );

  it(`renders properly`, () => {
    expect(component).toMatchSnapshot();
  });
});
