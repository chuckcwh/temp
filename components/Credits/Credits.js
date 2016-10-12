import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Loader from 'react-loader';
import FaBank from 'react-icons/lib/fa/bank';
import FaHistory from 'react-icons/lib/fa/history';
import FaGetPocket from 'react-icons/lib/fa/get-pocket';
import FaMoney from 'react-icons/lib/fa/money';
import s from './Credits.css';
import Link from '../Link';
import Container from '../Container';
import Header from '../Header';
import DashboardTableButton from '../DashboardTableButton';
import SideTabList from '../SideTabList';
import SideTab from '../SideTab';
import DayPickerPopup from '../DayPickerPopup';
import CreditsTopup from '../CreditsTopup';
import CreditsTransactions from '../CreditsTransactions';
import CreditsWithdraw from '../CreditsWithdraw';
import CreditsEarnings from '../CreditsEarnings';
import { fetchServices } from '../../actions';
import { isClient, isProvider, getUserCurrentCredits } from '../../core/util';

class Credits extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTabIndex: 0,
    };
  }

  componentDidMount() {
    this.props.fetchServices();
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
                      <SideTab><FaMoney /><span>Earnings / Payouts</span></SideTab>
                      <SideTab><FaGetPocket /><span>Withdraw Credits</span></SideTab>
                      <SideTab><FaHistory /><span>Transaction History</span></SideTab>
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
                      {selectedTabIndex === 0 && <CreditsEarnings />}
                      {selectedTabIndex === 1 && <CreditsWithdraw />}
                      {selectedTabIndex === 2 && <CreditsTransactions />}
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

  fetchServices: React.PropTypes.func,
};

const mapStateToProps = (state) => ({
  user: state.user.data,
});

const mapDispatchToProps = (dispatch) => ({
  fetchServices: () => dispatch(fetchServices()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Credits);
