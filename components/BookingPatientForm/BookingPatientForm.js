import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import moment from 'moment';
import Dropzone from 'react-dropzone';
import s from './BookingPatientForm.css';
import CloseButton from '../CloseButton';

class BookingPatientForm extends Component {

  onOpenClick = () => {
    this.dropzone.open();
  };

  onDrop = (files) => {
    const { fields: { additionalInfoImages } } = this.props;
    const newImages = [...(additionalInfoImages.value || []), ...files];
    additionalInfoImages.onChange(newImages);
  };

  removeFile = (index) => () => {
    const { fields: { additionalInfoImages } } = this.props;
    const newImages = [...additionalInfoImages.value];
    newImages.splice(index, 1)
    additionalInfoImages.onChange(newImages);
  };

  render() {
    const {
      fields: {
        clientName,
        clientEmail,
        clientContact,
        patientName,
        patientDob,
        patientContact,
        patientIdNum,
        patientGender,
        additionalInfo,
        additionalInfoImages,
        isPatient,
      },
      invalid,
      handleSubmit,
      submitFailed,
      submitting,
      config,
      onNext,
    } = this.props;
    return (
      <form className={s.bookingPatientForm} onSubmit={handleSubmit(onNext)}>
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
            <input type="text" placeholder="Name*" {...clientName} />
            {clientName.touched && clientName.error && <div className={s.bookingPatientFormError}>{clientName.error}</div>}
          </div>
          <div className={s.bookingPatientFormGroup}>
            <input type="email" placeholder="Email*" {...clientEmail} />
            {clientEmail.touched && clientEmail.error && <div className={s.bookingPatientFormError}>{clientEmail.error}</div>}
          </div>
          <div className={s.bookingPatientFormGroup}>
            <input type="text" placeholder="Mobile Number*" {...clientContact} />
            {clientContact.touched && clientContact.error &&
              <div className={s.bookingPatientFormError}>{clientContact.error}</div>}
          </div>
        </div>
        <div className={s.bookingPatientFormSection}>
          <div>
            <span className={s.patientDetailsLabel1}>Patient Details</span>
            <span className={s.patientDetailsLabel2}> (
              <input className={s.rememberMeCheckbox} type="checkbox" id="isPatient" {...isPatient} />
              <label className={s.rememberMeCheckboxLabel} htmlFor="isPatient">
                <span></span><span>Are you the patient?</span>
              </label>
              &nbsp;)
            </span>
          </div>
          <div>
            <div className={s.bookingPatientFormGroup}>
              <input type="text" placeholder="Name*" {...patientName} />
              {patientName.touched && patientName.error && <div className={s.bookingPatientFormError}>{patientName.error}</div>}
            </div>
            <div className={s.bookingPatientFormGroup}>
              <input type="text" placeholder="Mobile Number*" {...patientContact} />
              {patientContact.touched && patientContact.error &&
                <div className={s.bookingPatientFormError}>{patientContact.error}</div>}
            </div>
            <div className={s.bookingPatientFormGroup}>
              <input type="text" placeholder="IC*" {...patientIdNum} />
              {patientIdNum.touched && patientIdNum.error && <div className={s.bookingPatientFormError}>{patientIdNum.error}</div>}
            </div>
            <div className={s.bookingPatientFormGroup}>
              <div className="DateInput">
                <input type="text" placeholder="Birth Date* (YYYY-MM-DD)" {...patientDob} />
                <span onClick={() => this.props.showDayPickerPopup(patientDob.value, 'bookingPatientForm')}></span>
              </div>
              {patientDob.touched && patientDob.error && <div className={s.bookingPatientFormError}>{patientDob.error}</div>}
            </div>
            <div className={s.bookingPatientFormGroup}>
              {
                config && config.genders.map(elem => (
                  <div className="radio radio-inline">
                    <input
                      type="radio"
                      id={`patient_gender_${elem.value}`}
                      {...patientGender}
                      value={elem.value}
                      checked={patientGender.value === elem.value}
                    />
                    <label htmlFor={`patient_gender_${elem.value}`}>
                      <span><span></span></span>
                      <span>{elem.name}</span>
                    </label>
                  </div>
                ))
              }
              {patientGender.touched && patientGender.error && <div className={s.bookingPatientFormError}>{patientGender.error}</div>}
            </div>
          </div>
          <div style={{ marginTop: '40px' }}>
            <div>
              <div>Additional Info:</div>
              <textarea
                placeholder="Please provide important notes about patient here."
                {...additionalInfo}
                value={additionalInfo.value || ''}
              />
              {additionalInfo.touched && additionalInfo.error && <div className={s.bookingPatientFormError}>{additionalInfo.error}</div>}
              <Dropzone
                ref={(c) => { this.dropzone = c; }}
                className={s.dropzone}
                activeClassName={s.dropzoneActive}
                onDrop={this.onDrop}
                disableClick={true}
              >
                {(!additionalInfoImages || !Array.isArray(additionalInfoImages.value) || !additionalInfoImages.value.length) &&
                  <div className={s.dropzoneNotes}>
                    <div><strong>IMAGE NOTES</strong></div>
                    <div>Drop image(s) here, or click on button below.</div>
                    <button type="button" className="btn btn-primary btn-small" onClick={this.onOpenClick}>
                      Select File(s)
                    </button>
                  </div>
                }
                {additionalInfoImages && Array.isArray(additionalInfoImages.value) && !!additionalInfoImages.value.length &&
                  <div>
                    <ul>
                      {additionalInfoImages.value.map((file, index) => (
                        <li key={index}>
                          <img src={file.preview} />
                          <CloseButton onCloseClicked={this.removeFile(index)} />
                        </li>
                      ))}
                    </ul>
                    <button type="button" className="btn btn-primary btn-small" onClick={this.onOpenClick}>
                      Select File(s)
                    </button>
                  </div>
                }
              </Dropzone>
            </div>
          </div>
          {submitFailed && invalid && <div className={s.bookingPatientFormError}>You have one or more form field errors.</div>}
          <button className="btn btn-primary" type="submit" disabled={submitting}>BOOK NOW</button>
        </div>
      </form>
    );
  }

}

