import React, { Component } from 'react';
import './Account.scss';
import Container from '../Container';
import Link from '../Link';

export default class Account extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    var components;
    if (this.props.type === 'login') {
      components = (
        <div className="Account-container">
          {/*
          <div className="Account-login Account-container-item">
            <form id="AccountLoginForm" action="http://161.202.19.121/login/" method="POST">
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
            <form id="AccountManageBookingForm">
              <h3>Have Booking ID?</h3>
              <input className="BookingIdInput" type="text" placeholder="Booking ID" />
              <input className="EmailInput" type="email" placeholder="Enter Email" />
              <div className="Account-container-item-middle"></div>
              <button className="btn btn-primary">Find Booking</button>
            </form>
          </div>
        </div>
      );
    } else if (this.props.type === 'forgot-password') {
      components = (
        <div className="Account-container">
          <div className="Account-login Account-container-item">
            <form id="AccountForgotPasswordForm">
              <h3>Forgot Password?</h3>
              <input className="EmailInput" type="email" placeholder="Enter Email" />
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
      </div>
    );
  }

}
