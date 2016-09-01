import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import classNames from 'classnames';
import s from './BookingLocationForm.css';

class BookingLocationForm extends Component {

  componentWillReceiveProps(props) {
    const { fields: { postalCode } } = this.props;
    const newPostalCode = props && props.fields && props.fields.postalCode;
    if (newPostalCode.value.length === 6 && newPostalCode.value !== postalCode.value) {
      this.props.fetchAddress(newPostalCode.value);
    }
  }

  onClickLogin = (event) => {
    event.preventDefault();

    this.props.showLoginPopup();
  };

  render() {
    const {
      fields: { postalCode, unitNumber, address, lat, lng, region, neighborhood },
      invalid,
      handleSubmit,
      submitFailed,
      submitting,
    } = this.props;
    return (
      <form className={s.bookingLocationForm} onSubmit={handleSubmit(this.props.onNext)}>
        <div className={s.bookingLocationFormSection}>
          <span>I&apos;m an existing customer</span>
          <a href="#" className="btn btn-primary btn-small btn-inline" onClick={this.onClickLogin}>LOGIN</a>
          {/*
          <span>or</span>
          <a href="/booking2" className="btn btn-primary btn-small btn-inline">REGISTER</a>
          */}
          <p className="small">You can import pre-existing patient information.</p>
        </div>
        <div className={s.bookingLocationFormSection}>
          <div>Continue booking as guest</div>
          <div className={s.patientAddress}>
            <div className={classNames(s.patientAddressLeft, 'inline')}>
              <div className={s.bookingLocationFormGroup}>
                <input type="text" id="postalCode" name="postalCode" placeholder="Enter Postal Code*" {...postalCode} />
                {postalCode.touched && postalCode.error && <div className={s.bookingLocationFormError}>{postalCode.error}</div>}
              </div>
              <div className={s.bookingLocationFormGroup}>
                <input type="text" id="unitNumber" name="unitNumber" placeholder="Enter Unit Number" {...unitNumber} />
                {unitNumber.touched && unitNumber.error && <div className={s.bookingLocationFormError}>{unitNumber.error}</div>}
              </div>
            </div>
            <div className={classNames(s.patientAddressRight, 'inline')}>
              <div className={s.bookingLocationFormGroup}>
                <textarea id="address" name="address" placeholder="Enter Address*" {...address} />
                {address.touched && address.error && <div className={s.bookingLocationFormError}>{address.error}</div>}
              </div>
            </div>
          </div>
          <div style={{ padding: '20px 0' }}>
            {submitFailed && invalid && <div className={s.bookingLocationFormError}>You have one or more form field errors.</div>}
            <button className="btn btn-primary" type="submit" disabled={submitting}>NEXT</button>
          </div>
        </div>
      </form>
    );
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
};

BookingLocationForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  showLoginPopup: PropTypes.func.isRequired,
  fetchAddress: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

const reduxFormConfig = {
  form: 'bookingLocationForm',
  fields: ['postalCode', 'unitNumber', 'address', 'lat', 'lng', 'region', 'neighborhood'],
  validate,
};

const mapStateToProps = (state) => {
  const { order } = state;
  return {
    initialValues: {
      postalCode: order && order.location && order.location.postalCode || undefined,
      address: order && order.location && order.location.address || undefined,
      unitNumber: order && order.location && order.location.unitNumber || undefined,
      lat: order && order.location && order.location.lat || undefined,
      lng: order && order.location && order.location.lng || undefined,
      region: order && order.location && order.location.region || undefined,
      neighborhood: order && order.location && order.location.neighborhood || undefined,
    },
  };
};

export default reduxForm(reduxFormConfig, mapStateToProps)(BookingLocationForm);
