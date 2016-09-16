import React, { Component } from 'react';
import s from './Credits.css';
import { } from '../../actions';
import { connect } from 'react-redux';
import moment from 'moment';
import Link from '../Link';
import Container from '../Container';
import Header from '../Header';
import DashboardTableButton from '../DashboardTableButton';
import SideTabList from '../SideTabList';
import SideTab from '../SideTab';
import DayPickerPopup from '../DayPickerPopup';
import Loader from 'react-loader';
import FaBank from 'react-icons/lib/fa/bank';
import FaHistory from 'react-icons/lib/fa/history';
import FaGetPocket from 'react-icons/lib/fa/get-pocket';
import FaMoney from 'react-icons/lib/fa/money';
import CreditsTopup from '../CreditsTopup';
import CreditsTransactions from '../CreditsTransactions';
import CreditsWithdraw from '../CreditsWithdraw';
import CreditsPayments from '../CreditsPayments';
import { isClient, isProvider, getUserCurrentCredits } from '../../core/util';

class Credits extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTabIndex: 0,
    };
  }

  componentDidMount() {
    // this.props.fetchLanguages();
  }

  handleTabSelect = (index) => {
    this.setState({ selectedTabIndex: index });
  };

  render() {
    const { user } = this.props;
    const { selectedTabIndex } = this.state;
    return (
      <div className={s.credits}>
        <Header title="Credits" />
        <Container>
          <div className={s.creditsWrapper}>
            <div className={s.creditsTabs}>
              <div className="well">
                <p className="featured">You have:</p>
                <h1>{`SGD ${getUserCurrentCredits(user)}`}</h1>
              </div>
              {(() => {
                if (isClient(user)) {
                  return (
                    <SideTabList
                      onSelect={this.handleTabSelect}
                      selectedIndex={this.state.selectedTabIndex}
                      selectable
                    >
                      <SideTab><FaBank /><span>Top Up Credits</span></SideTab>
                      <SideTab><FaHistory /><span>Transaction History</span></SideTab>
                      <SideTab><FaGetPocket /><span>Withdraw Credits</span></SideTab>
                    </SideTabList>
                  );
                } else if (isProvider(user)) {
                  return (
                    <SideTabList
                      onSelect={this.handleTabSelect}
                      selectedIndex={this.state.selectedTabIndex}
                      selectable
                    >
                      <SideTab><FaHistory /><span>Transaction History</span></SideTab>
                      <SideTab><FaGetPocket /><span>Withdraw Credits</span></SideTab>
                      <SideTab><FaMoney /><span>Payments</span></SideTab>
                    </SideTabList>
                  );
                }
              })()}
            </div>
            <div className={s.creditsPanel}>
              {(() => {
                if (isClient(user)) {
                  return (
                    <div>
                      {selectedTabIndex === 0 && <CreditsTopup />}
                      {selectedTabIndex === 1 && <CreditsTransactions />}
                      {selectedTabIndex === 2 && <CreditsWithdraw />}
                    </div>
                  );
                } else if (isProvider(user)) {
                  return (
                    <div>
                      {selectedTabIndex === 0 && <CreditsTransactions />}
                      {selectedTabIndex === 1 && <CreditsWithdraw />}
                      {selectedTabIndex === 2 && <CreditsPayments />}
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        </Container>
      </div>
    );
  }
}


Credits.propTypes = {
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
});

export default connect(mapStateToProps, mapDispatchToProps)(Credits);
