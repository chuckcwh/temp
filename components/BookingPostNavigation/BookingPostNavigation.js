import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import s from './BookingPostNavigation.css';
import Container from '../Container';
import Link from '../Link';
import { setPostStatus } from '../../actions';
import history from '../../core/history';
const location = history.getCurrentLocation();

class BookingPostNavigation extends Component {

  render() {
    const { postStatus } = this.props;
    return (
      <div className={s.bookingPostNavigationWrapper}>
        <Container>
          <ul className={s.bookingPostNavigation}>
            <li className={s.bookingPostNavigationItem}>
              <a className={classNames(s.bookingPostNavigationLink, (location && location.pathname === '/booking-confirmation' && postStatus === 'confirmation') ? s.bookingPostNavigationLinkActive : '')} href="#" onClick={this._onClick.bind(this)}>
                <div className={s.bookingPostNavigationItemIcon}>1</div>
                <span className={s.bookingPostNavigationItemText}>Booking Confirmation</span>
              </a>
            </li>
            <li className={s.bookingPostNavigationItem}>
              <span className={classNames(s.bookingPostNavigationLink, (location && location.pathname === '/booking-confirmation' && postStatus.indexOf('payment') > -1) ? s.bookingPostNavigationLinkActive : '')}>
                <div className={s.bookingPostNavigationItemIcon}>2</div>
                <span className={s.bookingPostNavigationItemText}>Booking Payment</span>
              </span>
            </li>
          </ul>
        </Container>
      </div>
    );
  }

  _onClick(event) {
    event.preventDefault();

    this.props.setPostStatus('confirmation');
  }

}

const mapStateToProps = (state) => {
  return {
    postStatus: state.postStatus
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setPostStatus: (status) => {
      return dispatch(setPostStatus(status));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingPostNavigation);
