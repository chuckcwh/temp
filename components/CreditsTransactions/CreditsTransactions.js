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

  render() {
    const { user } = this.props;
    const transactions = null;
    return (
      <div className={s.creditsTransactions}>
        <h2>Transaction History</h2>
        {(() => {
          if (transactions) {
            return (
              <DashboardDataTable css={s}>
                <Grid fluid className={s.dashboardDataTable}>
                  <Row className={s.lgHeader}>
                    <Col md={2}>ID</Col>
                    <Col md={2}>Date</Col>
                    <Col md={2}>Type</Col>
                    <Col md={2}>Method</Col>
                    <Col md={2}>Amount</Col>
                    <Col md={2}>Status</Col>
                  </Row>
                  {
                    transactions.map(transaction => (
                      <Row className={s.creditsTransactionsTableRow} key={transaction._id}>
                        <Col xs={4}>ID</Col>
                        <Col xs={8} md={2}>{transaction._id}</Col>
                        <Col xs={4}>Date</Col>
                        <Col xs={8} md={2}>{moment(transaction.createdAt).format('ll')}</Col>
                        <Col xs={4}>Mode</Col>
                        <Col xs={8} md={2}>{transaction.transactionType}</Col>
                        <Col xs={4}>Method</Col>
                        <Col xs={8} md={2}>{transaction.mode}</Col>
                        <Col xs={4}>Amount</Col>
                        <Col xs={8} md={2}>{`$${parseFloat(transaction.value).toFixed(2)}`}</Col>
                        <Col xs={4}>Status</Col>
                        <Col xs={8} md={2}>
                          {configToName(config, 'transactionStatusesByValue', session.status)}
                        </Col>
                      </Row>
                    ))
                  }
                </Grid>
              </DashboardDataTable>
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

  // fetchAddress: React.PropTypes.func.isRequired,
  // getPatients: React.PropTypes.func.isRequired,
  // showDayPickerPopup: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user.data,
});

const mapDispatchToProps = (dispatch) => ({
  // fetchAddress: (postalCode) => dispatch(fetchAddress(postalCode)),
  // getPatients: (params) => dispatch(getPatients(params)),
  // showDayPickerPopup: (value, source) => dispatch(showDayPickerPopup(value, source)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditsTransactions);
