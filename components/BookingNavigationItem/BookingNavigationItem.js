import React, { Component } from 'react';
import classNames from 'classNames';
import './BookingNavigationItem.scss';
import Link from '../Link';
import BookingStore from '../../stores/BookingStore';

export default class BookingNavigationItem extends Component {

  render() {
    if (BookingStore.isNavigationAllowed(this.props.link)) {
      return (
        <li className="BookingNavigationItem">
          <a className={classNames('BookingNavigation-link', (this.props.path.indexOf('/'+this.props.active)==0) ? 'active' : '')} href={'/'+this.props.link} onClick={Link.handleClick}>
            <div className="BookingNavigationItem-icon">{this.props.icon}</div>
            <span className="BookingNavigationItem-text">{this.props.text}</span>
          </a>
        </li>
      );
    } else {
      return (
        <li className="BookingNavigationItem">
          <span className={classNames('BookingNavigation-link', (this.props.path.indexOf('/'+this.props.active)==0) ? 'active' : '')}>
            <div className="BookingNavigationItem-icon">{this.props.icon}</div>
            <span className="BookingNavigationItem-text">{this.props.text}</span>
          </span>
        </li>
      );
    }
  }

}
