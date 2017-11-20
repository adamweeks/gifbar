import React from 'react';
import renderer from 'react-test-renderer';

import ImageActions from '.';

describe(`ImageActions component`, () => {
  const handleCopy = jest.fn();
  const handleRemoveFavorite = jest.fn();
  const handleFavorite = jest.fn();

  it(`renders properly`, () => {
    const component = renderer.create(
      <ImageActions
        handleCopy={handleCopy}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it(`renders properly with favorite`, () => {
    const component = renderer.create(
      <ImageActions
        handleCopy={handleCopy}
        handleFavorite={handleFavorite}
        showFavorite
      />
    );
    expect(component).toMatchSnapshot();
  });

  it(`renders properly with remove favorite`, () => {
    const component = renderer.create(
      <ImageActions
        handleCopy={handleCopy}
        handleRemoveFavorite={handleRemoveFavorite}
        showRemoveFavorite
      />
    );
    expect(component).toMatchSnapshot();
  });
});
