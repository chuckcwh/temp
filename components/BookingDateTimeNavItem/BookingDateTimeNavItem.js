import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import s from './BookingDateTimeNavItem.css';
import Link from '../Link';
import history from '../../core/history';
import { isNavigationAllowed } from '../../core/util';

const BookingDateTimeNavItem = (props) => {
  const { lastPage, active, link, name } = props;
  const location = history.getCurrentLocation();
  if (link && isNavigationAllowed(link, lastPage)) {
    return (
      <li className={s.bookingDateTimeNavItem}>
        <Link
          className={classNames(s.bookingDateTimeNavLink,
            (location && location.pathname && location.pathname.indexOf(`/${active}`) === 0)
            ? s.bookingDateTimeNavLinkActive
            : '')}
          to={{ pathname: `/${link}`, query: location && location.query }}
        >
          {name}
          <span className={s.bookingDateTimeNavArrow}><div className="nav-caret"></div></span>
        </Link>
      </li>
    );
  }
  return (
    <li className={s.bookingDateTimeNavItem}>
      <span
        className={classNames(s.bookingDateTimeNavLink,
          (location && location.pathname && location.pathname.indexOf(`/${active}`) === 0)
          ? s.bookingDateTimeNavLinkActive
          : '')}
      >
        {name}
        <span className={s.bookingDateTimeNavArrow}><div className="nav-caret"></div></span>
      </span>
    </li>
  );
};

BookingDateTimeNavItem.propTypes = {
  lastPage: React.PropTypes.string.isRequired,
  active: React.PropTypes.string.isRequired,
  link: React.PropTypes.string,
  name: React.PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  lastPage: state.lastPage,
});

export default connect(mapStateToProps, {})(BookingDateTimeNavItem);
