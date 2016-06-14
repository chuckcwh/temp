import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import './FindBookingForm.scss';
import { getBooking } from '../../actions';

const submit = (values, dispatch) => {
  return new Promise((resolve, reject) => {
    const errors = {};
    if (!values.bid) {
      errors.bid = 'Booking ID is required';
    }
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }
    if (errors.bid || errors.email) {
      reject(errors);
    } else {
      dispatch(getBooking({
        bid: values.bid,
        email: values.email
      })).then((res) => {
        if (res.response && res.response.status === 1) {
          resolve();
        } else {
          reject({ _error: 'Sorry, we are not able to find your booking.' });
        }
      });
    }
  });
}

class FindBookingForm extends Component {

  render() {
    const { 
      fields: { bid, email }, 
      error,
      handleSubmit, 
      submitting 
    } = this.props;
    return (
      <form className="FindBookingForm" onSubmit={handleSubmit(submit)}>
        <h3>Have Guest Booking ID?</h3>
        <div className="IconInput BookingIdInput">
          <input type="text" placeholder="Booking ID*" {...bid} />
        </div>
        <div className="IconInput EmailInput">
          <input type="email" placeholder="Enter Email*" {...email} />
        </div>
        <div className="Account-container-item-middle">
          {bid.touched && bid.error && <div className="FindBookingFormError">{bid.error}</div>}
          {email.touched && email.error && <div className="FindBookingFormError">{email.error}</div>}
          {error && <div className="FindBookingFormError">{error}</div>}
          <div className="LoginInsteadContainer">
            Have account? <a href="https://app.ebeecare.com/login/" className="LoginInsteadLink">Login instead</a>
          </div>
        </div>
        <button className="btn btn-primary" type="submit" disabled={submitting}>Find Booking</button>
      </form>
    );
  }

}

FindBookingForm.propTypes = {
  fields: PropTypes.object.isRequired,
  error: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired
}

const reduxFormConfig = {
  form: 'findBookingForm',
  fields: ['bid', 'email'],
  destroyOnUnmount: true
}

export default reduxForm(reduxFormConfig)(FindBookingForm);
