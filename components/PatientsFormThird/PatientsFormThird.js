/* eslint-disable camelcase */

import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import moment from 'moment';
import MultiSelect from '../MultiSelect';
import s from './PatientsFormThird.css';

class PatientsFormThird extends Component {

  onClickLogin = (event) => {
    event.preventDefault();

    this.props.showLoginPopup();
  };

  render() {
    const {
      fields: {
        race,
        religion,
        languages,
      },
      invalid,
      handleSubmit,
      submitFailed,
      submitting,
      previousPage,
      action,
    } = this.props;
    return (
      <form className={s.patientsFormThird} onSubmit={handleSubmit}>
        <div className={s.patientsFormThirdSection}>
          <div className="TableRow">
            <div className="TableRowItem1">Race*</div>
            <div className="TableRowItem2">
              <div className="select">
                <span></span>
                <select id="race" name="race" {...race} value={race.value || ''}>
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
              {race.touched && race.error && <div className={s.patientsFormThirdError}>{race.error}</div>}
            </div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Religion*</div>
            <div className="TableRowItem2">
              <div className="select">
                <span></span>
                <select id="religion" name="religion" {...religion} value={religion.value || ''}>
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
              {religion.touched && religion.error && <div className={s.patientsFormThirdError}>{religion.error}</div>}
            </div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Languages*</div>
            <div className="TableRowItem2">
              <MultiSelect
                options={Object.values(this.props.languages).map((l) => ({ label: l.name, value: l.id }))}
                {...languages}
              />
              {languages.touched && languages.error && <div className={s.patientsFormThirdError}>{languages.error}</div>}
            </div>
          </div>
        </div>
        <div className={s.patientsFormThirdSection}>
          {submitFailed && invalid && <div className={s.patientsFormThirdError}>You have one or more form field errors.</div>}
          {action === 'add' &&
            <div>
              <button className="btn btn-default" type="button" disabled={submitting} onClick={previousPage}>Previous</button>
              <button className="btn btn-primary" type="submit" disabled={submitting}>Next</button>
            </div>
          }
          {action === 'edit' && <button className="btn btn-primary" type="submit" disabled={submitting}>Save</button>}
        </div>
      </form>
    );
  }

}

const validate = values => {
  const errors = {};
  if (!values.race) {
    errors.race = 'Required';
  }
  if (!values.religion) {
    errors.religion = 'Required';
  }
  if (!values.languages) {
    errors.religion = 'Required';
  }
  return errors;
};

PatientsFormThird.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  previousPage: PropTypes.func.isRequired,
  languages: PropTypes.object.isRequired,
  action: PropTypes.string.isRequired,
};

const reduxFormConfig = {
  form: 'patientsForm',
  fields: [
    'race',
    'religion',
    'languages',
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

export default reduxForm(reduxFormConfig, mapStateToProps)(PatientsFormThird);
