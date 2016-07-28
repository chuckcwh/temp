import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import s from './BookingNavigationItem.css';
import Link from '../Link';
import history from '../../core/history';
import { isNavigationAllowed } from '../../core/util';

const BookingNavigationItem = (props) => {
  const { lastPage, active, link, icon, text } = props;
  const location = history.getCurrentLocation();
  if (link && isNavigationAllowed(link, lastPage)) {
    return (
      <li className={s.bookingNavigationItem}>
        <Link
          className={classNames(s.bookingNavigationLink,
            (location && location.pathname && location.pathname.indexOf(`/${active}`) === 0)
            ? s.bookingNavigationLinkActive : '')}
          to={{ pathname: `/${link}`, query: location && location.query }}
        >
          <div className={s.bookingNavigationItemIcon}>{icon}</div>
          <span className={s.bookingNavigationItemText}>{text}</span>
        </Link>
      </li>
    );
  }
  return (
    <li className={s.bookingNavigationItem}>
      <span
        className={classNames(s.bookingNavigationLink,
          (location && location.pathname && location.pathname.indexOf(`/${active}`) === 0)
          ? s.bookingNavigationLinkActive : '')}
      >
        <div className={s.bookingNavigationItemIcon}>{icon}</div>
        <span className={s.bookingNavigationItemText}>{text}</span>
      </span>
    </li>
  );
};

BookingNavigationItem.propTypes = {
  active: React.PropTypes.string,
  link: React.PropTypes.string,
  icon: React.PropTypes.string,
  text: React.PropTypes.string,

  lastPage: React.PropTypes.string,
};

const mapStateToProps = (state) => ({
  lastPage: state.lastPage,
});

export default connect(mapStateToProps)(BookingNavigationItem);
