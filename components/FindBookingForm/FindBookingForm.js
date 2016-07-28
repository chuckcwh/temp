import React, { PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import s from './FindBookingForm.css';
import sAccount from '../Account/Account.css';
import { getBooking } from '../../actions';

const submit = (values, dispatch) => (
  new Promise((resolve, reject) => {
    const errors = {};
    if (!values.bid) {
      errors.bid = 'Booking ID is required';
    }
    if (!values.mobilePhone) {
      errors.mobilePhone = 'Mobile Number is required';
    // } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    //   errors.email = 'Invalid email address';
    } else if (!/^[8-9]{1}[0-9]{7}$/.test(values.mobilePhone)) {
      errors.mobilePhone = 'Invalid mobile number';
    }
    if (errors.bid || errors.mobilePhone) {
      reject(errors);
    } else {
      dispatch(getBooking({
        bid: values.bid,
        mobilePhone: values.mobilePhone,
      })).then((res) => {
        if (res.response && res.response.status === 1) {
          resolve();
        } else {
          reject({ _error: 'Sorry, we are not able to find your booking.' });
        }
      });
    }
  })
);

const FindBookingForm = (props) => {
  const {
    fields: { bid, mobilePhone },
    error,
    handleSubmit,
    submitting,
  } = props;
  return (
    <form className={s.findBookingForm} onSubmit={handleSubmit(submit)}>
      <h3>Have Guest Booking ID?</h3>
      <div className="IconInput BookingIdInput">
        <span />
        <input type="text" placeholder="Booking ID*" {...bid} />
      </div>
      <div className="IconInput PhoneInput">
        <span />
        <input type="text" placeholder="Mobile Number*" {...mobilePhone} />
      </div>
      <div className={sAccount.accountContainerItemMiddle}>
        {bid.touched && bid.error && <div className={s.findBookingFormError}>{bid.error}</div>}
        {mobilePhone.touched && mobilePhone.error && <div className={s.findBookingFormError}>{mobilePhone.error}</div>}
        {error && <div className={s.findBookingFormError}>{error}</div>}
        <div className={sAccount.loginInsteadContainer}>
          Have account? <a href="https://app.ebeecare.com/login/" className={sAccount.loginInsteadLink}>Login instead</a>
        </div>
      </div>
      <button className="btn btn-primary" type="submit" disabled={submitting}>Find Booking</button>
    </form>
  );
};

FindBookingForm.propTypes = {
  fields: PropTypes.object.isRequired,
  error: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
};

const reduxFormConfig = {
  form: 'findBookingForm',
  fields: ['bid', 'mobilePhone'],
  destroyOnUnmount: true,
};

export default reduxForm(reduxFormConfig)(FindBookingForm);
