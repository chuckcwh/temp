import React, { Component } from 'react';
import s from './CreditsTopup.css';
import { setPostStatus, showDayPickerPopup } from '../../actions';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import moment from 'moment';
import Link from '../Link';
import Container from '../Container';
import Header from '../Header';
import DayPickerPopup from '../DayPickerPopup';
import DashboardTableButton from '../DashboardTableButton';
import SideTabList from '../SideTabList';
import SideTab from '../SideTab';
import CreditsTopupForm from '../CreditsTopupForm';
import history from '../../core/history';

class CreditsTopup extends Component {

  constructor(props) {
    super(props);
  }

  handleSubmit = (values) => {
    return new Promise((resolve, reject) => {
      this.props.setPostStatus(`payment-${values.mode}`);
      history.push({ pathname: '/credits-payment', query: {
        deposit: values.deposit,
      } });
    });
  };

  render() {
    const { user, showDayPickerPopup } = this.props;
    const transactions = null;
    return (
      <div className={s.creditsTopup}>
        <div className={s.creditsTopupSection}>
          <h2>Top Up Credits</h2>
          <CreditsTopupForm
            user={user}
            showDayPickerPopup={showDayPickerPopup}
            onSubmit={this.handleSubmit}
          />
        </div>
        <DayPickerPopup title="Transaction Date" />
      </div>
    );
  }
}


CreditsTopup.propTypes = {
  user: React.PropTypes.object,

  // fetchLanguages: React.PropTypes.func.isRequired,
  // fetchAddress: React.PropTypes.func.isRequired,
  setPostStatus: React.PropTypes.func.isRequired,
  showDayPickerPopup: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user.data,
});

const mapDispatchToProps = (dispatch) => ({
  // fetchLanguages: () => dispatch(fetchLanguages()),
  // fetchAddress: (postalCode) => dispatch(fetchAddress(postalCode)),
  setPostStatus: (params) => dispatch(setPostStatus(params)),
  showDayPickerPopup: (value, source) => dispatch(showDayPickerPopup(value, source)),
  // showAlertPopup: (message) => dispatch(showAlertPopup(message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditsTopup);
