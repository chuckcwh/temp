import React, { Component } from 'react';
import Loader from 'react-loader';
import linkState from 'react-link-state';
import request from 'superagent';
import './Account.scss';
import Container from '../Container';
import Link from '../Link';
import AlertPopup from '../AlertPopup';
import BookingActions from '../../actions/BookingActions';
import Util from '../../core/Util';

export default class Account extends Component {

  constructor(props) {
    super(props);
    this.state = {
      bid: undefined,
      email: undefined
    };
  }

  componentWillUnmount() {
    this.serverRequest1 && this.serverRequest1.abort();
  }

  render() {
    var components;
    if (this.props.type === 'login') {
      components = (
        <div className="Account-container">
          {/*
          <div className="Account-login Account-container-item">
            <form id="AccountLoginForm" action="https://app.ebecare.com/login/" method="POST">
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
            <Loader className="spinner" loaded={(!(this.props.booking && this.props.booking.id) && this.props.location.query.bid && this.props.location.query.email) ? false : true}>
              <form ref={(c) => this._accountManageBookingForm = c}>
                <h3>Have Guest Booking ID?</h3>
                <input className="BookingIdInput" type="text" valueLink={linkState(this, 'bid')} placeholder="Booking ID*" required />
                <input className="EmailInput" type="email" valueLink={linkState(this, 'email')} placeholder="Enter Email*" required />
                <div className="Account-container-item-middle">
                  <div className="LoginInsteadContainer">
                    Have account? <a href="https://app.ebeecare.com/login/" className="LoginInsteadLink">Login instead</a>
                  </div>
                </div>
                <button className="btn btn-primary" onClick={this._onClickFindBooking.bind(this)}>Find Booking</button>
              </form>
            </Loader>
          </div>
        </div>
      );
    } else if (this.props.type === 'forgot-password') {
      components = (
        <div className="Account-container">
          <div className="Account-login Account-container-item">
            <form ref={(c) => this._accountForgotPasswordForm = c}>
              <h3>Forgot Password?</h3>
              <input className="EmailInput" type="email" placeholder="Enter Email*" />
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
        <AlertPopup ref={(c) => this._alertPopup = c}>
          Please fill up all required fields.
        </AlertPopup>
        <AlertPopup ref={(c) => this._noBookingAlertPopup = c}>
          Sorry, we are not able to find your booking.
        </AlertPopup>
      </div>
    );
  }

  _onClickFindBooking(event) {
    if (this._accountManageBookingForm.checkValidity()) {
      event.preventDefault();

      this.serverRequest1 = request
        .get(Util.host + '/api/getBooking')
        .query({
          bid: this.state.bid,
          email: this.state.email
        })
        .auth(Util.authKey, Util.authSecret)
        .end((err, res) => {
          if (err) {
            return console.error(Util.host + '/api/getBooking', status, err.toString());
          }
          if (res.body && res.body.booking && res.body.status) {
            console.log(res.body.booking);
            // if booking has already been completed
            if (res.body.booking && res.body.booking.case) {
              BookingActions.setBooking(res.body.booking);
            }
          } else {
            console.error('Failed to obtain booking data.');
            this._noBookingAlertPopup.show();
          }
        });
    } else {
      event.preventDefault();
      this._alertPopup.show();
    }
  }

}
