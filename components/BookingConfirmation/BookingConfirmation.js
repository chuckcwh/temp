/* global google */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Loader from 'react-loader';
import 'react-datepicker/dist/react-datepicker.css';
import s from './BookingConfirmation.css';
import Container from '../Container';
import SessionClientDetails from '../SessionClientDetails';
import SessionPatientDetails from '../SessionPatientDetails';
import SessionAddressDetails from '../SessionAddressDetails';
import { fetchServices, getSessions, editBooking, setPostStatus } from '../../actions';
import { configToName } from '../../core/util';
import history from '../../core/history';

class BookingConfirmation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editingUser: false,
      editingPatient: false,
      editingAddress: false,
    };
  }

  componentDidMount() {
    const location = history.getCurrentLocation();
    if (this.props.user._id || this.props.booking._id) {
      location && location.query && location.query.sessions &&
        this.props.getSessions({
          ids: location.query.sessions.split(','),
        });
    }
  }

  componentWillReceiveProps(newProps) {
    const location = history.getCurrentLocation();
    if ((newProps.user._id && !this.props.user._id) || (newProps.booking._id && !this.props.booking._id)) {
      location && location.query && location.query.sessions &&
        this.props.getSessions({
          ids: location.query.sessions.split(','),
        });
    }
  }

  onClickEdit = (entity) => (event) => {
    event.preventDefault();

    switch (entity) {
      case 'user':
        this.setState({
          client_contactNumber: this.props.booking.client_contactNumber,

          editingUser: true,
        });
        break;
      case 'patient':
        this.setState({ editingPatient: true });
        break;
      case 'address':
        this.setState({
          postal: this.props.booking && this.props.booking.case
            && this.props.booking.case.addresses && this.props.booking.case.addresses[0]
            && this.props.booking.case.addresses[0].postal,
          address: this.props.booking && this.props.booking.case
            && this.props.booking.case.addresses && this.props.booking.case.addresses[0]
            && this.props.booking.case.addresses[0].address,
          unit: this.props.booking && this.props.booking.case
            && this.props.booking.case.addresses && this.props.booking.case.addresses[0]
            && this.props.booking.case.addresses[0].unit,

          editingAddress: true,
        });
        break;
      default:
        break;
    }
  };

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

  onClickSave = (entity) => (event) => {
    event.preventDefault();

    switch (entity) {
      case 'user':
        if (this.userDetailsForm.checkValidity()) {
          this.setState({ updatingUser: true });

          this.props.editBooking({
            bid: this.props.booking && this.props.booking.id,
            token: this.props.booking && this.props.booking.token,
            booking: {
              client_contactNumber: this.state.client_contactNumber,
            },
          }).then((res) => {
            if (res.response && res.response.status === 1) {
              this.setState({
                editingUser: false,
                updatingUser: false,
              });
            } else {
              // console.error('Failed to edit booking.');
            }
          });
        }
        break;
      case 'patient':
        if (this.patientDetailsForm.checkValidity()) {
          this.setState({ editingPatient: false });
        }
        break;
      case 'address':
        if (this.addressDetailsForm.checkValidity()) {
          this.setState({ updatingAddress: true });
          this.props.editBooking({
            bid: this.props.booking && this.props.booking.id,
            token: this.props.booking && this.props.booking.token,
            case: {
              addresses: [{
                id: this.props.booking && this.props.booking.case
                  && this.props.booking.case.addresses
                  && this.props.booking.case.addresses[0]
                  && this.props.booking.case.addresses[0].id,
                description: this.state.description,
                postal: this.state.postal,
                unit: this.state.unit,
              }],
            },
          }).then((res) => {
            if (res.response && res.response.status === 1) {
              this.setState({
                editingAddress: false,
                updatingAddress: false,
              });
            } else {
              // console.error('Failed to edit booking.');
            }
          });
        }
        break;
      default:
        break;
    }
  };

  onSelectDob = (date) => {
    this.setState({
      patient_dob: date,
    });
  };

  onChangePostalCode = (event) => {
    const that = this;
    const postalInput = event.target;
    this.setState({
      postal: postalInput.value,
    });
    if (postalInput.value.length === 6) {
      // console.log(postalInput.value);
      try {
        // postalInput.disabled = true;
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({
          address: postalInput.value,
          region: 'SG',
        }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            const position = results[0].geometry.location;
            geocoder.geocode({
              latLng: position,
            }, (responses) => {
              if (responses && responses.length > 0) {
                that.setState({
                  address: responses[0].formatted_address,
                });
                // postalInput.disabled = false;
              } else {
                // postalInput.disabled = false;
                // console.error('Invalid postal code.');
              }
            });
          } else {
            // postalInput.disabled = false;
            // console.error('Invalid postal code.');
          }
        });
      } catch (e) {
        // postalInput.disabled = false;
        // console.error('Unable to find your address.');
      }
    }
  };

  onNext = (event) => {
    // Link.handleClick(event);
    event.preventDefault();

    if (this.props.user && this.props.user._id) {
      this.props.setPostStatus('payment-credits');
    } else {
      this.props.setPostStatus('payment-card');
    }
  };

  render() {
    const { config, services, booking, bookingFetching, sessions, sessionsFetching } = this.props;
    let sessionsDetails,
      userDetails,
      patientDetails,
      addressDetails,
      paymentButton;
    sessionsDetails = (
      <div>
        <div className="TableRow TableRowHeader">
          <div className="TableRowItem2">Date</div>
          <div className="TableRowItem2">Time</div>
          <div className="TableRowItem2">Service</div>
          <div className="TableRowItem2">Cost</div>
        </div>
        {
          sessions && Object.values(sessions).length > 0 && Object.values(sessions).map(session => {
            if (session) return (
              <div className="TableRow" key={session._id}>
                <div className="TableRowItem2">{moment(session.date).format('D MMM YY')}</div>
                <div className="TableRowItem2">
                  {configToName(config, 'timeSlotsByValue', session.timeSlot)}
                </div>
                <div className="TableRowItem2">{services && services[session.service] && services[session.service].name}</div>
                <div className="TableRowItem2">
                  $ {session.pdiscount ? ((100 - parseFloat(session.pdiscount)) * parseFloat(session.price) / 100).toFixed(2) : parseFloat(session.price).toFixed(2)}
                </div>
              </div>
            );
            return;
          })
        }
      </div>
    );
    if (this.state.editingUser) {
      userDetails = (
        <div>
          <form ref={(c) => (this.userDetailsForm = c)} onSubmit={this.onClickSave('user')}>
            {/*
            <div className="TableRow">
              <div className="TableRowItem1">First Name</div>
              <div className="TableRowItem3">
                <input
                  type="text"
                  id="client_firstName"
                  name="client_firstName"
                  value={this.props.booking.client_firstName}
                  placeholder="First Name*"
                  maxLength="50"
                  required
                />
              </div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Last Name</div>
              <div className="TableRowItem3">
                <input
                  type="text"
                  id="client_lastName"
                  name="client_lastName"
                  value={this.props.booking.client_lastName}
                  placeholder="Last Name*"
                  maxLength="50"
                  required
                />
              </div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Email</div>
              <div className="TableRowItem3">
                <input
                  type="email"
                  id="client_contactEmail"
                  name="client_contactEmail"
                  value={this.props.booking.client_contactEmail}
                  placeholder="Email*"
                  maxLength="50"
                  required
                />
              </div>
            </div>
            */}
            <div className="TableRow">
              <div className="TableRowItem1">Contact Number</div>
              <div className="TableRowItem3">
                <input
                  type="text"
                  id="client_contactNumber"
                  name="client_contactNumber"
                  value={this.state.client_contactNumber}
                  onChange={(e) => this.setState({ client_contactNumber: e.target.value })}
                  placeholder="Contact Number*"
                  maxLength="8"
                  required
                />
              </div>
            </div>
            <div>
              <a href="#" className="btn btn-primary" onClick={this.onClickSave('user')}>Save</a>
              <a href="#" className="btn btn-primary" onClick={this.onClickStopEdit('user')}>Cancel</a>
            </div>
          </form>
        </div>
      );
    } else {
      userDetails = (
        <div>
          <div className="TableRow">
            <div className="TableRowItem1">First Name</div>
            <div className="TableRowItem3">{booking && booking.client_firstName}</div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Last Name</div>
            <div className="TableRowItem3">{booking && booking.client_lastName}</div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Email</div>
            <div className="TableRowItem3">{booking && booking.client_contactEmail}</div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Contact Number</div>
            <div className="TableRowItem3">{booking && booking.client_contactNumber}</div>
          </div>
        </div>
      );
    }
    if (this.state.editingPatient) {
      patientDetails = (
        <div>
          <form ref={(c) => (this.patientDetailsForm = c)} onSubmit={this.onClickSave('patient')}>
            <div className="TableRow">
              <div className="TableRowItem1">First Name</div>
              <div className="TableRowItem3">
                <input
                  type="text"
                  id="patient_firstName"
                  name="patient_firstName"
                  value={booking && booking.patient_firstName}
                  placeholder="First Name*"
                  maxLength="50"
                  required
                />
              </div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Last Name</div>
              <div className="TableRowItem3">
                <input
                  type="text"
                  id="patient_lastName"
                  name="patient_lastName"
                  value={booking && booking.patient_lastName}
                  placeholder="Last Name*"
                  maxLength="50"
                  required
                />
              </div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Gender</div>
              <div className="TableRowItem3">
                <div className="radio radio-inline">
                  <input
                    type="radio"
                    id="patient_gender_male"
                    name="patient_gender"
                    checked={booking && booking.patient_gender === 'Male'}
                    value="Male"
                    required
                  />
                  <label htmlFor="patient_gender_male"><span><span></span></span><span>Male</span></label>
                </div>
                <div className="radio radio-inline">
                  <input
                    type="radio"
                    id="patient_gender_female"
                    name="patient_gender"
                    checked={booking && booking.patient_gender === 'Female'}
                    value="Female"
                    required
                  />
                  <label htmlFor="patient_gender_female"><span><span></span></span><span>Female</span></label>
                </div>
              </div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Date of Birth</div>
              <div className="TableRowItem3">
                <DatePicker
                  selected={booking && booking.patient_dob && moment(booking.patient_dob)}
                  maxDate={moment()}
                  dateFormat="YYYY-MM-DD"
                  showYearDropdown
                  onChange={this.onSelectDob}
                  placeholderText="Date of Birth* (Y-M-D)"
                />
              </div>
            </div>
            <div>
              <a href="#" className="btn btn-primary" onClick={this.onClickSave('patient')}>Save</a>
              <a href="#" className="btn btn-primary" onClick={this.onClickStopEdit('patient')}>Cancel</a>
            </div>
          </form>
        </div>
      );
    } else {
      patientDetails = (
        <div>
          <div className="TableRow">
            <div className="TableRowItem1">First Name</div>
            <div className="TableRowItem3">{booking && booking.patient_firstName}</div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Last Name</div>
            <div className="TableRowItem3">{booking && booking.patient_lastName}</div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Gender</div>
            <div className="TableRowItem3">{booking && booking.patient_gender}</div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Date of Birth</div>
            <div className="TableRowItem3">
              {booking && booking.patient_dob
                && moment(booking.patient_dob, 'YYYY-MM-DD').format('ll')}
            </div>
          </div>
        </div>
      );
    }
    if (this.state.editingAddress) {
      addressDetails = (
        <div>
          <form ref={(c) => (this.addressDetailsForm = c)} onSubmit={this.onClickSave('address')}>
            <div className="TableRow">
              <div className="TableRowItem1">Postal Code</div>
              <div className="TableRowItem3">
                <input
                  type="text"
                  id="postal"
                  name="postal"
                  onChange={this.onChangePostalCode}
                  value={this.state.postal}
                  placeholder="Enter Postal Code*"
                  required
                />
              </div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Address</div>
              <div className="TableRowItem3">
                <textarea
                  id="address"
                  name="address"
                  value={this.state.address}
                  onChange={(e) => this.setState({ address: e.target.value })}
                  placeholder="Enter Address*"
                  required
                />
              </div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Unit Number</div>
              <div className="TableRowItem3">
                <input
                  type="text"
                  id="unit"
                  name="unit"
                  value={this.state.unit}
                  onChange={(e) => this.setState({ unit: e.target.value })}
                  placeholder="Enter Unit Number"
                />
              </div>
            </div>
            <div>
              <a href="#" className="btn btn-primary" onClick={this.onClickSave('address')}>Save</a>
              <a href="#" className="btn btn-primary" onClick={this.onClickStopEdit('address')}>Cancel</a>
            </div>
          </form>
        </div>
      );
    } else {
      addressDetails = (
        <div>
          <div>
            {booking && booking.case
              && booking.case.addresses
              && booking.case.addresses[0]
              && booking.case.addresses[0].address}
          </div>
          <div>
            {booking && booking.case
              && booking.case.addresses
              && booking.case.addresses[0]
              && booking.case.addresses[0].unit}
          </div>
        </div>
      );
    }
    // show payment button only if booking is "Closed" and not yet paid, and if not editing
    if ((booking && booking.case
      && booking.case.status === 'Closed' && !booking.case.isPaid)
      && (!this.state.editingUser && !this.state.editingPatient && !this.state.editingAddress)) {
      paymentButton = (
        <a href="#" className="btn btn-primary" onClick={this.onNext}>GO TO PAYMENT</a>
      );
    }

    return (
      <div className={s.bookingConfirmation}>
        <Container>
          <Loader className="spinner" loaded={!bookingFetching}>
            <div className={s.bookingConfirmationWrapper}>
              <div className={s.bookingConfirmationBody}>
                <div className={s.bookingConfirmationBodySection}>
                  <div className={s.bookingConfirmationBodySectionTitle}>
                    <h3>Appointment Sessions to Pay</h3>
                  </div>
                  <Loader className="spinner" loaded={!sessionsFetching}>
                    {sessionsDetails}
                  </Loader>
                </div>
                <div className={s.bookingConfirmationBodyActions}>
                  <span className={s.bookingConfirmationFooter}>
                    <button type="button" className="btn btn-primary" onClick={this.onNext}>CONTINUE PAYMENT</button>
                  </span>
                </div>
                { /*
                <div className={s.bookingConfirmationBodySection}>
                  <div className={s.bookingConfirmationBodySectionTitle}>
                    <h3>Contact Person Details</h3>
                    {/* <a href="#" className={this.state.editingUser ? 'hidden' : ''}
                      onClick={this.onClickEdit('user')}><img src={require('../pencil.png')} /></a> }
                  </div>
                  <Loader className="spinner" loaded={!this.state.updatingUser}>
                    { /*
                      <SessionClientDetails
                        client={session.client}
                      />
                     }
                  </Loader>
                </div>
                <div className={s.bookingConfirmationBodySection}>
                  <div className={s.bookingConfirmationBodySectionTitle}>
                    <h3>Patient Details</h3>
                    {/* <a href="#" className={this.state.editingPatient ? 'hidden' : ''}
                      onClick={this.onClickEdit('patient')}><img src={require('../pencil.png')} /></a> }
                  </div>
                  {patientDetails}
                </div>
                <div className={s.bookingConfirmationBodySection}>
                  <div className={s.bookingConfirmationBodySectionTitle}>
                    <h3>Patient Location / Address</h3>
                    {/* <a href="#" className={this.state.editingAddress ? 'hidden' : ''}
                      onClick={this.onClickEdit('address')}><img src={require('../pencil.png')} /></a> }
                  </div>
                  <Loader className="spinner" loaded={!this.state.updatingAddress}>
                    {addressDetails}
                  </Loader>
                </div>
                <div className={s.bookingConfirmationFooter}>
                  {paymentButton}
                </div>
                */ }
              </div>
              {this.props.children}
            </div>
          </Loader>
        </Container>
      </div>
    );
  }

}

BookingConfirmation.propTypes = {
  children: React.PropTypes.node,

  config: React.PropTypes.object,
  services: React.PropTypes.object,
  user: React.PropTypes.object,
  booking: React.PropTypes.object,
  bookingFetching: React.PropTypes.bool,
  sessions: React.PropTypes.object,
  sessionsFetching: React.PropTypes.bool,

  fetchServices: React.PropTypes.func,
  getSessions: React.PropTypes.func,
  editBooking: React.PropTypes.func,
  setPostStatus: React.PropTypes.func,
};

const mapStateToProps = (state) => ({
  config: state.config.data,
  services: state.services.data,
  user: state.user.data,
  booking: state.booking.data,
  bookingFetching: state.booking.isFetching,
  sessions: state.sessions.data,
  sessionsFetching: state.sessions.isFetching,
});

const mapDispatchToProps = (dispatch) => ({
  fetchServices: () => dispatch(fetchServices()),
  getSessions: (params) => dispatch(getSessions(params)),
  editBooking: (booking) => dispatch(editBooking(booking)),
  setPostStatus: (status) => dispatch(setPostStatus(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookingConfirmation);
