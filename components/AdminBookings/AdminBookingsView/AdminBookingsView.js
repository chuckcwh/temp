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
import GenericPopup from '../../GenericPopup';
import ConfirmPopup from '../../ConfirmPopup';
import { AutoSizer, Table, Column } from 'react-virtualized';
import history from '../../../core/history';
import { formatSessionAlias, configToName } from '../../../core/util';
import { Grid, Row, Col } from 'react-flexbox-grid';
import FeedbackPopupForm from '../../FeedbackPopupForm';
import {
  APPLICATION_CREATE_SUCCESS,
  BOOKING_DELETE_SUCCESS,
  fetchServices,
  showAlertPopup,
  showGenericPopup,
  hideGenericPopup,
  showConfirmPopup,
  getBooking,
  deleteBooking,
  createApplication,
  cancelApplication,
  getUsers,
  getUser,
  showFeedbackPopupForm,
  hideFeedbackPopupForm,
} from '../../../actions';
// react-icons
import FaCheck from 'react-icons/lib/fa/check';
import FaPhoneSquare from 'react-icons/lib/fa/phone-square';
import FaChild from 'react-icons/lib/fa/child';

//TODO: transaction / nurse payment

const providerPickDefault = {
  choices: [],
  sessionId: undefined,
  providerId: undefined,
};

class AdminBookingsView extends Component {

  constructor(props) {
    super(props);

    this.state = {
      // Assign service provider to each session
      providerPick: providerPickDefault,
    }
  }

  componentDidMount() {
    const { getBooking, fetchServices } = this.props;
    const { bookingId } = this.props.params;

    fetchServices();
    getBooking({ bookingId }).then(res => {
      if (res.type === 'BOOKING_FAILURE') {
        history.push({ pathname: '/admin-bookings' });
      }
    });

    // Get user list for assigning service provider to session
    this.props.getUsers({ filter: {role: 'provider'} })
  }

  onFilterAvailableProvider = (date, time, sessionId) => {
    const { providers } = this.props;
    const { providerPick } = this.state;

    const choices = Object.values(providers).filter(provider => {
      const check = provider.schedules.filter(schedule => {
        return (schedule.dateTimeStart === date) && (schedule.timeSlot === time)
      })
      return check.length
    })

    this.setState({ providerPick: {...providerPick, choices, sessionId} });
  }

  onAssignProvider = (sessionId) => {
    const { providerPick } = this.state;
    const { hideGenericPopup, showAlertPopup, getBooking } = this.props;
    const { bookingId } = this.props.params;

    hideGenericPopup();
    this.props.createApplication({
      provider: providerPick.providerId,
      session: providerPick.sessionId,
    }).then(res => {
      this.setState({providerPick: providerPickDefault});
      if (res.type === APPLICATION_CREATE_SUCCESS) {
        showAlertPopup('Assign Provider Success');
        getBooking({ bookingId }).then(res => {
          if (res.type === 'BOOKING_FAILURE') {
            history.push({ pathname: '/admin-bookings' });
          }
        });
      } else {
        showAlertPopup('Assign Provider Failure');
      }
    })
  }

  onDeAssignProvider = (applicationId) => {
    console.log('deassign application', applicationId);
    this.props.cancelApplication({ applicationId }).then(res => {
      // TODO: provide status popup
    })


  }

  // should not work because booking shouldn't be deleted
  deleteBooking = () => {
    const { booking, deleteBooking } = this.props;

    console.log('delete action', booking._id);
    deleteBooking({ bookingId: booking._id }).then(res => {
      if (res.type === BOOKING_DELETE_SUCCESS) {
        history.push({ pathname: '/admin-bookings' });
      }
    })
  }

