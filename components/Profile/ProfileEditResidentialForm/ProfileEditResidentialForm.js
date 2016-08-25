import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import s from './ProfileEditResidentialForm.css';
import Container from '../../Container';
import Link from '../../Link';
import Header from '../../Header';
import history from '../../../core/history';
import util from '../../../core/util';
import { reduxForm } from 'redux-form';
import InlineForm from '../../MultiSelect';
// react-icons
import FaLock from 'react-icons/lib/fa/lock';


class ProfileEditResidentialForm extends Component {

  render() {
    const {
      fields: {
        postalCode,
        floorNum,
        unitNum,
        addr,
        region
      },
      invalid,
      handleSubmit,
      submitFailed,
      submitting,
      showDayPickerPopup,
    } = this.props;

    return (
      <div className={s.ProfileEditResidentialForm}>
        <form onSubmit={handleSubmit}>
          <div className={s.formSection}>
            <div className="TableRow">
              <div className="TableRowItem1">Postal Code</div>
              <div className="TableRowItem2">
                <input type="text" {...postalCode} />
                {postalCode.touched && postalCode.error && <div className={s.formError}>{postalCode.error}</div>}
              </div>
            </div>

            <div className="TableRow">
              <div className="TableRowItem1">Floor Number (if applicable)</div>
              <div className="TableRowItem2">
                <input type="text" {...floorNum} />
                {floorNum.touched && floorNum.error && <div className={s.formError}>{floorNum.error}</div>}
              </div>
            </div>

            <div className="TableRow">
              <div className="TableRowItem1">Unit Number (if applicable)</div>
              <div className="TableRowItem2">
                <input type="text" {...unitNum} />
                {unitNum.touched && unitNum.error && <div className={s.formError}>{unitNum.error}</div>}
              </div>
            </div>

            <div className="TableRow">
              <div className="TableRowItem1">Address</div>
              <div className="TableRowItem2">
                <div>
                  <textarea className={s.addrInput} id="addr" name="addr" placeholder="Enter Address" {...addr} />
                  {addr.touched && addr.error && <div className={s.bookingLocationFormError}>{addr.error}</div>}
                </div>
                {addr.touched && addr.error && <div className={s.formError}>{addr.error}</div>}
              </div>
            </div>

            <div className="TableRow">
              <div className="TableRowItem1">Region</div>
              <div className="TableRowItem2">
                <input type="text" {...region} disabled />
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

ProfileEditResidentialForm.propTypes = {
  user: PropTypes.object,
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

const reduxFormConfig = {
  form: 'ProfileEditResidentialForm',
  fields: [
    'postalCode',
    'floorNum',
    'unitNum',
    'addr',
    'region'
  ],
  validate,
}

const mapStateToProps = (state) => {
  const user = state.user.data;

  return {
    initialValues: {
      postalCode: user.clients[0].addresses[0].postalCode || undefined,
      floorNum: user.clients[0].addresses[0].floorNumber || undefined,
      unitNum: user.clients[0].addresses[0].unitNumber || undefined,
      addr: user.clients[0].addresses[0].address || undefined,
      region: `${user.clients[0].addresses[0].region} (${user.clients[0].addresses[0].regionPlaces})`,
      // fullName: user.clients[0].fullName || undefined,
      // gender: user.clients[0].gender || undefined,
      // dob: user.clients[0].dob || undefined,
      // idNumber: user.clients[0].IDnum || undefined,
      // idType: user.clients[0].IDtype || undefined,
      // occupation: user.clients[0].occupation || undefined,
      // maritalStatus: user.clients[0].maritalStatus || undefined,
      // email: user.email || undefined,
    }
  }
};

export default reduxForm(reduxFormConfig, mapStateToProps)(ProfileEditResidentialForm);
