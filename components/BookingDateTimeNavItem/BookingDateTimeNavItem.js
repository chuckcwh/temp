import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import './BookingDateTimeNavItem.scss';
import Link from '../Link';
import { isNavigationAllowed } from '../../core/Util';

class BookingDateTimeNavItem extends Component {

  render() {
    const { location, lastPage, active, link, name } = this.props;
    if (link && isNavigationAllowed(link, lastPage)) {
      return (
        <li className="BookingDateTimeNavItem">
          <a className={classNames('BookingDateTimeNav-link', (location && location.pathname && location.pathname.indexOf('/' + active)==0) ? 'active' : '')} href={'/' + link} onClick={Link.handleClick}>{name}<span className="BookingDateTimeNav-arrow"><div className="nav-caret"></div></span></a>
        </li>
      );
    } else {
      return (
        <li className="BookingDateTimeNavItem">
          <span className={classNames('BookingDateTimeNav-link', (location && location.pathname && location.pathname.indexOf('/' + active)==0) ? 'active' : '')}>{name}<span className="BookingDateTimeNav-arrow"><div className="nav-caret"></div></span></span>
        </li>
      );
    }
  }

}

const mapStateToProps = (state) => {
  return {
    location: state.router && state.router.location,
    lastPage: state.lastPage
  }
}

export default connect(mapStateToProps, {})(BookingDateTimeNavItem);
