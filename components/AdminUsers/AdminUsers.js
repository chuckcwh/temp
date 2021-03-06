import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import 'react-virtualized/styles.css';
import s from './AdminUsers.css';
import Container from '../Container';
import Link from '../Link';
import Header from '../Header';
import history from '../../core/history';
import GenericPopup from '../GenericPopup';
import { getUserName } from '../../core/util';
import { configToName } from '../../core/util';
import { InfiniteLoader, AutoSizer, Table, Column } from 'react-virtualized';
import {
  getUsers,
  showConfirmPopup,
  showGenericPopup,
  hideGenericPopup,
} from '../../actions';
// react-icons
import FaCaretDown from 'react-icons/lib/fa/caret-down';
import FaCaretSquareODown from 'react-icons/lib/fa/caret-square-o-down';
import FaCaretSquareOUp from 'react-icons/lib/fa/caret-square-o-up';
import FaCheck from 'react-icons/lib/fa/check';


const filterChoice = ['role', 'name', 'email', 'contact'];

class AdminUsers extends Component {

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
    this.props.getUsers({
      count: 10,
      page: this.state.page,
    });
  }

  isRowLoaded = ({ index }) => {
    return !!Object.values(this.props.users)[index];
  };

  loadMoreRows = ({startIndex, stopIndex}) => {
    const { sortDirection, filterKwd, filterField } = this.state;
    this.setState({page: this.state.page + 1});

    const data = {
      count: 10,
      page: this.state.page,
    };

    if (Object.keys(sortDirection).length !== 0) {
      data['sorting'] = sortDirection;
    }
    if (filterKwd) {
      data['filter'] = {[filterField]: filterKwd};
    }

    return this.props.getUsers(data, true);
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

    this.props.getUsers(data);
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
    this.props.getUsers({
      count: 10,
      page: 1,
    });
  }

  render() {
    const { users, showGenericPopup, hideGenericPopup } = this.props;
    const { sortDirection, filterField, filterKwd } = this.state;

    return (
      <div className={s.adminUsers}>
        <Header title="User Management" />
        <Container>
          <GenericPopup>
            <h3>Provider Status</h3>
          </GenericPopup>

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
                <input ref="filterKwd" type="text" className={s.textInput} placeholder="Filter keyword" onChange={this.onFilterData} />
              </div>
              <div className={s.inlineField}>
                <span type="text" className={s.clearSortFilter} onClick={this.onClearSortFilter}>
                  clear sort & filter
                </span>
              </div>
            </div>

            {users && (
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
                          this.props.getUsers({
                            count: 10,
                            page: 1,
                            sorting: {...sortDirection, [sortBy]: sortDirection[sortBy] === -1 ? 1 : sortDirection[sortBy] === 1 ? -1 : -1},
                          });
                          this.setState({page: 1, sortDirection: {...sortDirection, [sortBy]: sortDirection[sortBy] === -1 ? 1 : sortDirection[sortBy] === 1 ? -1 : -1}});
                        }}

                        onRowsRendered={onRowsRendered}
                        noRowsRenderer={() => (<div>No data</div>)}
                        rowHeight={100}
                        rowClassName={({index}) => index % 2 === 0 ? s.tableListEvenRow : null}
                        rowCount={Object.values(users).length}
                        rowGetter={({index}) => Object.values(users)[index]}
                      >
                        <Column
                          label="role"
                          headerRenderer={this.setHeaderLabel}
                          dataKey="role"
                          width={75}
                        />
                        <Column
                          label="name"
                          headerRenderer={this.setHeaderLabel}
                          dataKey="name"
                          width={200}
                        />
                        <Column
                          label="email"
                          headerRenderer={this.setHeaderLabel}
                          dataKey="email"
                          width={250}
                        />
                        <Column
                          label="contact"
                          headerRenderer={this.setHeaderLabel}
                          dataKey="contact"
                          cellRenderer={({rowData, cellData}) => {
                            return (
                              <div className={s.contactField}>
                                <div>{cellData}</div>
                                <div>({rowData.contact})</div>
                              </div>
                          )}}
                          width={250}
                        />
                        <Column
                          label="pin verified"
                          headerRenderer={this.setHeaderLabel}
                          dataKey="pinVerified"
                          cellRenderer={({cellData}) => cellData ? <FaCheck /> : null}
                          width={110}
                        />
                        <Column
                          label="edit"
                          headerRenderer={({label}) => <div className={s.headerLabel}>{label}</div>}
                          dataKey="_id"
                          cellRenderer={({rowData, cellData}) => (
                            <div>
                              <Link className={cx('btn', s.tableListBtn, s.bgOrange)} to={`/admin-users/${cellData}`}>
                                View
                              </Link>
                              {rowData.role === 'provider' && (
                                <button className={cx('btn btn-primary', s.tableListBtn, s.bgOrange)} onClick={() => showGenericPopup()}>
                                  Provider Status
                                </button>
                              )}
                            </div>
                          )}
                          disableSort={true}
                          width={250}
                        />
                      </Table>
                    )}
                  </AutoSizer>
                )}
              </InfiniteLoader>
            )}
          </div>

        </Container>
      </div>
    );
  }
}

AdminUsers.propTypes = {
};

const mapStateToProps = (state) => ({
  users: state.users.data,
  // usersTotal: state.users.total,
});

const mapDispatchToProps = (dispatch) => ({
  getUsers: (params, extend) => dispatch(getUsers(params, extend)),
  showConfirmPopup: (body, accept) => dispatch(showConfirmPopup(body, accept)),
  showGenericPopup: (body) => dispatch(showGenericPopup(body)),
  hideGenericPopup: () => dispatch(hideGenericPopup()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminUsers);
