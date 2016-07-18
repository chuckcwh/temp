import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import moment from 'moment';
import s from './BookingPatientForm.css';

class BookingPatientForm extends Component {

  componentWillReceiveProps(props) {
    // const { fields: { postalCode } } = this.props;
    // const newPostalCode = props && props.fields && props.fields.postalCode;
    // if (newPostalCode.value.length === 6 && newPostalCode.value !== postalCode.value) {
    //   this.props.fetchAddress(newPostalCode.value);
    // }
  }

  render() {
    const { 
      fields: { client_firstName, client_lastName, client_contactEmail, client_contactNumber, patient_firstName, patient_lastName, patient_dob, patient_gender, additionalInfo, isPatient }, 
      invalid,
      handleSubmit, 
      submitFailed,
      submitting 
    } = this.props;
    return (
      <form className={s.bookingPatientForm} onSubmit={handleSubmit(this.props.onNext)}>
        {/*
        <div className={s.bookingPatientFormSection}>
          <span>I&apos;m an existing customer</span>
          <a href="#" className="btn btn-primary btn-small btn-inline" onClick={this._onClickLogin.bind(this)}>LOGIN</a>
        </div>
        */}
        <div className={s.bookingPatientFormSection}>
          <div>Contact Details</div>
          {/*
          <div className="select">
            <span></span>
            <select name="salutation">
              <option value="">Salutation</option>
            </select>
          </div>
          */}
          <div className={s.bookingPatientFormGroup}>
            <input type="text" id="client_firstName" name="client_firstName" placeholder="First Name*" {...client_firstName} />
            {client_firstName.touched && client_firstName.error && <div className={s.bookingPatientFormError}>{client_firstName.error}</div>}
          </div>
          <div className={s.bookingPatientFormGroup}>
            <input type="text" id="client_lastName" name="client_lastName" placeholder="Last Name*" {...client_lastName} />
            {client_lastName.touched && client_lastName.error && <div className={s.bookingPatientFormError}>{client_lastName.error}</div>}
          </div>
          <div className={s.bookingPatientFormGroup}>
            <input type="email" id="client_contactEmail" name="client_contactEmail" placeholder="Email*" {...client_contactEmail} />
            {client_contactEmail.touched && client_contactEmail.error && <div className={s.bookingPatientFormError}>{client_contactEmail.error}</div>}
          </div>
          <div className={s.bookingPatientFormGroup}>
            <input type="text" id="client_contactNumber" name="client_contactNumber" placeholder="Mobile Number*" {...client_contactNumber} />
            {client_contactNumber.touched && client_contactNumber.error && <div className={s.bookingPatientFormError}>{client_contactNumber.error}</div>}
          </div>
        </div>
        <div className={s.bookingPatientFormSection}>
          <div>
            <span className={s.patientDetailsLabel1}>Patient Details</span>
            <span className={s.patientDetailsLabel2}> (
              <input className={s.rememberMeCheckbox} type="checkbox" id="isPatient" name="isPatient" {...isPatient} />
              <label className={s.rememberMeCheckboxLabel} htmlFor="isPatient">
                <span></span><span>Are you the patient?</span>
              </label>
              &nbsp;)
            </span>
          </div>
          <div>
            <div className={s.bookingPatientFormGroup}>
              <input type="text" id="patient_firstName" name="patient_firstName" placeholder="First Name*" {...patient_firstName} />
              {patient_firstName.touched && patient_firstName.error && <div className={s.bookingPatientFormError}>{patient_firstName.error}</div>}
            </div>
            <div className={s.bookingPatientFormGroup}>
              <input type="text" id="patient_lastName" name="patient_lastName" placeholder="Last Name*" {...patient_lastName} />
              {patient_lastName.touched && patient_lastName.error && <div className={s.bookingPatientFormError}>{patient_lastName.error}</div>}
            </div>
            <div className={s.bookingPatientFormGroup}>
              <div className="DateInput">
                <input type="text" id="patient_dob" name="patient_dob" placeholder="Birth Date* (YYYY-MM-DD)" {...patient_dob} />
                <span onClick={() => this.props.showDayPickerPopup(patient_dob.value, 'bookingLocationForm')}></span>
              </div>
              {patient_dob.touched && patient_dob.error && <div className={s.bookingPatientFormError}>{patient_dob.error}</div>}
            </div>
            <div className={s.bookingPatientFormGroup}>
              <div className="radio radio-inline">
                <input type="radio" id="patient_gender_male" name="patient_gender" {...patient_gender} value="Male" checked={patient_gender.value === 'Male'} />
                <label htmlFor="patient_gender_male"><span><span></span></span><span>Male</span></label>
              </div>
              <div className="radio radio-inline">
                <input type="radio" id="patient_gender_female" name="patient_gender" {...patient_gender} value="Female" checked={patient_gender.value === 'Female'} />
                <label htmlFor="patient_gender_female"><span><span></span></span><span>Female</span></label>
              </div>
              {patient_gender.touched && patient_gender.error && <div className={s.bookingPatientFormError}>{patient_gender.error}</div>}
            </div>
          </div>
          <div style={{marginTop: '40px'}}>
            <div>
              <div>Additional Info:</div>
              <textarea name="additionalInfo" placeholder="Please provide important notes about patient here." {...additionalInfo} value={additionalInfo.value || ''} />
              {additionalInfo.touched && additionalInfo.error && <div className={s.bookingPatientFormError}>{additionalInfo.error}</div>}
            </div>
          </div>
          <p className="small">This information will only be used to contact you regarding your booking.</p>
          {submitFailed && invalid && <div className={s.bookingPatientFormError}>You have one or more form field errors.</div>}
          <button className="btn btn-primary" type="submit" disabled={submitting}>BOOK NOW</button>
        </div>
      </form>
    );
  }

