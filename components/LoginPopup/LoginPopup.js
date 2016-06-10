import React, { Component } from 'react';
import { connect } from 'react-redux';
import linkState from 'react-link-state';
import Loader from 'react-loader';
import './LoginPopup.scss';
import Link from '../Link';
import Popup from '../Popup';
import { login, hideLoginPopup, destroyUser } from '../../actions';
import Util from '../../core/Util';

class LoginPopup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: undefined,
      password: undefined,
      error: undefined,
      pending: false,
      open: false
    };
  }

  render() {
    return (
      <div className="LoginPopup">
        <Popup isOpen={this.props.visible} afterOpen={this._executeAfterModalOpen.bind(this)} onCloseClicked={this._closePopup.bind(this)} onOverlayClicked={this._closePopup.bind(this)}>
          <Loader className="spinner" loaded={this.state.pending ? false : true}>
            <div className="Account-login Account-container-item">
              <form id="AccountLoginForm" ref={(c) => this._accountLoginForm = c} autoComplete="off">
                <h3>eBeeCare Client Login</h3>
                <div className="IconInput EmailInput">
                  <input type="email" name="email" ref={(c) => this._startInput = c} valueLink={linkState(this, 'email')} placeholder="Enter Email" required />
                </div>
                <div className="IconInput PasswordInput">
                  <input type="password" name="password" valueLink={linkState(this, 'password')} placeholder="Enter Password" required />
                </div>
                <div className="Account-container-item-middle">
                  <div className={this.state.error ? '' : 'hidden'}><span className="error">Failed to login.</span></div>
                </div>
                <button className="btn btn-primary" onClick={this._onClickLogin.bind(this)}>Login</button>
              </form>
            </div>
          </Loader>
        </Popup>
      </div>
    );
  }

  _onClickLogin(event) {
    if (this._accountLoginForm.checkValidity()) {
      event.preventDefault();

      this.setState({pending: true});

      this.props.login({
        email: this.state.email,
        password: this.state.password
      }).then((res) => {
        this.setState({pending: false});
        if (res.response && res.response.status === 1) {
          // console.log(res);
          var user = res.response.user;

          if (user.type === 'Client') {
            this.setState({
              error: undefined
            });

            this.props.hideLoginPopup();
            this.props.onLogin && this.props.onLogin(user);
          } else {
            this.setState({
              error: true
            });

            this.props.destroyUser();
          }
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

  _closePopup() {
    this.props.hideLoginPopup();
  }

  _executeAfterModalOpen() {
    this._startInput && this._startInput.focus();
  }

}

LoginPopup.propTypes = {
  onLogin: React.PropTypes.func
};

const mapStateToProps = (state) => {
  return {
    visible: state.modal.login
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    login: (params) => {
      return dispatch(login(params));
    },
    hideLoginPopup: () => {
      return dispatch(hideLoginPopup());
    },
    destroyUser: () => {
      return dispatch(destroyUser());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPopup);
