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
              <a className={classNames('BookingNavigation-link', (this.props.path === '/') ? 'active' : '')} href="/" onClick={Link.handleClick}>
                <svg className="BookingNavigation-item-icon" height="50" width="45">
                  <polygon className="BookingNavigation-item-icon-polygon" points="22.5,0 45,12.5 45,37.5 22.5,50 0,37.5 0,12.5" />
                  <text className="BookingNavigation-item-icon-text" x="18" y="32.5" textAnchor="start">1</text>
                </svg>
                <span className="BookingNavigation-item-text">Select Services</span>
              </a>
            </li>
            <li className="BookingNavigation-item">
              <a className={classNames('BookingNavigation-link', (this.props.path === '/about') ? 'active' : '')} href="/about" onClick={Link.handleClick}>
                <svg className="BookingNavigation-item-icon" height="50" width="45">
                  <polygon className="BookingNavigation-item-icon-polygon" points="22.5,0 45,12.5 45,37.5 22.5,50 0,37.5 0,12.5" />
                  <text className="BookingNavigation-item-icon-text" x="15" y="32.5" textAnchor="start">2</text>
                </svg>
                <span className="BookingNavigation-item-text">Select Location</span>
              </a>
            </li>
            <li className="BookingNavigation-item">
              <a className={classNames('BookingNavigation-link', (this.props.path === '/faq') ? 'active' : '')} href="/faq" onClick={Link.handleClick}>
                <svg className="BookingNavigation-item-icon" height="50" width="45">
                  <polygon className="BookingNavigation-item-icon-polygon" points="22.5,0 45,12.5 45,37.5 22.5,50 0,37.5 0,12.5" />
                  <text className="BookingNavigation-item-icon-text" x="15" y="32.5" textAnchor="start">3</text>
                </svg>
                <span className="BookingNavigation-item-text">Select Date & Time</span>
              </a>
            </li>
          </ul>
        </Container>
      </div>
    );
  }

}
