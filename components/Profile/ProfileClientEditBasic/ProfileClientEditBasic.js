import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import s from './ProfileClientEditBasic.css';
import Container from '../../Container';
import Link from '../../Link';
import Header from '../../Header';
import history from '../../../core/history';
import util from '../../../core/util';
import { reduxForm } from 'redux-form';
import InlineForm from '../../MultiSelect';
import { showDayPickerPopup } from '../../../actions';

import FaLock from 'react-icons/lib/fa/lock';


class ProfileClientEditBasic extends Component {

  render() {
    const {
      fields: { fullName, gender, dob, idNumber, idType, occupation, maritalStatus, email },
      invalid,
      handleSubmit,
      submitFailed,
      submitting,
    } = this.props;
    // const { fullName, gender, dob, addresses, race, religion, languages, nationality } = user.clients[0];

    return (
      <div className={s.profileClientEditBasic}>
        <form onSubmit={handleSubmit}>
          <div className={s.formSection}>
            <div className="TableRow">
              <div className="TableRowItem1">Full Name (as per NRIC)</div>
              <div className="TableRowItem2">
                <input type="text" {...fullName} />
                {fullName.touched && fullName.error && <div className={s.formError}>{fullName.error}</div>}
              </div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Gender</div>

              <div className="TableRowItem2">
                <div className="select">
                  <span></span>
                  <select id={name} name={name} {...gender} value={gender.value || 'male'}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                {gender.touched && gender.error && <div className={s.formError}>{gender.error}</div>}
              </div>
            </div>
            <div className="TableRow">
                <div className="TableRowItem1">Date of Birth</div>
                <div className="TableRowItem2">
                    <input type="text" {...dob} />
                    <input type="text" id="dob" name="dob" placeholder="Birth Date* (YYYY-MM-DD)" {...dob} />
                    <span onClick={() => this.props.showDayPickerPopup(dob.value, 'bookingLocationForm')}></span>
                    {dob.touched && dob.error && <div className={s.formError}>{dob.error}</div>}
                </div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Identification Number</div>
              <div className="TableRowItem2">
                <input type="text" {...idNumber} />
                {idNumber.touched && idNumber.error && <div className={s.formError}>{idNumber.error}</div>}
              </div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Identification type</div>
              <div className="TableRowItem2">
                <input type="text" {...idType} />
                {idType.touched && idType.error && <div className={s.formError}>{idType.error}</div>}
              </div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Occupation</div>
              <div className="TableRowItem2">
                <input type="text" {...occupation} />
                {occupation.touched && occupation.error && <div className={s.formError}>{occupation.error}</div>}
              </div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Marital Status</div>
              <div className="TableRowItem2">
                <input type="text" {...maritalStatus} />
                {maritalStatus.touched && maritalStatus.error && <div className={s.formError}>{maritalStatus.error}</div>}
              </div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Email</div>
              <div className="TableRowItem2">
                <input type="text" {...email} />
                {email.touched && email.error && <div className={s.formError}>{email.error}</div>}
              </div>
            </div>
          </div>
          <div className={s.formSection}>
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

ProfileClientEditBasic.propTypes = {
  user: PropTypes.object,
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

const reduxFormConfig = {
  form: 'profileClientEditBasicForm',
  fields: ['fullName', 'gender', 'dob', 'idNumber', 'idType', 'occupation', 'maritalStatus', 'email'],
  validate,
}

const mapStateToProps = (state) => {
  const user = state.user.data;

  return {
    initialValues: {
      fullName: user.clients[0].fullName || undefined,
      gender: user.clients[0].gender || undefined,
      dob: user.clients[0].dob || undefined,
      idNumber: user.clients[0].IDnum || undefined,
      idType: user.clients[0].IDtype || undefined,
      occupation: user.clients[0].occupation || undefined,
      maritalStatus: user.clients[0].maritalStatus || undefined,
      email: user.email || undefined,
    }
  }
};

const mapDispatchToProps = (dispatch) => ({
  showDayPickerPopup: (value, source) => dispatch(showDayPickerPopup(value, source)),
})

export default reduxForm(reduxFormConfig, mapStateToProps)(ProfileClientEditBasic);
