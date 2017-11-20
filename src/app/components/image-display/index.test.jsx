import React from 'react';
import renderer from 'react-test-renderer';

import ImageDisplay from '.';

describe(`ImageDisplay component`, () => {
  const handleClick = jest.fn();
  const onCopy = jest.fn();
  const onOpenModal = jest.fn();
  const image = {
    id: 1,
    displayUrl: `http://mycoolserver.info/kid-n-play.gif`,
    fullSizedImageFileSize: `5 Mb`,
    imageSizes: {
      smallSize: {
        height: 50
      }
    }
  };
  const component = renderer.create(
    <ImageDisplay
      handleClick={handleClick}
      image={image}
      onCopy={onCopy}
      onOpenModal={onOpenModal}
    />
  );

  it(`renders properly`, () => {
    expect(component).toMatchSnapshot();
  });
});
