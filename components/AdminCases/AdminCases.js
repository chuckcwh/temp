import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import 'react-virtualized/styles.css';
import s from './AdminCases.css';
import Container from '../Container';
import Link from '../Link';
import Header from '../Header';
import { InfiniteLoader, AutoSizer, Table, Column } from 'react-virtualized';
import { getSessions } from '../../actions';
import { formatSessionAlias, configToName } from '../../core/util';
// Sub Component
import AdminCasesForm from './AdminCasesForm/AdminCasesForm';
// react-icons
import FaCaretDown from 'react-icons/lib/fa/caret-down';
import FaCaretSquareODown from 'react-icons/lib/fa/caret-square-o-down';
import FaCaretSquareOUp from 'react-icons/lib/fa/caret-square-o-up';
import FaCheck from 'react-icons/lib/fa/check';


const filterChoice = ['phase', 'alias', 'client', 'patient', 'price', 'status']; //TODO: update fields

class AdminCases extends Component {

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
    this.props.getSessions({
      count: 10,
      page: this.state.page
    }, true);
  }

  isRowLoaded = ({ index }) => {
    return !!Object.values(this.props.sessions)[index];
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

    return this.props.getSessions(data, true);
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

    this.props.getSessions(data);
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
    this.props.getSessions({
      count: 10,
      page: 1,
    });
  }

  render() {
    const { add, edit, sessionId } = this.props.params;
    const { user, sessions, config } = this.props;
    const { sortDirection, filterField, filterKwd } = this.state;

    return (
      <div className={s.adminCases}>
        <Header title={add && "Add Booking" || edit && "Edit Case" || "Case Management"} />
        <Container>

          {user && add && <AdminCasesForm />}

          {user && edit && <AdminCasesForm edit={true} sessionId={sessionId} />}

          {user && !add && !edit && (
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
                          this.props.getSessions({
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
                        rowCount={Object.values(sessions).length}
                        rowGetter={({index}) => Object.values(sessions)[index]}
                      >
                        <Column
                          label="phase"
                          headerRenderer={this.setHeaderLabel}
                          dataKey="phase"
                          cellRenderer={({cellData}) => configToName(config, 'sessionPhasesByValue', cellData)}
                          width={190}
                        />
                        <Column
                          label="alias"
                          headerRenderer={this.setHeaderLabel}
                          dataKey="alias"
                          cellRenderer={({cellData}) => formatSessionAlias(cellData)}
                          width={90}
                        />
                        <Column
                          label="adhoc"
                          headerRenderer={this.setHeaderLabel}
                          dataKey="isAdhoc"
                          cellRenderer={({cellData}) => cellData ? <FaCheck /> : null}
                          width={80}
                        />
                        <Column
                          label="client"
                          headerRenderer={this.setHeaderLabel}
                          dataKey="client"
                          cellRenderer={({cellData}) => cellData && cellData.name}
                          width={130}
                        />
                        <Column
                          label="patient"
                          headerRenderer={this.setHeaderLabel}
                          dataKey="patient"
                          cellRenderer={({cellData}) => cellData && cellData.name}
                          width={130}
                        />
                        <Column
                          label="price"
                          headerRenderer={this.setHeaderLabel}
                          dataKey="price"
                          cellRenderer={({cellData}) => `$ ${parseFloat(cellData).toFixed(2)}`}
                          width={100}
                        />
                        <Column
                          label="created at"
                          headerRenderer={this.setHeaderLabel}
                          dataKey="createdAt"
                          cellRenderer={({cellData}) => moment(cellData).format('YYYY-MM-DD')}
                          width={130}
                        />
                        <Column
                          label="view"
                          headerRenderer={({label}) => <div className={s.headerLabel}>{label}</div>}
                          dataKey="_id"
                          cellRenderer={({cellData}) => (
                            <Link className={cx('btn', s.tableListToEdit)} to={`/admin-cases/edit/${cellData}`}>
                              Edit
                            </Link>
                          )}
                          disableSort={true}
                          width={80}
                        />
                        <Column
                          label="status"
                          headerRenderer={this.setHeaderLabel}
                          dataKey="status"
                          cellRenderer={({cellData}) => {
                            let statusClass;
                            switch (cellData) {
                              case 'open':
                              case 'engaged':
                                statusClass = s.tableListStatusOpen;
                                break;
                              case 'cancelled':
                              case 'completed':
                                statusClass = s.tableListStatusCancelled;
                                break;
                              case 'expired':
                              case 'suspended':
                                statusClass = s.tableListStatusExpired;
                                break;
                              default:
                                break;
                            }
                            return (
                              <div className={cx('btn', s.tableListStatus, statusClass)}>{cellData}</div>
                          )}}
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

AdminCases.propTypes = {
};

const mapStateToProps = (state) => ({
  user: state.user.data,
  sessions: state.sessions.data,
  config: state.config.data,
});

const mapDispatchToProps = (dispatch) => ({
  getSessions: (params, extend) => dispatch(getSessions(params, extend)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminCases);
