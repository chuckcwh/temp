/* global google */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Loader from 'react-loader';
import s from './SessionsView.css';
import Container from '../Container';
import Link from '../Link';
import InlineForm from '../InlineForm';
import CloseButton from '../CloseButton';
import ConfirmPopup from '../ConfirmPopup';
import SessionPatientDetails from '../SessionPatientDetails';
import SessionAddressDetails from '../SessionAddressDetails';
import SessionProviderDetails from '../SessionProviderDetails';
import { SESSION_CANCEL_SUCCESS,
    fetchServices, getSessions, getPatients, getSuggestedSession, editBooking,
    clearBooking, setPostStatus, cancelSession,
  showConfirmPopup, showDayPickerPopup, showInlineForm } from '../../actions';
import { configToName, formatSessionAlias, isClient, isProvider } from '../../core/util';
import history from '../../core/history';

const imgPencil = require('../pencil.png');

class SessionsView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editingClient: false,
      editingPatient: false,
      editingAddress: false,
    };
  }

  componentDidMount() {
    this.props.fetchServices();
    this.props.user && this.props.user._id && isClient(this.props.user)
      && this.props.getSessions({
        client: this.props.user._id,
      })
      && this.props.getPatients({
        userId: this.props.user._id
      });
    this.props.user
      && this.props.user._id
      && isProvider(this.props.user)
      && this.props.params
      && this.props.params.sessionId
      && this.props.getSuggestedSession({
        providerId: this.props.user._id,
        sessionId: this.props.params.sessionId,
      });
  }

  componentWillReceiveProps(newProps) {
    if (newProps.user !== this.props.user) {
      newProps.user && newProps.user._id && isClient(newProps.user)
        && newProps.getSessions({
          client: newProps.user._id,
        })
        && newProps.getPatients({
          userId: newProps.user._id
        });
      newProps.user
        && newProps.user._id
        && isProvider(newProps.user)
        && newProps.params
        && newProps.params.sessionId
        && newProps.getSuggestedSession({
          providerId: newProps.user._id,
          sessionId: newProps.params.sessionId,
        });
    }
  }

  isEditing = () => {
    return this.state.editingClient
      || this.state.editingPatient
      || this.state.editingAddress;
  };

  handleEdit = (entity) => () => {
    switch (entity) {
      case 'client':
        this.setState({ editingClient: true });
        break;
      case 'patient':
        this.setState({ editingPatient: true });
        break;
      case 'address':
        this.setState({ editingAddress: true });
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
    const postalCodeInput = event.target;
    this.setState({
      postalCode: postalCodeInput.value,
    });
    if (postalCodeInput.value.length === 6) {
      // console.log(postalCodeInput.value);
      try {
        // postalCodeInput.disabled = true;
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({
          address: postalCodeInput.value,
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
                // postalCodeInput.disabled = false;
              } else {
                // postalCodeInput.disabled = false;
                // console.error('Invalid postal code.');
              }
            });
          } else {
            // postalCodeInput.disabled = false;
            // console.error('Invalid postal code.');
          }
        });
      } catch (e) {
        // postalCodeInput.disabled = false;
        // console.error('Unable to find your address.');
      }
    }
  };

  onClickManageBooking = (event) => {
    this.props.clearBooking();

    event.preventDefault();
    history.push('/booking-manage');
  };

  onClickPay = (event) => {
    const location = history.getCurrentLocation();

    // Link.handleClick(event);
    event.preventDefault();
    history.push({ pathname: '/booking-confirmation', query: location.query });

    this.props.setPostStatus('confirmation');
  };

  onCancelSession = (session) => () => {
    this.props.showConfirmPopup('Are you sure you want to cancel this session?', () => {
      this.props.cancelSession({
        sessionId: session._id,
      }).then((res) => {
        if (res && res.type === SESSION_CANCEL_SUCCESS) {
          this.props.getSession({
            sessionId: session._id,
          });
        }
      });
    });
  };

  render() {
    const { params, config, services, user, sessions, sessionsFetching, patients, patientsFetching } = this.props;
    const session = sessions && params && params.sessionId && sessions[params.sessionId];
    const patient = (patients && session && session.patient && patients[session.patient])
      || (patients && session && session.patient);
    let patientDetails,
      addressDetails,
      sessionDetails,
      caregiverSection,
      paymentButton;
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
    // patientDetails = (
    //   <div>
    //     <div className="TableRow">
    //       <div className="TableRowItem1">Name</div>
    //       <div className="TableRowItem3">{patient && patient.name}</div>
    //     </div>
    //     <div className="TableRow">
    //       <div className="TableRowItem1">Gender</div>
    //       <div className="TableRowItem3">
    //         {configToName(config, 'gendersByValue', patient && patient.gender)}
    //       </div>
    //     </div>
    //     <div className="TableRow">
    //       <div className="TableRowItem1">Date of Birth</div>
    //       <div className="TableRowItem3">
    //         {patient && patient.dob
    //           && moment(patient.dob).format('ll')}
    //       </div>
    //     </div>
    //     <div className="TableRow">
    //       <div className="TableRowItem1">Age</div>
    //       <div className="TableRowItem3">
    //         {patient && patient.dob
    //           && moment().diff(moment(patient.dob), 'years')}
    //       </div>
    //     </div>
    //     <div className="TableRow">
    //       <div className="TableRowItem1">Contact</div>
    //       <div className="TableRowItem3">{patient && patient.contact}</div>
    //     </div>
    //     {patient && patient.diagnosis &&
    //       <div className="TableRow">
    //         <div className="TableRowItem1">Main Diagnosis</div>
    //         <div className="TableRowItem3">
    //           {patient.diagnosis}
    //         </div>
    //       </div>
    //     }
    //     {patient && patient.mobility &&
    //       <div className="TableRow">
    //         <div className="TableRowItem1">Mobility</div>
    //         <div className="TableRowItem3">
    //           {patient.mobility}
    //         </div>
    //       </div>
    //     }
    //     {patient && patient.specialNotes &&
    //       <div className="TableRow">
    //         <div className="TableRowItem1">Special Notes</div>
    //         <div className="TableRowItem3">
    //           {patient.specialNotes}
    //         </div>
    //       </div>
    //     }
    //   </div>
    // );
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
    // addressDetails = (
    //   <div>
    //     <div className="TableRow">
    //       <div className="TableRowItem1">Address</div>
    //       <div className="TableRowItem3">
    //         {session && session.address && session.address.description}
    //       </div>
    //     </div>
    //     {session && session.address && session.address.unit &&
    //       <div className="TableRow">
    //         <div className="TableRowItem1">Unit</div>
    //         <div className="TableRowItem3">
    //           {session && session.address && session.address.unit}
    //         </div>
    //       </div>
    //     }
    //     <div className="TableRow">
    //       <div className="TableRowItem1">Postal Code</div>
    //       <div className="TableRowItem3">
    //         {session && session.address && session.address.postal}
    //       </div>
    //     </div>
    //     <div className="TableRow">
    //       <div className="TableRowItem1">Region</div>
    //       <div className="TableRowItem3">
    //         {session && session.address && session.address.region}
    //       </div>
    //     </div>
    //   </div>
    // );
    // }
    // sessionDetails = (
    //   <div>
    //     <div className="TableRow TableRowHeader">
    //       <div className="TableRowItem2">Date</div>
    //       <div className="TableRowItem2">Session</div>
    //       <div className="TableRowItem2">Costs</div>
    //       <div className="TableRowItem2">Status</div>
    //       <div className="TableRowItem1"></div>
    //     </div>
    //     {
    //       booking && booking.sessions.map(session => (
    //           <div className="TableRow" key={session._id}>
    //             <div className="TableRowItem2">{moment(session.date).format('D MMM YY')}</div>
    //             <div className="TableRowItem2">
    //               {configToName(config, 'timeSlotsByValue', session.timeSlot)}
    //             </div>
    //             <div className="TableRowItem2">
    //               $ {session.pdiscount ? ((100 - parseFloat(session.pdiscount)) * parseFloat(session.price) / 100).toFixed(2) : parseFloat(session.price).toFixed(2)}
    //             </div>
    //             <div className="TableRowItem2">
    //               {configToName(config, 'sessionPhasesByValue', session.phase)}
    //             </div>
    //             <div className="TableRowItem1">
    //               {session.status === 'open' && moment(session.date).isAfter(moment(), 'day')
    //                 && <CloseButton onCloseClicked={this.onCancelSession(session)} />}
    //             </div>
    //           </div>
    //       ))
    //     }
    //   </div>
    // );
    // show caregiver section only if case has been paid
    if (session && session.isPaid) {
      caregiverSection = (
        <div className={s.sessionsViewBodySection}>
          <div className={s.sessionsViewBodySectionTitle}>
            <h3>Caregiver Details</h3>
          </div>
          <div>
            <div className="TableRow">
              <div className="TableRowItem1">Name</div>
              <div className="TableRowItem3">
                {session && session.provider
                  && session.provider.name}
              </div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Email</div>
              <div className="TableRowItem3">
                {session && session.provider
                  && session.provider.email}
              </div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Contact Number</div>
              <div className="TableRowItem3">
                {session && session.provider
                  && session.provider.contact}
              </div>
            </div>
          </div>
        </div>
      );
    }
    // show payment button only if booking is "Closed" and not yet paid, and if not editing
    if ((session
      && session.phase === 'pending-payment' && !session.isPaid)
      && (!this.state.editingUser && !this.state.editingPatient && !this.state.editingAddress)) {
      paymentButton = (
        <a href="#" className="btn btn-primary btn-small" onClick={this.onClickPay}>GO TO PAYMENT</a>
      );
    }

    return (
      <div className={s.sessionsView}>
        <Container>
          <Loader className="spinner" loaded={!sessionsFetching}>
            <div className={s.sessionsViewWrapper}>
              <div className={s.sessionsViewBody}>
                <div className={s.sessionsViewBodyActions}>
                  <span>
                    <Link to="/dashboard" className="btn btn-primary btn-small">BACK</Link>
                  </span>
                  <span>
                    {paymentButton}
                  </span>
                </div>
                <h2>{`Session ID: ${session && formatSessionAlias(session.alias)}`}</h2>
                <div>
                  <div>
                    <div className="TableRow">
                      <div className="TableRowItem1">Status</div>
                      <div className="TableRowItem3">
                        {config && config.sessionPhasesByValue
                          && session && session.phase
                          && config.sessionPhasesByValue[session.phase]
                          && config.sessionPhasesByValue[session.phase].name}
                      </div>
                    </div>
                    <div className="TableRow">
                      <div className="TableRowItem1">Service</div>
                      <div className="TableRowItem3">
                        {services && session && session.service
                          && services[session.service]
                          && services[session.service].name}
                      </div>
                    </div>
                    <div className="TableRow">
                      <div className="TableRowItem1">Duration</div>
                      <div className="TableRowItem3">
                        {`${services && session && session.service && session.serviceClass
                          && services[session.service]
                          && services[session.service].classes
                          && services[session.service].classes[session.serviceClass]
                          && services[session.service].classes[session.serviceClass].duration} hours`}
                      </div>
                    </div>
                    <div className="TableRow">
                      <div className="TableRowItem1">Date</div>
                      <div className="TableRowItem3">
                        {session && session.date
                          && moment(session.date).format('ll')}
                      </div>
                    </div>
                    <div className="TableRow">
                      <div className="TableRowItem1">Time</div>
                      <div className="TableRowItem3">
                        {session && session.timeSlot
                          && configToName(config, 'timeSlotsByValue', session.timeSlot)}
                      </div>
                    </div>
                    <div className="TableRow">
                      <div className="TableRowItem1">Price</div>
                      <div className="TableRowItem3">
                        {`$${session && parseFloat(session.price).toFixed(2)}`}
                      </div>
                    </div>
                    {session && session.additionalInfo &&
                      <div className="TableRow">
                        <div className="TableRowItem1">Additional Notes</div>
                        <div className="TableRowItem3">
                          {session.additionalInfo}
                        </div>
                      </div>
                    }
                  </div>
                </div>
                <div className={s.sessionsViewBodyColumnWrapper}>
                  <div className={s.sessionsViewBodyColumn}>
                    {patient &&
                      <div className={s.sessionsViewBodySection}>
                        <SessionPatientDetails
                          config={config}
                          patient={patient}
                          canEdit={isClient(user)}
                        />
                      </div>
                    }
                    <div className={s.sessionsViewBodySection}>
                      <Loader className="spinner" loaded={!this.state.updatingAddress}>
                        <SessionAddressDetails
                          address={session && session.address}
                        />
                      </Loader>
                    </div>
                  </div>
                  <div className={s.sessionsViewBodyColumn}>
                    {!isProvider(user) && session && session.provider &&
                      <div className={s.sessionsViewBodySection}>
                        <SessionProviderDetails
                          provider={session && session.provider}
                        />
                      </div>
                    }
                  </div>
                </div>
                <div className={s.sessionsViewFooter}>
                  <span>
                    {paymentButton}
                  </span>
                  <span>
                    <Link to="/dashboard" className="btn btn-primary btn-small">BACK</Link>
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

SessionsView.propTypes = {
  children: React.PropTypes.node,
  params: React.PropTypes.object,

  config: React.PropTypes.object,
  user: React.PropTypes.object,
  services: React.PropTypes.object,
  servicesFetching: React.PropTypes.bool,
  sessions: React.PropTypes.object,
  sessionsFetching: React.PropTypes.bool,
  patients: React.PropTypes.object,
  patientsFetching: React.PropTypes.bool,
  // inlineForm: React.PropTypes.object,

  fetchServices: React.PropTypes.func.isRequired,
  getSessions: React.PropTypes.func.isRequired,
  getPatients: React.PropTypes.func.isRequired,
  getSuggestedSession: React.PropTypes.func.isRequired,
  editBooking: React.PropTypes.func.isRequired,
  clearBooking: React.PropTypes.func.isRequired,
  setPostStatus: React.PropTypes.func.isRequired,
  cancelSession: React.PropTypes.func.isRequired,
  showConfirmPopup: React.PropTypes.func.isRequired,
  showInlineForm: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  config: state.config.data,
  user: state.user.data,
  services: state.services.data,
  servicesFetching: state.services.isFetching,
  sessions: state.user.data && state.user.data._id &&
    isProvider(state.user.data)
      ?
      (state.sessionsSuggestedToProvider[state.user.data._id]
      && state.sessionsSuggestedToProvider[state.user.data._id].data)
      :
      (state.sessionsByUser[state.user.data._id]
      && state.sessionsByUser[state.user.data._id].data),
  sessionsFetching: state.user.data && state.user.data._id &&
    isProvider(state.user.data)
      ?
      (state.sessionsSuggestedToProvider[state.user.data._id]
      && state.sessionsSuggestedToProvider[state.user.data._id].isFetching)
      :
      (state.sessionsByUser[state.user.data._id]
      && state.sessionsByUser[state.user.data._id].isFetching),
  patients: state.user.data && state.user.data._id
    && state.patientsByClient[state.user.data._id]
    && state.patientsByClient[state.user.data._id].data,
  patientsFetching: state.user.data && state.user.data._id
    && state.patientsByClient[state.user.data._id]
    && state.patientsByClient[state.user.data._id].isFetching,
  // inlineForm: state.inlineForm,
});

const mapDispatchToProps = (dispatch) => ({
  fetchServices: () => dispatch(fetchServices()),
  getSessions: (params) => dispatch(getSessions(params)),
  getPatients: (params) => dispatch(getPatients(params)),
  getSuggestedSession: (params) => dispatch(getSuggestedSession(params)),
  editBooking: (booking) => dispatch(editBooking(booking)),
  clearBooking: () => dispatch(clearBooking()),
  setPostStatus: (status) => dispatch(setPostStatus(status)),
  cancelSession: (params) => dispatch(cancelSession(params)),
  showConfirmPopup: (body, accept) => dispatch(showConfirmPopup(body, accept)),
  showDayPickerPopup: (body, accept) => dispatch(showDayPickerPopup(body, accept)),
  showInlineForm: (params) => dispatch(showInlineForm(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SessionsView);
