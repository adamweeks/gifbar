import React from 'react';
import renderer from 'react-test-renderer';

import StaticFooter from '.';

describe(`StaticFooter component`, () => {
  /**
    count: PropTypes.number,
    changeOffset: PropTypes.func,
    currentOffset: PropTypes.number,
    isTrending: PropTypes.bool,
    navPrevEnabled: PropTypes.bool,
    navForwardEnabled: PropTypes.bool,
    showNav: PropTypes.bool,
    totalResults: PropTypes.number,
   */



  it(`renders properly trending`, () => {
    const component = renderer.create(
      <StaticFooter
        isTrending
      />
    );
    expect(component).toMatchSnapshot();
  });

  describe(`show nav`, () => {
    it(`renders properly`, () => {
      const component = renderer.create(
        <StaticFooter
          count={10}
          changeOffset={jest.fn()}
          currentOffset={0}
          navPrevEnabled
          navForwardEnabled
          showNav
          totalResults={100}
        />
      );
      expect(component).toMatchSnapshot();
    });

    it(`renders properly with prev disabled`, () => {
      const component = renderer.create(
        <StaticFooter
          count={10}
          changeOffset={jest.fn()}
          currentOffset={0}
          navForwardEnabled
          showNav
          totalResults={100}
        />
      );
      expect(component).toMatchSnapshot();
    });

    it(`renders properly with forward disabled`, () => {
      const component = renderer.create(
        <StaticFooter
          count={10}
          changeOffset={jest.fn()}
          currentOffset={0}
          navPrevEnabled
          showNav
          totalResults={100}
        />
      );
      expect(component).toMatchSnapshot();
    });
  })

});
