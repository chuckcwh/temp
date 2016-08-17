/* eslint-disable camelcase */

import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import moment from 'moment';
import s from './PatientsFormFourth.css';

class PatientsFormFourth extends Component {

  render() {
    const {
      fields: {
        mobility,
        mainDiagnosis,
        specialNotes,
      },
      invalid,
      handleSubmit,
      submitFailed,
      submitting,
      previousPage,
      action,
    } = this.props;
    return (
      <form className={s.patientsFormFourth} onSubmit={handleSubmit}>
        <div className={s.patientsFormFourthSection}>
          <div className="TableRow">
            <div className="TableRowItem1">Mobility Status*</div>
            <div className="TableRowItem2">
              <div className="select">
                <span></span>
                <select id="mobility" name="mobility" {...mobility} value={mobility.value || ''}>
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
              {mobility.touched && mobility.error && <div className={s.patientsFormFourthError}>{mobility.error}</div>}
            </div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Main Diagnosis</div>
            <div className="TableRowItem2">
              <textarea
                name="mainDiagnosis"
                placeholder="e.g. Diabetes Type II, Stroke etc."
                {...mainDiagnosis}
                value={mainDiagnosis.value || ''}
              />
              {mainDiagnosis.touched && mainDiagnosis.error && <div className={s.patientsFormFourthError}>{mainDiagnosis.error}</div>}
            </div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Special Notes</div>
            <div className="TableRowItem2">
              <textarea
                name="specialNotes"
                placeholder="Enter information about the patient that you wish to reveal to nurses. Note that all nurses can view this."
                {...specialNotes}
                value={specialNotes.value || ''}
              />
              {specialNotes.touched && specialNotes.error && <div className={s.patientsFormFourthError}>{specialNotes.error}</div>}
            </div>
          </div>
        </div>
        <div className={s.patientsFormFourthSection}>
          {submitFailed && invalid && <div className={s.patientsFormFourthError}>You have one or more form field errors.</div>}
          {action === 'add' &&
            <div>
              <button className="btn btn-default" type="button" disabled={submitting} onClick={previousPage}>Previous</button>
              <button className="btn btn-primary" type="submit" disabled={invalid || submitting}>Save</button>
            </div>
          }
          {action === 'edit' && <button className="btn btn-primary" type="submit" disabled={invalid || submitting}>Save</button>}
        </div>
      </form>
    );
  }

}

const validate = values => {
  const errors = {};
  if (!values.mobility) {
    errors.mobility = 'Required';
  }
  return errors;
};

PatientsFormFourth.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  previousPage: PropTypes.func.isRequired,
  action: PropTypes.string.isRequired,
};

const reduxFormConfig = {
  form: 'patientsForm',
  fields: [
    'mobility',
    'mainDiagnosis',
    'specialNotes',
  ],
  destroyOnUnmount: false,
  validate,
};

const mapStateToProps = (state) => {
  const { order } = state;
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

export default reduxForm(reduxFormConfig, mapStateToProps)(PatientsFormFourth);
