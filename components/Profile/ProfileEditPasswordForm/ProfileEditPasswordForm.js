import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import s from './ProfileEditPasswordForm.css';
import Container from '../../Container';
import Link from '../../Link';
import Header from '../../Header';
import history from '../../../core/history';
import util from '../../../core/util';
import { reduxForm } from 'redux-form';
import { CHANGE_PASSWORD_SUCCESS, CHANGE_PASSWORD_FAILURE, changePassword } from '../../../actions';
// react-icons
import FaLock from 'react-icons/lib/fa/lock';


class ProfileEditPasswordForm extends Component {

  onSubmit = (values) => {
    console.log('values', values);
    return new Promise((resolve, reject) => {
      this.props.changePassword({
        _userId: values._userId,
        oldPassword: values.currPwd,
        newPassword: values.newPwd,
      }).then((res) => {
        if (res && res.type === CHANGE_PASSWORD_SUCCESS) {
          console.log('response success', res);
        } else if (res && res.type === CHANGE_PASSWORD_FAILURE) {
          console.log('response fail', res);
        }
      })
    })
  }

  render() {
    const {
      fields: {
        currPwd,
        newPwd,
        repeatNewPwd
      },
      invalid,
      handleSubmit,
      submitFailed,
      submitting,
    } = this.props;

    return (
      <div className={s.ProfileEditPasswordForm}>

        <form onSubmit={handleSubmit(this.onSubmit)}>
          <div className={s.formSection}>

            <div className="TableRow">
              <div className="TableRowItem1">Current Password</div>
              <div className="TableRowItem2">
                <input type="password" {...currPwd} />
                {currPwd.touched && currPwd.error && <div className={s.formError}>{currPwd.error}</div>}
              </div>
            </div>

            <div className="TableRow">
              <div className="TableRowItem1">New Password</div>
              <div className="TableRowItem2">
                <input type="password" {...newPwd} />
                {newPwd.touched && newPwd.error && <div className={s.formError}>{newPwd.error}</div>}
              </div>
            </div>

            <div className="TableRow">
              <div className="TableRowItem1">Repeat New Password</div>
              <div className="TableRowItem2">
                <input type="password" {...repeatNewPwd} />
                {repeatNewPwd.touched && repeatNewPwd.error && <div className={s.formError}>{repeatNewPwd.error}</div>}
              </div>
            </div>

          </div>

          <div className={s.formSectionSubmit}>
            {submitFailed && invalid && <div className={s.creditsWithdrawBankFormError}>You have one or more form field errors.</div>}
            <button className="btn btn-primary" type="submit" disabled={invalid || submitting}>Save Changes</button>
          </div>
        </form>
      </div>
    );
  }

}

const validate = values => {
  const errors = {};
  if (!values.currPwd) {
    errors.currPwd = 'Required';
  }
  if (!values.newPwd) {
    errors.newPwd = 'Required';
  }
  if (values.newPwd !== values.repeatNewPwd) {
    errors.repeatNewPwd = 'Passwords are not the same'
  }
  return errors
}

ProfileEditPasswordForm.propTypes = {
  // user: PropTypes.object,
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

const reduxFormConfig = {
  form: 'profileEditPasswordForm',
  fields: [
    'currPwd',
    'newPwd',
    'repeatNewPwd'
  ],
  validate,
}

const mapStateToProps = (state) => {
  const user = state.user.data;

  return {
    // user,
    // initialValues: {
      // fullName: user.clients[0].fullName || undefined,
    // }
  }
};

const mapDispatchToProps = (dispatch) => ({
  changePassword: (params) => dispatch(changePassword(params)),
});

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(ProfileEditPasswordForm);
