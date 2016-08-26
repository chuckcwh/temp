import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';
import { reduxForm } from 'redux-form';
import s from './LoginForm.css';
import Link from '../Link';
import { LOGIN_SUCCESS, LOGIN_CLIENT_SUCCESS, login, loginClient } from '../../actions';

const submit = (props) => (values, dispatch) => (
  new Promise((resolve, reject) => {
    const errors = {};
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }
    if (!values.password) {
      errors.password = 'Password is required';
    }
    if (errors.email || errors.password) {
      reject(errors);
    } else {
      if (props.type === 'client') {
        dispatch(loginClient({
          email: values.email,
          password: values.password,
        })).then((res) => {
          if (res && res.type === LOGIN_CLIENT_SUCCESS) {
            props.onSuccess && props.onSuccess();
            resolve();
          } else {
            props.onFailure && props.onFailure();
            reject({ _error: 'Failed to login.' });
          }
        });
      } else {
        dispatch(login({
          email: values.email,
          password: values.password,
        })).then((res) => {
          if (res && res.type === LOGIN_SUCCESS) {
            props.onSuccess && props.onSuccess();
            resolve();
          } else {
            props.onFailure && props.onFailure();
            reject({ _error: 'Failed to login.' });
          }
        });
      }
    }
  })
);

class LoginForm extends Component {

  render() {
    const {
      fields: { email, password },
      error,
      handleSubmit,
      submitting,
      type,
    } = this.props;
    return (
      <form className={s.loginForm} onSubmit={handleSubmit(submit(this.props))}>
        <Loader className="spinner" loaded={!submitting}>
          <h3>eBeeCare {type === 'client' ? 'Client ' : ''}Login</h3>
          <div className="IconInput EmailInput">
            <span />
            <input type="email" placeholder="Enter Email" {...email} ref={(c) => (this.startInput = c)} autoFocus />
          </div>
          <div className="IconInput PasswordInput">
            <span />
            <input type="password" placeholder="Enter Password" {...password} />
          </div>
          <div className={s.accountContainerItemMiddle}>
            <div className={s.signupContainer}>
              <Link to="/signup" className={s.signupLink}>No Account?</Link>
              &nbsp;
              <Link to="/forgot-password" className={s.forgotPasswordLink}>Forgot Password?</Link>
            </div>
            {email.touched && email.error && <div className={s.loginFormError}>{email.error}</div>}
            {password.touched && password.error && <div className={s.loginFormError}>{password.error}</div>}
            {error && <div className={s.loginFormError}>{error}</div>}
          </div>
          <button className="btn btn-primary" type="submit" disabled={submitting}>Login</button>
        </Loader>
      </form>
    );
  }

}

LoginForm.propTypes = {
  fields: PropTypes.object.isRequired,
  error: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  type: PropTypes.string,
  focused: PropTypes.bool,
  onSuccess: PropTypes.func,
  onFailure: PropTypes.func,
};

const reduxFormConfig = {
  form: 'loginForm',
  fields: ['email', 'password'],
  destroyOnUnmount: true,
};

export default reduxForm(reduxFormConfig)(LoginForm);
