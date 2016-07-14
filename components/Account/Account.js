import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import linkState from 'react-link-state';
import classNames from 'classnames';
import s from './Account.css';
import Container from '../Container';
import Link from '../Link';
import FindBookingForm from '../FindBookingForm';
import VerifyBookingPopup from '../VerifyBookingPopup';
import ResendVerifyBookingPopup from '../ResendVerifyBookingPopup';
import { getBooking, setLastPage, showAlertPopup, showVerifyBookingPopup } from '../../actions';
import history from '../../core/history';
import util from '../../core/util';

class Account extends Component {

  constructor(props) {
    super(props);
    this.state = {
      bid: this.props.bid || undefined,
      mobilePhone: this.props.mobilePhone || undefined,
      pin: undefined,
      resend: false,
      resent: false
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      bid: props.bid || this.state.bid,
      mobilePhone: props.mobilePhone || this.state.mobilePhone
    });
    if (props.booking && props.booking.id && !props.booking.isHPVerified) {
      this.props.showVerifyBookingPopup(props.booking.id);
    }
  }

  componentDidMount() {
    if (this.props.booking && this.props.booking.id && !this.props.booking.isHPVerified) {
      this.props.showVerifyBookingPopup(this.props.booking.id);
    }
  }

  render() {
    const location = history.getCurrentLocation();
    var components;
    if (this.props.type === 'login') {
      components = (
        <div className={s.accountContainer}>
          {/*
          <div className={classNames(s.accountLogin, s.accountContainerItem)}>
            <form id="AccountFindBookingForm" action="https://app.ebecare.com/login/" method="POST">
              <h3>Already a Member?</h3>
              <input className="EmailInput" type="email" name="email" placeholder="Enter Email" />
              <input className="PasswordInput" type="password" name="password" placeholder="Enter Password" />
              <div className={s.accountContainerItemMiddle}>
                <div className={s.forgotPasswordContainer}>
                  <Link to="/forgot-password" className={s.forgotPasswordLink}>Forgot Password?</Link>
                </div>
                <div>
                  <input className="RememberMeCheckbox" type="checkbox" id="remember" name="remember" />
                  <label className="RememberMeCheckboxLabel" htmlFor="remember">
                    <span></span><span>Remember me</span>
                  </label>
                </div>
              </div>
              <a href="#" className="btn btn-primary" onClick={this._onClickLogin.bind(this)}>Login</a>
            </form>
          </div>
          */}
          <div className={classNames(s.accountFind, s.accountContainerItem)}>
            <Loader className="spinner" loaded={(!(this.props.bookingFetching) && location && location.query && location.query.bid && location.query.mobilePhone) ? false : true}>
              <FindBookingForm />
            </Loader>
          </div>
        </div>
      );
    } else if (this.props.type === 'forgot-password') {
      components = (
        <div className={s.accountContainer}>
          <div className={classNames(s.accountForgot, s.accountContainerItem)}>
            <form ref={(c) => this._accountForgotPasswordForm = c}>
              <h3>Forgot Password?</h3>
              <div className="IconInput EmailInput">
                <input type="email" placeholder="Enter Email*" />
              </div>
              <div className={s.accountContainerItemMiddle}>
                <div className={s.forgotPasswordContainer}>
                  <Link to="/manage-booking" className={s.forgotPasswordLink}>Remembered Password?</Link>
                </div>
              </div>
              <a href="#" className="btn btn-primary">Submit</a>
            </form>
          </div>
        </div>
      );
    }
    return (
      <div className={s.account}>
        <Container>
          {components}
        </Container>
        <VerifyBookingPopup onVerified={this._onVerified.bind(this)} />
      </div>
    );
  }

  _onVerified() {
    this.props.getBooking({
      bid: this.state.bid,
      mobilePhone: this.state.mobilePhone
    }).then((res) => {
      if (res.response && res.response.status < 1) {
        this.props.showAlertPopup('Sorry, we are not able to find your booking.');
      }
    });
  }

}


const mapStateToProps = (state) => {
  return {
    booking: state.booking.data,
    user: state.user,
    patient: state.patient
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getBooking: (params) => {
      return dispatch(getBooking(params));
    },
    setLastPage: (page) => {
      return dispatch(setLastPage(page));
    },
    showAlertPopup: (message) => {
      return dispatch(showAlertPopup(message));
    },
    showVerifyBookingPopup: (bookingId) => {
      return dispatch(showVerifyBookingPopup(bookingId));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);
