import React, { Component } from 'react';
import classNames from 'classnames';
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
    var accountText;
    if (Util.isLoggedInBackend()) {
      accountText = 'DASHBOARD';
    } else {
      accountText = 'LOGIN';
    }
    return (
      <div className="NavWrapper">
        <Menu id={"mobile-menu"} width={180} isOpen={this.state.visible} right>
          <li className="Navigation-item">
            <a className={classNames('Navigation-link', (this.props.path === '/about') ? 'active' : '')} href="/about" onClick={Link.handleClick}>ABOUT</a>
          </li>
          <li className="Navigation-item">
            <a className={classNames('Navigation-link', (this.props.path === '/services') ? 'active' : '')} href="/services" onClick={Link.handleClick}>SERVICES</a>
          </li>
          <li className="Navigation-item">
            <a className={classNames('Navigation-link', (this.props.path === '/faq') ? 'active' : '')} href="/faq" onClick={Link.handleClick}>FAQ</a>
          </li>
          <li className="Navigation-item">
            <a className="Navigation-link Navigation-link-highlight" href={Util.partners}>BECOME A PARTNER</a>
          </li>
          <li className="Navigation-item">
            <a className={classNames('Navigation-link', (this.props.path === '/booking-manage') ? 'active' : '')} href="/booking-manage" onClick={Link.handleClick}>MANAGE BOOKING</a>
          </li>
          <li className="Navigation-item">
            <a className="Navigation-link" href={Util.backend}>{accountText}</a>
          </li>
        </Menu>
        <Container>
          <div className="Navigation-wrapper">
            <Logo />
            <ul className={classNames('Navigation', this.state.visible ? 'visible' : '')} role="menu">
              <li className="Navigation-item">
                <a className={classNames('Navigation-link', (this.props.path === '/about') ? 'active' : '')} href="/about" onClick={Link.handleClick}>ABOUT</a>
              </li>
              <li className="Navigation-item">
                <a className={classNames('Navigation-link', (this.props.path === '/services') ? 'active' : '')} href="/services" onClick={Link.handleClick}>SERVICES</a>
              </li>
              <li className="Navigation-item">
                <a className={classNames('Navigation-link', (this.props.path === '/faq') ? 'active' : '')} href="/faq" onClick={Link.handleClick}>FAQ</a>
              </li>
              <li className="Navigation-item">
                <a className="Navigation-link Navigation-link-highlight" href={Util.partners}>BECOME A PARTNER</a>
              </li>
              <li className="Navigation-item">
                <a className={classNames('Navigation-link', (this.props.path === '/booking-manage') ? 'active' : '')} href="/booking-manage" onClick={Link.handleClick}>MANAGE BOOKING</a>
              </li>
              <li className="Navigation-item">
                <a className="Navigation-link" href={Util.backend}>{accountText}</a>
              </li>
            </ul>
          </div>
        </Container>
      </div>
    );
  }

}
