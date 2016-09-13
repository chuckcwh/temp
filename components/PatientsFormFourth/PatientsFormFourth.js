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
        diagnosis,
        specialNotes,
      },
      invalid,
      handleSubmit,
      pristine,
      submitFailed,
      submitting,
      previousPage,
      action,
      config,
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
                  {!mobility.value && <option value="">-- Select --</option>}
                  {
                    config && config.mobilities.map((option) => (
                      <option value={option.value}>{option.name}</option>
                    ))
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
                name="diagnosis"
                placeholder="e.g. Diabetes Type II, Stroke etc."
                {...diagnosis}
                value={diagnosis.value || ''}
              />
              {diagnosis.touched && diagnosis.error && <div className={s.patientsFormFourthError}>{diagnosis.error}</div>}
            </div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Special Notes</div>
            <div className="TableRowItem2">
              <textarea
                name="specialNotes"
                placeholder="Enter info about the patient that you wish to reveal to the caregiver. Note that all caregivers can view this."
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
          {action === 'edit' && <button className="btn btn-primary" type="submit" disabled={invalid || pristine || submitting}>Save</button>}
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
  pristine: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  previousPage: PropTypes.func.isRequired,
  action: PropTypes.string.isRequired,
};

const reduxFormConfig = {
  form: 'patientsForm',
  // fields: [
  //   'mobility',
  //   'diagnosis',
  //   'specialNotes',
  // ],
  // destroyOnUnmount: false,
  validate,
};

const mapStateToProps = (state, ownProps) => {
  const patient = state.patientsByClient && state.user.data && state.user.data._id && ownProps.params &&
    ownProps.params.patientId && state.patientsByClient[state.user.data._id] &&
    state.patientsByClient[state.user.data._id].data &&
    state.patientsByClient[state.user.data._id].data[ownProps.params.patientId] || {};
  const {
    mobility,
    diagnosis,
    specialNotes,
  } = patient;
  return {
    config: state.config.data,
    initialValues: {
      mobility,
      diagnosis,
      specialNotes,
    },
  };
};

export default reduxForm(reduxFormConfig, mapStateToProps)(PatientsFormFourth);
