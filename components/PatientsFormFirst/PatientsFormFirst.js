/* eslint-disable camelcase */

import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import moment from 'moment';
import s from './PatientsFormFirst.css';

class PatientsFormFirst extends Component {

  render() {
    const {
      fields: {
        fullName,
        gender,
        dob,
        IDnum,
        IDtype,
        maritalStatus,
        relationship,
      },
      invalid,
      handleSubmit,
      submitFailed,
      submitting,
      action,
    } = this.props;
    return (
      <form className={s.patientsFormFirst} onSubmit={handleSubmit}>
        <div className={s.patientsFormFirstSection}>
          <div className="TableRow">
            <div className="TableRowItem1">Full Name (as per NRIC)*</div>
            <div className="TableRowItem2">
              <input type="text" id="fullName" name="fullName" {...fullName} />
              {fullName.touched && fullName.error && <div className={s.patientsFormFirstError}>{fullName.error}</div>}
            </div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Gender*</div>
            <div className="TableRowItem2">
              <div className="select">
                <span></span>
                <select id="gender" name="gender" {...gender} value={gender.value || ''}>
                  <option value="">-- Select --</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  {
                    /* input.options.map((option) => (
                      <option value={option.value}>{option.label}</option>
                    )) */
                  }
                </select>
              </div>
              {gender.touched && gender.error && <div className={s.patientsFormFirstError}>{gender.error}</div>}
            </div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Date of Birth*</div>
            <div className="TableRowItem2">
              <div className="DateInput">
                <input type="text" id="dob" name="dob" placeholder="YYYY-MM-DD" {...dob} />
                <span onClick={() => this.props.showDayPickerPopup(dob.value, 'patientsForm')}></span>
              </div>
              {dob.touched && dob.error && <div className={s.patientsFormFirstError}>{dob.error}</div>}
            </div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Identification Number*</div>
            <div className="TableRowItem2">
              <input type="text" id="IDnum" name="IDnum" placeholder="S1234567A" {...IDnum} />
              {IDnum.touched && IDnum.error && <div className={s.patientsFormFirstError}>{IDnum.error}</div>}
            </div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Identification Type*</div>
            <div className="TableRowItem2">
              <div className="select">
                <span></span>
                <select id="IDtype" name="IDtype" {...IDtype} value={IDtype.value || ''}>
                  <option value="">-- Select --</option>
                  <option value="Singapore Pink IC">Singapore Pink IC</option>
                  <option value="Singapore Blue IC">Singapore Blue IC</option>
                  <option value="Others">Others</option>
                  {
                    /* input.options.map((option) => (
                      <option value={option.value}>{option.label}</option>
                    )) */
                  }
                </select>
              </div>
              {IDtype.touched && IDtype.error && <div className={s.patientsFormFirstError}>{IDtype.error}</div>}
            </div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Marital Status</div>
            <div className="TableRowItem2">
              <div className="select">
                <span></span>
                <select id="maritalStatus" name="maritalStatus" {...maritalStatus} value={maritalStatus.value || ''}>
                  <option value="">-- Select --</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                  {
                    /* input.options.map((option) => (
                      <option value={option.value}>{option.label}</option>
                    )) */
                  }
                </select>
              </div>
              {maritalStatus.touched && maritalStatus.error &&
                <div className={s.patientsFormFirstError}>{maritalStatus.error}</div>}
            </div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Relationship with Client</div>
            <div className="TableRowItem2">
              <div className="select">
                <span></span>
                <select id="relationship" name="relationship" {...relationship} value={relationship.value || ''}>
                  <option value="">-- Select --</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                  {
                    /* input.options.map((option) => (
                      <option value={option.value}>{option.label}</option>
                    )) */
                  }
                </select>
              </div>
              {IDtype.touched && IDtype.error && <div className={s.patientsFormFirstError}>{IDtype.error}</div>}
            </div>
          </div>
        </div>
        <div className={s.patientsFormFirstSection}>
          {submitFailed && invalid && <div className={s.patientsFormFirstError}>You have one or more form field errors.</div>}
          {action === 'add' &&
            <button className="btn btn-primary" type="submit" disabled={submitting}>Next</button>
          }
          {action === 'edit' && <button className="btn btn-primary" type="submit" disabled={submitting}>Save</button>}
        </div>
      </form>
    );
  }

}

const validate = values => {
  const errors = {};
  if (!values.fullName) {
    errors.fullName = 'Required';
  } else if (values.fullName.length > 50) {
    errors.fullName = 'Cannot be more than 50 characters';
  }
  if (!values.gender) {
    errors.gender = 'Required';
  }
  if (!values.dob) {
    errors.dob = 'Required';
  } else if (!/^\d{4}[-]\d{2}[-]\d{2}$/i.test(values.dob)) {
    errors.dob = 'Invalid date of birth (e.g. YYYY-MM-DD)';
  } else if (moment().isSameOrBefore(values.dob, 'day')) {
    errors.dob = 'Date must be earlier than today';
  }
  if (!values.IDnum) {
    errors.IDnum = 'Required';
  } else if (values.IDnum.length > 9) {
    errors.IDnum = 'Cannot be more than 9 characters';
  }
  if (!values.IDtype) {
    errors.IDtype = 'Required';
  }
  return errors;
};

PatientsFormFirst.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  showDayPickerPopup: PropTypes.func.isRequired,
  action: PropTypes.string.isRequired,
};

const reduxFormConfig = {
  form: 'patientsForm',
  fields: [
    'fullName',
    'gender',
    'dob',
    'IDnum',
    'IDtype',
    'maritalStatus',
    'relationship',
  ],
  destroyOnUnmount: false,
  validate,
};

const mapStateToProps = (state) => {
  // const { order } = state;
  return {
    initialValues: {
      // client_contactEmail: order && order.booker && order.booker.client_contactEmail || undefined,
      // client_contactNumber: order && order.booker && order.booker.client_contactNumber || undefined,
      // client_firstName: order && order.booker && order.booker.client_firstName || undefined,
      // client_lastName: order && order.booker && order.booker.client_lastName || undefined,
      // patient_contactEmail: order && order.booker && order.booker.client_contactEmail || undefined,
      // patient_contactNumber: order && order.booker && order.booker.client_contactNumber || undefined,
      // patient_firstName: order && order.booker && order.booker.patient_firstName || undefined,
      // patient_lastName: order && order.booker && order.booker.patient_lastName || undefined,
      // patient_dob: order && order.booker && order.booker.patient_dob || undefined,
      // patient_gender: order && order.booker && order.booker.patient_gender || undefined,
      // additionalInfo: order && order.booker && order.booker.additionalInfo || undefined,
      // isPatient: order && order.booker && order.booker.isPatient || undefined,
      // postalCode: order && order.location && order.location.postalCode || undefined,
      // address: order && order.location && order.location.address || undefined,
      // unitNumber: order && order.location && order.location.unitNumber || undefined,
    },
  };
};

export default reduxForm(reduxFormConfig, mapStateToProps)(PatientsFormFirst);
