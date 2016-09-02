import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import classNames from 'classnames';
import s from './BookingLocationForm.css';

class BookingLocationForm extends Component {

  componentWillReceiveProps(props) {
    const { fields: { postal } } = this.props;
    const newPostalCode = props && props.fields && props.fields.postal;
    if (newPostalCode.value.length === 6 && newPostalCode.value !== postal.value) {
      this.props.fetchAddress(newPostalCode.value);
    }
  }

  onClickLogin = (event) => {
    event.preventDefault();

    this.props.showLoginPopup();
  };

  render() {
    const {
      fields: { postal, unit, description, lat, lng, region, neighborhood },
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
                <input type="text" id="postal" name="postal" placeholder="Enter Postal Code*" {...postal} />
                {postal.touched && postal.error && <div className={s.bookingLocationFormError}>{postal.error}</div>}
              </div>
              <div className={s.bookingLocationFormGroup}>
                <input type="text" id="unit" name="unit" placeholder="Enter Unit Number" {...unit} />
                {unit.touched && unit.error && <div className={s.bookingLocationFormError}>{unit.error}</div>}
              </div>
            </div>
            <div className={classNames(s.patientAddressRight, 'inline')}>
              <div className={s.bookingLocationFormGroup}>
                <textarea id="description" name="description" placeholder="Enter Address*" {...description} />
                {description.touched && description.error && <div className={s.bookingLocationFormError}>{description.error}</div>}
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
  fields: ['postal', 'unit', 'description', 'lat', 'lng', 'region', 'neighborhood'],
  validate,
};

const mapStateToProps = (state) => {
  const { order } = state;
  return {
    initialValues: {
      postal: order && order.location && order.location.postal || undefined,
      description: order && order.location && order.location.description || undefined,
      unit: order && order.location && order.location.unit || undefined,
      lat: order && order.location && order.location.lat || undefined,
      lng: order && order.location && order.location.lng || undefined,
      region: order && order.location && order.location.region || undefined,
      neighborhood: order && order.location && order.location.neighborhood || undefined,
    },
  };
};

export default reduxForm(reduxFormConfig, mapStateToProps)(BookingLocationForm);
