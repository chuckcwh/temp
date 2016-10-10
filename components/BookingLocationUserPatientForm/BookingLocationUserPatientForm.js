import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import classNames from 'classnames';
import moment from 'moment';
import s from './BookingLocationUserPatientForm.css';

class BookingLocationUserPatientForm extends Component {

  componentWillReceiveProps(props) {
    const { fields: { postal } } = this.props;
    const newPostalCode = props && props.fields && props.fields.postal;
    if (newPostalCode.value.length === 6 && newPostalCode.value !== postal.value) {
      this.props.fetchAddress(newPostalCode.value);
    }
  }

  render() {
    const {
      fields: { name, dob, idNum, contact, gender, postal, unit, description, lat, lng, region, neighborhood, isPatient },
      invalid,
      handleSubmit,
      submitFailed,
      submitting,
      config,
    } = this.props;
    return (
      <form className={s.bookingLocationUserPatientForm} onSubmit={handleSubmit(this.props.onFilled)}>
        <div>
          <div>
            <input className={s.rememberMeCheckbox} type="checkbox" id="isPatient" {...isPatient} />
            <label className={s.rememberMeCheckboxLabel} htmlFor="isPatient">
              <span></span><span>Are you the patient?</span>
            </label>
          </div>
          <div className={s.bookingLocationUserPatientFormGroup}>
            <input type="text" placeholder="Name*" {...name} disabled={isPatient.value === true} />
            {name.touched && name.error && <div className={s.bookingLocationUserPatientFormError}>{name.error}</div>}
          </div>
          <div className={s.bookingLocationUserPatientFormGroup}>
            <input type="text" placeholder="Mobile Number" {...contact} disabled={isPatient.value === true} />
            {contact.touched && contact.error && <div className={s.bookingLocationUserPatientFormError}>{contact.error}</div>}
          </div>
          <div className={s.bookingLocationUserPatientFormGroup}>
            <input type="text" placeholder="IC*" {...idNum} />
            {idNum.touched && idNum.error && <div className={s.bookingLocationUserPatientFormError}>{idNum.error}</div>}
          </div>
          <div className={s.bookingLocationUserPatientFormGroup}>
            <div className="DateInput">
              <input type="text" placeholder="Birth Date* (YYYY-MM-DD)" {...dob} />
              <span onClick={() => this.props.showDayPickerPopup(dob.value, 'bookingLocationUserPatientForm')}></span>
            </div>
            {dob.touched && dob.error && <div className={s.bookingLocationUserPatientFormError}>{dob.error}</div>}
          </div>
          <div className={s.bookingLocationUserPatientFormGroup}>
            {
              config.genders.map(elem => (
                <div className="radio radio-inline" key={elem.value}>
                  <input type="radio" id={`gender_${elem.value}`} name="gender" {...gender} value={elem.value} checked={gender.value === elem.value} />
                  <label htmlFor={`gender_${elem.value}`}><span><span></span></span><span>{elem.name}</span></label>
                </div>
              ))
            }
            {gender.touched && gender.error && <div className={s.bookingLocationUserPatientFormError}>{gender.error}</div>}
          </div>
        </div>
        <div>
          <div style={{ marginTop: '40px' }}>Patient Location / Address</div>
          <div className={s.patientAddress}>
            <div className={classNames(s.patientAddressLeft, 'inline')}>
              <div className={s.bookingLocationUserPatientFormGroup}>
                <input type="text" placeholder="Enter Postal Code*" {...postal} />
                {postal.touched && postal.error && <div className={s.bookingLocationUserPatientFormError}>{postal.error}</div>}
              </div>
              <div className={s.bookingLocationUserPatientFormGroup}>
                <input type="text" placeholder="Enter Unit Number" {...unit} />
                {unit.touched && unit.error && <div className={s.bookingLocationUserPatientFormError}>{unit.error}</div>}
              </div>
            </div>
            <div className={classNames(s.patientAddressRight, 'inline')}>
              <div>
                <textarea placeholder="Enter Address*" {...description} />
                {description.touched && description.error && <div className={s.bookingLocationUserPatientFormError}>{description.error}</div>}
              </div>
            </div>
          </div>
          <p className="small">This information will only be used to contact you regarding your booking.</p>
        </div>
        {submitFailed && invalid && <div className={s.bookingLocationUserPatientFormError}>You have one or more form field errors.</div>}
        <button className="btn btn-primary" type="submit" disabled={submitting}>Save Patient</button>
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
  if (!values.dob) {
    errors.dob = 'Required';
  } else if (!/^\d{4}[-]\d{2}[-]\d{2}$/i.test(values.dob)) {
    errors.dob = 'Invalid date of birth (e.g. YYYY-MM-DD)';
  } else if (moment().isSameOrBefore(values.dob, 'day')) {
    errors.dob = 'Date must be earlier than today';
  }
  if (!values.idNum) {
    errors.idNum = 'Required';
  } else if (!/[A-Z]\d{7}[A-Z]/i.test(values.idNum)) {
    errors.idNum = 'Invalid identication number (e.g. S1234567A)';
  }
  if (values.contact && !/^([+]65)?[8-9]{1}[0-9]{7}$/.test(values.contact)) {
    errors.contact = 'Invalid mobile number';
  }
  if (!values.gender) {
    errors.gender = 'Required';
  }
  if (!values.postal) {
    errors.postal = 'Required';
  } else if (!/^[0-9]{6}$/i.test(values.postal)) {
    errors.postal = 'Invalid postal code (e.g. 123456)';
  }
  if (!values.description) {
    errors.description = 'Required';
  }
  return errors;
};

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
  user: PropTypes.object.isRequired,

  config: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
};

const reduxFormConfig = {
  form: 'bookingLocationUserPatientForm',
  fields: ['userName', 'userContact', 'name', 'dob', 'idNum', 'contact', 'gender', 'postal', 'unit', 'description', 'lat', 'lng', 'region', 'neighborhood', 'isPatient'],
  validate,
};

const mapStateToProps = (state) => ({
  config: state.config.data,
  initialValues: {
    userName: state.user.data && state.user.data.name,
    userContact: state.user.data && state.user.data.contact,
  },
});

export default reduxForm(reduxFormConfig, mapStateToProps)(BookingLocationUserPatientForm);
