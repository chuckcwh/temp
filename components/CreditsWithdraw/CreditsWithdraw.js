import React, { Component } from 'react';
import s from './CreditsWithdraw.css';
import { USER_EDIT_SUCCESS, USER_CREDITS_WITHDRAW_SUCCESS, editUser, withdrawCredits, showAlertPopup } from '../../actions';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import moment from 'moment';
import Link from '../Link';
import Container from '../Container';
import Header from '../Header';
import DashboardTableButton from '../DashboardTableButton';
import SideTabList from '../SideTabList';
import SideTab from '../SideTab';
import DayPickerPopup from '../DayPickerPopup';
import CreditsWithdrawBankForm from '../CreditsWithdrawBankForm';
import CreditsWithdrawAmountForm from '../CreditsWithdrawAmountForm';

class CreditsWithdraw extends Component {

  handleUpdateBankDetails = (values) => {
    return new Promise((resolve, reject) => {
      this.props.editUser({
        userId: this.props.user._id,
        bankDetails: { ...values },
      }).then(res => {
        if (res && res.type === USER_EDIT_SUCCESS) {
          this.props.showAlertPopup('You have successfully updated your bank details.');
          resolve();
        } else {
          reject();
        }
      });
    });
  };

  handleWithdrawCredits = (values) => {
    return new Promise((resolve, reject) => {
      if (parseFloat(values.withdrawAmt) <= this.props.user.credits.current) {
        this.props.withdrawCredits({
          value: values.withdrawAmt,
        }).then(res => {
          if (res && res.type === USER_CREDITS_WITHDRAW_SUCCESS) {
            this.props.showAlertPopup('You have successfully submitted a request to withdraw.');
            resolve();
          } else {
            this.props.showAlertPopup('Your withdrawal request has been rejected.');
            reject();
          }
        });
      } else {
        this.props.showAlertPopup('You do not have enough credits.');
        reject();
      }
    });
  }

  render() {
    const { user } = this.props;
    const transactions = null;
    return (
      <div className={s.creditsWithdraw}>
        <div className={s.creditsWithdrawSection}>
          <h2>Bank Details</h2>
          <CreditsWithdrawBankForm
            onSubmit={this.handleUpdateBankDetails}
          />
        </div>
        <div className={s.creditsWithdrawSection}>
          <h2>Withdraw Credits</h2>
          <CreditsWithdrawAmountForm
            onSubmit={this.handleWithdrawCredits}
          />
        </div>
      </div>
    );
  }
}


CreditsWithdraw.propTypes = {
  user: React.PropTypes.object,

  editUser: React.PropTypes.func.isRequired,
  showAlertPopup: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user.data,
});

const mapDispatchToProps = (dispatch) => ({
  editUser: (params) => dispatch(editUser(params)),
  showAlertPopup: (message) => dispatch(showAlertPopup(message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditsWithdraw);
