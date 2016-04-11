import React, { Component } from 'react';
import classNames from 'classnames';
import './BookingDateTimeNavItem.scss';
import Link from '../Link';
import BookingStore from '../../stores/BookingStore';

export default class BookingDateTimeNavItem extends Component {

  render() {
    if (this.props.link && BookingStore.isNavigationAllowed(this.props.link)) {
      return (
        <li className="BookingDateTimeNavItem">
          <a className={classNames('BookingDateTimeNav-link', (this.props.path && this.props.path.indexOf('/'+this.props.active)==0) ? 'active' : '')} href={'/'+this.props.link} onClick={Link.handleClick}>{this.props.name}<span className="BookingDateTimeNav-arrow"><div className="nav-caret"></div></span></a>
        </li>
      );
    } else {
      return (
        <li className="BookingDateTimeNavItem">
          <span className={classNames('BookingDateTimeNav-link', (this.props.path && this.props.path.indexOf('/'+this.props.active)==0) ? 'active' : '')}>{this.props.name}<span className="BookingDateTimeNav-arrow"><div className="nav-caret"></div></span></span>
        </li>
      );
    }
  }

}
