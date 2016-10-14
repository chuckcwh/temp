import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';
import { reduxForm } from 'redux-form';
import s from './ResetPasswordForm.css';
import Link from '../Link';
import { RESET_PASSWORD_SUCCESS, resetPassword } from '../../actions';

class ResetPasswordForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      success: undefined,
    };
  }

  submit = (values, dispatch) => (
    new Promise((resolve, reject) => {
      const errors = {};
      if (!values.token) {
        errors.token = 'Token is missing';
      }
      if (!values.newPassword) {
        errors.newPassword = 'New password is required';
      } else if (values.newPassword.length < 6) {
        errors.newPassword = 'New password needs to contain at least 6 characters';
      }
      if (errors.token || errors.newPassword) {
        reject(errors);
      } else {
        dispatch(resetPassword({
          token: values.token,
          newPassword: values.newPassword,
        })).then((res) => {
          if (res && res.type === RESET_PASSWORD_SUCCESS) {
            this.setState({ success: true });
            this.props.onSuccess && this.props.onSuccess();
            resolve();
          } else {
            this.props.onFailure && this.props.onFailure();
            reject({ _error: 'Failed to reset password.' });
          }
        });
      }
    })
  );

  render() {
    const {
      fields: { token, newPassword },
      error,
      handleSubmit,
      submitting,
    } = this.props;
    if (this.state.success) {
      return (
        <form className={s.resetPasswordForm}>
          <h3>Reset Password</h3>
          <div className={s.accountContainerItemMiddle}>
            <p>You have successfully resetted your password.</p>
            <p>Please try logging in.</p>
          </div>
          <Link to="/login" className="btn btn-primary">Back to Login</Link>
        </form>
      );
    } else {
      return (
        <form className={s.resetPasswordForm} onSubmit={handleSubmit(this.submit)} noValidate>
          <Loader className="spinner" loaded={!submitting}>
            <h3>Reset Password</h3>
            {!token.initialValue && <div className="IconInput TickInput">
              <span />
              <input type="text" placeholder="Enter Token" {...token} />
            </div>}
            <div className="IconInput PasswordInput">
              <span />
              <input type="password" placeholder="Enter New Password" {...newPassword} />
            </div>
            <div className={s.accountContainerItemMiddle}>
              <div className={s.loginContainer}>
                <Link to="/login" className={s.loginLink}>Remembered Password?</Link>
              </div>
              {newPassword.touched && newPassword.error && <div className={s.resetPasswordFormError}>{newPassword.error}</div>}
              {error && <div className={s.resetPasswordFormError}>{error}</div>}
            </div>
            <button className="btn btn-primary" type="submit" disabled={submitting}>Submit</button>
          </Loader>
        </form>
      );
    }
  }

}

ResetPasswordForm.propTypes = {
  fields: PropTypes.object.isRequired,
  error: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  onSuccess: PropTypes.func,
  onFailure: PropTypes.func,
};

const reduxFormConfig = {
  form: 'resetPasswordForm',
  fields: ['token', 'newPassword'],
  destroyOnUnmount: true,
};

export default reduxForm(reduxFormConfig)(ResetPasswordForm);
