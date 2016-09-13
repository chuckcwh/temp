import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import cx from 'classnames';
import s from './CreditsTopupForm.css';
import util from '../../core/util';

class CreditsTopupForm extends Component {

  render() {
    const {
      fields: { deposit, method, transRef, transDate },
      invalid,
      handleSubmit,
      submitFailed,
      submitting,
      user,
    } = this.props;
    return (
      <form className={s.creditsTopupForm} onSubmit={handleSubmit}>
        <div className={s.creditsTopupFormSection}>
          <div className="TableRow">
            <div className="TableRowItem1">Amount (SGD)*</div>
            <div className="TableRowItem2">
              <input type="text" placeholder="No decimals allowed" {...deposit} />
              {deposit.touched && deposit.error && <div className={s.creditsTopupFormError}>{deposit.error}</div>}
            </div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Payment Method*</div>
            <div className="TableRowItem2">
              <div className="radio radio-inline">
                <input type="radio" id="method_paypal" name="method" {...method} value="paypal" checked={method.value === 'paypal'} />
                <label htmlFor="method_paypal"><span><span></span></span><span>Paypal</span></label>
              </div>
              <div className="radio radio-inline">
                <input type="radio" id="method_bank_transfer" name="method" {...method} value="bank" checked={method.value === 'bank'} />
                <label htmlFor="method_bank_transfer"><span><span></span></span><span>Bank Transfer</span></label>
              </div>
              {method.touched && method.error && <div className={s.creditsTopupFormError}>{method.error}</div>}
            </div>
          </div>
        </div>
        {method.value === 'paypal' && <div className={s.creditsTopupFormPaypal}>
          <div className={s.creditsTopupFormSection}>
            <div className={s.creditsTopupFormSectionBoxWrapper}>
              <div className={s.creditsTopupFormSectionBox}>
                <div className={s.creditsTopupFormSectionBoxContent}>
                  <div className={s.creditsTopupFormSectionBoxValue} name="credit">
                    {`SGD ${user && parseFloat(user.credits.current + deposit.value).toFixed(2)}`}
                  </div>
                  <div className={s.creditsTopupFormSectionBoxTitle}>Balance Credits after Deposit</div>
                </div>
              </div>
              <div className={s.creditsTopupFormSectionBox}>
                <div className={s.creditsTopupFormSectionBoxContent}>
                  <div className={s.creditsTopupFormSectionBoxValue} id="pay">
                    {util.isInt(deposit.value) ? `SGD ${((parseFloat(deposit.value) + 0.5) / (1 - 0.039)).toFixed(2)}`: '-'}
                  </div>
                  <div className={s.creditsTopupFormSectionBoxTitle}>*Amount to Pay</div>
                </div>
              </div>
            </div>
          </div>
          <div className={s.creditsTopupFormSection}>
            <p className="small">*PayPal Transaction Fee: SGD 0.50 + 3.90%</p>
            <button className="btn btn-primary" type="submit" disabled={invalid || submitting}>Pay via Paypal</button>
          </div>
        </div>}
        {method.value === 'bank' && <div className={s.creditsTopupFormBank}>
          <div className={s.creditsTopupFormSection}>
            <div className={s.creditsTopupFormSectionBoxWrapper}>
              <div className={s.creditsTopupFormSectionBox}>
                <div className={s.creditsTopupFormSectionBoxContent}>
                  <div className={s.creditsTopupFormSectionBoxValue} name="credit">
                    {`SGD ${user && parseFloat(user.credits.current + deposit.value).toFixed(2)}`}
                  </div>
                  <div className={s.creditsTopupFormSectionBoxTitle}>Balance Credits after Deposit</div>
                </div>
              </div>
              <div className={s.creditsTopupFormSectionBox}>
                <div className={s.creditsTopupFormSectionBoxContent}>
                  <div className={s.creditsTopupFormSectionBoxValue} id="pay">
                    {util.isInt(deposit.value) ? `SGD ${parseFloat(deposit.value).toFixed(2)}`: '-'}
                  </div>
                  <div className={s.creditsTopupFormSectionBoxTitle}>*Amount to Pay</div>
                </div>
              </div>
            </div>
          </div>
          <div className={s.creditsTopupFormSection}>
            <h4>Notes on Bank Transfer</h4>
            <p>
              Please make payment to the following bank account:
              <br />
              <strong>UOB Current Account: 341-306-307-6</strong>
              <br />
            </p>
            <p>
              After transferring, fill in your transaction reference number below and click "Pay via Bank Transfer".
              <br />
              We will verify the transaction and credit you accordingly within 3 working days.
              <br />
              Meanwhile, you will see a "Pending" transaction in your history.
            </p>
          </div>
          <div className={s.creditsTopupFormSection}>
            <div className="TableRow">
              <div className="TableRowItem1">Transaction Reference No.*</div>
              <div className="TableRowItem2">
                <input type="text" {...transRef} />
                {transRef.touched && transRef.error && <div className={s.creditsTopupFormError}>{transRef.error}</div>}
              </div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Transaction Date*</div>
              <div className="TableRowItem2">
                <div className="DateInput">
                  <input type="text" {...transDate} />
                  <span
                    onClick={() =>
                      this.props.showDayPickerPopup && this.props.showDayPickerPopup(transDate.value, 'creditsTopupForm')}
                  ></span>
                </div>
                {transDate.touched && transDate.error && <div className={s.creditsTopupFormError}>{transDate.error}</div>}
              </div>
            </div>
            <button className="btn btn-primary" type="submit" disabled={invalid || submitting}>
              Pay via Bank Transfer
            </button>
          </div>
        </div>}
      </form>
    );
  }

}

const validate = values => {
  const errors = {};
  if (!values.deposit) {
    errors.deposit = 'Required';
  } else if (!util.isInt(values.deposit)) {
    errors.deposit = 'Invalid top up amount';
  }
  if (!values.method) {
    errors.method = 'Required';
  }
  if (values.method === 'bank' && !values.transRef) {
    errors.transRef = 'Required';
  }
  if (values.method === 'bank' && !values.transDate) {
    errors.transDate = 'Required';
  }
  return errors;
};

CreditsTopupForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  showDayPickerPopup: PropTypes.func.isRequired,
  // showAlertPopup: PropTypes.func.isRequired,
  // fetchAddress: PropTypes.func.isRequired,
  // onNext: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

const reduxFormConfig = {
  form: 'creditsTopupForm',
  fields: ['deposit', 'method', 'transRef', 'transDate'],
  validate,
};

export default reduxForm(reduxFormConfig)(CreditsTopupForm);
