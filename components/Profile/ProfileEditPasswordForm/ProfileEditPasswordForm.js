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
// react-icons
import FaLock from 'react-icons/lib/fa/lock';


class ProfileEditPasswordForm extends Component {

  render() {
    const {
      fields: { currPwd, newPwd, repeatNewPwd },
      invalid,
      handleSubmit,
      submitFailed,
      submitting,
      showDayPickerPopup,
    } = this.props;

    return (
      <div className={s.ProfileEditPasswordForm}>

        <form onSubmit={handleSubmit}>
          <div className={s.formSection}>

            <div className="TableRow">
              <div className="TableRowItem1">Current Password</div>
              <div className="TableRowItem2">
                <input type="text" {...currPwd} />
                {currPwd.touched && currPwd.error && <div className={s.formError}>{currPwd.error}</div>}
              </div>
            </div>

            <div className="TableRow">
              <div className="TableRowItem1">New Password</div>
              <div className="TableRowItem2">
                <input type="text" {...newPwd} />
                {newPwd.touched && newPwd.error && <div className={s.formError}>{newPwd.error}</div>}
              </div>
            </div>

            <div className="TableRow">
              <div className="TableRowItem1">Repeat New Password</div>
              <div className="TableRowItem2">
                <input type="text" {...repeatNewPwd} />
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
  // if (!values.withdrawAmt) {
  //   errors.withdrawAmt = 'Required';
  // } else if (!/\d+/i.test(values.withdrawAmt)) {
  //   errors.withdrawAmt = 'Invalid withdraw amount';
  // }
}

ProfileEditPasswordForm.propTypes = {
  user: PropTypes.object,
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

const reduxFormConfig = {
  form: 'ProfileEditPasswordForm',
  fields: ['currPwd', 'newPwd', 'repeatNewPwd'],
  validate,
}

const mapStateToProps = (state) => {
  const user = state.user.data;

  return {
    user,
    // initialValues: {
      // fullName: user.clients[0].fullName || undefined,
      // gender: user.clients[0].gender || undefined,
      // dob: user.clients[0].dob || undefined,
      // idNumber: user.clients[0].IDnum || undefined,
      // idType: user.clients[0].IDtype || undefined,
      // occupation: user.clients[0].occupation || undefined,
      // maritalStatus: user.clients[0].maritalStatus || undefined,
      // email: user.email || undefined,
    // }
  }
};

const mapDispatchToProps = (dispatch) => ({
  // showDayPickerPopup: (value, source) => dispatch(showDayPickerPopup(value, source)),
})

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(ProfileEditPasswordForm);
