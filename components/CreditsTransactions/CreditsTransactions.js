import React, { Component } from 'react';
import s from './CreditsTransactions.css';
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

class CreditsTransactions extends Component {

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
      <div className={s.creditsTransactions}>
        <h2>Transaction History</h2>
        {(() => {
          if (transactions) {
            return (
              <table class="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Method</th>
                    <th>Amount</th>
                    <th>Reference No.</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                {
                  transactions.map(transaction => (
                    <tr class="odd gradeX" key={transaction.id}>
                      <td>{moment(transaction.transactionDate).format('ll')}</td>
                      <td>{transaction.type}</td>
                      <td>{transaction.method}</td>
                      <td>{transaction.amount}</td>
                      <td>{transaction.paymentID}</td>
                      <td>{transaction.status}</td>
                    </tr>
                  ))
                }
                </tbody>
              </table>
            );
          } else {
            return <p>No transaction history found.</p>;
          }
        })()}
      </div>
    );
  }
}


CreditsTransactions.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(CreditsTransactions);