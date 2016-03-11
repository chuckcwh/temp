import React, { Component } from 'react';
import linkState from 'react-link-state';
import classNames from 'classNames';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import './BookingLocation.scss';
import Container from '../Container';
import Link from '../Link';
import LoginPopup from '../LoginPopup';
import AlertPopup from '../AlertPopup';
import BookingActions from '../../actions/BookingActions';

export default class BookingLocation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      client_contactEmail: this.props.booking && this.props.booking.user && this.props.booking.user.client_contactEmail,
      client_contactNumber: this.props.booking && this.props.booking.user && this.props.booking.user.client_contactNumber,
      client_firstName: this.props.booking && this.props.booking.user && this.props.booking.user.client_firstName,
      client_lastName: this.props.booking && this.props.booking.user && this.props.booking.user.client_lastName,
      patient_contactEmail: this.props.booking && this.props.booking.user && this.props.booking.user.client_contactEmail,
      patient_contactNumber: this.props.booking && this.props.booking.user && this.props.booking.user.client_contactNumber,
      patient_firstName: this.props.booking && this.props.booking.user && this.props.booking.user.patient_firstName,
      patient_lastName: this.props.booking && this.props.booking.user && this.props.booking.user.patient_lastName,
      patient_dob: this.props.booking && this.props.booking.user && this.props.booking.user.patient_dob,
      patient_gender: this.props.booking && this.props.booking.user && this.props.booking.user.patient_gender,
      additionalInfo: this.props.booking && this.props.booking.user && this.props.booking.user.additionalInfo,
      postalCode: this.props.booking && this.props.booking.location && this.props.booking.location.postalCode,
      address: this.props.booking && this.props.booking.location && this.props.booking.location.address,
      unitNumber: this.props.booking && this.props.booking.location && this.props.booking.location.unitNumber,
    };
  }

  render() {
    return (
      <div className="BookingLocation">
        <Container>
          <div className="BookingLocationWrapper">
            <div className="BookingLocationBody">
              <form ref={(c) => this._bookingLocationForm = c}>
                <div className="BookingLocationBodySection">
                  <span>I&apos;m an existing customer</span>
                  <a href="#" className="btn btn-primary btn-small btn-inline" onClick={this._onClickLogin.bind(this)}>LOGIN</a>
                  {/*
                  <span>or</span>
                  <a href="/booking2" className="btn btn-primary btn-small btn-inline">REGISTER</a>
                  */}
                </div>
                <div className="BookingLocationBodySection">
                  <div>Continue booking as guest</div>
                  {/*
                  <div className="select">
                    <span></span>
                    <select name="salutation">
                      <option value="">Salutation</option>
                    </select>
                  </div>
                  */}
                  <input type="text" id="client_firstName" name="client_firstName" valueLink={linkState(this, 'client_firstName')} placeholder="First Name*" maxLength="50" required />
                  <input type="text" id="client_lastName" name="client_lastName" valueLink={linkState(this, 'client_lastName')} placeholder="Last Name*" maxLength="50" required />
                  <input type="email" id="client_contactEmail" name="client_contactEmail" valueLink={linkState(this, 'client_contactEmail')} placeholder="Email*" maxLength="50" required />
                  <input type="text" id="client_contactNumber" name="client_contactNumber" valueLink={linkState(this, 'client_contactNumber')} placeholder="Contact Number*" maxLength="8" required />
                </div>
                <div className="BookingLocationBodySection">
                  <div>Patient Details</div>
                  <div>
                    <input type="text" id="patient_firstName" name="patient_firstName" valueLink={linkState(this, 'patient_firstName')} placeholder="First Name*" maxLength="50" required />
                    <input type="text" id="patient_lastName" name="patient_lastName" valueLink={linkState(this, 'patient_lastName')} placeholder="Last Name*" maxLength="50" required />
                    <DatePicker selected={this.state.patient_dob} maxDate={moment()} dateFormat="YYYY-MM-DD" showYearDropdown onChange={this._onSelectDob.bind(this)} placeholderText="Date of Birth* (Y-M-D)" />
                    <div className="radio radio-inline">
                      <input type="radio" id="patient_gender_male" name="patient_gender" checked={this.state.patient_gender==='Male'} onChange={this._onSelectGender.bind(this)} value="Male" required />
                      <label htmlFor="patient_gender_male"><span><span></span></span><span>Male</span></label>
                    </div>
                    <div className="radio radio-inline">
                      <input type="radio" id="patient_gender_female" name="patient_gender" checked={this.state.patient_gender==='Female'} onChange={this._onSelectGender.bind(this)} value="Female" required />
                      <label htmlFor="patient_gender_female"><span><span></span></span><span>Female</span></label>
                    </div>
                  </div>
                  <div style={{marginTop: '40px'}}>
                    <div>Additional Info:</div>
                    <textarea name="additionalInfo" valueLink={linkState(this, 'additionalInfo')} />
                  </div>
                </div>
                <div className="BookingLocationBodySection">
                  <div>Patient Location / Address</div>
                  <div className="PatientAddress">
                    <div className="PatientAddressLeft inline">
                      <input type="text" id="postalCode" name="postalCode" value={this.state.postalCode} onChange={this._onChangePostalCode.bind(this)} placeholder="Enter Postal Code*" required />
                      <input type="text" id="unitNumber" name="unitNumber" valueLink={linkState(this, 'unitNumber')} placeholder="Enter Unit Number" />
                    </div>
                    <div className="PatientAddressRight inline">
                      <textarea id="address" name="address" valueLink={linkState(this, 'address')} placeholder="Enter Address*" required />
                    </div>
                  </div>
                  <p className="small">This information will only be used to contact you regarding your booking.</p>
                  <a href="/booking3a" className="btn btn-primary" onClick={this._onNext.bind(this)}>NEXT</a>
                </div>
              </form>
            </div>
            {this.props.children}
          </div>
        </Container>
        <AlertPopup ref={(c) => this._alertPopup = c}>
          Please fill up all required fields.
        </AlertPopup>
        <LoginPopup ref={(c) => this._loginPopup = c} />
      </div>
    );
  }

  _onSelectDob(date) {
    this.setState({
      patient_dob: date
    });
  }

  _onSelectGender(event) {
    this.setState({
      patient_gender: event.target.value
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
  }

  _onClickLogin(event) {
    event.preventDefault();

    this._loginPopup.show();
  }

  _onNext(event) {
    if (this._bookingLocationForm.checkValidity()) {
      Link.handleClick(event);

      var user =  {
        client_contactEmail: this.state.client_contactEmail,
        client_contactNumber: this.state.client_contactNumber,
        client_firstName: this.state.client_firstName,
        client_lastName: this.state.client_lastName,
        patient_contactEmail: this.state.client_contactEmail,
        patient_contactNumber: this.state.client_contactNumber,
        patient_firstName: this.state.patient_firstName,
        patient_lastName: this.state.patient_lastName,
        patient_dob: this.state.patient_dob,
        patient_gender: this.state.patient_gender,
        additionalInfo: this.state.additionalInfo
      };
      // console.log(user);
      var location = {
        postalCode: this.state.postalCode,
        address: this.state.address,
        unitNumber: this.state.unitNumber
      };
      BookingActions.setUser(user);
      BookingActions.setLocation(location);
      BookingActions.setLast('booking2');
    } else {
      event.preventDefault();
      // alert('Please fill up all required fields.');
      this._alertPopup.show();
    }
  }

}
