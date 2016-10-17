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
import { InfiniteLoader, AutoSizer, Table, Column } from 'react-virtualized';
import { getTransactions } from '../../actions';
// react-icons
import FaCaretDown from 'react-icons/lib/fa/caret-down';
import FaCaretSquareODown from 'react-icons/lib/fa/caret-square-o-down';
import FaCaretSquareOUp from 'react-icons/lib/fa/caret-square-o-up';


const filterChoice = ['code', 'name'];

class AdminTransactions extends Component {

  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      sortDirection: {},
      filterKwd: null,
      filterField: filterChoice[0],
    }
  }

  componentDidMount() {
    this.props.getTransactions({
      count: 10,
      page: this.state.page,
    });
  }

  isRowLoaded = ({ index }) => {
    return !!Object.values(this.props.transactions)[index];
  }

  loadMoreRows = ({startIndex, stopIndex}) => {
    const { sortDirection, filterKwd, filterField } = this.state;
    this.setState({page: this.state.page + 1});

    const data = {
      count: 10,
      page: this.state.page,
    }

    if (Object.keys(sortDirection).length !== 0) {
      data['sorting'] = sortDirection;
    }
    if (filterKwd) {
      data['filter'] = {[filterField]: filterKwd};
    }

    return this.props.getTransactions(data, true);
  }

  setHeaderLabel = ({dataKey, label}) => {
    const {sortDirection} = this.state;
    const arrow = sortDirection[dataKey] === 1 ? <FaCaretSquareODown /> : sortDirection[dataKey] === -1 ? <FaCaretSquareOUp />  : <FaCaretDown />;
    return (
      <div>{label}  {arrow}</div>
  )}

  onFilterData = (e) => {
    e.preventDefault();

    const { sortDirection, filterField } = this.state;
    const { value } = e.target;
    this.setState({page: 1, filterKwd: value});

    const data = {
      count: 10,
      page: 1,
      filter: {[filterField]: value},
    }

    if (Object.keys(sortDirection).length !== 0) {
      data['sorting'] = sortDirection;
    }

    this.props.getTransactions(data);
  }

  onClearSortFilter = () => {
    this.setState({
      page: 1,
      sortDirection: {},
      filterKwd: null,
      filterField: filterChoice[0],
    });

    this.refs.filterField.value = filterChoice[0];
    this.refs.filterKwd.value = "";
    this.props.getTransactions({
      count: 10,
      page: 1,
    });
  }

  render() {
    const { add, edit, transactionId } = this.props.params;
    const { user, transactions } = this.props;
    const { sortDirection, filterField, filterKwd } = this.state;

    return (
      <div className={s.adminTransactions}>
        <Header title="Transactions Management" />
        <Container>

          {user && add && <AdminTransactionsForm />}

          {user && !add && !edit && (
            <div>
              <div className={s.addLink}>
                <Link
                  className={cx('btn', 'btn-primary')}
                  to="/admin-transactions/add">
                  New Transaction
                </Link>
              </div>

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
                  <input ref="filterKwd" type="text" className={s.textInput} placeholder="Filter keyword" onChange={this.onFilterData} />
                </div>
                <div className={s.inlineField}>
                  <span type="text" className={s.clearSortFilter} onClick={this.onClearSortFilter}>
                    clear sort & filter
                  </span>
                </div>
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
                        rowClassName={s.tableListRow}
                        rowCount={Object.values(transactions).length}
                        rowGetter={({index}) => Object.values(transactions)[index]}
                      >
                        <Column
                          label="created at"
                          headerRenderer={this.setHeaderLabel}
                          dataKey="createdAt"
                          cellRenderer={({cellData}) => moment(cellData).format('YYYY-MM-DD')}
                          width={150}
                        />
                        <Column
                          label="value"
                          headerRenderer={this.setHeaderLabel}
                          dataKey="value"
                          width={150}
                        />
                        <Column
                          label="user payment"
                          headerRenderer={this.setHeaderLabel}
                          dataKey="user payment"
                          width={150}
                        />
                        <Column
                          label="status"
                          headerRenderer={this.setHeaderLabel}
                          dataKey="status"
                          width={150}
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
};

const mapStateToProps = (state) => ({
  user: state.user.data,
  transactions: state.transactions.data,
});

const mapDispatchToProps = (dispatch) => ({
  getTransactions: (params, extend) => dispatch(getTransactions(params, extend)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminTransactions);