  render() {
    const { config, booking, services, showConfirmPopup } = this.props;
    const { providerPick } = this.state;

    const detail = {
      title: () => {
        const serviceName = booking.sessions && booking.sessions[0].service && Object.keys(services).length > 0 && services[booking.sessions[0].service].name;
        const serviceClassName = booking.sessions && booking.sessions[0].serviceClass && Object.keys(services).length > 0 && services[booking.sessions[0].service].classes[booking.sessions[0].serviceClass].duration;
        return serviceName ? `${serviceName} (${serviceClassName} hr${parseFloat(serviceClassName) > 1 ? 's' : ''})` : '';
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
        name: booking.patient && booking.patient.name || '-',
        age: booking.patient && moment().diff(booking.patient.dob, 'years') ? moment().diff(booking.patient.dob, 'years') : 0,
        dob: booking.patient && moment(booking.patient.dob).format('YYYY-MM-DD') || '-',
        gender: booking.patient && configToName(config, 'gendersByValue', booking.patient.gender) || '-',
        diagnosis: booking.patient && booking.patient.diagnosis || '-',
        mobility: booking.patient && booking.patient.mobility || '-',
        note: booking.patient && booking.patient.specialNotes || '-',
      },
      client: {
        name: booking.client && booking.client.name || '-',
        mobile: booking.client && booking.client.contact || '-',
        email: booking.client && booking.client.email || '-',
      }
    }

    return (
      <div className={s.adminBookingsView}>
        <Header title="Booking Detail" />
        <Container>
          <ConfirmPopup />
          <FeedbackPopupForm onFeedbackSuccess={() => console.log('oh yeh!')}/>
          <GenericPopup>
            <div className={s.providerPickPopup}>
              <h3>Pick an Available Provider</h3>
              <div className={cx("select", s.selectInput)}>
                <span></span>
                <select id='providerPick' name='providerPick' onChange={e => this.setState({providerPick: {...providerPick, providerId: e.target.value}})}>
                  <option value="">-- SELECT --</option>
                  {providerPick.choices && providerPick.choices.map((item, index) => (
                    <option key={index} value={item._id}>{item.name}</option>
                  ))}
                </select>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => this.onAssignProvider()}>
                Assign
              </button>
            </div>
          </GenericPopup>

          <button onClick={() => history.push({ pathname: '/admin-bookings' })} className={cx('btn', 'btn-primary', s.btnBack)}>back</button>
          <div className={s.buttonPanel}>
            <Link
              className={cx('btn', 'btn-primary')}
              to={`/admin-bookings/edit/${booking._id}`}>
              Edit
            </Link>
            <button
              className={cx('btn', 'btn-secondary')}
              onClick={() => showConfirmPopup('Do you really want to delete the booking?', () => this.deleteBooking())}>
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
                <h2>SCHEDULED CASES</h2>

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
                          label="datetime"
                          dataKey="date"
                          cellRenderer={({rowData, cellData}) => (
                            <div>
                              {moment(cellData).format('YYYY-MM-DD')}<br />
                              <div className={cx(s.font_sm, s.textAlign_bottom)}>
                                {moment(cellData).format('(ddd)')}<br />
                                {configToName(config, 'timeSlotsByValue', rowData.timeSlot)}
                              </div>
                            </div>
                          )}
                          width={130}
                        />
                        <Column
                          label="patient"
                          dataKey="patient"
                          cellRenderer={({cellData}) => cellData ? (
                            <div>
                              {cellData.name}
                              <div className={cx(s.font_sm, s.textAlign_bottom)}>
                                {cellData.gender && (<span><FaChild />{cellData.gender}</span>)}
                                {cellData.contact && (<span><br /><FaPhoneSquare /> {cellData.contact}</span>)}
                              </div>
                            </div>
                          ) : (
                            <div>
                              {booking && booking.patient && booking.patient.name}
                              <div className={cx(s.font_sm, s.textAlign_bottom)}>
                                {booking && booking.patient && booking.patient.gender && (<span><FaChild />{booking && booking.patient && booking.patient.gender}</span>)}
                                {booking && booking.patient && booking.patient.contact && (<span><br /><FaPhoneSquare /> {booking && booking.patient && booking.patient.contact}</span>)}
                              </div>
                            </div>
                          )}
                          width={150}
                        />
                        <Column
                          label="price"
                          dataKey="price"
                          cellRenderer={({cellData}) => `$${parseFloat(cellData).toFixed(2)}`}
                          width={110}
                        />
                        <Column
                          label="provider price"
                          dataKey="providerPrice"
                          cellRenderer={({cellData}) => {
                            return (
                              <div>
                                {`$${parseFloat(cellData).toFixed(2)}`}
                                <div className={cx(s.tableListSign, s.tableListSignPay)}>Pay</div>
                              </div>
                          )}}
                          width={130}
                        />
                        <Column
                          label="provider"
                          dataKey="provider"
                          cellRenderer={({rowData, cellData}) => {
                            return (
                              <div>
                                {rowData.provider && rowData.provider.name}
                                <div>
                                  <div
                                    className={cx(s.tableListSign, s.tableListSignPlus)}
                                    onClick={() => {
                                      this.onFilterAvailableProvider(rowData.date, rowData.timeSlot, rowData._id);
                                      this.props.showGenericPopup();
                                    }}>
                                    +
                                  </div>
                                  <div
                                    className={cx(s.tableListSign, s.tableListSignMinus)}
                                    onClick={() => showConfirmPopup("Are you sure you want to cancel this application?", () => this.onDeAssignProvider(rowData.acceptedApplication._id))}>
                                    -
                                  </div>
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
                              case 'completed':
                                statusClass = s.tableListStatusGreen;
                                break;
                              case 'awaiting-caregiver':
                              case 'pending-payment-approval':
                              case 'pending-payment':
                              case 'pending-documentation':
                              case 'pending-visit':
                                statusClass = s.tableListStatusOrange;
                                break;
                              case 'cancelled':
                              case 'suspended':
                              case 'expired':
                                statusClass = s.tableListStatusRed;
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
                          cellRenderer={({rowData, cellData}) => {
                            return (
                              <div>
                                <div>
                                  <div className={cx('btn', s.tableListSign, s.tableListSignDoc, !rowData.documentation && s.tableListSignDocNo)} onClick={() => history.push({ pathname: `/sessions/${cellData}/documentation` })}>Doc{rowData.documentation && (<span className={s.textAlign_textBottom}> <FaCheck /></span>)}</div>
                                  <div className={cx('btn', s.tableListSign, s.tableListSignEdit)} onClick={() => history.push({ pathname: `/admin-cases/edit/${cellData}` })}>Edit</div>
                                </div>
                                <div>
                                  <div className={cx('btn', s.tableListSign, s.tableListSignDelete)}>Cancel</div>
                                  <div
                                    className={cx('btn', s.tableListSign, s.tableListSignDoc, s.font_sm, !rowData.clientFeedback && s.tableListSignDocNo)}
                                    onClick={() => rowData.clientFeedback && this.props.showFeedbackPopupForm({
                                      sessionId: cellData,
                                      feedbackData: rowData.clientFeedback,
                                      isAdmin: true,
                                    })}
                                  >
                                    Feedback{rowData.clientFeedback && (<span> <FaCheck /></span>)}
                                  </div>
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
  fetchServices: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  config: state.config.data,
  services: state.services.data,
  booking: state.booking.data,
  providers: state.users.data,
});

const mapDispatchToProps = (dispatch) => ({
  fetchServices: () => dispatch(fetchServices()),
  getBooking: (params) => dispatch(getBooking(params)),
  deleteBooking: (params) => dispatch(deleteBooking(params)),
  createApplication: (params) => dispatch(createApplication(params)),
  cancelApplication: (params) => dispatch(cancelApplication(params)),
  showAlertPopup: (body) => dispatch(showAlertPopup(body)),
  showConfirmPopup: (body, accept) => dispatch(showConfirmPopup(body, accept)),
  showGenericPopup: (body) => dispatch(showGenericPopup(body)),
  hideGenericPopup: () => dispatch(hideGenericPopup()),
  getUsers: (params) => dispatch(getUsers(params)),
  showFeedbackPopupForm: (params) => dispatch(showFeedbackPopupForm(params)),
  hideFeedbackPopupForm: () => dispatch(hideFeedbackPopupForm()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminBookingsView);
