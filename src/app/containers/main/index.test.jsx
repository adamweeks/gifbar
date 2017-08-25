import React from 'react';
import renderer from 'react-test-renderer';

import Main from '.';

jest.mock(`../../giphy-search`, () => {
  return {
    fetchGiphyTrending: jest.fn(() => Promise.resolve())
  };
});

describe(`Main component`, () => {
  electron.remote.BrowserWindow = jest.fn();
  electron.remote.getGlobal = jest.fn(() => global);
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
