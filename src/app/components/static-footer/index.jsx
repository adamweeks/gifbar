import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import {View} from 'react-native';

import FooterNav from '../footer-nav';

import refresh from '../../images/Command-Refresh-128.png';
import favoriteImage from '../../images/Shape-Star2-128.png';
import nextImage from '../../images/Media-Fast-Forward-128.png';
import previousImage from '../../images/Media-Rewind-128.png';

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
    const {
      count,
      currentOffset,
      isTrending,
      navForwardEnabled,
      navPrevEnabled,
      showNav,
      totalResults
    } = this.props;
    const title = this.props.title ? this.props.title : this.buildTitle(isTrending, totalResults, count, currentOffset);
    let leftNav, rightNav;
    if (isTrending) {
      leftNav = {
        image: favoriteImage,
        onClick: this.props.displayFavorites
      };
      rightNav = {
        image: refresh,
        onClick: this.props.handleRefresh
      }
    }
    if (showNav) {
      leftNav = {
        disabled: !navPrevEnabled,
        image: previousImage,
        onClick: this.decrement
      };
      rightNav = {
        disabled: !navForwardEnabled,
        image: nextImage,
        onClick: this.increment
      }
    }

    return (
      <View>
        <FooterNav
          leftNav={leftNav}
          rightNav={rightNav}
          title={title}
        />
      </View>
    );
  }
}

StaticFooter.propTypes = {
  count: PropTypes.number,
  changeOffset: PropTypes.func,
  currentOffset: PropTypes.number,
  displayFavorites: PropTypes.func,
  handleRefresh: PropTypes.func,
  isTrending: PropTypes.bool,
  navPrevEnabled: PropTypes.bool,
  navForwardEnabled: PropTypes.bool,
  showNav: PropTypes.bool,
  title: PropTypes.string,
  totalResults: PropTypes.number,
};

export default StaticFooter;
