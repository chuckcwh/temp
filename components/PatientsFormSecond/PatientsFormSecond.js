/* eslint-disable camelcase */

import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import moment from 'moment';
import s from './PatientsFormSecond.css';

class PatientsFormSecond extends Component {

  componentWillReceiveProps(props) {
    const { fields: { postalCode } } = this.props;
    const newPostalCode = props && props.fields && props.fields.postalCode;
    if (newPostalCode.value.length === 6 && newPostalCode.value !== postalCode.value) {
      this.props.fetchAddress(newPostalCode.value);
    }
  }

  render() {
    const {
      fields: {
        sameAddress,
        postalCode,
        unitNumber,
        address,
        region,
      },
      invalid,
      handleSubmit,
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
              <input type="text" id="postalCode" name="postalCode" {...postalCode} />
              {postalCode.touched && postalCode.error && <div className={s.patientsFormSecondError}>{postalCode.error}</div>}
            </div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Unit Number</div>
            <div className="TableRowItem2">
              <input type="text" id="unitNumber" name="unitNumber" {...unitNumber} />
              {unitNumber.touched && unitNumber.error && <div className={s.patientsFormSecondError}>{unitNumber.error}</div>}
            </div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Address*</div>
            <div className="TableRowItem2">
              <textarea
                name="address"
                {...address}
                value={address.value || ''}
              />
              {address.touched && address.error && <div className={s.patientsFormSecondError}>{address.error}</div>}
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
          {action === 'edit' && <button className="btn btn-primary" type="submit" disabled={invalid || submitting}>Save</button>}
        </div>
      </form>
    );
  }

}

const validate = values => {
  const errors = {};
  if (!values.postalCode) {
    errors.client_firstName = 'Required';
  } else if (values.postalCode.length > 6) {
    errors.postalCode = 'Cannot be more than 6 characters';
  }
  if (values.unitNumber && values.unitNumber.length > 10) {
    errors.unitNumber = 'Cannot be more than 10 characters';
  }
  if (!values.address) {
    errors.address = 'Required';
  } else if (values.address.length > 50) {
    errors.address = 'Cannot be more than 50 characters';
  }
  return errors;
};

PatientsFormSecond.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
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
    'postalCode',
    'unitNumber',
    'address',
    'region',
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

export default reduxForm(reduxFormConfig, mapStateToProps)(PatientsFormSecond);
