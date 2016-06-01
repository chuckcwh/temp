import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import './BookingLocationUserPatientForm.scss';

class BookingLocationUserPatientForm extends Component {

  componentWillReceiveProps(props) {
    const { fields: { postalCode } } = this.props;
    const newPostalCode = props && props.fields && props.fields.postalCode;
    if (newPostalCode.value.length === 6 && newPostalCode.value !== postalCode.value) {
      this.props.fetchAddress(newPostalCode.value);
    }
  }

  render() {
    const { 
      fields: { fullName, dob, gender, additionalInfo, postalCode, unitNumber, address, isPatient }, 
      invalid,
      handleSubmit, 
      submitFailed,
      submitting 
    } = this.props;
    return (
      <form className="BookingLocationUserPatientForm" onSubmit={handleSubmit(this.props.onFilled)}>
        <div>
          <div>
            <input className="RememberMeCheckbox" type="checkbox" id="isPatient" {...isPatient} />
            <label className="RememberMeCheckboxLabel" htmlFor="isPatient">
              <span></span><span>Are you the patient?</span>
            </label>
          </div>
          <div className="BookingLocationUserPatientFormGroup">
            <input type="text" id="fullName" name="fullName" placeholder="Full Name*" {...fullName} disabled={isPatient.value === true} />
            {fullName.touched && fullName.error && <div className="BookingLocationUserPatientFormError">{fullName.error}</div>}
          </div>
          <div className="BookingLocationUserPatientFormGroup">
            <div className="DateInput">
              <input type="text" id="dob" name="dob" placeholder="Birth Date* (YYYY-MM-DD)" {...dob} />
              <span onClick={() => this.props.showDayPickerPopup(dob.value, 'bookingLocationUserPatientForm')}></span>
            </div>
            {dob.touched && dob.error && <div className="BookingLocationUserPatientFormError">{dob.error}</div>}
          </div>
          <div className="BookingLocationUserPatientFormGroup">
            <div className="radio radio-inline">
              <input type="radio" id="gender_male" name="gender" {...gender} value="Male" checked={gender.value === 'Male'} />
              <label htmlFor="gender_male"><span><span></span></span><span>Male</span></label>
            </div>
            <div className="radio radio-inline">
              <input type="radio" id="gender_female" name="gender" {...gender} value="Female" checked={gender.value === 'Female'} />
              <label htmlFor="gender_female"><span><span></span></span><span>Female</span></label>
            </div>
            {gender.touched && gender.error && <div className="BookingLocationUserPatientFormError">{gender.error}</div>}
          </div>
        </div>
        <div>
          <div style={{marginTop: '40px'}}>Patient Location / Address</div>
          <div className="PatientAddress">
            <div className="PatientAddressLeft inline">
              <div className="BookingLocationUserPatientFormGroup">
                <input type="text" id="postalCode" name="postalCode" placeholder="Enter Postal Code*" {...postalCode} />
                {postalCode.touched && postalCode.error && <div className="BookingLocationUserPatientFormError">{postalCode.error}</div>}
              </div>
              <div className="BookingLocationUserPatientFormGroup">
                <input type="text" id="unitNumber" name="unitNumber" placeholder="Enter Unit Number" {...unitNumber} />
                {unitNumber.touched && unitNumber.error && <div className="BookingLocationUserPatientFormError">{unitNumber.error}</div>}
              </div>
            </div>
            <div className="PatientAddressRight inline">
              <div>
                <textarea id="address" name="address" placeholder="Enter Address*" {...address} />
                {address.touched && address.error && <div className="BookingLocationUserPatientFormError">{address.error}</div>}
              </div>
            </div>
          </div>
          <p className="small">This information will only be used to contact you regarding your booking.</p>
        </div>
        {submitFailed && invalid && <div className="BookingLocationUserPatientFormError">You have one or more form field errors.</div>}
        <button className="btn btn-primary" type="submit">Save Patient</button>
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
  if (!values.dob) {
    errors.dob = 'Required';
  } else if (!/^\d{4}[-]\d{2}[-]\d{2}$/i.test(values.dob)) {
    errors.dob = 'Invalid date of birth (e.g. YYYY-MM-DD)';
  }
  if (!values.gender) {
    errors.gender = 'Required';
  }
  if (!values.postalCode) {
    errors.postalCode = 'Required';
  } else if (!/^[0-9]{6}$/i.test(values.postalCode)) {
    errors.postalCode = 'Invalid postal code (e.g. 123456)';
  }
  if (!values.address) {
    errors.address = 'Required';
  }
  return errors;
}

BookingLocationUserPatientForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  showDayPickerPopup: PropTypes.func.isRequired,
  showAlertPopup: PropTypes.func.isRequired,
  fetchAddress: PropTypes.func.isRequired,
  onFilled: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

const reduxFormConfig = {
  form: 'bookingLocationUserPatientForm',
  fields: ['userName', 'fullName', 'dob', 'gender', 'additionalInfo', 'postalCode', 'unitNumber', 'address', 'isPatient'],
  validate: validate
}

const mapStateToProps = (state) => {
  // const { order } = state;
  return {
    initialValues: {
      userName: state.user.data && state.user.data.clients && state.user.data.clients[0] && state.user.data.clients[0].fullName
    }
    // initialValues: {
    //   client_contactEmail: order && order.booker && order.booker.client_contactEmail || undefined,
    //   client_contactNumber: order && order.booker && order.booker.client_contactNumber || undefined,
    //   client_firstName: order && order.booker && order.booker.client_firstName || undefined,
    //   client_lastName: order && order.booker && order.booker.client_lastName || undefined,
    //   patient_contactEmail: order && order.booker && order.booker.client_contactEmail || undefined,
    //   patient_contactNumber: order && order.booker && order.booker.client_contactNumber || undefined,
    //   patient_firstName: order && order.booker && order.booker.patient_firstName || undefined,
    //   patient_lastName: order && order.booker && order.booker.patient_lastName || undefined,
    //   patient_dob: order && order.booker && order.booker.patient_dob || undefined,
    //   patient_dob_temp: undefined,
    //   patient_gender: order && order.booker && order.booker.patient_gender || undefined,
    //   additionalInfo: order && order.booker && order.booker.additionalInfo || undefined,
    //   isPatient: order && order.booker && order.booker.isPatient || undefined,
    //   postalCode: order && order.location && order.location.postalCode || undefined,
    //   address: order && order.location && order.location.address || undefined,
    //   unitNumber: order && order.location && order.location.unitNumber || undefined,
    // }
  }
}

export default reduxForm(reduxFormConfig, mapStateToProps)(BookingLocationUserPatientForm);
