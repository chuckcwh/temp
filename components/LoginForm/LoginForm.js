import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';
import { reduxForm } from 'redux-form';
import './LoginForm.scss';
import { login, loginClient } from '../../actions';

const submit = (props) => {
  return (values, dispatch) => {
    return new Promise((resolve, reject) => {
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
            password: values.password
          })).then((res) => {
            if (res && res.response && res.response.user && res.response.user.type === 'Client') {
              props.onSuccess && props.onSuccess();
              resolve();
            } else {
              props.onFailure && props.onFailure();
              reject({ _error: 'Failed to login.' });
            }
          });;
        } else {
          dispatch(login({
            email: values.email,
            password: values.password
          })).then((res) => {
            if (res && res.response && res.response.user) {
              props.onSuccess && props.onSuccess();
              resolve();
            } else {
              props.onFailure && props.onFailure();
              reject({ _error: 'Failed to login.' });
            }
          });
        }
      }
    });
  }
}

class LoginForm extends Component {

  render() {
    const { 
      fields: { email, password }, 
      error,
      handleSubmit, 
      submitting,
      type
    } = this.props;
    return (
      <form className="LoginForm" onSubmit={handleSubmit(submit(this.props))}>
        <Loader className="spinner" loaded={!submitting}>
          <h3>eBeeCare {type === 'client' ? 'Client ' : ''}Login</h3>
          <div className="IconInput EmailInput">
            <input type="email" placeholder="Enter Email" {...email} ref={(c) => { this._startInput = c }} autoFocus={true} />
          </div>
          <div className="IconInput PasswordInput">
            <input type="password" placeholder="Enter Password" {...password} />
          </div>
          <div className="Account-container-item-middle">
            {email.touched && email.error && <div className="LoginFormError">{email.error}</div>}
            {password.touched && password.error && <div className="LoginFormError">{password.error}</div>}
            {error && <div className="LoginFormError">{error}</div>}
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
  onFailure: PropTypes.func
}

const reduxFormConfig = {
  form: 'loginForm',
  fields: ['email', 'password'],
  destroyOnUnmount: true
}

export default reduxForm(reduxFormConfig)(LoginForm);
