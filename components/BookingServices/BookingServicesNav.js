import React, { Component } from 'react';
import classNames from 'classNames';
import './BookingServices.scss';
import Container from '../Container';
import Link from '../Link';

export default class BookingServicesNav extends Component {

  render() {
    return (
      <div className="BookingServicesNav-wrapper">
        <Container>
          <ul className="BookingServicesNav">
            <li className="BookingServicesNav-item">
              <a className={classNames('BookingServicesNav-link', (this.props.path === '/') ? 'active' : '')} href="/" onClick={Link.handleClick}>All Services</a>
            </li>
            <li className="BookingServicesNav-item">
              <a className={classNames('BookingServicesNav-link', (this.props.path === '/about') ? 'active' : '')} href="/about" onClick={Link.handleClick}>Home Nursing</a>
            </li>
            <li className="BookingServicesNav-item">
              <a className={classNames('BookingServicesNav-link', (this.props.path === '/faq') ? 'active' : '')} href="/faq" onClick={Link.handleClick}>Home TCM</a>
            </li>
            <li className="BookingServicesNav-item">
              <a className={classNames('BookingServicesNav-link', (this.props.path === '/faq') ? 'active' : '')} href="/faq" onClick={Link.handleClick}>Home Care</a>
            </li>
            <li className="BookingServicesNav-item">
              <a className={classNames('BookingServicesNav-link', (this.props.path === '/faq') ? 'active' : '')} href="/faq" onClick={Link.handleClick}>Home Medical</a>
            </li>
          </ul>
        </Container>
      </div>
    );
  }

}
