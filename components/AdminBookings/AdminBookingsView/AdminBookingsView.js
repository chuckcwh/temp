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
import ConfirmPopup from '../../ConfirmPopup';
import { AutoSizer, Table, Column } from 'react-virtualized';
import { fetchServices, showConfirmPopup, getBooking, deleteBooking } from '../../../actions';
import history from '../../../core/history';
import { formatSessionAlias, configToName } from '../../../core/util';
import { Grid, Row, Col } from 'react-flexbox-grid';
// Sub Component
import AdminBookingsForm from '../AdminBookingsForm/AdminBookingsForm';
// react-icons
import FaCheck from 'react-icons/lib/fa/check';


//TODO: add nurse price
//TODO: add nurse

//TODO: nurse assign/de-assign
//TODO: transaction / nurse payment

class AdminBookingsView extends Component {

  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {
    const { getBooking, fetchServices } = this.props;
    const { bookingId } = this.props.params;

    fetchServices();
    getBooking({ bookingId }).then(res => {
      if (res.type === 'BOOKING_FAILURE') {
        history.push({ pathname: '/admin-bookings' });
        // history.goBack();
      }
    });
  }

  deleteBooking = () => {
    const { booking, deleteBooking } = this.props;

    console.log('delete action', booking._id);
    deleteBooking({ bookingId: booking._id }).then(res => {
      if (res.type === 'BOOKING_DELETE_SUCCESS') {
        history.push({ pathname: '/admin-bookings' });
      }
    })
  }

