import React, { Component } from 'react';
import linkState from 'react-link-state';
import Loader from 'react-loader';
import request from 'superagent';
import SkyLight from 'react-skylight';
import './LoginPopup.scss';
import Link from '../Link';

export default class LoginPopup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: undefined,
      password: undefined,
      error: undefined,
      pending: false
    };
  }

  componentWillUnmount() {
    this.serverRequest && this.serverRequest.abort();
  }

  render() {
    var styles = {
      dialogStyles: {
        width: '340px',
        marginLeft: '-170px'
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
      <SkyLight 
        dialogStyles={styles.dialogStyles} 
        titleStyle={styles.title} 
        closeButtonStyle={styles.closeButtonStyle} 
        afterOpen={this._executeAfterModalOpen.bind(this)}
        hideOnOverlayClicked 
        ref={(c) => this._loginPopup = c}>
        <Loader className="spinner" loaded={this.state.pending ? false : true}>
          <div className="LoginPopup">
            <div className="Account-login Account-container-item">
              <form id="AccountLoginForm" ref={(c) => this._accountLoginForm = c} autoComplete="off">
                <h3>eBeeCare Login</h3>
                <input className="EmailInput" type="email" name="email" ref={(c) => this._startInput = c} valueLink={linkState(this, 'email')} placeholder="Enter Email" required />
                <input className="PasswordInput" type="password" name="password" valueLink={linkState(this, 'password')} placeholder="Enter Password" required />
                <div className="Account-container-item-middle">
                  <div className={this.state.error ? '' : 'hidden'}><span className="error">Failed to login.</span></div>
                </div>
                <button className="btn btn-primary" onClick={this._onClickLogin.bind(this)}>Login</button>
              </form>
            </div>
          </div>
        </Loader>
      </SkyLight>
    );
  }

  _onClickLogin(event) {
    if (this._accountLoginForm.checkValidity()) {
      event.preventDefault();

      this.setState({pending: true});

      this.serverRequest = request
        .post('http://161.202.19.121/api/mlogin')
        .auth('secret', 'secret0nlyWeilsonKnowsShhh852~')
        .send({
          email: this.state.email,
          password: this.state.password
        })
        .end((err, res) => {
          this.setState({pending: false});
          if (err) {
            return console.error('http://161.202.19.121/api/mlogin', status, err.toString());
          }
          if (res.body && res.body.status === 1) {
            console.log(res.body);
            var user = res.body.user;
            
            this.setState({
              error: undefined
            });

            this._loginPopup.hide();
            
            this._success(user);
          } else {
            this.setState({
              error: true
            });
            console.error('Failed to login.');
          }
        });

      this.setState({
        email: undefined,
        password: undefined
      });
    }
  }

  _executeAfterModalOpen() {
    this._startInput.focus();
  }

  show(success) {
    this._success = success || () => {};
    this._loginPopup.show();
  }

}
