/* eslint-disable camelcase */

import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import moment from 'moment';
import s from './PatientsFormFirst.css';
import Link from '../Link';

class PatientsFormFirst extends Component {

  render() {
    const {
      fields: {
        name,
        gender,
        dob,
        idNum,
        idType,
        maritalStatus,
        relationship,
      },
      invalid,
      handleSubmit,
      pristine,
      submitFailed,
      submitting,
      action,
      config,
    } = this.props;
    return (
      <form className={s.patientsFormFirst} onSubmit={handleSubmit}>
        <div className={s.patientsFormFirstSection}>
          <div className="TableRow">
            <div className="TableRowItem1">Full Name (as per IC)*</div>
            <div className="TableRowItem2">
              <input type="text" {...name} />
              {name.touched && name.error && <div className={s.patientsFormFirstError}>{name.error}</div>}
            </div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Gender*</div>
            <div className="TableRowItem2">
              <div className="select">
                <span></span>
                <select id="gender" name="gender" {...gender} value={gender.value || ''}>
                  {!gender.value && <option value="">-- Select --</option>}
                  {
                    config && config.genders && config.genders.map((option) => (
                      <option value={option.value} key={option.value}>{option.name}</option>
                    ))
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
                <input type="text" placeholder="YYYY-MM-DD" {...dob} />
                <span onClick={() => this.props.showDayPickerPopup(dob.value, 'patientsForm')}></span>
              </div>
              {dob.touched && dob.error && <div className={s.patientsFormFirstError}>{dob.error}</div>}
            </div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Identification Number*</div>
            <div className="TableRowItem2">
              <input type="text" placeholder="S1234567A" {...idNum} />
              {idNum.touched && idNum.error && <div className={s.patientsFormFirstError}>{idNum.error}</div>}
            </div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Identification Type*</div>
            <div className="TableRowItem2">
              <div className="select">
                <span></span>
                <select id="idType" name="idType" {...idType} value={idType.value || ''}>
                  {!idType.value && <option value="">-- Select --</option>}
                  {
                    config && config.idTypes && config.idTypes.map((option) => (
                      <option value={option.value} key={option.value}>{option.name}</option>
                    ))
                  }
                </select>
              </div>
              {idType.touched && idType.error && <div className={s.patientsFormFirstError}>{idType.error}</div>}
            </div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Marital Status</div>
            <div className="TableRowItem2">
              <div className="select">
                <span></span>
                <select id="maritalStatus" name="maritalStatus" {...maritalStatus} value={maritalStatus.value || ''}>
                  {!maritalStatus.value && <option value="">-- Select --</option>}
                  {
                    config && config.maritalStatuses && config.maritalStatuses.map((option) => (
                      <option value={option.value} key={option.value}>{option.name}</option>
                    ))
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
                  {!relationship.value && <option value="">-- Select --</option>}
                  {
                    config && config.relationships && config.relationships.map((option) => (
                      <option value={option.value} key={option.value}>{option.name}</option>
                    ))
                  }
                </select>
              </div>
              {idType.touched && idType.error && <div className={s.patientsFormFirstError}>{idType.error}</div>}
            </div>
          </div>
        </div>
        <div className={s.patientsFormFirstSection}>
          {submitFailed && invalid && <div className={s.patientsFormFirstError}>You have one or more form field errors.</div>}
          {action === 'add' &&
            <div>
              <Link to="/patients" className="btn btn-default" disabled={submitting}>Cancel</Link>
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
  if (!values.name) {
    errors.name = 'Required';
  } else if (values.name.length > 50) {
    errors.name = 'Cannot be more than 50 characters';
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
  if (!values.idNum) {
    errors.idNum = 'Required';
  } else if (values.idNum.length > 9) {
    errors.idNum = 'Cannot be more than 9 characters';
  }
  if (!values.idType) {
    errors.idType = 'Required';
  }
  return errors;
};

PatientsFormFirst.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  showDayPickerPopup: PropTypes.func.isRequired,
  action: PropTypes.string.isRequired,
  config: PropTypes.object,
};

const reduxFormConfig = {
  form: 'patientsForm',
  fields: [
    'name',
    'gender',
    'dob',
    'idNum',
    'idType',
    'maritalStatus',
    'relationship',
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
    name,
    gender,
    dob,
    idNum,
    idType,
    maritalStatus,
    relationship,
  } = patient;
  return {
    config: state.config.data,
    initialValues: {
      name,
      gender,
      dob: moment(dob).format('YYYY-MM-DD'),
      idNum,
      idType,
      maritalStatus,
      relationship,
    },
  };
};

export default reduxForm(reduxFormConfig, mapStateToProps)(PatientsFormFirst);
