import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import s from './CreditsWithdrawBankForm.css';

class CreditsWithdrawBankForm extends Component {

  render() {
    const {
      fields: { bankCode, branchCode, acctNum },
      invalid,
      handleSubmit,
      pristine,
      submitFailed,
      submitting,
    } = this.props;
    return (
      <form className={s.creditsWithdrawBankForm} onSubmit={handleSubmit}>
        <div className={s.creditsWithdrawBankFormSection}>
          <div className="TableRow">
            <div className="TableRowItem1">Bank*</div>
            <div className="TableRowItem2">
              <input type="text" {...bankCode} />
              {bankCode.touched && bankCode.error && <div className={s.creditsWithdrawBankFormError}>{bankCode.error}</div>}
            </div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Branch No.*</div>
            <div className="TableRowItem2">
              <input type="text" {...branchCode} />
              {branchCode.touched && branchCode.error && <div className={s.creditsWithdrawBankFormError}>{branchCode.error}</div>}
            </div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Bank Account No.*</div>
            <div className="TableRowItem2">
              <input type="text" placeholder="Omit dashes" {...acctNum} />
              {acctNum.touched && acctNum.error && <div className={s.creditsWithdrawBankFormError}>{acctNum.error}</div>}
            </div>
          </div>
        </div>
        <div className={s.creditsWithdrawBankFormSection}>
          {submitFailed && invalid && <div className={s.creditsWithdrawBankFormError}>You have one or more form field errors.</div>}
          <button className="btn btn-primary" type="submit" disabled={invalid || pristine || submitting}>Update</button>
        </div>
      </form>
    );
  }

}

const validate = values => {
  const errors = {};
  if (!values.bankCode) {
    errors.bankCode = 'Required';
  }
  if (!values.branchCode) {
    errors.branchCode = 'Required';
  } else if (!/\d+/i.test(values.branchCode)) {
    errors.branchCode = 'Invalid branch number';
  }
  if (!values.acctNum) {
    errors.acctNum = 'Required';
  } else if (!/\d+/i.test(values.acctNum)) {
    errors.acctNum = 'Invalid account number';
  }
  return errors;
};

CreditsWithdrawBankForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

const reduxFormConfig = {
  form: 'creditsWithdrawBankForm',
  fields: ['bankCode', 'branchCode', 'acctNum'],
  destroyOnUnmount: true,
  validate,
};

const mapStateToProps = (state) => {
  const { user } = state;
  return {
    initialValues: {
      bankCode: user && user.data && user.data.bankDetails && user.data.bankDetails.bankCode || undefined,
      branchCode: user && user.data && user.data.bankDetails && user.data.bankDetails.branchCode || undefined,
      acctNum: user && user.data && user.data.bankDetails && user.data.bankDetails.acctNum || undefined,
    },
  };
};

export default reduxForm(reduxFormConfig, mapStateToProps)(CreditsWithdrawBankForm);
