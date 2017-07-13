import React from 'react';
import renderer from 'react-test-renderer';

import ImageInfo from '.';

describe(`ImageInfo component`, () => {
  const component = renderer.create(
    <ImageInfo
      info={`Image Info`}
    />
  );

  it(`renders properly`, () => {
    expect(component).toMatchSnapshot();
  });
});
