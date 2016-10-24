import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Loader from 'react-loader';
import s from './BookingView.css';
import Container from '../Container';
import SessionAddressDetails from '../SessionAddressDetails';
import InlineForm from '../InlineForm';
import CloseButton from '../CloseButton';
import ConfirmPopup from '../ConfirmPopup';
import { SESSION_CANCEL_SUCCESS, fetchServices, getBooking, editBooking, clearBooking, setPostStatus, cancelSession,
  showConfirmPopup, showInlineForm } from '../../actions';
import { configToName, removeByKey } from '../../core/util';
import history from '../../core/history';

import imgPencil from '../pencil.png';

class BookingView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      selected: {},
    };
  }

  componentDidMount() {
    this.props.fetchServices();
  }

  onClickEdit = (entity) => (event) => {
    event.preventDefault();
    this.setState({ editing: true });

    switch (entity) {
      case 'userDetails':
        this.props.showInlineForm({
          name: 'userDetails',
          inputs: {
            clientName: {
              label: 'Name',
              type: 'text',
              initialValue:
                this.props.booking &&
                this.props.booking.client &&
                this.props.booking.client.name,
            },
            clientContact: {
              label: 'Mobile Number',
              type: 'text',
              initialValue:
                this.props.booking &&
                this.props.booking.client &&
                this.props.booking.client.contact,
            },
          },
          validate: (values) => {
            const errors = {};
            if (!values.clientName) {
              errors.clientName = 'Required';
            }
            if (!values.clientContact) {
              errors.clientContact = 'Required';
            } else if (!/^[8,9]{1}[0-9]{7}$/i.test(values.clientContact)) {
              errors.clientContact = 'Invalid mobile phone';
            }
            return errors;
          },
          ok: this.onClickSave('userDetails'),
          cancel: () => { this.setState({ editing: false }); },
        });
        break;
      default:
        break;
    }
  };

  onClickSave = (entity) => (values) => (
    new Promise((resolve, reject) => {
      switch (entity) {
        case 'userDetails':
          this.props.editBooking({
            bid: this.props.booking && this.props.booking.id,
            token: this.props.booking && this.props.booking.token,
            booking: {
              clientName: values.clientName,
              clientContact: values.clientContact,
            },
          }).then((res) => {
            if (res && res.response && res.response.status === 1) {
              resolve();
              this.setState({ editing: false });
            } else {
              reject({ _error: res.response.message });
            }
          }, (reason) => {
            reject({ _error: reason });
          });
          break;
        default:
          break;
      }
    })
  );

  onClickStopEdit = (entity) => (event) => {
    event.preventDefault();

    switch (entity) {
      case 'user':
        this.setState({ editingUser: false });
        break;
      case 'patient':
        this.setState({ editingPatient: false });
        break;
      case 'address':
        this.setState({ editingAddress: false });
        break;
      default:
        break;
    }
  };

  onClickManageBooking = (event) => {
    this.props.clearBooking();

    event.preventDefault();
    history.push('/booking-manage');
  };

  handleClickPay = (event) => {
    const { booking, sessions, setPostStatus } = this.props;
    const location = history.getCurrentLocation();

    // Link.handleClick(event);
    event.preventDefault();
    history.push({ pathname: '/booking-confirmation', query: {
      ...location.query,
      applications: Object.keys(this.state.selected)
        .map(sessionId => sessions[sessionId].applications[0]).join(),
      bid: booking._id,
      btoken: booking.client.contact,
    } });

    setPostStatus('confirmation');
  };

  onCancelSession = (session) => () => {
    this.props.showConfirmPopup('Are you sure you want to cancel this session?', () => {
      this.props.cancelSession({
        sessionId: session._id,
        bookingId: this.props.booking._id,
        bookingToken: this.props.booking.client.contact,
      }).then((res) => {
        if (res && res.type === SESSION_CANCEL_SUCCESS) {
          this.props.getBooking({
            bookingId: this.props.booking._id,
            bookingToken: this.props.booking.client.contact,
          });
        }
      });
    });
  };

  render() {
    let userDetails,
      patientDetails,
      addressDetails,
      sessionDetails,
      caregiverSection,
      paymentButton;
    const { config, services, booking, bookingFetching, sessions } = this.props;
    if (this.state.editing && this.props.inlineForm && /^(userDetails)$/i.test(this.props.inlineForm.name)) {
      userDetails = <InlineForm />;
    } else {
      userDetails = (
        <div>
          <div className="TableRow">
            <div className="TableRowItem1">Name</div>
            <div className="TableRowItem3">{booking && booking.client && booking.client.name}</div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Email</div>
            <div className="TableRowItem3">{booking && booking.client && booking.client.email}</div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Mobile Number</div>
            <div className="TableRowItem3">{booking && booking.client && booking.client.contact}</div>
          </div>
        </div>
      );
    }
    // if (this.state.editingPatient) {
    //   patientDetails = (
    //     <div>
    //       <form>
    //         <div className="TableRow">
    //           <div className="TableRowItem1">First Name</div>
    //           <div className="TableRowItem3">
    //             <input
    //               type="text"
    //               id="patient_firstName"
    //               name="patient_firstName"
    //               value={booking && booking.patient_firstName}
    //               placeholder="First Name*"
    //               maxLength="50"
    //               required
    //             />
    //           </div>
    //         </div>
    //         <div className="TableRow">
    //           <div className="TableRowItem1">Last Name</div>
    //           <div className="TableRowItem3">
    //             <input
    //               type="text"
    //               id="patient_lastName"
    //               name="patient_lastName"
    //               value={booking && booking.patient_lastName}
    //               placeholder="Last Name*"
    //               maxLength="50"
    //               required
    //             />
    //           </div>
    //         </div>
    //         <div className="TableRow">
    //           <div className="TableRowItem1">Gender</div>
    //           <div className="TableRowItem3">
    //             <div className="radio radio-inline">
    //               <input
    //                 type="radio"
    //                 id="patient_gender_male"
    //                 name="patient_gender"
    //                 checked={booking && booking.patient_gender === 'Male'}
    //                 value="Male"
    //                 required
    //               />
    //               <label htmlFor="patient_gender_male"><span><span></span></span><span>Male</span></label>
    //             </div>
    //             <div className="radio radio-inline">
    //               <input
    //                 type="radio"
    //                 id="patient_gender_female"
    //                 name="patient_gender"
    //                 checked={booking && booking.patient_gender === 'Female'}
    //                 value="Female"
    //                 required
    //               />
    //               <label htmlFor="patient_gender_female"><span><span></span></span><span>Female</span></label>
    //             </div>
    //           </div>
    //         </div>
    //         <div className="TableRow">
    //           <div className="TableRowItem1">Date of Birth</div>
    //           <div className="TableRowItem3">
    //             <DatePicker
    //               selected={moment(booking.patient_dob)}
    //               maxDate={moment()}
    //               dateFormat="YYYY-MM-DD"
    //               showYearDropdown
    //               onChange={this.onSelectDob}
    //               placeholderText="Date of Birth* (Y-M-D)"
    //             />
    //           </div>
    //         </div>
    //         <div>
    //           <a href="#" className="btn btn-primary" onClick={this.onClickSave('patient')}>Save</a>
    //           <a href="#" className="btn btn-primary" onClick={this.onClickStopEdit('patient')}>Cancel</a>
    //         </div>
    //       </form>
    //     </div>
    //   );
    // } else {
    patientDetails = (
      <div>
        <div className="TableRow">
          <div className="TableRowItem1">Name</div>
          <div className="TableRowItem3">{booking && booking.patient && booking.patient.name}</div>
        </div>
        <div className="TableRow">
          <div className="TableRowItem1">Gender</div>
          <div className="TableRowItem3">
            {configToName(config, 'gendersByValue', booking && booking.patient && booking.patient.gender)}
          </div>
        </div>
        <div className="TableRow">
          <div className="TableRowItem1">Date of Birth</div>
          <div className="TableRowItem3">
            {booking && booking.patient && booking.patient.dob
              && moment(booking.patient.dob).format('ll')}
          </div>
        </div>
        <div className="TableRow">
          <div className="TableRowItem1">Mobile Number</div>
          <div className="TableRowItem3">{booking && booking.patient && booking.patient.contact}</div>
        </div>
      </div>
    );
    // }
    // if (this.state.editingAddress) {
    //   addressDetails = (
    //     <div>
    //       <form>
    //         <div className="TableRow">
    //           <div className="TableRowItem1">Postal Code</div>
    //           <div className="TableRowItem3">
    //             <input
    //               type="text"
    //               id="postalCode"
    //               name="postalCode"
    //               onChange={this.onChangePostalCode}
    //               value={this.state.postalCode}
    //               placeholder="Enter Postal Code*"
    //               required
    //             />
    //           </div>
    //         </div>
    //         <div className="TableRow">
    //           <div className="TableRowItem1">Address</div>
    //           <div className="TableRowItem3">
    //             <textarea
    //               id="address"
    //               name="address"
    //               value={this.state.address}
    //               onChange={(e) => this.setState({ address: e.target.value })}
    //               placeholder="Enter Address*"
    //               required
    //             />
    //           </div>
    //         </div>
    //         <div className="TableRow">
    //           <div className="TableRowItem1">Unit Number</div>
    //           <div className="TableRowItem3">
    //             <input
    //               type="text"
    //               id="unitNumber"
    //               name="unitNumber"
    //               value={this.state.unitNumber}
    //               onChange={(e) => this.setState({ unitNumber: e.target.value })}
    //               placeholder="Enter Unit Number"
    //             />
    //           </div>
    //         </div>
    //         <div>
    //           <a href="#" className="btn btn-primary" onClick={this.onClickSave('address')}>Save</a>
    //           <a href="#" className="btn btn-primary" onClick={this.onClickStopEdit('address')}>Cancel</a>
    //         </div>
    //       </form>
    //     </div>
    //   );
    // } else {
    addressDetails = (
      <div>
        <div>
          {booking && booking.sessions
            && booking.sessions[0] && booking.sessions[0].address && booking.sessions[0].address.description}
        </div>
        <div>
          {booking && booking.sessions
            && booking.sessions[0] && booking.sessions[0].address && booking.sessions[0].address.unit}
        </div>
      </div>
    );
    // }
    sessionDetails = (
      <div>
        <div className="TableRow TableRowHeader">
          <div className="TableRowItem1"></div>
          <div className="TableRowItem2">Date</div>
          <div className="TableRowItem2">Session</div>
          <div className="TableRowItem2">Cost</div>
          <div className="TableRowItem2">Status</div>
          <div className="TableRowItem1"></div>
        </div>
        {
          booking && booking.sessions.map(session => (
            <div className="TableRow" key={session._id}>
              <div className="TableRowItem1">
                {
                  session.status === 'pending-payment' &&
                    <input
                      className={s.rememberMeCheckbox}
                      type="checkbox"
                      checked={!!this.state.selected[session._id]}
                      onChange={() => {
                        if (this.state.selected[session._id]) {
                          this.setState({
                            selected: removeByKey(this.state.selected, session._id),
                          })
                        } else {
                          this.setState({
                            selected: {
                              ...this.state.selected,
                              [session._id]: true,
                            }
                          })
                        }
                      }}
                    />
                }
                <label><span></span></label>
              </div>
              <div className="TableRowItem2">{moment(session.date).format('D MMM YY')}</div>
              <div className="TableRowItem2">
                {configToName(config, 'timeSlotsByValue', session.timeSlot)}
              </div>
              <div className="TableRowItem2">
                {`$ ${session.pdiscount
                  ? ((100 - parseFloat(session.pdiscount)) * parseFloat(session.price) / 100).toFixed(2)
                  : parseFloat(session.price).toFixed(2)}`}
              </div>
              <div className="TableRowItem2">
                {configToName(config, 'sessionStatusesByValue', session.status)}
              </div>
              <div className="TableRowItem1">
                {session.status === 'open' && moment(session.date).isAfter(moment(), 'day')
                  && <CloseButton onCloseClicked={this.onCancelSession(session)} />}
              </div>
            </div>
          ))
        }
        <div className={s.bookingViewBodyActions}>
          <button
            type="button"
            className="btn btn-primary btn-small"
            onClick={this.handleClickPay}
            disabled={Object.values(this.state.selected).length === 0}
          >Pay</button>
        </div>
      </div>
    );
    // show caregiver section only if case has been paid
    if (booking && booking.case && booking.case.isPaid) {
      caregiverSection = (
        <div className={s.bookingViewBodySection}>
          <div className={s.bookingViewBodySectionTitle}>
            <h3>Caregiver Details</h3>
          </div>
          <div>
            <div className="TableRow">
              <div className="TableRowItem1">Name</div>
              <div className="TableRowItem3">
                {booking && booking.case
                  && booking.case.quotes
                  && booking.case.quotes[0]
                  && booking.case.quotes[0].fullName}
              </div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Email</div>
              <div className="TableRowItem3">
                {booking && booking.case
                  && booking.case.quotes
                  && booking.case.quotes[0]
                  && booking.case.quotes[0].user
                  && booking.case.quotes[0].user.email}
              </div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Contact Number</div>
              <div className="TableRowItem3">
                {booking && booking.case
                  && booking.case.quotes
                  && booking.case.quotes[0]
                  && booking.case.quotes[0].user
                  && booking.case.quotes[0].user.mobilePhone}
              </div>
            </div>
          </div>
        </div>
      );
    }
    // show payment button only if booking is "Closed" and not yet paid, and if not editing
    if ((booking && booking.case
      && booking.case.status === 'Closed' && !booking.case.isPaid
      && booking.case.transactions && !booking.case.transactions.length)
      && (!this.state.editingUser && !this.state.editingPatient && !this.state.editingAddress)) {
      paymentButton = (
        <a href="#" className="btn btn-primary" onClick={this.handleClickPay}>GO TO PAYMENT</a>
      );
    }

    return (
      <div className={s.bookingView}>
        <Container>
          <Loader className="spinner" loaded={!bookingFetching}>
            <div className={s.bookingViewWrapper}>
              <div className={s.bookingViewBody}>
                <div className={s.bookingViewBodyActions}>
                  <span className={s.bookingViewFooter}>
                    {paymentButton}
                  </span>
                  <span className={s.bookingViewFooter}>
                    <a href="/booking-manage" className="btn btn-primary" onClick={this.onClickManageBooking}>VIEW ANOTHER</a>
                  </span>
                </div>
                <h2>Booking ID: {booking && booking.bookingId}</h2>
                <div>
                  <div>
                    <div className="TableRow">
                      <div className="TableRowItem1">Service</div>
                      <div className="TableRowItem3">
                        {services && booking && booking.sessions
                          && booking.sessions[0] && booking.sessions[0].service
                          && services[booking.sessions[0].service]
                          && services[booking.sessions[0].service].name}
                      </div>
                    </div>
                    <div className="TableRow">
                      <div className="TableRowItem1">Duration</div>
                      <div className="TableRowItem3">
                        {`${services && booking && booking.sessions
                          && booking.sessions[0]
                          && booking.sessions[0].service && booking.sessions[0].serviceClass
                          && services[booking.sessions[0].service]
                          && services[booking.sessions[0].service].classes
                          && services[booking.sessions[0].service].classes[booking.sessions[0].serviceClass]
                          && services[booking.sessions[0].service].classes[booking.sessions[0].serviceClass].duration} hours`}
                      </div>
                    </div>
                    {booking && booking.sessions && booking.sessions[0] && booking.sessions[0].additionalInfo &&
                      <div className="TableRow">
                        <div className="TableRowItem1">Additional Notes</div>
                        <div className="TableRowItem3">
                          {booking && booking.sessions && booking.sessions[0] && booking.sessions[0].additionalInfo}
                        </div>
                      </div>
                    }
                  </div>
                </div>
                <div className={s.bookingViewBodyColumnWrapper}>
                  <div className={s.bookingViewBodyColumn}>
                    <div className={s.bookingViewBodySection}>
                      <div className={s.bookingViewBodySectionTitle}>
                        <h3>Client Details</h3>
                        <a
                          href="#"
                          className={this.state.editingUser ? 'hidden' : ''}
                          onClick={this.onClickEdit('userDetails')}
                        ><img src={imgPencil} alt="Edit" /></a>
                      </div>
                      <Loader className="spinner" loaded={!this.state.updatingUser}>
                        {userDetails}
                      </Loader>
                    </div>
                    <div className={s.bookingViewBodySection}>
                      <div className={s.bookingViewBodySectionTitle}>
                        <h3>Patient Details</h3>
                        {/* <a href="#" className={this.state.editingPatient ? 'hidden' : ''}
                          onClick={this.onClickEdit('patient')}><img src={require('../pencil.png')} /></a> */}
                      </div>
                      {patientDetails}
                    </div>
                    <div className={s.bookingViewBodySection}>
                      <Loader className="spinner" loaded={!this.state.updatingAddress}>
                        <SessionAddressDetails
                          address={booking && booking.sessions && booking.sessions[0] && booking.sessions[0].address}
                        />
                      </Loader>
                    </div>
                  </div>
                  <div className={s.bookingViewBodyColumn}>
                    {caregiverSection}
                    <div className={s.bookingViewBodySection}>
                      <div className={s.bookingViewBodySectionTitle}>
                        <h3>Session Details</h3>
                        {/* <a href="#" className={this.state.editingPatient ? 'hidden' : ''}
                          onClick={this.onClickEdit('patient')}><img src={require('../pencil.png')} /></a> */}
                      </div>
                      {sessionDetails}
                    </div>
                  </div>
                </div>
                <div className={s.bookingViewFooter}>
                  <span>
                    {paymentButton}
                  </span>
                  <span>
                    <a href="/booking-manage" className="btn btn-primary" onClick={this.onClickManageBooking}>VIEW ANOTHER</a>
                  </span>
                </div>
              </div>
              {this.props.children}
            </div>
          </Loader>
        </Container>
        <ConfirmPopup />
      </div>
    );
  }

}

