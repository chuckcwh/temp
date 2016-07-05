import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import linkState from 'react-link-state';
import './Account.scss';
import Container from '../Container';
import Link from '../Link';
import FindBookingForm from '../FindBookingForm';
import VerifyBookingPopup from '../VerifyBookingPopup';
import ResendVerifyBookingPopup from '../ResendVerifyBookingPopup';
import { getBooking, setLastPage, showAlertPopup, showVerifyBookingPopup } from '../../actions';
import Util from '../../core/Util';

class Account extends Component {

  constructor(props) {
    super(props);
    this.state = {
      bid: this.props.bid || undefined,
      email: this.props.email || undefined,
      pin: undefined,
      resend: false,
      resent: false
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      bid: props.bid || this.state.bid,
      email: props.email || this.state.email
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
    var components;
    if (this.props.type === 'login') {
      components = (
        <div className="Account-container">
          {/*
          <div className="Account-login Account-container-item">
            <form id="AccountFindBookingForm" action="https://app.ebecare.com/login/" method="POST">
              <h3>Already a Member?</h3>
              <input className="EmailInput" type="email" name="email" placeholder="Enter Email" />
              <input className="PasswordInput" type="password" name="password" placeholder="Enter Password" />
              <div className="Account-container-item-middle">
                <div className="ForgotPasswordContainer">
                  <a href="/forgot-password" className="ForgotPasswordLink" onClick={Link.handleClick}>Forgot Password?</a>
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
          <div className="Account-find Account-container-item">
            <Loader className="spinner" loaded={(!(this.props.bookingFetching) && this.props.location && this.props.location.query && this.props.location.query.bid && this.props.location.query.email) ? false : true}>
              <FindBookingForm />
            </Loader>
          </div>
        </div>
      );
    } else if (this.props.type === 'forgot-password') {
      components = (
        <div className="Account-container">
          <div className="Account-forgot Account-container-item">
            <form ref={(c) => this._accountForgotPasswordForm = c}>
              <h3>Forgot Password?</h3>
              <div className="IconInput EmailInput">
                <input type="email" placeholder="Enter Email*" />
              </div>
              <div className="Account-container-item-middle">
                <div className="ForgotPasswordContainer">
                  <a href="/manage-booking" className="ForgotPasswordLink" onClick={Link.handleClick}>Remembered Password?</a>
                </div>
              </div>
              <a href="#" className="btn btn-primary">Submit</a>
            </form>
          </div>
        </div>
      );
    }
    return (
      <div className="Account">
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
      email: this.state.email
    }).then((res) => {
      if (res.response && res.response.status < 1) {
        this.props.showAlertPopup('Sorry, we are not able to find your booking.');
      }
    });
  }

}


const mapStateToProps = (state) => {
  return {
    location: state.router && state.router.location,
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
