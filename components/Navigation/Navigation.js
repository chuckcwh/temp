import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { slide as Menu } from 'react-burger-menu';
import s from './Navigation.css';
import Container from '../Container';
import Logo from '../Logo';
import Link from '../Link';
import history from '../../core/history';
import util from '../../core/util';

export default class Navigation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  render() {
    const location = history.getCurrentLocation();
    var accountText;
    if (util.isLoggedInBackend()) {
      accountText = 'DASHBOARD';
    } else {
      accountText = 'LOGIN';
    }
    return (
      <div className={s.navWrapper}>
        <Menu id={"mobile-menu"} width={180} isOpen={this.state.visible} right>
          <li className={s.navigationItem}>
            <Link className={classNames(s.navigationLink, (location.pathname === '/about') ? s.navigationLinkActive : '')} to="/about">ABOUT</Link>
          </li>
          <li className={s.navigationItem}>
            <Link className={classNames(s.navigationLink, (location.pathname === '/services') ? s.navigationLinkActive : '')} to="/services">SERVICES</Link>
          </li>
          <li className={s.navigationItem}>
            <Link className={classNames(s.navigationLink, (location.pathname === '/faq') ? s.navigationLinkActive : '')} to="/faq">FAQ</Link>
          </li>
          <li className={s.navigationItem}>
            <Link className={classNames(s.navigationLink, (location.pathname === '/booking-manage') ? s.navigationLinkActive : '')} to="/booking-manage">MANAGE BOOKING</Link>
          </li>
          <li className={s.navigationItem}>
            <a className={s.navigationLink} href={util.backend}>{accountText}</a>
          </li>
        </Menu>
        <Container>
          <div className={s.navigationWrapper}>
            <Logo />
            <ul className={classNames(s.navigation, this.state.visible ? 'visible' : '')} role="menu">
              <li className={s.navigationItem}>
                <Link className={classNames(s.navigationLink, (location.pathname === '/about') ? s.navigationLinkActive : '')} to="/about">ABOUT</Link>
              </li>
              <li className={s.navigationItem}>
                <Link className={classNames(s.navigationLink, (location.pathname === '/services') ? s.navigationLinkActive : '')} to="/services">SERVICES</Link>
              </li>
              <li className={s.navigationItem}>
                <Link className={classNames(s.navigationLink, (location.pathname === '/faq') ? s.navigationLinkActive : '')} to="/faq">FAQ</Link>
              </li>
              <li className={s.navigationItem}>
                <Link className={classNames(s.navigationLink, (location.pathname === '/booking-manage') ? s.navigationLinkActive : '')} to="/booking-manage">MANAGE BOOKING</Link>
              </li>
              <li className={s.navigationItem}>
                <a className={s.navigationLink} href={util.backend}>{accountText}</a>
              </li>
            </ul>
          </div>
        </Container>
      </div>
    );
  }

}