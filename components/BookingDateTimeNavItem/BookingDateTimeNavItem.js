import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import s from './BookingDateTimeNavItem.css';
import Link from '../Link';
import history from '../../core/history';
import { isNavigationAllowed } from '../../core/util';

class BookingDateTimeNavItem extends Component {

  render() {
    const { lastPage, active, link, name } = this.props;
    const location = history.getCurrentLocation();
    if (link && isNavigationAllowed(link, lastPage)) {
      return (
        <li className={s.bookingDateTimeNavItem}>
          <Link className={classNames(s.bookingDateTimeNavLink, (location && location.pathname && location.pathname.indexOf('/' + active)==0) ? s.bookingDateTimeNavLinkActive : '')} to={{ pathname: '/' + link, query: this.props.location && this.props.location.query }}>{name}<span className={s.bookingDateTimeNavArrow}><div className="nav-caret"></div></span></Link>
        </li>
      );
    } else {
      return (
        <li className={s.bookingDateTimeNavItem}>
          <span className={classNames(s.bookingDateTimeNavLink, (location && location.pathname && location.pathname.indexOf('/' + active)==0) ? s.bookingDateTimeNavLinkActive : '')}>{name}<span className={s.bookingDateTimeNavArrow}><div className="nav-caret"></div></span></span>
        </li>
      );
    }
  }

}

const mapStateToProps = (state) => {
  return {
    lastPage: state.lastPage
  }
}

export default connect(mapStateToProps, {})(BookingDateTimeNavItem);
