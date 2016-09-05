import React, { Component } from 'react';
import s from './CreditsTopup.css';
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
import CreditsTopupForm from '../CreditsTopupForm';

class CreditsTopup extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { user } = this.props;
    const transactions = null;
    return (
      <div className={s.creditsTopup}>
        <div className={s.creditsTopupSection}>
          <h2>Top Up Credits</h2>
          <CreditsTopupForm />
        </div>
      </div>
    );
  }
}


CreditsTopup.propTypes = {
  user: React.PropTypes.object,

  // fetchLanguages: React.PropTypes.func.isRequired,
  // fetchAddress: React.PropTypes.func.isRequired,
  // getPatients: React.PropTypes.func.isRequired,
  // showDayPickerPopup: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user.data,
});

const mapDispatchToProps = (dispatch) => ({
  // fetchLanguages: () => dispatch(fetchLanguages()),
  // fetchAddress: (postalCode) => dispatch(fetchAddress(postalCode)),
  // getPatients: (params) => dispatch(getPatients(params)),
  // showDayPickerPopup: (value, source) => dispatch(showDayPickerPopup(value, source)),
  // showAlertPopup: (message) => dispatch(showAlertPopup(message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditsTopup);
