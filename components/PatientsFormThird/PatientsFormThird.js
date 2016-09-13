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
      pristine,
      submitFailed,
      submitting,
      previousPage,
      action,
      config,
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
                  {
                    config && config.races.map((option) => (
                      <option value={option.value} key={option.value}>{option.name}</option>
                    ))
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
                  {
                    config && config.religions.map((option) => (
                      <option value={option.value} key={option.value}>{option.name}</option>
                    ))
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
                options={config && config.languages.map((l) => ({ label: l.name, value: l.value }))}
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
              <button className="btn btn-primary" type="submit" disabled={invalid || submitting}>Next</button>
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
  if (!values.race) {
    errors.race = 'Required';
  }
  if (!values.religion) {
    errors.religion = 'Required';
  }
  if (!values.languages) {
    errors.languages = 'Required';
  }
  return errors;
};

PatientsFormThird.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  previousPage: PropTypes.func.isRequired,
  action: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
  initialValues: PropTypes.object,
};

const reduxFormConfig = {
  form: 'patientsForm',
  fields: [
    'race',
    'religion',
    'languages',
  ],
  // destroyOnUnmount: false,
  validate,
};

const mapStateToProps = (state, ownProps) => {
  const patient = state.patientsByClient && state.user.data && state.user.data._id && ownProps.params &&
    ownProps.params.patientId && state.patientsByClient[state.user.data._id] &&
    state.patientsByClient[state.user.data._id].data &&
    state.patientsByClient[state.user.data._id].data[ownProps.params.patientId] || {};
  const {
    race,
    religion,
    languages,
  } = patient;
  return {
    config: state.config.data,
    initialValues: {
      race,
      religion,
      languages,
    },
  };
};

export default reduxForm(reduxFormConfig, mapStateToProps)(PatientsFormThird);
