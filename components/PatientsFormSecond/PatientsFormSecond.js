/* eslint-disable camelcase */

import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import moment from 'moment';
import s from './PatientsFormSecond.css';

class PatientsFormSecond extends Component {

  componentWillReceiveProps(props) {
    const { fields: { postal } } = this.props;
    const newpostal = props && props.fields && props.fields.postal;
    if (newpostal.value.length === 6 && newpostal.value !== postal.value) {
      this.props.fetchAddress(newpostal.value);
    }
  }

  render() {
    const {
      fields: {
        sameAddress,
        postal,
        unit,
        description,
        lat,
        lng,
        region,
        neighborhood,
      },
      invalid,
      handleSubmit,
      pristine,
      submitFailed,
      submitting,
      previousPage,
      action,
    } = this.props;
    return (
      <form className={s.patientsFormSecond} onSubmit={handleSubmit}>
        <div className={s.patientsFormSecondSection}>
          <div className="TableRow">
            <input className={s.rememberMeCheckbox} type="checkbox" id="sameAddress" name="sameAddress" {...sameAddress} />
            <label className={s.rememberMeCheckboxLabel} htmlFor="sameAddress">
              <span></span><span>Use my address</span>
            </label>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Postal Code*</div>
            <div className="TableRowItem2">
              <input type="text" id="postal" name="postal" {...postal} />
              {postal.touched && postal.error && <div className={s.patientsFormSecondError}>{postal.error}</div>}
            </div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Unit Number</div>
            <div className="TableRowItem2">
              <input type="text" id="unit" name="unit" {...unit} />
              {unit.touched && unit.error && <div className={s.patientsFormSecondError}>{unit.error}</div>}
            </div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Address*</div>
            <div className="TableRowItem2">
              <textarea
                name="description"
                {...description}
                value={description.value || ''}
              />
              {description.touched && description.error && <div className={s.patientsFormSecondError}>{description.error}</div>}
            </div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Region*</div>
            <div className="TableRowItem2">
              <input type="text" id="region" name="region" disabled {...region} />
              {region.touched && region.error && <div className={s.patientsFormSecondError}>{region.error}</div>}
            </div>
          </div>
        </div>
        <div className={s.patientsFormSecondSection}>
          {submitFailed && invalid && <div className={s.patientsFormSecondError}>You have one or more form field errors.</div>}
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
  if (!values.postal) {
    errors.postal = 'Required';
  } else if (values.postal.length > 6) {
    errors.postal = 'Cannot be more than 6 characters';
  }
  if (values.unit && values.unit.length > 10) {
    errors.unit = 'Cannot be more than 10 characters';
  }
  if (!values.description) {
    errors.description = 'Required';
  } else if (values.description.length > 50) {
    errors.description = 'Cannot be more than 50 characters';
  }
  return errors;
};

PatientsFormSecond.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  previousPage: PropTypes.func.isRequired,
  fetchAddress: PropTypes.func.isRequired,
  action: PropTypes.string.isRequired,
};

const reduxFormConfig = {
  form: 'patientsForm',
  fields: [
    'sameAddress',
    'postal',
    'unit',
    'description',
    'lat',
    'lng',
    'region',
    'neighborhood',
  ],
  // destroyOnUnmount: false,
  validate,
};

const mapStateToProps = (state, ownProps) => {
  const patientAddress = state.patientsByClient && state.user.data && state.user.data._id && ownProps.params &&
    ownProps.params.patientId && state.patientsByClient[state.user.data._id] &&
    state.patientsByClient[state.user.data._id].data &&
    state.patientsByClient[state.user.data._id].data[ownProps.params.patientId] &&
    state.patientsByClient[state.user.data._id].data[ownProps.params.patientId].address || {};
  const {
    sameAddress,
    postal,
    unit,
    description,
    lat,
    lng,
    region,
    neighborhood,
  } = patientAddress;
  return {
    config: state.config.data,
    initialValues: {
      sameAddress,
      postal,
      unit,
      description,
      lat,
      lng,
      region,
      neighborhood,
    },
  };
};

export default reduxForm(reduxFormConfig, mapStateToProps)(PatientsFormSecond);
