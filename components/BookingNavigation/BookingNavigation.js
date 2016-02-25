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
              <a className={classNames('BookingNavigation-link', (this.props.path === '/booking1') ? 'active' : '')} href="/booking1" onClick={Link.handleClick}>
                <div className="BookingNavigation-item-icon">1</div>
                <span className="BookingNavigation-item-text">Select Services</span>
              </a>
            </li>
            <li className="BookingNavigation-item">
              <a className={classNames('BookingNavigation-link', (this.props.path === '/booking2') ? 'active' : '')} href="/booking2" onClick={Link.handleClick}>
                <div className="BookingNavigation-item-icon">2</div>
                <span className="BookingNavigation-item-text">Select Location</span>
              </a>
            </li>
            <li className="BookingNavigation-item">
              <a className={classNames('BookingNavigation-link', (this.props.path.indexOf('/booking3')==0) ? 'active' : '')} href="/booking3a" onClick={Link.handleClick}>
                <div className="BookingNavigation-item-icon">3</div>
                <span className="BookingNavigation-item-text">Select Date & Time</span>
              </a>
            </li>
          </ul>
        </Container>
      </div>
    );
  }

}
