import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import cx from 'classnames';
import s from './CreditsWithdrawBankForm.css';

class CreditsWithdrawBankForm extends Component {

  render() {
    const {
      fields: { bank, branch, acctno },
      invalid,
      handleSubmit,
      submitFailed,
      submitting,
    } = this.props;
    return (
      <form className={s.creditsWithdrawBankForm} onSubmit={handleSubmit}>
        <div className={s.creditsWithdrawBankFormSection}>
          <div className="TableRow">
            <div className="TableRowItem1">Bank*</div>
            <div className="TableRowItem2">
              <input type="text" {...bank} />
              {bank.touched && bank.error && <div className={s.creditsWithdrawBankFormError}>{bank.error}</div>}
            </div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Branch No.*</div>
            <div className="TableRowItem2">
              <input type="text" {...branch} />
              {branch.touched && branch.error && <div className={s.creditsWithdrawBankFormError}>{branch.error}</div>}
            </div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Bank Account No.*</div>
            <div className="TableRowItem2">
              <input type="text" placeholder="Omit dashes" {...acctno} />
              {acctno.touched && acctno.error && <div className={s.creditsWithdrawBankFormError}>{acctno.error}</div>}
            </div>
          </div>
        </div>
        <div className={s.creditsWithdrawBankFormSection}>
          {submitFailed && invalid && <div className={s.creditsWithdrawBankFormError}>You have one or more form field errors.</div>}
          <button className="btn btn-primary" type="submit" disabled={invalid || submitting}>Update</button>
        </div>
      </form>
    );
  }

}

const validate = values => {
  const errors = {};
  // if (!values.postalCode) {
  //   errors.postalCode = 'Required';
  // } else if (!/^[0-9]{6}$/i.test(values.postalCode)) {
  //   errors.postalCode = 'Invalid postal code (e.g. 123456)';
  // }
  if (!values.bank) {
    errors.bank = 'Required';
  }
  if (!values.branch) {
    errors.branch = 'Required';
  } else if (!/\d+/i.test(values.branch)) {
    errors.branch = 'Invalid branch number';
  }
  if (!values.acctno) {
    errors.acctno = 'Required';
  } else if (!/\d+/i.test(values.acctno)) {
    errors.branch = 'Invalid branch number';
  }
  return errors;
};

CreditsWithdrawBankForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  // showLoginPopup: PropTypes.func.isRequired,
  // fetchAddress: PropTypes.func.isRequired,
  // onNext: PropTypes.func.isRequired,
};

const reduxFormConfig = {
  form: 'creditsWithdrawBankForm',
  fields: ['bank', 'branch', 'acctno'],
  validate,
};

const mapStateToProps = (state) => {
  const { order } = state;
  return {
    initialValues: {
      // postalCode: order && order.location && order.location.postalCode || undefined,
      // address: order && order.location && order.location.address || undefined,
      // unitNumber: order && order.location && order.location.unitNumber || undefined,
    },
  };
};

export default reduxForm(reduxFormConfig, mapStateToProps)(CreditsWithdrawBankForm);
