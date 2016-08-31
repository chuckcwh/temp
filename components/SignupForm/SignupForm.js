import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';
import { reduxForm } from 'redux-form';
import s from './SignupForm.css';
import Link from '../Link';
import { USER_CREATE_SUCCESS, createUser } from '../../actions';
import util from '../../core/util';

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
    if (values.password !== values.passwordConfirm) {
      errors.passwordConfirm = 'Passwords are not same';
    }
    if (!values.name) {
      errors.name = 'Name is required';
    }
    if (!values.contact) {
      errors.contact = 'Mobile is required';
    } else if (!/^[8,9]{1}[0-9]{7}$/i.test(values.contact)) {
      errors.contact = 'Invalid mobile phone';
    }
    if (errors.email || errors.password || errors.passwordConfirm || errors.name || errors.contact) {
      reject(errors);
    } else {
      dispatch(createUser({
        email: values.email,
        password: values.password,
        name: values.name,
        contact: values.contact,
        role: 'client',
      })).then((res) => {
        if (res && res.type === USER_CREATE_SUCCESS) {
          props.onSuccess && props.onSuccess();
          resolve();
        } else {
          props.onFailure && props.onFailure();
          reject({ _error: 'Failed to sign up.' });
        }
      });
    }
  })
);

class SignupForm extends Component {

  render() {
    const {
      fields: { email, password, passwordConfirm, name, contact },
      error,
      handleSubmit,
      submitting,
      type,
    } = this.props;
    return (
      <form className={s.signupForm} onSubmit={handleSubmit(submit(this.props))} noValidate>
        <Loader className="spinner" loaded={!submitting}>
          <h3>eBeeCare {type === 'client' ? 'Client ' : ''}Signup</h3>
          <div className="small">
            <p>If you are a healthcare professional, please signup <a href={util.partners}>here</a>.</p>
          </div>
          <div className="IconInput EmailInput">
            <span />
            <input type="email" placeholder="Enter Email*" {...email} ref={(c) => (this.startInput = c)} autoFocus />
          </div>
          <div className="IconInput PasswordInput">
            <span />
            <input type="password" placeholder="Enter Password*" {...password} />
          </div>
          <div className="IconInput TickInput">
            <span />
            <input type="password" placeholder="Confirm Password*" {...passwordConfirm} />
          </div>
          <div className="IconInput UserInput">
            <span />
            <input type="text" placeholder="Enter Full Name*" {...name} />
          </div>
          <div className="IconInput PhoneInput">
            <span />
            <input type="text" placeholder="Enter Mobile*" {...contact} />
          </div>
          <div className={s.accountContainerItemMiddle}>
            <div className={s.loginContainer}>
              <p className="small">A verification SMS will be sent.</p>
              <Link to="/login" className={s.loginLink} tabIndex="-1">Have an account?</Link>
            </div>
            {email.touched && email.error && <div className={s.signupFormError}>{email.error}</div>}
            {password.touched && password.error && <div className={s.signupFormError}>{password.error}</div>}
            {passwordConfirm.touched && passwordConfirm.error && <div className={s.signupFormError}>{passwordConfirm.error}</div>}
            {name.touched && name.error && <div className={s.signupFormError}>{name.error}</div>}
            {contact.touched && contact.error && <div className={s.signupFormError}>{contact.error}</div>}
            {error && <div className={s.signupFormError}>{error}</div>}
          </div>
          <button className="btn btn-primary" type="submit" disabled={submitting}>Register</button>
        </Loader>
      </form>
    );
  }

}

SignupForm.propTypes = {
  fields: PropTypes.object.isRequired,
  error: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  type: PropTypes.string,
  onSuccess: PropTypes.func,
  onFailure: PropTypes.func,
};

const reduxFormConfig = {
  form: 'signupForm',
  fields: ['email', 'password', 'passwordConfirm', 'name', 'contact'],
  destroyOnUnmount: true,
};

export default reduxForm(reduxFormConfig)(SignupForm);
