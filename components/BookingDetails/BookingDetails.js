import React, { Component } from 'react';
import { connect } from 'react-redux';
import linkState from 'react-link-state';
import moment from 'moment';
import Loader from 'react-loader';
import s from './BookingDetails.css';
import Container from '../Container';
import Link from '../Link';
import InlineForm from '../InlineForm';
import CloseButton from '../CloseButton';
import ConfirmPopup from '../ConfirmPopup';
import { fetchServices, getBooking, editBooking, clearBooking, setPostStatus, cancelBookingSession, showConfirmPopup, showInlineForm } from '../../actions';
import history from '../../core/history';
import util from '../../core/util';

class BookingDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editing: false,
    };
  }

  componentDidMount() {
    this.props.fetchServices();
  }

  render() {
    var userDetails, patientDetails, addressDetails, sessionDetails, caregiverSection, paymentButton;
    if (this.state.editing && this.props.inlineForm && /^(userDetails)$/i.test(this.props.inlineForm.name)) {
      userDetails = <InlineForm />;
    } else {
      userDetails = (
        <div>
          <div className="TableRow">
            <div className="TableRowItem1">First Name</div>
            <div className="TableRowItem3">{this.props.booking && this.props.booking.client_firstName}</div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Last Name</div>
            <div className="TableRowItem3">{this.props.booking && this.props.booking.client_lastName}</div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Email</div>
            <div className="TableRowItem3">{this.props.booking && this.props.booking.client_contactEmail}</div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Contact Number</div>
            <div className="TableRowItem3">{this.props.booking && this.props.booking.client_contactNumber}</div>
          </div>
        </div>
      );
    }
    if (this.state.editingPatient) {
      patientDetails = (
        <div>
          <form ref={(c) => this._patientDetailsForm = c}>
            <div className="TableRow">
              <div className="TableRowItem1">First Name</div>
              <div className="TableRowItem3">
                <input type="text" id="patient_firstName" name="patient_firstName" value={this.props.booking && this.props.booking.patient_firstName} placeholder="First Name*" maxLength="50" required />
              </div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Last Name</div>
              <div className="TableRowItem3">
                <input type="text" id="patient_lastName" name="patient_lastName" value={this.props.booking && this.props.booking.patient_lastName} placeholder="Last Name*" maxLength="50" required />
              </div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Gender</div>
              <div className="TableRowItem3">
                <div className="radio radio-inline">
                  <input type="radio" id="patient_gender_male" name="patient_gender" checked={this.props.booking && this.props.booking.patient_gender==='Male'} value="Male" required />
                  <label htmlFor="patient_gender_male"><span><span></span></span><span>Male</span></label>
                </div>
                <div className="radio radio-inline">
                  <input type="radio" id="patient_gender_female" name="patient_gender" checked={this.props.booking && this.props.booking.patient_gender==='Female'} value="Female" required />
                  <label htmlFor="patient_gender_female"><span><span></span></span><span>Female</span></label>
                </div>
              </div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Date of Birth</div>
              <div className="TableRowItem3">
                <DatePicker selected={moment(this.props.booking.patient_dob)} maxDate={moment()} dateFormat="YYYY-MM-DD" showYearDropdown onChange={this._onSelectDob.bind(this)} placeholderText="Date of Birth* (Y-M-D)" />
              </div>
            </div>
            <div>
              <a href="#" className="btn btn-primary" onClick={this._onClickSave.bind(this, 'patient')}>Save</a>
              <a href="#" className="btn btn-primary" onClick={this._onClickStopEdit.bind(this, 'patient')}>Cancel</a>
            </div>
          </form>
        </div>
      );
    } else {
      patientDetails = (
        <div>
          <div className="TableRow">
            <div className="TableRowItem1">First Name</div>
            <div className="TableRowItem3">{this.props.booking && this.props.booking.patient_firstName}</div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Last Name</div>
            <div className="TableRowItem3">{this.props.booking && this.props.booking.patient_lastName}</div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Gender</div>
            <div className="TableRowItem3">{this.props.booking && this.props.booking.patient_gender}</div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Date of Birth</div>
            <div className="TableRowItem3">{this.props.booking && this.props.booking.patient_dob && moment(this.props.booking.patient_dob, 'YYYY-MM-DD').format('ll')}</div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Additional Notes</div>
            <div className="TableRowItem3">{this.props.booking && this.props.booking.case && this.props.booking.case.notes}</div>
          </div>
        </div>
      );
    }
    if (this.state.editingAddress) {
      addressDetails = (
        <div>
          <form ref={(c) => this._addressDetailsForm = c}>
            <div className="TableRow">
              <div className="TableRowItem1">Postal Code</div>
              <div className="TableRowItem3">
                <input type="text" id="postalCode" name="postalCode" onChange={this._onChangePostalCode.bind(this)} value={this.state.postalCode} placeholder="Enter Postal Code*" required />
              </div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Address</div>
              <div className="TableRowItem3">
                <textarea id="address" name="address" valueLink={linkState(this, 'address')} placeholder="Enter Address*" required />
              </div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Unit Number</div>
              <div className="TableRowItem3">
                <input type="text" id="unitNumber" name="unitNumber" valueLinkg={linkState(this, 'unitNumber')} placeholder="Enter Unit Number" />
              </div>
            </div>
            <div>
              <a href="#" className="btn btn-primary" onClick={this._onClickSave.bind(this, 'address')}>Save</a>
              <a href="#" className="btn btn-primary" onClick={this._onClickStopEdit.bind(this, 'address')}>Cancel</a>
            </div>
          </form>
        </div>
      );
    } else {
      addressDetails = (
        <div>
          <div>{this.props.booking && this.props.booking.case && this.props.booking.case.addresses[0] && this.props.booking.case.addresses[0].address}</div>
          <div>{this.props.booking && this.props.booking.case && this.props.booking.case.addresses[0] && this.props.booking.case.addresses[0].unitNumber}</div>
        </div>
      );
    }
    sessionDetails = (
      <div>
        <div className="TableRow TableRowHeader">
          <div className="TableRowItem2">Date</div>
          <div className="TableRowItem2">Session</div>
          <div className="TableRowItem2">{(this.props.booking && this.props.booking.case && this.props.booking.case.isPaid) ? '' : 'Estimated '}Costs</div>
          <div className="TableRowItem2">Status</div>
          <div className="TableRowItem1"></div>
        </div>
        {
          this.props.booking && this.props.booking.case && this.props.booking.case.dates && this.props.booking.case.dates.map(session => {
            return (
              <div className="TableRow" key={session.id}>
                <div className="TableRowItem2">{moment(session.dateTimeStart).format('D MMM')}</div>
                <div className="TableRowItem2">{session.estTime}</div>
                <div className="TableRowItem2">$ {session.pdiscount ? ((100 - parseFloat(session.pdiscount)) * parseFloat(session.price) / 100).toFixed(2) : session.price}</div>
                <div className="TableRowItem2">{session.status}</div>
                <div className="TableRowItem1">
                  {session.status === 'Active' && moment(session.dateTimeStart).isAfter(moment(), 'day') && <CloseButton onCloseClicked={this._onCancelSession.bind(this, session)} />}
                </div>
              </div>
            );
          })
        }
      </div>
    );
    // show caregiver section only if case has been paid
    if (this.props.booking && this.props.booking.case && this.props.booking.case.isPaid) {
      caregiverSection = (
        <div className={s.bookingDetailsBodySection}>
          <div className={s.bookingDetailsBodySectionTitle}>
            <h3>Caregiver Details</h3>
          </div>
          <div>
            <div className="TableRow">
              <div className="TableRowItem1">Name</div>
              <div className="TableRowItem3">{this.props.booking && this.props.booking.case && this.props.booking.case.quotes && this.props.booking.case.quotes[0] && this.props.booking.case.quotes[0].fullName}</div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Email</div>
              <div className="TableRowItem3">{this.props.booking && this.props.booking.case && this.props.booking.case.quotes && this.props.booking.case.quotes[0] && this.props.booking.case.quotes[0].user && this.props.booking.case.quotes[0].user.email}</div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Contact Number</div>
              <div className="TableRowItem3">{this.props.booking && this.props.booking.case && this.props.booking.case.quotes && this.props.booking.case.quotes[0] && this.props.booking.case.quotes[0].user && this.props.booking.case.quotes[0].user.mobilePhone}</div>
            </div>
          </div>
        </div>
      );
    }
    // show payment button only if booking is "Closed" and not yet paid, and if not editing
    if ((this.props.booking && this.props.booking.case && this.props.booking.case.status === 'Closed' && !this.props.booking.case.isPaid && this.props.booking.case.transactions && !this.props.booking.case.transactions.length) && (!this.state.editingUser && !this.state.editingPatient && !this.state.editingAddress)) {
      paymentButton = (
        <a href="#" className="btn btn-primary" onClick={this._onClickPay.bind(this)}>GO TO PAYMENT</a>
      );
    }

    // set booking status
    var bookingStatus = '';
    if (this.props.booking && this.props.booking.case && this.props.booking.case.status === 'Accepting Quotes') {
      bookingStatus = 'Awaiting Caregiver';
    } else if (this.props.booking && this.props.booking.case && this.props.booking.case.status === 'Closed' && this.props.booking.case.isPaid) {
      bookingStatus = 'Paid & Confirmed';
    } else if (this.props.booking && this.props.booking.case && this.props.booking.case.status === 'Closed' && !this.props.booking.case.isPaid) {
      bookingStatus = 'Awaiting Payment';

      if (this.props.booking.case.transactions && this.props.booking.case.transactions.length) {
        for (var i in this.props.booking.case.transactions) {
          if (this.props.booking.case.transactions[i].type === 'Payment' && this.props.booking.case.transactions[i].method === 'Bank' && this.props.booking.case.transactions[i].status === 'Pending') {
            bookingStatus = 'Processing Payment';            
          }
        }
      }
    } else {
      bookingStatus = this.props.booking && this.props.booking.case && this.props.booking.case.status;
    }

    return (
      <div className={s.bookingDetails}>
        <Container>
          <Loader className="spinner" loaded={this.props.bookingFetching ? false : true}>
            <div className={s.bookingDetailsWrapper}>
              <div className={s.bookingDetailsBody}>
                <div className={s.bookingDetailsBodyActions}>
                  <span className={s.bookingDetailsFooter}>
                    {paymentButton}
                  </span>
                  <span className={s.bookingDetailsFooter}>
                    <a href="/booking-manage" className="btn btn-primary" onClick={this._onClickManageBooking.bind(this)}>VIEW ANOTHER</a>
                  </span>
                </div>
                <h2>Booking ID: #{this.props.booking && this.props.booking.id}</h2>
                <div className="">
                  <div>
                    <div className="TableRow">
                      <div className="TableRowItem1">Status</div>
                      <div className="TableRowItem3">{bookingStatus}</div>
                    </div>
                  </div>
                </div>
                <div className="">
                  <div>
                    <div className="TableRow">
                      <div className="TableRowItem1">Service</div>
                      <div className="TableRowItem3">{this.props.allServices && this.props.booking && this.props.booking.case && this.props.booking.case.service && this.props.allServices[this.props.booking.case.service] && this.props.allServices[this.props.booking.case.service].name}</div>
                    </div>
                  </div>
                </div>
                <div className={s.bookingDetailsBodyColumnWrapper}>
                  <div className={s.bookingDetailsBodyColumn}>
                    <div className={s.bookingDetailsBodySection}>
                      <div className={s.bookingDetailsBodySectionTitle}>
                        <h3>Contact Person Details</h3>
                        <a href="#" className={(this.state.editingUser || (this.props.booking && this.props.booking.case && this.props.booking.case.isPaid)) ? 'hidden' : ''} onClick={this._onClickEdit.bind(this, 'userDetails')}><img src={require('../pencil.png')} /></a>
                      </div>
                      <Loader className="spinner" loaded={!this.state.updatingUser ? true : false}>
                        {userDetails}
                      </Loader>
                    </div>
                    <div className={s.bookingDetailsBodySection}>
                      <div className={s.bookingDetailsBodySectionTitle}>
                        <h3>Patient Details</h3>
                        {/*<a href="#" className={this.state.editingPatient ? 'hidden' : ''} onClick={this._onClickEdit.bind(this, 'patient')}><img src={require('../pencil.png')} /></a>*/}
                      </div>
                      {patientDetails}
                    </div>
                    <div className={s.bookingDetailsBodySection}>
                      <div className={s.bookingDetailsBodySectionTitle}>
                        <h3>Patient Location / Address</h3>
                        {/*<a href="#" className={this.state.editingAddress ? 'hidden' : ''} onClick={this._onClickEdit.bind(this, 'address')}><img src={require('../pencil.png')} /></a>*/}
                      </div>
                      <Loader className="spinner" loaded={!this.state.updatingAddress ? true : false}>
                        {addressDetails}
                      </Loader>
                    </div>
                  </div>
                  <div className={s.bookingDetailsBodyColumn}>
                    {caregiverSection}
                    <div className={s.bookingDetailsBodySection}>
                      <div className={s.bookingDetailsBodySectionTitle}>
                        <h3>Session Details</h3>
                        {/*<a href="#" className={this.state.editingPatient ? 'hidden' : ''} onClick={this._onClickEdit.bind(this, 'patient')}><img src={require('../pencil.png')} /></a>*/}
                      </div>
                      {sessionDetails}
                    </div>
                  </div>
                </div>
                <div className={s.bookingDetailsFooter}>
                  <span>
                    {paymentButton}
                  </span>
                  <span>
                    <a href="/booking-manage" className="btn btn-primary" onClick={this._onClickManageBooking.bind(this)}>VIEW ANOTHER</a>
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

  _onClickEdit(entity, event) {
    event.preventDefault();
    this.setState({ editing: true });

    switch (entity) {
      case 'userDetails':
        this.props.showInlineForm({
          name: 'userDetails',
          inputs: {
            client_firstName: {
              label: 'First Name',
              type: 'text',
              initialValue: this.props.booking && this.props.booking.client_firstName
            },
            client_lastName: {
              label: 'Last Name',
              type: 'text',
              initialValue: this.props.booking && this.props.booking.client_lastName
            },
            client_contactNumber: {
              label: 'Contact Number',
              type: 'text',
              initialValue: this.props.booking && this.props.booking.client_contactNumber
            },
          },
          validate: (values) => {
            const errors = {};
            if (!values.client_firstName) {
              errors.client_firstName = 'Required';
            }
            if (!values.client_lastName) {
              errors.client_lastName = 'Required';
            }
            if (!values.client_contactNumber) {
              errors.client_contactNumber = 'Required';
            } else if (!/^[8,9]{1}[0-9]{7}$/i.test(values.client_contactNumber)) {
              errors.client_contactNumber = 'Invalid mobile phone';
            }
            return errors;
          },
          ok: this._onClickSave.bind(this, 'userDetails'),
          cancel: () => { this.setState({ editing: false }); }
        });
        break;
      default:
        break;
    }
  }

  _onClickSave(entity, values, dispatch) {
    return new Promise((resolve, reject) => {
      switch (entity) {
        case 'userDetails':
          this.props.editBooking({
            bid: this.props.booking && this.props.booking.id,
            token: this.props.booking && this.props.booking.token,
            booking: {
              client_firstName: values.client_firstName,
              client_lastName: values.client_lastName,
              client_contactNumber: values.client_contactNumber
            }
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
    });
  }

  _onClickStopEdit(entity, event) {
    event.preventDefault();

    switch (entity) {
      case 'user':
        this.setState({editingUser: false});
        break;
      case 'patient':
        this.setState({editingPatient: false});
        break;
      case 'address':
        this.setState({editingAddress: false});
        break;
    }
  }

  _onSelectDob(date) {
    this.setState({
      patient_dob: date
    });
  }

  _onChangePostalCode(event) {
    var that = this;
    var postalCodeInput = event.target;
    this.setState({
      postalCode: postalCodeInput.value
    });
    if (postalCodeInput.value.length === 6) {
      // console.log(postalCodeInput.value);
      try {
        // postalCodeInput.disabled = true;
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode( {
          'address': postalCodeInput.value,
          'region': 'SG'
        }, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            var position = results[0].geometry.location;
            geocoder.geocode({
              latLng: position
            }, function(responses) {
              if (responses && responses.length > 0) {
                that.setState({
                  address: responses[0].formatted_address
                });
                // postalCodeInput.disabled = false;
              } else {
                // postalCodeInput.disabled = false;
                console.error('Invalid postal code.');
              }
            });
          } else {
            // postalCodeInput.disabled = false;
            console.error('Invalid postal code.');
          }
        });
      } catch(e) {
        // postalCodeInput.disabled = false;
        console.error('Unable to find your address.');
      }
    }
  };

  _onClickManageBooking(event) {
    this.props.clearBooking();

    event.preventDefault();
    history.push('/booking-manage');
  }

  _onClickPay(event) {
    const location = history.getCurrentLocation();

    // Link.handleClick(event);
    event.preventDefault();
    history.push({ pathname: '/booking-confirmation', query: location.query });

    this.props.setPostStatus('confirmation');
  }

  _onCancelSession(session, event) {
    return this.props.showConfirmPopup('Are you sure you want to cancel this session?', () => {
      this.props.cancelBookingSession({
        dateObjId: session.id,
        token: this.props.booking.token
      }, this.props.booking).then((res) => {
        if (res.response && res.response.status === 1) {
          this.props.getBooking({
            bid: this.props.booking.id,
            email: this.props.booking.client_contactEmail
          });
        }
      });
    });
  }

}

const mapStateToProps = (state) => {
  return {
    allServices: state.allServices.data,
    allServicesFetching: state.allServices.isFetching,
    booking: state.booking.data,
    bookingFetching: state.booking.isFetching,
    inlineForm: state.inlineForm,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchServices: () => {
      return dispatch(fetchServices());
    },
    getBooking: (params) => {
      return dispatch(getBooking(params));
    },
    editBooking: (booking) => {
      return dispatch(editBooking(booking));
    },
    clearBooking: () => {
      return dispatch(clearBooking());
    },
    setPostStatus: (status) => {
      return dispatch(setPostStatus(status));
    },
    cancelBookingSession: (params) => {
      return dispatch(cancelBookingSession(params));
    },
    showConfirmPopup: (body, accept) => {
      return dispatch(showConfirmPopup(body, accept));
    },
    showInlineForm: (params) => {
      return dispatch(showInlineForm(params));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingDetails);
