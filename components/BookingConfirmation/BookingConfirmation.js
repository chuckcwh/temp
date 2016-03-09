import React, { Component } from 'react';
import linkState from 'react-link-state';
import classNames from 'classNames';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Loader from 'react-loader';
import './BookingConfirmation.scss';
import Container from '../Container';
import Link from '../Link';
import BookingActions from '../../actions/BookingActions';
import BookingStore from '../../stores/BookingStore';

export default class BookingConfirmation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      booking: this.props.booking,
      editingUser: false,
      editingPatient: false,
      editingAddress: false,
      // temporary state variables
      user: {}
    };
  }

  render() {
    var userDetails, patientDetails, addressDetails;
    if (this.state.editingUser) {
      userDetails = (
        <div>
          <form id="userDetailsForm">
            <div className="TableRow">
              <div className="TableRowItem1">First Name</div>
              <div className="TableRowItem3">
                <input type="text" id="client_firstName" name="client_firstName" value={this.props.booking.client_firstName} placeholder="First Name*" maxLength="50" required />
              </div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Last Name</div>
              <div className="TableRowItem3">
                <input type="text" id="client_lastName" name="client_lastName" value={this.props.booking.client_lastName} placeholder="Last Name*" maxLength="50" required />
              </div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Email</div>
              <div className="TableRowItem3">
                <input type="email" id="client_contactEmail" name="client_contactEmail" value={this.props.booking.client_contactEmail} placeholder="Email*" maxLength="50" required />
              </div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Contact Number</div>
              <div className="TableRowItem3">
                <input type="text" id="client_contactNumber" name="client_contactNumber" value={this.props.booking.client_contactNumber} placeholder="Contact Number*" maxLength="8" required />
              </div>
            </div>
            <div>
              <a href="#" className="btn btn-primary" onClick={this._onClickSave.bind(this, 'user')}>Save</a>
              <a href="#" className="btn btn-primary" onClick={this._onClickStopEdit.bind(this, 'user')}>Cancel</a>
            </div>
          </form>
        </div>
      );
    } else {
      userDetails = (
        <div>
          <div className="TableRow">
            <div className="TableRowItem1">First Name</div>
            <div className="TableRowItem3">{this.props.booking.client_firstName}</div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Last Name</div>
            <div className="TableRowItem3">{this.props.booking.client_lastName}</div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Email</div>
            <div className="TableRowItem3">{this.props.booking.client_contactEmail}</div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Contact Number</div>
            <div className="TableRowItem3">{this.props.booking.client_contactNumber}</div>
          </div>
        </div>
      );
    }
    if (this.state.editingPatient) {
      patientDetails = (
        <div>
          <form id="patientDetailsForm">
            <div className="TableRow">
              <div className="TableRowItem1">First Name</div>
              <div className="TableRowItem3">
                <input type="text" id="patient_firstName" name="patient_firstName" value={this.props.booking.patient_firstName} placeholder="First Name*" maxLength="50" required />
              </div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Last Name</div>
              <div className="TableRowItem3">
                <input type="text" id="patient_lastName" name="patient_lastName" value={this.props.booking.patient_lastName} placeholder="Last Name*" maxLength="50" required />
              </div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Gender</div>
              <div className="TableRowItem3">
                <div className="radio radio-inline">
                  <input type="radio" id="patient_gender_male" name="patient_gender" checked={this.props.booking.patient_gender==='Male'} value="Male" required />
                  <label htmlFor="patient_gender_male"><span><span></span></span><span>Male</span></label>
                </div>
                <div className="radio radio-inline">
                  <input type="radio" id="patient_gender_female" name="patient_gender" checked={this.props.booking.patient_gender==='Female'} value="Female" required />
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
            <div className="TableRowItem3">{this.props.booking.patient_firstName}</div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Last Name</div>
            <div className="TableRowItem3">{this.props.booking.patient_lastName}</div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Gender</div>
            <div className="TableRowItem3">{this.props.booking.patient_gender}</div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Date of Birth</div>
            <div className="TableRowItem3">{moment(this.props.booking.patient_dob, 'YYYY-MM-DD').format('ll')}</div>
          </div>
        </div>
      );
    }
    if (this.state.editingAddress) {
      addressDetails = (
        <div>
          <form id="addressDetailsForm">
            <div className="TableRow">
              <div className="TableRowItem1">Postal Code</div>
              <div className="TableRowItem3">
                <input type="text" id="postalCode" name="postalCode" onChange={this._onChangePostalCode.bind(this)} value={this.props.booking.case.addresses[0].postalCode} placeholder="Enter Postal Code*" required />
              </div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Address</div>
              <div className="TableRowItem3">
                <textarea id="address" name="address" value={this.props.booking.case.addresses[0].address} placeholder="Enter Address*" required />
              </div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Unit Number</div>
              <div className="TableRowItem3">
                <input type="text" id="unitNumber" name="unitNumber" value={this.props.booking.case.addresses[0].unitNumber} placeholder="Enter Unit Number" />
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
          <div>{this.props.booking.case && this.props.booking.case.addresses[0].address}</div>
          <div>{this.props.booking.case && this.props.booking.case.addresses[0].unitNumber}</div>
        </div>
      );  
    }
    
    return (
      <div className="BookingConfirmation">
        <Container>
          <Loader className="spinner" loaded={this.props.booking.id ? true : false}>
            <div className="BookingConfirmationWrapper">
              <div className="BookingConfirmationBody">
                <div className="BookingConfirmationBodySection">
                  <div className="BookingConfirmationBodySectionTitle">
                    <h3>Contact Person Details</h3>
                    <a href="#" className={this.state.editingUser ? 'hidden' : ''} onClick={this._onClickEdit.bind(this, 'user')}><img src={require('../pencil.png')} /></a>
                  </div>
                  {userDetails}
                </div>
                <div className="BookingConfirmationBodySection">
                  <div className="BookingConfirmationBodySectionTitle">
                    <h3>Patient Details</h3>
                    <a href="#" className={this.state.editingPatient ? 'hidden' : ''} onClick={this._onClickEdit.bind(this, 'patient')}><img src={require('../pencil.png')} /></a>
                  </div>
                  {patientDetails}
                </div>
                <div className="BookingConfirmationBodySection">
                  <div className="BookingConfirmationBodySectionTitle">
                    <h3>Patient Location / Address</h3>
                    <a href="#" className={this.state.editingAddress ? 'hidden' : ''} onClick={this._onClickEdit.bind(this, 'address')}><img src={require('../pencil.png')} /></a>
                  </div>
                  {addressDetails}
                </div>
                <div className={classNames('BookingConfirmationBodySection', ((this.props.booking && this.props.booking.case && this.props.booking.case.transactions && this.props.booking.case.transactions.length) || this.state.editingUser || this.state.editingPatient || this.state.editingAddress) ? 'hidden' : '')}>
                  <a href="#" className="btn btn-primary" onClick={this._onNext.bind(this)}>GO TO PAYMENT</a>
                </div>
              </div>
              {this.props.children}
            </div>
          </Loader>
        </Container>
      </div>
    );
  }

  _onClickEdit(entity, event) {
    event.preventDefault();

    switch (entity) {
      case 'user':
        this.setState({editingUser: true});
        break;
      case 'patient':
        this.setState({editingPatient: true});
        break;
      case 'address':
        this.setState({editingAddress: true});
        break;
    }
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

  _onClickSave(entity, event) {
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

  _onNext(event) {
    // Link.handleClick(event);
    event.preventDefault();

    BookingActions.setPostStatus('payment-paypal');
  }

}