import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import './BookingLocationForm.scss';

class BookingLocationForm extends Component {

  componentWillReceiveProps(props) {
    const { fields: { postalCode } } = this.props;
    const newPostalCode = props && props.fields && props.fields.postalCode;
    if (newPostalCode.value.length === 6 && newPostalCode.value !== postalCode.value) {
      this.props.fetchAddress(newPostalCode.value);
    }
  }

  render() {
    const { 
      fields: { postalCode, unitNumber, address }, 
      invalid,
      handleSubmit, 
      submitFailed,
      submitting 
    } = this.props;
    return (
      <form className="BookingLocationForm" onSubmit={handleSubmit(this.props.onNext)}>
        <div className="BookingLocationFormSection">
          <span>I&apos;m an existing customer</span>
          <a href="#" className="btn btn-primary btn-small btn-inline" onClick={this._onClickLogin.bind(this)}>LOGIN</a>
          {/*
          <span>or</span>
          <a href="/booking2" className="btn btn-primary btn-small btn-inline">REGISTER</a>
          */}
          <p className="small">You can import pre-existing patient information.</p>
        </div>
        <div className="BookingLocationFormSection">
          <div>Continue booking as guest</div>
          <div className="PatientAddress">
            <div className="PatientAddressLeft inline">
              <div className="BookingLocationFormGroup">
                <input type="text" id="postalCode" name="postalCode" placeholder="Enter Postal Code*" {...postalCode} />
                {postalCode.touched && postalCode.error && <div className="BookingLocationFormError">{postalCode.error}</div>}
              </div>
              <div className="BookingLocationFormGroup">
                <input type="text" id="unitNumber" name="unitNumber" placeholder="Enter Unit Number" {...unitNumber} />
                {unitNumber.touched && unitNumber.error && <div className="BookingLocationFormError">{unitNumber.error}</div>}
              </div>
            </div>
            <div className="PatientAddressRight inline">
              <div>
                <textarea id="address" name="address" placeholder="Enter Address*" {...address} />
                {address.touched && address.error && <div className="BookingLocationFormError">{address.error}</div>}
              </div>
            </div>
          </div>
          <div style={{padding: '20px 0'}}>
            {submitFailed && invalid && <div className="BookingLocationFormError">You have one or more form field errors.</div>}
            <button className="btn btn-primary" type="submit" disabled={submitting}>NEXT</button>
          </div>
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

BookingLocationForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  showLoginPopup: PropTypes.func.isRequired,
  fetchAddress: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired
}

const reduxFormConfig = {
  form: 'bookingLocationForm',
  fields: ['postalCode', 'unitNumber', 'address'],
  validate: validate
}

const mapStateToProps = (state) => {
  const { order } = state;
  return {
    initialValues: {
      postalCode: order && order.location && order.location.postalCode || undefined,
      address: order && order.location && order.location.address || undefined,
      unitNumber: order && order.location && order.location.unitNumber || undefined,
    }
  }
}

export default reduxForm(reduxFormConfig, mapStateToProps)(BookingLocationForm);
