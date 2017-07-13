import React from 'react';
import renderer from 'react-test-renderer';

import ImageActions from '.';

describe(`ImageActions component`, () => {
  const handleClick = jest.fn();
  const component = renderer.create(
    <ImageActions
      handleClick={handleClick}
    />
  );

  it(`renders properly`, () => {
    expect(component).toMatchSnapshot();
  });
});
