import React from 'react';
import renderer from 'react-test-renderer';

import SearchPagination from '.';

describe(`SearchPagination component`, () => {
  const amount = 10;
  const changeOffset = jest.fn();
  const currentOffset = 30;
  const forwardAvailable = true;
  const previousAvailable = true;
  const totalResults = 200;
  const component = renderer.create(
    <SearchPagination
      amount={amount}
      changeOffset={changeOffset}
      currentOffset={currentOffset}
      forwardAvailable={forwardAvailable}
      previousAvailable={previousAvailable}
      totalResults={totalResults}
    />
  );

  it(`renders properly`, () => {
    expect(component).toMatchSnapshot();
  });
});