  render() {
    const { config, booking, services } = this.props;

    const detail = {
      title: () => {
        const serviceName = booking.sessions && booking.sessions[0].service && Object.keys(services).length > 0 && services[booking.sessions[0].service].name;
        const serviceClassName = booking.sessions && booking.sessions[0].serviceClass && Object.keys(services).length > 0 && services[booking.sessions[0].service].classes[booking.sessions[0].serviceClass].duration;
        return serviceName ? `${serviceName} (${serviceClassName} hr${parseFloat(serviceClassName) > 1 ? 's' : ''})` : 'Unknown';
      },
      price: () => {
        const p = booking.sessions && booking.sessions.length && booking.sessions.reduce((result, session) => result + parseFloat(session.price), 0).toFixed(2);
        return `$ ${p} SGD`;
      },
      datePeriod: () => {
        const dateStart = booking.sessions && booking.sessions.length > 0 && moment(booking.sessions[0].date).format('YYYY-MM-DD');
        const dateEnd = booking.sessions && booking.sessions.length > 1 && moment(booking.sessions[booking.sessions.length - 1].date).format('YYYY-MM-DD');
        return `${dateStart}${dateEnd ? ' to ' + dateEnd : ""}`;
      },
      location: booking.sessions && booking.sessions.length > 0 && booking.sessions[0].address,
      patient: {
        name: booking.adhocPatient && booking.adhocPatient.name
          || booking.patient && booking.patient.name,
        age: booking.adhocPatient && moment().diff(booking.adhocPatient.dob, 'years') ? moment().diff(booking.adhocPatient.dob, 'years') : 0
          || booking.patient && moment().diff(booking.patient.dob, 'years') ? moment().diff(booking.patient.dob, 'years') : 0,
        dob: booking.adhocPatient && moment(booking.adhocPatient.dob).format('YYYY-MM-DD')
          || booking.patient && moment(booking.patient.dob).format('YYYY-MM-DD'),
        gender: booking.adhocPatient && configToName(config, 'gendersByValue', booking.adhocPatient.gender)
          || booking.patient && configToName(config, 'gendersByValue', booking.patient.gender),
        diagnosis: booking.adhocPatient && '-'
          || booking.patient && '-',
        mobility: booking.adhocPatient && '-'
          || booking.patient && '-',
        note: booking.adhocPatient && '-'
          || booking.patient && '-',
      },
      client: {
        name: booking.adhocClient && booking.adhocClient.name
          || booking.client && booking.client.name,
        mobile: booking.adhocClient && booking.adhocClient.contact
          || booking.client && booking.client.contact,
        email: booking.adhocClient && booking.adhocClient.email
          || booking.client && booking.client.email,
      }
    }

    return (
      <div className={s.adminBookingsView}>
        <Header title="Booking Detail" />
        <Container>
          <ConfirmPopup />
          <button onClick={() => history.push({ pathname: '/admin-bookings' })} className={cx('btn', 'btn-primary', s.btnBack)}>back</button>
          <div className={s.buttonPanel}>
            <button className={cx('btn', 'btn-primary')}>Edit</button>
            <button
              className={cx('btn', 'btn-secondary')}
              onClick={() => this.props.showConfirmPopup('Do you really want to delete the booking?', () => this.deleteBooking())}>
              Delete
            </button>
          </div>


          <h1>
            {detail.title()}
            <div className={s.bookingStatus}></div>
          </h1>

          <Grid fluid>
            <Row className={s.caseDetail}>
              <Col xs={12} md={4} className={s.detailSection}>
                <h2>CASE DETAILS</h2>
                <ul>
                  <li><span className={s.title}>Type:</span>{booking.isAdhoc ? 'Ad-hoc' : 'Registered User'}</li>
                  <li><span className={s.title}>Status</span>{booking.status}</li>
                  <li><span className={s.title}>Sessions:</span>{booking.sessions && booking.sessions.length}</li>
                  <li><span className={s.title}>Price:</span>{detail.price()}</li>
                  <li><span className={s.title}>Booking ID:</span>{booking.bookingId}</li>
                  <li><span className={s.title}>Date period:</span><span className={s.inlineBlock}>{detail.datePeriod()}</span></li>
                </ul>
              </Col>

              <Col xs={12} md={4} className={s.detailSection}>
                <h2>LOCATION</h2>
                <ul className={s.caseDetailList}>
                  <li><span className={s.title}>Postal:</span>{detail.location && detail.location.postal}</li>
                  <li><span className={s.title}>Region:</span>{detail.location && detail.location.region || '-'}</li>
                  <li><span className={s.title}>Neighborhood:</span>{detail.location && detail.location.neighborhood || '-'}</li>
                  <li><span className={s.title}>Address:</span><span className={s.inlineBlock}>{detail.location && detail.location.description}</span></li>
                  <li><span className={s.title}>Unit:</span>{detail.location && detail.location.unit}</li>
                </ul>
              </Col>

              <Col xs={12} md={4} className={s.detailSection}>
                <h2>INSTRUCTIONS</h2>
                <ul>
                  <li className={s.colorRed}>Please contact the client to confirm the visit date.</li>
                  <li>Do clarify further details with the client with regards to the patient&#39;s condition</li>
                  <li>Ensure that you confirm with the client the actual date and time for the visit.</li>
                </ul>
              </Col>
            </Row>

            <Row className={s.personDetail}>
              <Col xs={12} md={4} className={s.detailSection}>
                <h2>PATIENT {booking.isAdhoc && '(Ad-hoc)'}</h2>
                <ul>
                  <li><span className={s.title}>Name:</span>{detail.patient.name}</li>
                  <li><span className={s.title}>Age:</span>{detail.patient.age}</li>
                  <li><span className={s.title}>DOB:</span>{detail.patient.dob}</li>
                  <li><span className={s.title}>Gender:</span>{detail.patient.gender}</li>
                </ul>
              </Col>

              <Col xs={12} md={4} className={s.detailSection}>
                <ul className={s.patientDetailCont}>
                  <li><span className={s.title}>Main Diagnosis:</span><span className={s.inlineBlock}>{detail.patient.diagnosis}</span></li>
                  <li><span className={s.title}>Mobility:</span><span className={s.inlineBlock}>{detail.patient.mobility}</span></li>
                  <li><span className={s.title}>Special Note:</span><span className={s.inlineBlock}>{detail.patient.note}</span></li>
                </ul>
              </Col>

              <Col xs={12} md={4} className={s.detailSection}>
                <h2>CLIENT {booking.isAdhoc && '(Ad-hoc)'}</h2>
                <ul>
                  <li><span className={s.title}>Name:</span>{detail.client.name}</li>
                  <li><span className={s.title}>Mobile:</span>{detail.client.mobile}</li>
                  <li><span className={s.title}>Email:</span>{detail.client.email}</li>
                </ul>
              </Col>
            </Row>

            <Row className={s.sessionDetail}>
              <Col xs={12} md={12} className={s.detailSection}>
                <h2>SCHEDULED DATES</h2>

                {booking.sessions && (
                  <AutoSizer disableHeight>
                    {({width}) => (
                      <Table
                        className={s.tableList}
                        height={360}
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
                                </div>
                                <div>
                                  <div className={cx('btn', s.tableListSign, s.tableListSignCancel)}>Cancel</div>
                                  <div className={cx('btn', s.tableListSign, s.tableListSignDelete)}>Delete</div>
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

            <Row className={s.transactionDetail}>
              <Col xs={12} md={12} className={s.detailSection}>
                <h2>TRANSACTION HISTORY</h2>

                {booking.transactions && booking.transactions.length > 0 ? (
                  <AutoSizer disableHeight>
                    {({width}) => (
                      <Table
                        className={s.tableList}
                        height={200}
                        width={width}

                        headerClassName={s.tableListHeader}
                        headerHeight={30}

                        noRowsRenderer={() => (<div>No transactions.</div>)}
                        rowHeight={100}
                        rowClassName={({index}) => index % 2 === 0 ? s.tableListEvenRow : null}
                        rowCount={booking.transactions.length}
                        rowGetter={({index}) => booking.transactions[index]}
                      >
                        <Column
                          label="transaction date"
                          dataKey="date"
                          cellRenderer={({cellData}) => '-'}
                          width={130}
                        />
                        <Column
                          label="payment ref"
                          dataKey="ref"
                          cellRenderer={({cellData}) => '-'}
                          width={130}
                        />
                        <Column
                          label="amount"
                          dataKey="amount"
                          cellRenderer={({cellData}) => '-'}
                          width={120}
                        />
                        <Column
                          label="status"
                          dataKey="status"
                          cellRenderer={({cellData}) => '-'}
                          width={100}
                        />
                        <Column
                          label="method"
                          dataKey="method"
                          cellRenderer={({cellData}) => '-'}
                          width={100}
                        />
                        <Column
                          label="nurse"
                          dataKey="nurse"
                          cellRenderer={({cellData}) => '-'}
                          width={100}
                        />
                        <Column
                          label="action"
                          dataKey="_id"
                          cellRenderer={({cellData}) => '-'}
                          width={100}
                        />
                        <Column
                          label="actions"
                          dataKey="_id"
                          cellRenderer={({cellData}) => {
                            return (
                              <div>
                                <div>
                                  <div className={cx('btn', s.tableListSign, s.tableListSignDoc)}>Doc</div>
                                  <div className={cx('btn', s.tableListSign, s.tableListSignEdit)}>Edit</div>
                                </div>
                                <div>
                                  <div className={cx('btn', s.tableListSign, s.tableListSignEdit)}>Cancel</div>
                                  <div className={cx('btn', s.tableListSign, s.tableListSignDelete)}>Delete</div>
                                </div>
                              </div>
                          )}}
                          width={200}
                        />
                      </Table>
                    )}
                  </AutoSizer>
                ) : (
                  <div>There are no transactions.</div>
                )}
              </Col>

              <Col xs={12} md={4} className={s.detailSection}>
                <h2>NURSE PAYOUT HISTORY</h2>
                  {booking.nurseTransactions && booking.nurseTransactions.length > 0 ? (
                    <AutoSizer disableHeight>
                      {({width}) => (
                        <Table
                          className={s.tableList}
                          height={200}
                          width={width}

                          headerClassName={s.tableListHeader}
                          headerHeight={30}

                          noRowsRenderer={() => (<div>No transactions.</div>)}
                          rowHeight={100}
                          rowClassName={({index}) => index % 2 === 0 ? s.tableListEvenRow : null}
                          rowCount={booking.transactions.length}
                          rowGetter={({index}) => booking.transactions[index]}
                        >
                          <Column
                            label="transaction date"
                            dataKey="date"
                            cellRenderer={({cellData}) => '-'}
                            width={130}
                          />
                          <Column
                            label="payment ref"
                            dataKey="ref"
                            cellRenderer={({cellData}) => '-'}
                            width={130}
                          />
                          <Column
                            label="amount"
                            dataKey="amount"
                            cellRenderer={({cellData}) => '-'}
                            width={120}
                          />
                          <Column
                            label="status"
                            dataKey="status"
                            cellRenderer={({cellData}) => '-'}
                            width={100}
                          />
                          <Column
                            label="method"
                            dataKey="method"
                            cellRenderer={({cellData}) => '-'}
                            width={100}
                          />
                          <Column
                            label="nurse"
                            dataKey="nurse"
                            cellRenderer={({cellData}) => '-'}
                            width={100}
                          />
                          <Column
                            label="action"
                            dataKey="_id"
                            cellRenderer={({cellData}) => '-'}
                            width={100}
                          />
                          <Column
                            label="actions"
                            dataKey="_id"
                            cellRenderer={({cellData}) => {
                              return (
                                <div>
                                  <div>
                                    <div className={cx('btn', s.tableListSign, s.tableListSignDoc)}>Doc</div>
                                    <div className={cx('btn', s.tableListSign, s.tableListSignEdit)}>Edit</div>
                                  </div>
                                  <div>
                                    <div className={cx('btn', s.tableListSign, s.tableListSignEdit)}>Cancel</div>
                                    <div className={cx('btn', s.tableListSign, s.tableListSignDelete)}>Delete</div>
                                  </div>
                                </div>
                            )}}
                            width={200}
                          />
                        </Table>
                      )}
                    </AutoSizer>
                  ) : (
                    <div>There are no transactions.</div>
                  )}
              </Col>

              <Col xs={12} md={12} className={s.detailSection}>
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
  showConfirmPopup: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  config: state.config.data,
  services: state.services.data,
  booking: state.booking.data,
});

const mapDispatchToProps = (dispatch) => ({
  fetchServices: () => dispatch(fetchServices()),
  getBooking: (params) => dispatch(getBooking(params)),
  deleteBooking: (params) => dispatch(deleteBooking(params)),
  showConfirmPopup: (body, accept) => dispatch(showConfirmPopup(body, accept)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminBookingsView);
