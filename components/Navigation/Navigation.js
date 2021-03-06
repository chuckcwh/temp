import React, { Component } from 'react';
import { connect } from 'react-redux';
import cookie from 'react-cookie';
import classNames from 'classnames';
import { slide as Menu } from 'react-burger-menu';
import s from './Navigation.css';
import Container from '../Container';
import Logo from '../Logo';
import Link from '../Link';
import { destroyUser } from '../../actions';
import history from '../../core/history';
import { isBookingPage, blog, isClient, isProvider, isAdmin } from '../../core/util';

class Navigation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  handleLogout = (event) => {
    event.preventDefault();
    cookie.remove('user_id', { path: '/' });
    cookie.remove('user_token', { path: '/' });
    this.props.destroyUser();
    history.push({ pathname: '/login', query: location.query });
  };

  render() {
    const location = history.getCurrentLocation();
    const { user } = this.props;

    if (user && isClient(user)) {
      return (
        <div className={s.navWrapper}>
          <Menu id={"mobile-menu"} width={180} isOpen={this.state.visible} right>
            <li className={s.navigationItem}>
              <Link
                className={classNames(s.navigationLink, (location.pathname === '/dashboard') ? s.navigationLinkActive : '')}
                to="/dashboard"
              >DASHBOARD</Link>
            </li>
            <li className={s.navigationItem}>
              <Link
                className={classNames(s.navigationLink)}
                to="/booking1"
              >CREATE BOOKING</Link>
            </li>
            <li className={s.navigationItem}>
              <Link
                className={classNames(s.navigationLink, (location.pathname === '/credits') ? s.navigationLinkActive : '')}
                to="/credits"
              >E-WALLET</Link>
            </li>
            <li className={s.navigationItem}>
              <Link
                className={classNames(s.navigationLink, (location.pathname === '/patients') ? s.navigationLinkActive : '')}
                to="/patients"
              >PATIENTS</Link>
            </li>
            <li className={s.navigationItem}>
              <Link
                className={classNames(s.navigationLink, (location.pathname === '/profile') ? s.navigationLinkActive : '')}
                to="/profile"
              >PROFILE</Link>
            </li>
            <li className={s.navigationItem}>
              <a className={s.navigationLink} onClick={this.handleLogout}>LOGOUT</a>
            </li>
          </Menu>
          <Container>
            <div className={s.navigationWrapper}>
              <Logo />
              <ul className={classNames(s.navigation, this.state.visible ? 'visible' : '')} role="menu">
                <li className={s.navigationItem}>
                  <Link
                    className={classNames(s.navigationLink, (location.pathname === '/dashboard') ? s.navigationLinkActive : '')}
                    to="/dashboard"
                  >DASHBOARD</Link>
                </li>
                <li className={s.navigationItem}>
                  <Link
                    className={classNames(s.navigationLink, (isBookingPage(location.pathname)) ? s.navigationLinkActive : '')}
                    to="/booking1"
                  >CREATE BOOKING</Link>
                </li>
                <li className={s.navigationItem}>
                  <Link
                    className={classNames(s.navigationLink, (location.pathname === '/credits') ? s.navigationLinkActive : '')}
                    to="/credits"
                  >E-WALLET</Link>
                </li>
                <li className={s.navigationItem}>
                  <Link
                    className={classNames(s.navigationLink, (location.pathname === '/patients') ? s.navigationLinkActive : '')}
                    to="/patients"
                  >PATIENTS</Link>
                </li>
                <li className={s.navigationItem}>
                  <a className={classNames(s.navigationLink)} onClick={this.handleLogout}>LOGOUT</a>
                </li>
              </ul>
            </div>
          </Container>
        </div>
      );
    } else if (user && isProvider(user)) {
      return (
        <div className={s.navWrapper}>
          <Menu id={"mobile-menu"} width={180} isOpen={this.state.visible} right>
            <li className={s.navigationItem}>
              <Link
                className={classNames(s.navigationLink, (location.pathname === '/dashboard') ? s.navigationLinkActive : '')}
                to="/dashboard"
              >DASHBOARD</Link>
            </li>
            <li className={s.navigationItem}>
              <Link
                className={classNames(s.navigationLink, (location.pathname === '/schedule') ? s.navigationLinkActive : '')}
                to="/schedule"
              >SCHEDULE</Link>
            </li>
            <li className={s.navigationItem}>
              <Link
                className={classNames(s.navigationLink, (location.pathname === '/profile') ? s.navigationLinkActive : '')}
                to="/profile"
              >PROFILE</Link>
            </li>
            <li className={s.navigationItem}>
              <a className={s.navigationLink} onClick={this.handleLogout}>LOGOUT</a>
            </li>
          </Menu>
          <Container>
            <div className={s.navigationWrapper}>
              <Logo />
              <ul className={classNames(s.navigation, this.state.visible ? 'visible' : '')} role="menu">
                <li className={s.navigationItem}>
                  <Link
                    className={classNames(s.navigationLink, (location.pathname === '/dashboard') ? s.navigationLinkActive : '')}
                    to="/dashboard"
                  >DASHBOARD</Link>
                </li>
                <li className={s.navigationItem}>
                  <Link
                    className={classNames(s.navigationLink, (location.pathname === '/schedule') ? s.navigationLinkActive : '')}
                    to="/schedule"
                  >SCHEDULE</Link>
                </li>
                <li className={s.navigationItem}>
                  <a className={classNames(s.navigationLink)} onClick={this.handleLogout}>LOGOUT</a>
                </li>
              </ul>
            </div>
          </Container>
        </div>
      );
    } else if (user && isAdmin(user)) {
      return (
        <div className={s.navWrapper}>
          <Menu id={"mobile-menu"} width={180} isOpen={this.state.visible} right>
            <li className={s.navigationItem}>
              <Link
                className={classNames(s.navigationLink, (location.pathname === '/dashboard') ? s.navigationLinkActive : '')}
                to="/dashboard"
              >DASHBOARD</Link>
            </li>
            <li className={s.navigationItem}>
              <Link
                className={classNames(s.navigationLink, (location.pathname === '/admin-promocodes') ? s.navigationLinkActive : '')}
                to="/admin-promocodes"
              >PROMOCODES</Link>
            </li>
            <li className={s.navigationItem}>
              <Link
                className={classNames(s.navigationLink, (location.pathname === '/admin-bookings') ? s.navigationLinkActive : '')}
                to="/admin-bookings"
              >BOOKINGS</Link>
            </li>
            <li className={s.navigationItem}>
              <Link
                className={classNames(s.navigationLink, (location.pathname === '/admin-cases') ? s.navigationLinkActive : '')}
                to="/admin-cases"
              >CASES</Link>
            </li>
            <li className={s.navigationItem}>
              <Link
                className={classNames(s.navigationLink, (location.pathname === '/admin-users') ? s.navigationLinkActive : '')}
                to="/admin-users"
              >USERS</Link>
            </li>
            <li className={s.navigationItem}>
              <Link
                className={classNames(s.navigationLink, (location.pathname === '/admin-transactions') ? s.navigationLinkActive : '')}
                to="/admin-transactions"
              >TRANSACTIONS</Link>
            </li>
            <li className={s.navigationItem}>
              <Link
                className={classNames(s.navigationLink, (location.pathname === '/admin-services') ? s.navigationLinkActive : '')}
                to="/admin-services"
              >SERVICES</Link>
            </li>
            <li className={s.navigationItem}>
              <Link
                className={classNames(s.navigationLink, (location.pathname === '/admin-categories') ? s.navigationLinkActive : '')}
                to="/admin-categories"
              >CATEGORIES</Link>
            </li>
            <li className={s.navigationItem}>
              <a className={s.navigationLink} onClick={this.handleLogout}>LOGOUT</a>
            </li>
          </Menu>
          <Container>
            <div className={s.navigationWrapper}>
              <Logo />
              <ul className={classNames(s.navigation, this.state.visible ? 'visible' : '')} role="menu">
                <li className={s.navigationItem}>
                  <Link
                    className={classNames(s.navigationLink, (location.pathname === '/dashboard') ? s.navigationLinkActive : '')}
                    to="/dashboard"
                  >DASHBOARD</Link>
                </li>
                <li className={s.navigationItem}>
                  <Link
                    className={classNames(s.navigationLink, (location.pathname === '/admin-promocodes') ? s.navigationLinkActive : '')}
                    to="/admin-promocodes"
                  >PROMOCODES</Link>
                </li>
                <li className={s.navigationItem}>
                  <Link
                    className={classNames(s.navigationLink, (location.pathname === '/admin-bookings') ? s.navigationLinkActive : '')}
                    to="/admin-bookings"
                  >BOOKINGS</Link>
                </li>
                <li className={s.navigationItem}>
                  <Link
                    className={classNames(s.navigationLink, (location.pathname === '/admin-cases') ? s.navigationLinkActive : '')}
                    to="/admin-cases"
                  >CASES</Link>
                </li>
                <li className={s.navigationItem}>
                  <Link
                    className={classNames(s.navigationLink, (location.pathname === '/admin-users') ? s.navigationLinkActive : '')}
                    to="/admin-users"
                  >USERS</Link>
                </li>
                <li className={s.navigationItem}>
                  <Link
                    className={classNames(s.navigationLink, (location.pathname === '/admin-transactions') ? s.navigationLinkActive : '')}
                    to="/admin-transactions"
                  >TRANSACTIONS</Link>
                </li>
                <li className={s.navigationItem}>
                  <Link
                    className={classNames(s.navigationLink, (location.pathname === '/admin-services') ? s.navigationLinkActive : '')}
                    to="/admin-services"
                  >SERVICES</Link>
                </li>
                <li className={s.navigationItem}>
                  <Link
                    className={classNames(s.navigationLink, (location.pathname === '/admin-categories') ? s.navigationLinkActive : '')}
                    to="/admin-categories"
                  >CATEGORIES</Link>
                </li>
                <li className={s.navigationItem}>
                  <a className={classNames(s.navigationLink)} onClick={this.handleLogout}>LOGOUT</a>
                </li>
              </ul>
            </div>
          </Container>
        </div>
      );
    }
    return (
      <div className={s.navWrapper}>
        <Menu id={"mobile-menu"} width={180} isOpen={this.state.visible} right>
          <li className={s.navigationItem}>
            <Link
              className={classNames(s.navigationLink, (location.pathname === '/about') ? s.navigationLinkActive : '')}
              to="/about"
            >ABOUT</Link>
          </li>
          <li className={s.navigationItem}>
            <Link
              className={classNames(s.navigationLink, (location.pathname === '/services') ? s.navigationLinkActive : '')}
              to="/services"
            >SERVICES</Link>
          </li>
          <li className={s.navigationItem}>
            <Link
              className={classNames(s.navigationLink, (location.pathname === '/faq') ? s.navigationLinkActive : '')}
              to="/faq"
            >FAQ</Link>
          </li>
          <li className={s.navigationItem}>
            <a className={s.navigationLink} href={blog}>BLOG</a>
          </li>
          <li className={s.navigationItem}>
            <Link
              className={classNames(s.navigationLink, (location.pathname === '/booking-manage') ? s.navigationLinkActive : '')}
              to="/booking-manage"
            >MANAGE BOOKING</Link>
          </li>
        </Menu>
        <Container>
          <div className={s.navigationWrapper}>
            <Logo />
            <ul className={classNames(s.navigation, this.state.visible ? 'visible' : '')} role="menu">
              <li className={s.navigationItem}>
                <Link
                  className={classNames(s.navigationLink, (location.pathname === '/about') ? s.navigationLinkActive : '')}
                  to="/about"
                >ABOUT</Link>
              </li>
              <li className={s.navigationItem}>
                <Link
                  className={classNames(s.navigationLink, (location.pathname === '/services') ? s.navigationLinkActive : '')}
                  to="/services"
                >SERVICES</Link>
              </li>
              <li className={s.navigationItem}>
                <Link
                  className={classNames(s.navigationLink, (location.pathname === '/faq') ? s.navigationLinkActive : '')}
                  to="/faq"
                >FAQ</Link>
              </li>
              <li className={s.navigationItem}>
                <a className={s.navigationLink} href={blog}>BLOG</a>
              </li>
              <li className={s.navigationItem}>
                <Link
                  className={classNames(s.navigationLink, (location.pathname === '/booking-manage') ? s.navigationLinkActive : '')}
                  to="/booking-manage"
                >MANAGE BOOKING</Link>
              </li>
              <li className={s.navigationItem}>
                <Link
                  className={classNames(s.navigationLink, (location.pathname === '/login') ? s.navigationLinkActive : '')}
                  to="/login"
                >LOGIN</Link>
              </li>
            </ul>
          </div>
        </Container>
      </div>
    );
  }

}

Navigation.propTypes = {
  location: React.PropTypes.object.isRequired,

  user: React.PropTypes.object,

  destroyUser: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user.data,
});

const mapDispatchToProps = (dispatch) => ({
  destroyUser: () => dispatch(destroyUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