const validate = values => {
  const errors = {};
  if (!values.clientName) {
    errors.clientName = 'Required';
  } else if (values.clientName.length > 50) {
    errors.clientName = 'Cannot be more than 50 characters';
  }
  if (!values.clientEmail) {
    errors.clientEmail = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.clientEmail)) {
    errors.clientEmail = 'Invalid email address';
  } else if (values.clientEmail.length > 50) {
    errors.clientEmail = 'Cannot be more than 50 characters';
  }
  if (!values.clientContact) {
    errors.clientContact = 'Required';
  } else if (!/^[8,9]{1}[0-9]{7}$/i.test(values.clientContact)) {
    errors.clientContact = 'Invalid mobile number (e.g. 98765432)';
  }
  if (!values.patientName) {
    errors.patientName = 'Required';
  } else if (values.patientName.length > 50) {
    errors.patientName = 'Cannot be more than 50 characters';
  }
  if (!values.patientDob) {
    errors.patientDob = 'Required';
  } else if (!/^\d{4}[-]\d{2}[-]\d{2}$/i.test(values.patientDob)) {
    errors.patientDob = 'Invalid date of birth (e.g. YYYY-MM-DD)';
  } else if (moment().isSameOrBefore(values.patientDob, 'day')) {
    errors.patientDob = 'Date must be earlier than today';
  }
  if (!values.patientContact) {
    errors.patientContact = 'Required';
  } else if (!/^[8,9]{1}[0-9]{7}$/i.test(values.patientContact)) {
    errors.patientContact = 'Invalid mobile number (e.g. 98765432)';
  }
  if (!values.patientIdNum) {
    errors.patientIdNum = 'Required';
  } else if (!/[A-Z]\d{7}[A-Z]/i.test(values.patientIdNum)) {
    errors.patientIdNum = 'Invalid patientIdNum (e.g. S1234567A)';
  }
  if (!values.patientGender) {
    errors.patientGender = 'Required';
  }
  return errors;
};

BookingPatientForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  showDayPickerPopup: PropTypes.func.isRequired,
  showLoginPopup: PropTypes.func.isRequired,
  showAlertPopup: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

const reduxFormConfig = {
  form: 'bookingPatientForm',
  fields: [
    'clientName',
    'clientEmail',
    'clientContact',
    'patientName',
    'patientDob',
    'patientContact',
    'patientIdNum',
    'patientGender',
    'additionalInfo',
    'additionalInfoImages',
    'isPatient',
  ],
  validate,
};

const mapStateToProps = (state) => {
  const { order } = state;
  return {
    config: state.config.data,
    initialValues: {
      clientName: order && order.booker && order.booker.clientName || undefined,
      clientEmail: order && order.booker && order.booker.clientEmail || undefined,
      clientContact: order && order.booker && order.booker.clientContact || undefined,
      patientName: order && order.booker && order.booker.patientName || undefined,
      patientDob: order && order.booker && order.booker.patientDob || undefined,
      patientContact: order && order.booker && order.booker.patientContact || undefined,
      patientIdNum: order && order.booker && order.booker.patientIdNum || undefined,
      patientGender: order && order.booker && order.booker.patientGender || undefined,
      additionalInfo: order && order.booker && order.booker.additionalInfo || undefined,
      additionalInfoImages: order && order.booker && order.booker.additionalInfoImages || [],
      isPatient: order && order.booker && order.booker.isPatient || undefined,
    },
  };
};

export default reduxForm(reduxFormConfig, mapStateToProps)(BookingPatientForm);
