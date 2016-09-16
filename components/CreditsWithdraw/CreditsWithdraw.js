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

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // this.props.fetchLanguages();
  }

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
      this.props.withdrawCredits({
        value: values.withdrawAmt,
      }).then(res => {
        if (res && res.type === USER_CREDITS_WITHDRAW_SUCCESS) {
          this.props.showAlertPopup(`You have successfully submitted a request to withdraw.`);
          resolve();
        } else {
          reject();
        }
      })
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

  // fetchLanguages: React.PropTypes.func.isRequired,
  // fetchAddress: React.PropTypes.func.isRequired,
  // getPatients: React.PropTypes.func.isRequired,
  // showDayPickerPopup: React.PropTypes.func.isRequired,
  editUser: React.PropTypes.func.isRequired,
  showAlertPopup: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user.data,
});

const mapDispatchToProps = (dispatch) => ({
  // fetchLanguages: () => dispatch(fetchLanguages()),
  // fetchAddress: (postalCode) => dispatch(fetchAddress(postalCode)),
  // getPatients: (params) => dispatch(getPatients(params)),
  // showDayPickerPopup: (value, source) => dispatch(showDayPickerPopup(value, source)),
  editUser: (params) => dispatch(editUser(params)),
  showAlertPopup: (message) => dispatch(showAlertPopup(message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditsWithdraw);
