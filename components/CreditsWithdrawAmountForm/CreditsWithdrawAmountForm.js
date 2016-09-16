import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import cx from 'classnames';
import s from './CreditsWithdrawAmountForm.css';

class CreditsWithdrawAmountForm extends Component {

  render() {
    const {
      fields: { withdrawAmt },
      invalid,
      handleSubmit,
      pristine,
      submitFailed,
      submitting,
    } = this.props;
    return (
      <form className={s.creditsWithdrawAmountForm} onSubmit={handleSubmit}>
        <div className={s.creditsWithdrawAmountFormSection}>
          <div className="TableRow">
            <div className="TableRowItem1">Amount (SGD)*</div>
            <div className="TableRowItem2">
              <input type="text" {...withdrawAmt} />
              {withdrawAmt.touched && withdrawAmt.error && <div className={s.creditsWithdrawAmountFormError}>{withdrawAmt.error}</div>}
            </div>
          </div>
        </div>
        <div className={s.creditsWithdrawAmountFormSection}>
          {submitFailed && invalid && <div className={s.creditsWithdrawAmountFormError}>You have one or more form field errors.</div>}
          <button className="btn btn-primary" type="submit" disabled={invalid || pristine || submitting}>Withdraw</button>
        </div>
      </form>
    );
  }

}

const validate = values => {
  const errors = {};
  if (!values.withdrawAmt) {
    errors.withdrawAmt = 'Required';
  } else if (!/\d+/i.test(values.withdrawAmt)) {
    errors.withdrawAmt = 'Invalid withdraw amount';
  }
  return errors;
};

CreditsWithdrawAmountForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  // showLoginPopup: PropTypes.func.isRequired,
  // fetchAddress: PropTypes.func.isRequired,
  // onNext: PropTypes.func.isRequired,
};

const reduxFormConfig = {
  form: 'creditsWithdrawAmountForm',
  fields: ['withdrawAmt'],
  destroyOnUnmount: true,
  validate,
};

export default reduxForm(reduxFormConfig)(CreditsWithdrawAmountForm);
