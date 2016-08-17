import React, { Component } from 'react';
import s from './CreditsWithdraw.css';
import { } from '../../actions';
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

  render() {
    const { user } = this.props;
    const transactions = null;
    return (
      <div className={s.creditsWithdraw}>
        <div className={s.creditsWithdrawSection}>
          <h2>Bank Details</h2>
          <CreditsWithdrawBankForm />
        </div>
        <div className={s.creditsWithdrawSection}>
          <h2>Withdraw Credits</h2>
          <CreditsWithdrawAmountForm />
        </div>
      </div>
    );
  }
}


CreditsWithdraw.propTypes = {
  user: React.PropTypes.object,
  client: React.PropTypes.object,
  nurse: React.PropTypes.object,

  // fetchLanguages: React.PropTypes.func.isRequired,
  // fetchAddress: React.PropTypes.func.isRequired,
  // getPatients: React.PropTypes.func.isRequired,
  // showDayPickerPopup: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  languages: state.languages.data,
  user: state.user.data,
  client: state.user.data && state.user.data.clients && state.user.data.clients.length && state.user.data.clients[0],
  nurse: state.user.data && state.user.data.nurses && state.user.data.nurses.length && state.user.data.nurses[0],
});

const mapDispatchToProps = (dispatch) => ({
  // fetchLanguages: () => dispatch(fetchLanguages()),
  // fetchAddress: (postalCode) => dispatch(fetchAddress(postalCode)),
  // getPatients: (params) => dispatch(getPatients(params)),
  // showDayPickerPopup: (value, source) => dispatch(showDayPickerPopup(value, source)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditsWithdraw);