  _onClickLogin(event) {
    event.preventDefault();

    this.props.showLoginPopup();
  }

}

const validate = values => {
  const errors = {};
  if (!values.client_firstName) {
    errors.client_firstName = 'Required';
  } else if (values.client_firstName.length > 50) {
    errors.client_firstName = 'Cannot be more than 50 characters';
  }
  if (!values.client_lastName) {
    errors.client_lastName = 'Required';
  } else if (values.client_lastName.length > 50) {
    errors.client_lastName = 'Cannot be more than 50 characters';
  }
  if (!values.client_contactEmail) {
    errors.client_contactEmail = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.client_contactEmail)) {
    errors.client_contactEmail = 'Invalid email address';
  } else if (values.client_contactEmail.length > 50) {
    errors.client_contactEmail = 'Cannot be more than 50 characters';
  }
  if (!values.client_contactNumber) {
    errors.client_contactNumber = 'Required';
  } else if (!/^[8,9]{1}[0-9]{7}$/i.test(values.client_contactNumber)) {
    errors.client_contactNumber = 'Invalid mobile number (e.g. 98765432)';
  }
  if (!values.patient_firstName) {
    errors.patient_firstName = 'Required';
  } else if (values.patient_firstName.length > 50) {
    errors.patient_firstName = 'Cannot be more than 50 characters';
  }
  if (!values.patient_lastName) {
    errors.patient_lastName = 'Required';
  } else if (values.patient_lastName.length > 50) {
    errors.patient_lastName = 'Cannot be more than 50 characters';
  }
  if (!values.patient_dob) {
    errors.patient_dob = 'Required';
  } else if (!/^\d{4}[-]\d{2}[-]\d{2}$/i.test(values.patient_dob)) {
    errors.patient_dob = 'Invalid date of birth (e.g. YYYY-MM-DD)';
  } else if (moment().isSameOrBefore(values.patient_dob, 'day')) {
    errors.patient_dob = 'Invalid date of birth (e.g. YYYY-MM-DD)';
  }
  if (!values.patient_gender) {
    errors.patient_gender = 'Required';
  }
  return errors;
}

BookingPatientForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  showDayPickerPopup: PropTypes.func.isRequired,
  showLoginPopup: PropTypes.func.isRequired,
  showAlertPopup: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired
}

const reduxFormConfig = {
  form: 'bookingLocationForm',
  fields: ['client_firstName', 'client_lastName', 'client_contactEmail', 'client_contactNumber', 'patient_firstName', 'patient_lastName', 'patient_dob', 'patient_gender', 'additionalInfo', 'postalCode', 'unitNumber', 'address', 'isPatient'],
  validate: validate
}

const mapStateToProps = (state) => {
  const { order } = state;
  return {
    initialValues: {
      client_contactEmail: order && order.booker && order.booker.client_contactEmail || undefined,
      client_contactNumber: order && order.booker && order.booker.client_contactNumber || undefined,
      client_firstName: order && order.booker && order.booker.client_firstName || undefined,
      client_lastName: order && order.booker && order.booker.client_lastName || undefined,
      patient_contactEmail: order && order.booker && order.booker.client_contactEmail || undefined,
      patient_contactNumber: order && order.booker && order.booker.client_contactNumber || undefined,
      patient_firstName: order && order.booker && order.booker.patient_firstName || undefined,
      patient_lastName: order && order.booker && order.booker.patient_lastName || undefined,
      patient_dob: order && order.booker && order.booker.patient_dob || undefined,
      patient_gender: order && order.booker && order.booker.patient_gender || undefined,
      additionalInfo: order && order.booker && order.booker.additionalInfo || undefined,
      isPatient: order && order.booker && order.booker.isPatient || undefined,
      postalCode: order && order.location && order.location.postalCode || undefined,
      address: order && order.location && order.location.address || undefined,
      unitNumber: order && order.location && order.location.unitNumber || undefined,
    }
  }
}

export default reduxForm(reduxFormConfig, mapStateToProps)(BookingPatientForm);
