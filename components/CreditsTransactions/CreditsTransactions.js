import React, { Component } from 'react';
import s from './CreditsTransactions.css';
import { connect } from 'react-redux';
import moment from 'moment';
import Loader from 'react-loader';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Link from '../Link';
import Container from '../Container';
import Header from '../Header';
import DashboardDataTable from '../DashboardDataTable';
import DashboardTableButton from '../DashboardTableButton';
import SideTabList from '../SideTabList';
import SideTab from '../SideTab';
import DayPickerPopup from '../DayPickerPopup';
import { getTransactions } from '../../actions';
import { configToName } from '../../core/util';

class CreditsTransactions extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.user && this.props.user._id) {
      this.props.getTransactions({
        user: this.props.user._id,
      });
    }
  }

  render() {
    const { config, user, transactions, transactionsFetching } = this.props;
    return (
      <div className={s.creditsTransactions}>
        <h2>Transaction History</h2>
        {(() => {
          if (transactions && Object.values(transactions) && Object.values(transactions).length > 0) {
            return (
              <DashboardDataTable css={s}>
                <Grid fluid className={s.dashboardDataTable}>
                  <Row className={s.lgHeader}>
                    <Col md={3}>ID</Col>
                    <Col md={2}>Date</Col>
                    <Col md={2}>Type</Col>
                    <Col md={2}>Method</Col>
                    <Col md={1}>Amount</Col>
                    <Col md={2}>Status</Col>
                  </Row>
                  {
                    Object.values(transactions).map(transaction => (
                      <Row className={s.creditsTransactionsTableRow} key={transaction._id}>
                        <Col xs={4}>ID</Col>
                        <Col xs={8} md={3}>{transaction._id}</Col>
                        <Col xs={4}>Date</Col>
                        <Col xs={8} md={2}>{moment(transaction.createdAt).format('ll')}</Col>
                        <Col xs={4}>Type</Col>
                        <Col xs={8} md={2}>
                          {configToName(config, 'transactionTypesByValue', transaction.transactionType)}
                        </Col>
                        <Col xs={4}>Method</Col>
                        <Col xs={8} md={2}>
                          {configToName(config, 'transactionModesByValue', transaction.mode)}
                        </Col>
                        <Col xs={4}>Amount</Col>
                        <Col xs={8} md={1}>{`$${parseFloat(transaction.value).toFixed(2)}`}</Col>
                        <Col xs={4}>Status</Col>
                        <Col xs={8} md={2}>
                          {configToName(config, 'transactionStatusesByValue', transaction.status)}
                        </Col>
                      </Row>
                    ))
                  }
                </Grid>
              </DashboardDataTable>
            );
          } else {
            return <p>No transactions found.</p>;
          }
        })()}
      </div>
    );
  }
}


CreditsTransactions.propTypes = {
  config: React.PropTypes.object,
  user: React.PropTypes.object,
  transactions: React.PropTypes.object,
  transactionsFetching: React.PropTypes.bool,

  getTransactions: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  config: state.config.data,
  user: state.user.data,
  transactions: state.user.data && state.user.data._id &&
    state.transactionsByUser &&
    state.transactionsByUser[state.user.data._id] &&
    state.transactionsByUser[state.user.data._id].data,
  transactionsFetching: state.user.data && state.user.data._id &&
    state.transactionsByUser &&
    state.transactionsByUser[state.user.data._id] &&
    state.transactionsByUser[state.user.data._id].isFetching,
});

const mapDispatchToProps = (dispatch) => ({
  getTransactions: (params) => dispatch(getTransactions(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditsTransactions);
