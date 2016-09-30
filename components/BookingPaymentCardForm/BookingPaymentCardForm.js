import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import s from './BookingPaymentCardForm.css';

class BookingPaymentCardForm extends Component {

  render() {
    const {
      fields: { number, exp_month, exp_year, cvc, address_zip },
      invalid,
      handleSubmit,
      pristine,
      submitFailed,
      submitting,
    } = this.props;
    return (
      <form className={s.bookingPaymentCardForm} onSubmit={handleSubmit}>
        <div className={s.bookingPaymentCardFormSection}>
          <div className="TableRow">
            <div className="TableRowItem1">Card Number*</div>
            <div className="TableRowItem2">
              <input type="text" size="20" placeholder="1111222233334444" {...number} />
              {number.touched && number.error && <div className={s.bookingPaymentCardFormError}>{number.error}</div>}
            </div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Expiry Month (MM)*</div>
            <div className="TableRowItem2">
              <input type="text" size="2" placeholder="01" {...exp_month} />
              {exp_month.touched && exp_month.error && <div className={s.bookingPaymentCardFormError}>{exp_month.error}</div>}
            </div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Expiry Year (YY)*</div>
            <div className="TableRowItem2">
              <input type="text" size="2" placeholder="19" {...exp_year} />
              {exp_year.touched && exp_year.error && <div className={s.bookingPaymentCardFormError}>{exp_year.error}</div>}
            </div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">CVC*</div>
            <div className="TableRowItem2">
              <input type="text" size="4" placeholder="321" {...cvc} />
              {cvc.touched && cvc.error && <div className={s.bookingPaymentCardFormError}>{cvc.error}</div>}
            </div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Postal/Zip Code*</div>
            <div className="TableRowItem2">
              <input type="text" size="6" placeholder="123456" {...address_zip} />
              {address_zip.touched && address_zip.error && <div className={s.bookingPaymentCardFormError}>{address_zip.error}</div>}
            </div>
          </div>
        </div>
        <div className={s.bookingPaymentCardFormSection}>
          {submitFailed && invalid && <div className={s.bookingPaymentCardFormError}>You have one or more form field errors.</div>}
          <button className="btn btn-primary" type="submit" disabled={invalid || pristine || submitting}>PAY NOW</button>
        </div>
      </form>
    );
  }

}

const validate = values => {
  const errors = {};
  if (!values.number) {
    errors.number = 'Required';
  } else if (!/\d{16}/i.test(values.number)) {
    errors.number = 'Invalid card number';
  }
  if (!values.exp_month) {
    errors.exp_month = 'Required';
  } else if (!/\d{2}/i.test(values.exp_month)) {
    errors.exp_month = 'Invalid expiry month';
  }
  if (!values.exp_year) {
    errors.exp_year = 'Required';
  } else if (!/\d{2}/i.test(values.exp_year)) {
    errors.exp_year = 'Invalid expiry year';
  }
  if (!values.cvc) {
    errors.cvc = 'Required';
  } else if (!/\d+/i.test(values.cvc)) {
    errors.cvc = 'Invalid CVC';
  }
  if (!values.address_zip) {
    errors.address_zip = 'Required';
  } else if (!/\d{6}/i.test(values.address_zip)) {
    errors.address_zip = 'Invalid postal/zip code';
  }
  return errors;
};

BookingPaymentCardForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

const reduxFormConfig = {
  form: 'creditsWithdrawBankForm',
  fields: ['number', 'exp_month', 'exp_year', 'cvc', 'address_zip'],
  destroyOnUnmount: true,
  validate,
};

export default reduxForm(reduxFormConfig)(BookingPaymentCardForm);
