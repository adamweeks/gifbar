import React from 'react';
import renderer from 'react-test-renderer';

import SearchResults from '.';

describe(`SearchResults component`, () => {
  const image1 = {
    id: 1,
    displayUrl: `http://mycoolserver.info/kid-n-play.gif`,
    fullSizedImageFileSize: `5 Mb`,
    imageSizes: {
      smallSize: {
        height: 50
      }
    }
  };
  const image2 = {
    id: 2,
    displayUrl: `http://mycoolserver.info/kid-n-play.gif`,
    fullSizedImageFileSize: `5 Mb`,
    imageSizes: {
      smallSize: {
        height: 50
      }
    }
  };
  const image3 = {
    id: 3,
    displayUrl: `http://mycoolserver.info/kid-n-play.gif`,
    fullSizedImageFileSize: `5 Mb`,
    imageSizes: {
      smallSize: {
        height: 50
      }
    }
  };
  const copyUrl = jest.fn();
  const error = {
    message: `ERROR!`,
    imageUrl: `http://imgerror.url/err.gif`
  };
  const openModal = jest.fn();
  const results = [
    image1,
    image2,
    image3
  ]
  const component = renderer.create(
    <SearchResults
      copyUrl={copyUrl}
      openModal={openModal}
      results={results}
    />
  );

  it(`renders properly`, () => {
    expect(component).toMatchSnapshot();
  });

  it(`renders properly with error`, () => {
    const component = renderer.create(
      <SearchResults
        copyUrl={copyUrl}
        error={error}
        openModal={openModal}
        results={results}
      />
    );
    expect(component).toMatchSnapshot();
  });
});
