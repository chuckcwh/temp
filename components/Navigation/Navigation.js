import React, { Component } from 'react';
import classNames from 'classNames';
import './Navigation.scss';
import Logo from '../Logo';
import Link from '../Link';

export default class Navigation extends Component {

  render() {
    return (
      <div className="Navigation-wrapper">
        <Logo />
        <ul className="Navigation" role="menu">
          <li className="Navigation-item">
            <a className={classNames('Navigation-link', (this.props.path === '/') ? 'active' : '')} href="/" onClick={Link.handleClick}>Home</a>
          </li>
          <li className="Navigation-item">
            <a className={classNames('Navigation-link', (this.props.path === '/about') ? 'active' : '')} href="/about" onClick={Link.handleClick}>About</a>
          </li>
          <li className="Navigation-item">
            <a className={classNames('Navigation-link', (this.props.path === '/faq') ? 'active' : '')} href="/faq" onClick={Link.handleClick}>FAQ</a>
          </li>
          <li className="Navigation-item">
            <a className={classNames('Navigation-link', (this.props.path === '/services') ? 'active' : '')} href="/services" onClick={Link.handleClick}>Services</a>
          </li>
          <li className="Navigation-item">
            <a className={classNames('Navigation-link', (this.props.path === '/contact') ? 'active' : '')} href="/contact" onClick={Link.handleClick}>Contact</a>
          </li>
          <li className="Navigation-item">
            <a className={classNames('Navigation-link', (this.props.path === '/login') ? 'active' : '')} href="/login" onClick={Link.handleClick}>Manage Bookings</a>
          </li>
        </ul>
      </div>
    );
  }

}
