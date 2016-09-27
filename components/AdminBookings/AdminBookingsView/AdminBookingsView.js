import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import 'react-virtualized/styles.css';
import s from './AdminBookingsView.css';
import Container from '../../Container';
import Link from '../../Link';
import Header from '../../Header';
import { AutoSizer, Table, Column } from 'react-virtualized';
import { getBooking, fetchServices } from '../../../actions';
import history from '../../../core/history';
import { formatSessionAlias, configToName } from '../../../core/util';
import { Grid, Row, Col } from 'react-flexbox-grid';
// Sub Component
import AdminBookingsForm from '../AdminBookingsForm/AdminBookingsForm';
// react-icons
import FaCheck from 'react-icons/lib/fa/check';


//TODO: add nurse price
//TODO: add nurse

class AdminBookingsView extends Component {

  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {
    const { edit, bookingId, getBooking, fetchServices } = this.props;

    fetchServices();
    getBooking({ bookingId });
  }

  render() {
    const { config, booking, services } = this.props;

    const detail = {
      title: () => {
        const serviceName = booking.sessions && booking.sessions[0].service && Object.keys(services).length > 0 && services[booking.sessions[0].service].name;
        const serviceClassName = booking.sessions && booking.sessions[0].serviceClassId && Object.keys(services).length > 0 && services[booking.sessions[0].service].classes[booking.sessions[0].serviceClassId].duration;
        return serviceName && `${serviceName} (${serviceClassName} hr${parseFloat(serviceClassName) > 1 ? 's' : ''})`;
      },
      price: () => {
        const p = booking.sessions && booking.sessions.length && booking.sessions.reduce((result, session) => result + parseFloat(session.price), 0).toFixed(2);
        return `$ ${p} SGD`;
      },
      datePeriod: () => {
        const dateStart = booking.sessions && booking.sessions.length && moment(booking.sessions[0].date).format('YYYY-MM-DD');
        const dateEnd = booking.sessions && booking.sessions.length > 1 && moment(booking.sessions[booking.sessions.length - 1].date).format('YYYY-MM-DD');
        return `${dateStart}${dateEnd ? ' - ' + dateEnd : ""}`;
      }
    }

    return (
      <div className={s.adminBookingsView}>
        <Header title="Booking Detail" />
        <Container>

          <button onClick={() => history.goBack()} className={cx('btn', 'btn-primary', s.btnBack)}>back</button>
          <div className={s.buttonPanel}>
            <button className={cx('btn', 'btn-secondary')}>Delete</button>
            <button className={cx('btn', 'btn-primary')}>Edit</button>
          </div>


          <h1>
            {detail.title()}
            <div className={s.bookingStatus}>{booking.status}</div>
          </h1>

          <Grid fluid>
            <Row className={s.caseDetail}>
              <Col xs={8} md={8} className={s.detailSection}>
                <h2>CASE DETAILS</h2>
                <p><span>Type:</span>Ad-hoc</p>
                <p><span>Sessions:</span>{booking.sessions && booking.sessions.length}</p>
                <p><span>Price:</span>{detail.price()}</p>
                <p><span>BookingId:</span>{booking.bookingId}</p>
                <p><span>Date period:</span>{detail.datePeriod()}</p>
              </Col>

              <Col xs={4} md={4} className={s.detailSection}>
                <h2>INSTRUCTIONS</h2>
                <ul>
                  <li>Please contact the client to confirm the visit date.</li>
                  <li>Do clarify further details with the client with regards to the patient&#39;s condition</li>
                  <li>Ensure that you confirm with the client the actual date and time for the visit.</li>
                </ul>
              </Col>
            </Row>

            <Row className={s.caseDetail}>
              <Col xs={12} md={12} className={s.detailSection}>
                <h2>SCHEDULED DATES</h2>

                {booking.sessions && booking.sessions.length > 0 && (
                  <AutoSizer disableHeight>
                    {({width}) => (
                      <Table
                        className={s.tableList}
                        height={200}
                        width={width}

                        headerClassName={s.tableListHeader}
                        headerHeight={30}

                        noRowsRenderer={() => (<div>No cases</div>)}
                        rowHeight={100}
                        rowClassName={({index}) => index % 2 === 0 ? s.tableListEvenRow : null}
                        rowCount={booking.sessions.length}
                        rowGetter={({index}) => booking.sessions[index]}
                      >
                        <Column
                          label="alias"
                          dataKey="alias"
                          cellRenderer={({cellData}) => formatSessionAlias(cellData)}
                          width={80}
                        />
                        <Column
                          label="date"
                          dataKey="date"
                          cellRenderer={({cellData}) => moment(cellData).format('YYYY-MM-DD (ddd)')}
                          width={180}
                        />
                        <Column
                          label="time"
                          dataKey="timeSlot"
                          cellRenderer={({cellData}) => configToName(config, 'timeSlotsByValue', cellData)}
                          width={120}
                        />
                        <Column
                          label="price"
                          dataKey="price"
                          cellRenderer={({cellData}) => `$${parseFloat(cellData).toFixed(2)}`}
                          width={120}
                        />
                        <Column
                          label="nurse price"
                          dataKey="price"
                          cellRenderer={({cellData}) => {
                            return (
                              <div>
                                {'-'}
                                <div className={cx(s.tableListSign, s.tableListSignPay)}>Pay</div>
                              </div>
                          )}}
                          width={120}
                        />
                        <Column
                          label="nurse"
                          dataKey="nurse"
                          cellRenderer={({cellData}) => {
                            return (
                              <div>
                                {'-'}
                                <div>
                                  <div className={cx(s.tableListSign, s.tableListSignPlus)}>+</div>
                                  <div className={cx(s.tableListSign, s.tableListSignMinus)}>-</div>
                                </div>
                              </div>
                          )}}
                          width={150}
                        />
                        <Column
                          label="status"
                          dataKey="status"
                          cellRenderer={({cellData}) => {
                            let statusClass;
                            switch (cellData) {
                              case 'open':
                              case 'engaged':
                                statusClass = s.tableListStatusOpen;
                                break;
                              case 'completed':
                              case 'cancelled':
                                statusClass = s.tableListStatusCancelled;
                                break;
                              case 'suspended':
                              case 'expired':
                                statusClass = s.tableListStatusExpired;
                                break;
                              default:
                                break;
                            }
                            return (
                              <div className={cx('btn', s.tableListStatus, statusClass)}>{configToName(config, 'sessionStatusesByValue', cellData)}</div>
                          )}}
                          width={120}
                        />
                        <Column
                          label="actions"
                          dataKey="_id"
                          cellRenderer={({cellData}) => {
                            return (
                              <div>
                                <div>
                                  <div className={cx('btn', s.tableListSign, s.tableListSignEdit)}>Edit</div>
                                  <div className={cx('btn', s.tableListSign, s.tableListSignDoc)}>Doc</div>
                                </div>
                                <div>
                                  <div className={cx('btn', s.tableListSign, s.tableListSignCancel)}>Cancel</div>
                                  <div className={cx('btn', s.tableListSign, s.tableListSignEdit)}>Delete</div>
                                </div>
                              </div>
                          )}}
                          width={200}
                        />
                      </Table>
                    )}
                  </AutoSizer>
                )}
              </Col>
            </Row>

            <Row className={s.personDetail}>
              <Col xs={6} md={6} className={s.detailSection}>
                <h2>PATIENT</h2>
                <p><span>Age:</span></p>
                <p><span>DOB:</span></p>
                <p><span>Gender:</span></p>
                <p><span>Main Diagnosis:</span></p>
                <p><span>Mobility:</span></p>
                <p><span>Special Note:</span></p>
              </Col>

              <Col xs={6} md={6} className={s.detailSection}>
                <h2>CLIENT</h2>
                <p><span>Full Name:</span></p>
                <p><span>Mobile:</span></p>
                <p><span>Email:</span></p>
              </Col>
            </Row>

            <Row className={s.personDetail}>
              <Col xs={4} md={4} className={s.detailSection}>
                <h2>TRANSACTION HISTORY</h2>
                <p>There are no transactions.</p>
              </Col>

              <Col xs={4} md={4} className={s.detailSection}>
                <h2>NURSE PAYOUT HISTORY</h2>
                <p>There are no transactions.</p>
              </Col>

              <Col xs={4} md={4} className={s.detailSection}>
                <h2>FOLLOW UP CASES</h2>
                <p>There are no follow-up cases.</p>
              </Col>
            </Row>
          </Grid>

        </Container>
      </div>
    );
  }
}

AdminBookingsView.propTypes = {
};

const mapStateToProps = (state) => ({
  config: state.config.data,
  services: state.services.data,
  booking: state.booking.data,
});

const mapDispatchToProps = (dispatch) => ({
  fetchServices: () => dispatch(fetchServices()),
  getBooking: (params) => dispatch(getBooking(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminBookingsView);
