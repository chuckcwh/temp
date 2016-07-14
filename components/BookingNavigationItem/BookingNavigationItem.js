import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import s from './BookingNavigationItem.css';
import Link from '../Link';
import history from '../../core/history';
import { isNavigationAllowed } from '../../core/util';
const location = history.getCurrentLocation();

class BookingNavigationItem extends Component {

  render() {
    const { location, lastPage, active, link, icon, text } = this.props;
    if (link && isNavigationAllowed(link, lastPage)) {
      return (
        <li className={s.bookingNavigationItem}>
          <Link className={classNames(s.bookingNavigationLink, (location && location.pathname && location.pathname.indexOf('/' + active)==0) ? s.bookingNavigationLinkActive : '')} to={{ pathname: '/' + link, query: location && location.query }}>
            <div className={s.bookingNavigationItemIcon}>{icon}</div>
            <span className={s.bookingNavigationItemText}>{text}</span>
          </Link>
        </li>
      );
    } else {
      return (
        <li className={s.bookingNavigationItem}>
          <span className={classNames(s.bookingNavigationLink, (location && location.pathname && location.pathname.indexOf('/' + active)==0) ? s.bookingNavigationLinkActive : '')}>
            <div className={s.bookingNavigationItemIcon}>{icon}</div>
            <span className={s.bookingNavigationItemText}>{text}</span>
          </span>
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

export default connect(mapStateToProps)(BookingNavigationItem);
