import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';
import s from './VerifyEmail.css';
import Link from '../Link';
import { VERIFY_USER_EMAIL_SUCCESS } from '../../actions';
import { getCookieUserId, getUriQueryParam } from '../../core/util';

class VerifyEmail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      resent: undefined,
      success: undefined,
      token: undefined,
    };
  }

  componentDidMount() {
    if (this.props.user._id) {
      if (getUriQueryParam('token')) {
        this.setState({ token: getUriQueryParam('token') });
        this.props.verifyUserEmail({
          token: getUriQueryParam('token'),
          userId: this.props.user._id,
        }).then(res => {
          if (res && res.type === VERIFY_USER_EMAIL_SUCCESS) {
            this.setState({ success: true });
            this.props.onSuccess && this.props.onSuccess();
          } else {
            this.setState({ success: false });
            this.props.onFailure && this.props.onFailure();
          }
        });
      }
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.user._id && !this.props.user._id) {
      if (getUriQueryParam('token')) {
        this.setState({ token: getUriQueryParam('token') });
        this.props.verifyUserEmail({
          token: getUriQueryParam('token'),
          userId: newProps.user._id,
        }).then(res => {
          if (res && res.type === VERIFY_USER_EMAIL_SUCCESS) {
            this.setState({ success: true });
            this.props.onSuccess && this.props.onSuccess();
          } else {
            this.setState({ success: false });
            this.props.onFailure && this.props.onFailure();
          }
        });
      }
    }
  }

  onClickResend = (e) => {
    e.preventDefault();

    if (this.props.user._id) {
      this.props.showConfirmPopup('Would you like to receive another verification email?', () => {
        this.props.resendVerifyUserEmail({
          userId: this.props.user._id,
        });
      });
    }
  }

  render() {
    const { userFetching } = this.props;
    let resentText,
      successText,
      error;
    if (this.state.resent) {
      resentText = <div>Activation email has been resent!</div>;
    }
    if (this.state.success) {
      successText = (
        <div>
          <div>Thank you! Your email address has been verified!</div>
          <Link to="/" className={s.homeLink}>Back to Home</Link>
        </div>
      );
    } else if (this.state.success === false) {
      error = "Failed to verify email.";
    }
    if (!this.state.token) {
      error = "Token is missing.";
    }
    return (
      <div className={s.verifyEmail}>
        <Loader className="spinner" loaded={!userFetching}>
          <h3>Verify Email</h3>
          <div className={s.accountContainerItemMiddle}>
            <div className={s.loginContainer}>
              {this.state.success === false &&
                <a href="#" className={s.resendLink} onClick={this.onClickResend}>No verification email?</a>
              }
              {resentText}
              {successText}
            </div>
            {error && <div className={s.verifyEmailError}>{error}</div>}
          </div>
        </Loader>
      </div>
    );
  }

}

VerifyEmail.propTypes = {
  onSuccess: PropTypes.func,
  onFailure: PropTypes.func,
  user: PropTypes.object,
  userFetching: PropTypes.bool,
  verifyUserEmail: PropTypes.func,
  resendVerifyUserEmail: PropTypes.func,
  showConfirmPopup: PropTypes.func,
};

export default VerifyEmail;
