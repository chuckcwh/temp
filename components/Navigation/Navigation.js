import React, { Component } from 'react';
import classNames from 'classNames';
import { slide as Menu } from 'react-burger-menu';
import './Navigation.scss';
import Container from '../Container';
import Logo from '../Logo';
import Link from '../Link';
import Util from '../../core/Util';

export default class Navigation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  render() {
    var accountLink;
    if (Util.getCookies()['sessionid']) {
      accountLink = (
        <li className="Navigation-item">
          <a className="Navigation-link" href="https://app.ebeecare.com/login/">Dashboard</a>
        </li>
      );
    } else {
      accountLink = (
        <li className="Navigation-item">
          <a className="Navigation-link" href="https://app.ebeecare.com/login/">Login</a>
        </li>
      );
    }
    return (
      <div className="NavWrapper">
        <Menu id={"mobile-menu"} width={150} isOpen={this.state.visible} right>
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
            <a className={classNames('Navigation-link', (this.props.path === '/booking-manage') ? 'active' : '')} href="/booking-manage" onClick={Link.handleClick}>Manage Booking</a>
          </li>
          {accountLink}
        </Menu>
        <Container>
          <div className="Navigation-wrapper">
            <Logo />
            <ul className={classNames('Navigation', this.state.visible ? 'visible' : '')} role="menu">
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
                <a className={classNames('Navigation-link', (this.props.path === '/booking-manage') ? 'active' : '')} href="/booking-manage" onClick={Link.handleClick}>Manage Booking</a>
              </li>
              {accountLink}
            </ul>
          </div>
        </Container>
      </div>
    );
  }

}
