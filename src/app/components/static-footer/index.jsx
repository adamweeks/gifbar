import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import autobind from 'autobind-decorator';

import styles from './styles.css';
import image from './giphy.gif';

class StaticFooter extends Component {
  buildTitle(isTrending, totalResults, count, offset) {
    if (isTrending) {
      return `Top Trending GIFs!`;
    }
    const totalPages = Math.ceil(totalResults / count);
    const currentPage = offset / count + 1;
    return `Showing page ${currentPage} of ${totalPages}`;
  }

  @autobind
  decrement() {
    const {currentOffset, count, changeOffset, navPrevEnabled} = this.props;
    if (!navPrevEnabled) {
      return;
    }
    const offset = currentOffset >= count ? currentOffset - count : 0;
    changeOffset(offset);
  }

  @autobind
  increment() {
    const {currentOffset, count, changeOffset, navForwardEnabled} = this.props;
    if (!navForwardEnabled) {
      return;
    }
    const offset = currentOffset + count;
    changeOffset(offset);
  }

  render() {
    const {count, currentOffset, isTrending, navForwardEnabled, navPrevEnabled, showNav, totalResults} = this.props;
    const title = this.buildTitle(isTrending, totalResults, count, currentOffset);
    const prevClass = classNames({
      [`${styles.button}`]: true,
      [`${styles.buttonDisabled}`]: !navPrevEnabled
    });
    const nextClass = classNames({
      [`${styles.button}`]: true,
      [`${styles.buttonDisabled}`]: !navForwardEnabled
    });
    return (
      <div className={styles.footer}>
        {showNav && (
          <div className={styles.side}>
            <div className={prevClass} onClick={this.decrement}>
              {`<`}
            </div>
          </div>
        )}
        <div className={styles.main}>
          <div className={styles.title}>
            {title}
          </div>
          <div className={styles.attribution}>
            <img className={styles.img} src={image} />
          </div>
        </div>
        {showNav && (
          <div className={styles.side}>
            <div className={nextClass} onClick={this.increment}>
              {`>`}
            </div>
          </div>
        )}
      </div>
    );
  }
}

StaticFooter.propTypes = {
  count: PropTypes.number,
  changeOffset: PropTypes.func,
  currentOffset: PropTypes.number,
  isTrending: PropTypes.bool,
  navPrevEnabled: PropTypes.bool,
  navForwardEnabled: PropTypes.bool,
  showNav: PropTypes.bool,
  totalResults: PropTypes.number,
};

export default StaticFooter;
