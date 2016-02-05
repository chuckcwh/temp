import React, { Component } from 'react';
import classNames from 'classNames';
import './BookingNavigation.scss';
import Container from '../Container';
import Link from '../Link';

export default class BookingNavigation extends Component {

  render() {
    return (
      <div className="BookingNavigation-wrapper">
        <Container>
          <ul className="BookingNavigation">
            <li className="BookingNavigation-item">
              <a className={classNames('BookingNavigation-link', (this.props.path === '/') ? 'active' : '')} href="/" onClick={Link.handleClick}>Select Services</a>
            </li>
            <li className="BookingNavigation-item">
              <a className={classNames('BookingNavigation-link', (this.props.path === '/about') ? 'active' : '')} href="/about" onClick={Link.handleClick}>Select Location</a>
            </li>
            <li className="BookingNavigation-item">
              <a className={classNames('BookingNavigation-link', (this.props.path === '/faq') ? 'active' : '')} href="/faq" onClick={Link.handleClick}>Select Date & Time</a>
            </li>
          </ul>
        </Container>
      </div>
    );
  }

}
