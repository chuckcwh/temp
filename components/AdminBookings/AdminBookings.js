import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import 'react-virtualized/styles.css';
import s from './AdminBookings.css';
import Container from '../Container';
import Link from '../Link';
import Header from '../Header';
import { InfiniteLoader, AutoSizer, Table, Column } from 'react-virtualized';
import { getBookings, fetchServices } from '../../actions';
import { configToName } from '../../core/util';
// react-icons
import FaCaretDown from 'react-icons/lib/fa/caret-down';
import FaCaretSquareODown from 'react-icons/lib/fa/caret-square-o-down';
import FaCaretSquareOUp from 'react-icons/lib/fa/caret-square-o-up';
import FaCheck from 'react-icons/lib/fa/check';


const filterChoice = ['status']; //TODO: update fields

class AdminBookings extends Component {

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
    this.props.fetchServices();
    this.props.getBookings({
      count: 10,
      page: this.state.page
    });
  }

  isRowLoaded = ({ index }) => {
    return !!Object.values(this.props.bookings)[index];
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

    return this.props.getBookings(data, true);
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

    this.props.getBookings(data);
  }

  onClearSortFilter = () => {
    this.setState({
      page: 1,
      sortDirection: {},
      filterKwd: null,
      filterField: filterChoice[0],
    });

    this.filterField.value = filterChoice[0];
    this.filterKwd.value = "";
    this.props.getBookings({
      count: 10,
      page: 1,
    });
  }

  render() {
    const { user, bookings, config, services } = this.props;
    const { sortDirection, filterField, filterKwd } = this.state;

    return (
      <div className={s.adminBookings}>
        <Header title="Booking Management" />
        <Container>

          {user && (
            <div>
              <div className={s.addLink}>
                <Link
                  className={cx("btn", "btn-primary", s.addLink)}
                  to="/admin-bookings/add">
                  New Booking
                </Link>
              </div>

              <div className={s.filter}>
                <div className={s.inlineField}>
                  <div className={cx("select", s.filterInput)}>
                    <span></span>
                    <select ref={(c) => this.filterField = c} className={s.filterInputInner} name={filterField} onChange={(e) => this.setState({filterField: e.target.value})}>
                      {filterChoice && filterChoice.map(item => (
                        <option key={filterChoice.indexOf(item)} value={item}>{item}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className={s.inlineField}>
                  <input ref={(c) => this.filterKwd = c} type="text" className={s.textInput} placeholder="Filter keyword" onChange={this.onFilterData} />
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
                          this.props.getBookings({
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
                        rowCount={Object.values(bookings).length}
                        rowGetter={({index}) => Object.values(bookings)[index]}
                      >
                        <Column
                          label="adhoc"
                          headerRenderer={this.setHeaderLabel}
                          dataKey="isAdhoc"
                          cellRenderer={({cellData}) => cellData ? <FaCheck /> : null}
                          width={75}
                        />
                        <Column
                          label="client"
                          headerRenderer={this.setHeaderLabel}
                          dataKey="client"
                          cellRenderer={({cellData}) => cellData && cellData.name}
                          width={120}
                        />
                        <Column
                          label="patient"
                          headerRenderer={this.setHeaderLabel}
                          dataKey="patient"
                          cellRenderer={({cellData}) => cellData && cellData.name}
                          width={120}
                        />
                        <Column
                          label="service"
                          dataKey="sessions"
                          cellRenderer={({cellData}) => {
                            const serviceName = cellData && cellData[0].service && Object.keys(services).length > 0 && services[cellData[0].service].name;
                            const serviceClassName = cellData && cellData[0].serviceClass && Object.keys(services).length > 0 && services[cellData[0].service].classes[cellData[0].serviceClass].duration;
                            return serviceName && `${serviceName} (${serviceClassName} hr${parseFloat(serviceClassName) > 1 ? 's' : ''})`
                          }}
                          width={200}
                        />
                        <Column
                          label="verified"
                          headerRenderer={this.setHeaderLabel}
                          dataKey="isVerified"
                          cellRenderer={({cellData}) => cellData ? <FaCheck /> : null}
                          width={80}
                        />
                        <Column
                          label="view"
                          headerRenderer={({label}) => <div className={s.headerLabel}>{label}</div>}
                          dataKey="_id"
                          cellRenderer={({cellData}) => (
                            <Link className={cx("btn", s.tableListToEdit)} to={`/admin-bookings/view/${cellData}`}>
                              Edit
                            </Link>
                          )}
                          disableSort={true}
                          width={90}
                        />
                        <Column
                          label="created at"
                          headerRenderer={this.setHeaderLabel}
                          dataKey="createdAt"
                          cellRenderer={({cellData}) => moment(cellData).format('YYYY-MM-DD')}
                          width={110}
                        />
                        <Column
                          label="status"
                          headerRenderer={this.setHeaderLabel}
                          dataKey="status"
                          cellRenderer={({cellData}) => {
                            let statusClass;
                            switch (cellData) {
                              case 'active':
                                statusClass = s.tableListStatusOpen;
                                break;
                              case 'inactive':
                              case 'suspended':
                                statusClass = s.tableListStatusCancelled;
                                break;
                              case 'cancelled':
                                statusClass = s.tableListStatusExpired;
                                break;
                              default:
                                break;
                            }
                            return (
                              <div className={cx('btn', s.tableListStatus, statusClass)}>{configToName(config, 'bookingStatusesByValue', cellData)}</div>
                            )}}
                          width={90}
                        />
                        <Column
                          label="session dates"
                          headerRenderer={({label}) => <div className={s.headerLabel}>{label}</div>}
                          dataKey="sessions"
                          cellRenderer={({cellData}) => cellData && cellData.map(item => moment(item.date).format('YYYY-MM-DD')).join(', ')}
                          disableSort={true}
                          width={200}
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

AdminBookings.propTypes = {
};

const mapStateToProps = (state) => ({
  user: state.user.data,
  bookings: state.bookings.data,
  config: state.config.data,
  services: state.services.data,
});

const mapDispatchToProps = (dispatch) => ({
  fetchServices: () => dispatch(fetchServices()),
  getBookings: (params, extend) => dispatch(getBookings(params, extend)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminBookings);
