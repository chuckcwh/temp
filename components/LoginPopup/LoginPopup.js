import React, { Component } from 'react';
import SkyLight from 'react-skylight';
import './LoginPopup.scss';
import Link from '../Link';

export default class LoginPopup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      validationError: undefined,
      loginError: undefined
    };
  }

  render() {
    var styles = {
      dialogStyles: {
        width: '340px',
        // height: '150px',
        // marginTop: '-75px',
        marginLeft: '-170px',
        // textAlign: 'center'
      },
      title: {
        display: 'none'
      },
      closeButtonStyle: {
        color: '#f78d00',
        textDecoration: 'none'
      }
    };

    return (
      <SkyLight dialogStyles={styles.dialogStyles} titleStyle={styles.title} closeButtonStyle={styles.closeButtonStyle} hideOnOverlayClicked ref={(c) => this._loginPopup = c}>
        <div className="LoginPopup">
          <div className="Account-login Account-container-item">
            <form id="AccountLoginForm" ref={(c) => this._accountLoginForm = c}>
              <h3>Account Login</h3>
              <input className="EmailInput" type="email" name="email" placeholder="Enter Email" />
              <input className="PasswordInput" type="password" name="password" placeholder="Enter Password" />
              <div className="Account-container-item-middle">
                <div className={this.state.validationError ? '' : 'hidden'}><span className="error">Please check your email or password.</span></div>
                <div className={this.state.loginError ? '' : 'hidden'}><span className="error">Login failed.</span></div>
              </div>
              <a href="#" className="btn btn-primary" onClick={this._onClickLogin.bind(this)}>Login</a>
            </form>
          </div>
        </div>
      </SkyLight>
    );
  }

  _onClickLogin(event) {
    event.preventDefault();

    if (this._accountLoginForm.checkValidity()) {

    } else {
      this.setState({validationError: true});
    }
  }

  show() {
    this._loginPopup.show();
  }

}
