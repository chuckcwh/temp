import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import 'react-virtualized/styles.css';
import s from './AdminTransactions.css';
import Container from '../Container';
import Link from '../Link';
import Header from '../Header';
import linkState from 'react-link-state';
import { InfiniteLoader, AutoSizer, Table, Column } from 'react-virtualized';
import { isAdmin } from '../../core/util';
import {
  TRANSACTION_APPROVE_SUCCESS,
  showAlertPopup,
  getTransactions,
  approveTransaction
} from '../../actions';
// react-icons
import FaCaretDown from 'react-icons/lib/fa/caret-down';
import FaCaretSquareODown from 'react-icons/lib/fa/caret-square-o-down';
import FaCaretSquareOUp from 'react-icons/lib/fa/caret-square-o-up';


const filterChoice = ['mode', 'status'];

class AdminTransactions extends Component {

  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      sortDirection: {},
      filterKwd: null,
      filterField: filterChoice[0],
      showPendingTransaction: false,
    }
  }

  componentDidMount() {
    this.onGetTransactions();
  }

  onApproveTransaction = (transactionId) => {
    console.log('do approve', transactionId);
    const { approveTransaction, showAlertPopup } = this.props;

    approveTransaction({transactionId}).then(res => {
      if (res.type === TRANSACTION_APPROVE_SUCCESS) {
        showAlertPopup('Successfully approve transaction');
      } else {
        showAlertPopup('Failed to approve transaction');
      }
    })
  }

  isRowLoaded = ({ index }) => {
    return !!Object.values(this.props.transactions)[index];
  }

  loadMoreRows = ({startIndex, stopIndex}) => {
    const { sortDirection, filterKwd, filterField, showPendingTransaction } = this.state;
    this.setState({page: this.state.page + 1}, () => this.onGetTransactions(true));
  }

  setHeaderLabel = ({dataKey, label}) => {
    const {sortDirection} = this.state;
    const arrow = sortDirection[dataKey] === 1 ? <FaCaretSquareODown /> : sortDirection[dataKey] === -1 ? <FaCaretSquareOUp />  : <FaCaretDown />;
    return (
      <div>{label}  {arrow}</div>
  )}

  onClearSortFilter = () => {
    this.setState({
      page: 1,
      sortDirection: {},
      filterKwd: null,
      filterField: filterChoice[0],
    }, this.onGetTransactions());

    this.refs.filterField.value = filterChoice[0];
    this.refs.filterKwd.value = "";
  }

  onGetTransactions = (extend = false) => {
    const { sortDirection, filterKwd, filterField, page, showPendingTransaction } = this.state;
    const data = {
      count: 10,
      page: page,
      filter: {},
    }

    if (Object.keys(sortDirection).length !== 0) {
      data['sorting'] = sortDirection;
    }
    if (filterKwd) {
      data['filter'][filterField] = filterKwd;
    }
    if (showPendingTransaction) {
      data['filter']['status'] = 'pending';
    }

    this.props.getTransactions(data, extend);
  }

  render() {
    const { transactionId } = this.props.params;
    const { user, transactions } = this.props;
    const { sortDirection, filterField, filterKwd, showPendingTransaction } = this.state;
    console.log('showPendingTransaction', showPendingTransaction);
    return (
      <div className={s.adminTransactions}>
        <Header title="Transactions Management" />
        <Container>
          {isAdmin(user) && (
            <div>
              <div className={s.filter}>
                <div className={s.inlineField}>
                  <div className={cx("select", s.filterInput)}>
                    <span></span>
                    <select ref="filterField" className={s.filterInputInner} name={filterField} onChange={(e) => this.setState({filterField: e.target.value})}>
                      {filterChoice && filterChoice.map(item => (
                        <option key={filterChoice.indexOf(item)} value={item}>{item}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className={s.inlineField}>
                  <input
                    ref="filterKwd"
                    type="text"
                    className={s.textInput}
                    placeholder="Filter keyword"
                    onChange={e => this.setState({page: 1, filterKwd: e.target.value}, () => this.onGetTransactions())}
                  />
                </div>
                <div className={s.inlineField}>
                  <span type="text" className={s.clearSortFilter} onClick={this.onClearSortFilter}>
                    clear sort & filter
                  </span>
                </div>
              </div>

              <div>
                <input
                  type="checkbox"
                  id="pendingTransactions"
                  name="pendingTransactions"
                  onChange={e => {
                    this.setState({
                    page: 1,
                    showPendingTransaction: !showPendingTransaction
                  }, () => this.onGetTransactions())}}
                  value={showPendingTransaction}
                />
              <label htmlFor="pendingTransactions"><span></span><span>show only pending transactions</span></label>
              </div>

              <InfiniteLoader
                isRowLoaded={this.isRowLoaded}
                loadMoreRows={this.loadMoreRows}
                rowCount={10000}
              >
                {({ onRowsRendered, registerChild }) => (

                  <AutoSizer disableHeight>
                    {({width}) => (
                      <Table
                        ref={registerChild}
                        className={s.tableList}
                        height={400}
                        width={width}

                        headerClassName={s.tableListHeader}
                        headerHeight={30}
                        sort={({sortBy}) => {
                          this.props.getTransactions({
                            count: 10,
                            page: 1,
                            sorting: {...sortDirection, [sortBy]: sortDirection[sortBy] === -1 ? 1 : sortDirection[sortBy] === 1 ? -1 : -1},
                          });
                          this.setState({page: 1, sortDirection: {...sortDirection, [sortBy]: sortDirection[sortBy] === -1 ? 1 : sortDirection[sortBy] === 1 ? -1 : -1}});
                        }}

                        onRowsRendered={onRowsRendered}
                        noRowsRenderer={() => (<div>No data</div>)}
                        rowHeight={50}
                        rowClassName={({index}) => index % 2 === 0 ? s.tableListEvenRow : null}
                        rowCount={Object.values(transactions).length}
                        rowGetter={({index}) => Object.values(transactions)[index]}
                      >
                        <Column
                          label="created at"
                          headerRenderer={this.setHeaderLabel}
                          dataKey="createdAt"
                          cellRenderer={({cellData}) => moment(cellData).format('YYYY-MM-DD')}
                          width={110}
                        />
                        <Column
                          label="mode"
                          headerRenderer={this.setHeaderLabel}
                          dataKey="mode"
                          width={100}
                        />
                        <Column
                          label="value"
                          headerRenderer={this.setHeaderLabel}
                          dataKey="value"
                          width={100}
                        />
                        <Column
                          label="payer"
                          headerRenderer={this.setHeaderLabel}
                          dataKey="payment"
                          cellRenderer={({cellData}) => cellData && cellData.payer && cellData.payer.payer_info && `${cellData.payer.payer_info.first_name} ${cellData.payer.payer_info.last_name}`}
                          width={150}
                        />
                        <Column
                          label="transaction type"
                          headerRenderer={this.setHeaderLabel}
                          dataKey="transactionType"
                          width={170}
                        />
                        <Column
                          label="status"
                          headerRenderer={this.setHeaderLabel}
                          dataKey="status"
                          width={150}
                        />
                        <Column
                          label="approve"
                          headerRenderer={({label}) => <div className={s.headerLabel}>{label}</div>}
                          dataKey="_id"
                          cellRenderer={({rowData, cellData}) => {
                            return rowData.status === 'pending' && (
                              <div className={cx('btn', s.tableListBtn, s.green)} onClick={() => this.onApproveTransaction(cellData)}>Approve</div>
                          )}}
                          width={100}
                        />
                      </Table>
                    )}
                  </AutoSizer>
                )}
              </InfiniteLoader>

            </div>
          )}

        </Container>
      </div>
    );
  }
}

AdminTransactions.propTypes = {
  transactions:React.PropTypes.object.isRequired,
  user: React.PropTypes.object.isRequired,

  showAlertPopup: React.PropTypes.func.isRequired,
  approveTransaction: React.PropTypes.func.isRequired,
  getTransactions: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user.data,
  transactions: state.transactions.data,
});

const mapDispatchToProps = (dispatch) => ({
  getTransactions: (params, extend) => dispatch(getTransactions(params, extend)),
  approveTransaction: (params) => dispatch(approveTransaction(params)),
  showAlertPopup: (message) => dispatch(showAlertPopup(message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminTransactions);
