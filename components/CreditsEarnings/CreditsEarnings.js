import React, { Component } from 'react';
import s from './CreditsEarnings.css';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import moment from 'moment';
import Link from '../Link';
import Container from '../Container';
import Header from '../Header';
import DashboardTableButton from '../DashboardTableButton';
import SideTabList from '../SideTabList';
import SideTab from '../SideTab';
import { getApplications, getTransactions } from '../../actions';
import { configToName, formatSessionAlias, isProvider } from '../../core/util';

class CreditsEarnings extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.user && isProvider(this.props.user)
      && this.props.getApplications({
        provider: this.props.user._id,
      })
      && this.props.getTransactions({
        user: this.props.user._id,
      });
  }

  render() {
    const { config, user, applications, applicationsFetching, transactions, transactionsFetching } = this.props;
    const pendingApplications = applications && Object.values(applications).filter(application =>
      application.status === 'accepted');
    const completedApplications = applications && Object.values(applications).filter(application =>
      application.status === 'completed');
    const paidTransactions = transactions && Object.values(transactions).filter(transaction =>
      transaction.transactionType === 'session-payment' && transaction.status === 'completed');
    const futureAmount = pendingApplications.reduce((result, application) => {
      return result + application.session.price;
    }, 0);
    const pendingAmount = completedApplications.reduce((result, application) => {
      return result + application.session.price;
    }, 0);
    const paidAmount = paidTransactions.reduce((result, transaction) => {
      return result + transaction.value;
    }, 0);
    return (
      <div className={s.creditsEarnings}>
        <h2>Future Earnings</h2>
        <h3>TOTAL: SGD {parseFloat(futureAmount).toFixed(2)}</h3>
        {(() => {
          if (pendingApplications && pendingApplications.length) {
            return (
              <table class="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th>Session ID</th>
                    <th>Visit Date</th>
                    <th>Visit Time</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                {
                  pendingApplications.map(application => (
                    <tr class="odd gradeX" key={application._id}>
                      <td>{formatSessionAlias(application.session.alias)}</td>
                      <td>{moment(application.session.date).format('ll')}</td>
                      <td>{configToName(config, 'timeSlotsByValue', application.session.timeSlot)}</td>
                      <td>{`SGD ${parseFloat(application.price).toFixed(2)}`}</td>
                      <td>{configToName(config, 'sessionStatusesByValue', application.session.status)}</td>
                    </tr>
                  ))
                }
                </tbody>
              </table>
            );
          }
        })()}
        <h2>Pending Payouts</h2>
        <h3>TOTAL: SGD {parseFloat(pendingAmount).toFixed(2)}</h3>
        {(() => {
          if (completedApplications && completedApplications.length) {
            return (
              <table class="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th>Session ID</th>
                    <th>Visit Date</th>
                    <th>Visit Time</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                {
                  completedApplications.map(application => (
                    <tr class="odd gradeX" key={application._id}>
                      <td>{formatSessionAlias(application.session.alias)}</td>
                      <td>{moment(application.session.date).format('ll')}</td>
                      <td>{configToName(config, 'timeSlotsByValue', application.session.timeSlot)}</td>
                      <td>{`SGD ${parseFloat(application.price).toFixed(2)}`}</td>
                      <td>{application.status}</td>
                    </tr>
                  ))
                }
                </tbody>
              </table>
            );
          }
        })()}
        <h2>Completed Payouts</h2>
        <h3>TOTAL: SGD {parseFloat(paidAmount).toFixed(2)}</h3>
        {(() => {
          if (paidTransactions && paidTransactions.length) {
            return (
              <table class="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th>Session ID</th>
                    <th>Payment Date</th>
                    <th>Method</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                {
                  paidTransactions.map(transaction => {
                    transaction.sessions && transaction.sessions.map(session => (
                      <tr class="odd gradeX" key={session._id}>
                        <td>{formatSessionAlias(session.alias)}</td>
                        <td>{moment(transaction.date).format('ll')}</td>
                        <td>{configToName(config, 'transactionModesByValue', transaction.mode)}</td>
                        <td>{`SGD ${parseFloat(transaction.value).toFixed(2)}`}</td>
                      </tr>
                    ))
                  })
                }
                </tbody>
              </table>
            );
          }
        })()}
      </div>
    );
  }
}


CreditsEarnings.propTypes = {
  config: React.PropTypes.object,
  user: React.PropTypes.object,
  applications: React.PropTypes.object,
  applicationsFetching: React.PropTypes.bool,

  getApplications: React.PropTypes.func.isRequired,
  getTransactions: React.PropTypes.func.isRequired,
  // fetchAddress: React.PropTypes.func.isRequired,
  // getPatients: React.PropTypes.func.isRequired,
  // showDayPickerPopup: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  config: state.config.data,
  user: state.user.data,
  applications: state.user.data && state.user.data._id
    && state.applicationsByProvider[state.user.data._id]
    && state.applicationsByProvider[state.user.data._id].data,
  applicationsFetching: state.user.data && state.user.data._id
    && state.applicationsByProvider[state.user.data._id]
    && state.applicationsByProvider[state.user.data._id].isFetching,
  transactions: state.user.data && state.user.data._id
    && state.transactionsByUser[state.user.data._id]
    && state.transactionsByUser[state.user.data._id].data,
  transactionsFetching: state.user.data && state.user.data._id
    && state.transactionsByUser[state.user.data._id]
    && state.transactionsByUser[state.user.data._id].isFetching,
});

const mapDispatchToProps = (dispatch) => ({
  getApplications: (params) => dispatch(getApplications(params)),
  getTransactions: (params) => dispatch(getTransactions(params)),
  // fetchAddress: (postalCode) => dispatch(fetchAddress(postalCode)),
  // getPatients: (params) => dispatch(getPatients(params)),
  // showDayPickerPopup: (value, source) => dispatch(showDayPickerPopup(value, source)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditsEarnings);
