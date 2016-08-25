import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';
import { reduxForm } from 'redux-form';
import s from './ForgotPasswordForm.css';
import Link from '../Link';
import { login, loginClient } from '../../actions';

const submit = (props) => (values, dispatch) => (
  new Promise((resolve, reject) => {
    const errors = {};
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }
    if (errors.email) {
      reject(errors);
    } else {
      dispatch(loginClient({
        email: values.email,
        password: values.password,
      })).then((res) => {
        if (res && res.response && res.response.user && res.response.user.type === 'Client') {
          props.onSuccess && props.onSuccess();
          resolve();
        } else {
          props.onFailure && props.onFailure();
          reject({ _error: 'Failed to login.' });
        }
      });
    }
  })
);

class ForgotPasswordForm extends Component {

  render() {
    const {
      fields: { email, password },
      error,
      handleSubmit,
      submitting,
      type,
    } = this.props;
    return (
      <form className={s.forgotPasswordForm} onSubmit={handleSubmit(submit(this.props))}>
        <Loader className="spinner" loaded={!submitting}>
          <h3>Forgot Password?</h3>
          <div className="IconInput EmailInput">
            <span />
            <input type="email" placeholder="Enter Email" {...email} ref={(c) => (this.startInput = c)} autoFocus />
          </div>
          <div className={s.accountContainerItemMiddle}>
            <div className={s.loginContainer}>
              <Link to="/login" className={s.loginLink}>Remembered Password?</Link>
            </div>
            {email.touched && email.error && <div className={s.forgotPasswordFormError}>{email.error}</div>}
            {error && <div className={s.forgotPasswordFormError}>{error}</div>}
          </div>
          <button className="btn btn-primary" type="submit" disabled={submitting}>Submit</button>
        </Loader>
      </form>
    );
  }

}

ForgotPasswordForm.propTypes = {
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
  form: 'forgotPasswordForm',
  fields: ['email'],
  destroyOnUnmount: true,
};

export default reduxForm(reduxFormConfig)(ForgotPasswordForm);
