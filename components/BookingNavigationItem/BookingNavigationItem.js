import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import './BookingNavigationItem.scss';
import Link from '../Link';
import { isNavigationAllowed } from '../../core/Util';

class BookingNavigationItem extends Component {

  render() {
    const { location, lastPage, active, link, icon, text } = this.props;
    if (link && isNavigationAllowed(link, lastPage)) {
      return (
        <li className="BookingNavigationItem">
          <a className={classNames('BookingNavigation-link', (location && location.pathname && location.pathname.indexOf('/' + active)==0) ? 'active' : '')} href={'/' + link} onClick={Link.handleClick}>
            <div className="BookingNavigationItem-icon">{icon}</div>
            <span className="BookingNavigationItem-text">{text}</span>
          </a>
        </li>
      );
    } else {
      return (
        <li className="BookingNavigationItem">
          <span className={classNames('BookingNavigation-link', (location && location.pathname && location.pathname.indexOf('/' + active)==0) ? 'active' : '')}>
            <div className="BookingNavigationItem-icon">{icon}</div>
            <span className="BookingNavigationItem-text">{text}</span>
          </span>
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

export default connect(mapStateToProps, {})(BookingNavigationItem);