BookingView.propTypes = {
  children: React.PropTypes.node,

  config: React.PropTypes.object,
  services: React.PropTypes.object,
  servicesFetching: React.PropTypes.bool,
  booking: React.PropTypes.object,
  bookingFetching: React.PropTypes.bool,
  sessions: React.PropTypes.object,
  sessionsFetching: React.PropTypes.bool,
  inlineForm: React.PropTypes.object,

  fetchServices: React.PropTypes.func.isRequired,
  getBooking: React.PropTypes.func.isRequired,
  editBooking: React.PropTypes.func.isRequired,
  clearBooking: React.PropTypes.func.isRequired,
  setPostStatus: React.PropTypes.func.isRequired,
  cancelSession: React.PropTypes.func.isRequired,
  showConfirmPopup: React.PropTypes.func.isRequired,
  showInlineForm: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  config: state.config.data,
  services: state.services.data,
  servicesFetching: state.services.isFetching,
  booking: state.booking.data,
  bookingFetching: state.booking.isFetching,
  sessions: state.sessions.data,
  sessionsFetching: state.sessions.isFetching,
  inlineForm: state.inlineForm,
});

const mapDispatchToProps = (dispatch) => ({
  fetchServices: () => dispatch(fetchServices()),
  getBooking: (params) => dispatch(getBooking(params)),
  editBooking: (booking) => dispatch(editBooking(booking)),
  clearBooking: () => dispatch(clearBooking()),
  setPostStatus: (status) => dispatch(setPostStatus(status)),
  cancelSession: (params) => dispatch(cancelSession(params)),
  showConfirmPopup: (body, accept) => dispatch(showConfirmPopup(body, accept)),
  showInlineForm: (params) => dispatch(showInlineForm(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookingView);
