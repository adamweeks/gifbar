import React from 'react';
import renderer from 'react-test-renderer';

import SearchBar from '.';

describe(`SearchBar component`, () => {
  const doClear = jest.fn();
  const doExit = jest.fn();
  const doSearch = jest.fn();
  const onFocus = jest.fn();
  const component = renderer.create(
    <SearchBar
      doClear={doClear}
      doExit={doExit}
      doSearch={doSearch}
      onFocus={onFocus}
    />
  );

  it(`renders properly`, () => {
    expect(component).toMatchSnapshot();
  });
});
