import React, { Component } from 'react';
import { connect } from 'react-redux';
import linkState from 'react-link-state';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import './BookingLocation.scss';
import Container from '../Container';
import Link from '../Link';
import DayPickerPopup from '../DayPickerPopup';
import { setOrderBooker, setOrderLocation, setLastPage, showLoginPopup, showDayPickerPopup, showAlertPopup } from '../../actions';
import Location from '../../core/Location';
import Util from '../../core/Util';

class BookingLocation extends Component {

  constructor(props) {
    super(props);
    const { order } = this.props;
    this.state = {
      client_contactEmail: order && order.booker && order.booker.client_contactEmail,
      client_contactNumber: order && order.booker && order.booker.client_contactNumber,
      client_firstName: order && order.booker && order.booker.client_firstName,
      client_lastName: order && order.booker && order.booker.client_lastName,
      patient_contactEmail: order && order.booker && order.booker.client_contactEmail,
      patient_contactNumber: order && order.booker && order.booker.client_contactNumber,
      patient_firstName: order && order.booker && order.booker.patient_firstName,
      patient_lastName: order && order.booker && order.booker.patient_lastName,
      patient_dob: order && order.booker && order.booker.patient_dob,
      patient_dob_temp: undefined,
      patient_gender: order && order.booker && order.booker.patient_gender,
      additionalInfo: order && order.booker && order.booker.additionalInfo,
      postalCode: order && order.location && order.location.postalCode,
      address: order && order.location && order.location.address,
      unitNumber: order && order.location && order.location.unitNumber
    };
  }

  render() {
    var component, userDetails, patientDetails;
    component = (
      <form ref={(c) => this._bookingLocationForm = c} onSubmit={this._onNext.bind(this)}>
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
          <input type="text" id="client_contactNumber" name="client_contactNumber" valueLink={linkState(this, 'client_contactNumber')} placeholder="Mobile Number*" pattern="[8,9]{1}[0-9]{7}" required />
        </div>
        <div className="BookingLocationBodySection">
          <div>
            <span className="PatientDetailsLabel1">Patient Details</span>
            <span className="PatientDetailsLabel2"> (
              <input className="RememberMeCheckbox" type="checkbox" id="isPatient" name="isPatient" onChange={this._onCheckedPatient.bind(this)} />
              <label className="RememberMeCheckboxLabel" htmlFor="isPatient">
                <span></span><span>Are you the patient?</span>
              </label>
              &nbsp;)
            </span>
          </div>
          <div>
            <input type="text" id="patient_firstName" name="patient_firstName" valueLink={linkState(this, 'patient_firstName')} placeholder="First Name*" maxLength="50" required />
            <input type="text" id="patient_lastName" name="patient_lastName" valueLink={linkState(this, 'patient_lastName')} placeholder="Last Name*" maxLength="50" required />
            <div className="DateInput">
              <input type="text" id="patient_dob" name="patient_dob" value={this.state.patient_dob_temp ? this.state.patient_dob_temp : (this.state.patient_dob ? moment(this.state.patient_dob).format('YYYY-MM-DD') : '')} onChange={this._onChangeDob.bind(this)} onBlur={this._onBlurDob.bind(this)} placeholder="Birth Date* (YYYY-MM-DD)" pattern="\d{4}[-]\d{2}[-]\d{2}" required />
              <span onClick={() => this.props.showDayPickerPopup(this.state.patient_dob)}></span>
            </div>
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
            <textarea name="additionalInfo" valueLink={linkState(this, 'additionalInfo')} placeholder="Please provide important notes about patient here." />
          </div>
        </div>
        <div className="BookingLocationBodySection">
          <div>Patient Location / Address</div>
          <div className="PatientAddress">
            <div className="PatientAddressLeft inline">
              <input type="text" id="postalCode" name="postalCode" value={this.state.postalCode} onChange={this._onChangePostalCode.bind(this)} placeholder="Enter Postal Code*" pattern="[0-9]{6}" required />
              <input type="text" id="unitNumber" name="unitNumber" valueLink={linkState(this, 'unitNumber')} placeholder="Enter Unit Number" />
            </div>
            <div className="PatientAddressRight inline">
              <textarea id="address" name="address" valueLink={linkState(this, 'address')} placeholder="Enter Address*" required />
            </div>
          </div>
          <p className="small">This information will only be used to contact you regarding your booking.</p>
          <button className="btn btn-primary" type="submit">NEXT</button>
        </div>
      </form>
    );
    return (
      <div className="BookingLocation">
        <Container>
          <div className="BookingLocationWrapper">
            <div className="BookingLocationBody">
              {component}
            </div>
            {this.props.children}
          </div>
        </Container>
        <DayPickerPopup title="Date of Birth" onDayClick={this._onSelectDob.bind(this)} />
      </div>
    );
  }

  _onSelectDob(event, date) {
    this.setState({
      patient_dob: date
    });
  }

  _onChangeDob(event) {
    this.setState({
      patient_dob_temp: event.target.value
    });
  }

  _onBlurDob(event) {
    // validate date (especially for manual keyboard input)
    var d = moment(event.target.value, 'YYYY-MM-DD');
    var valid = d.isValid() && d.isBefore(new Date(), 'day');
    this.setState({
      patient_dob: valid ? d.toDate() : '',
      patient_dob_temp: undefined
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

    this.props.showLoginPopup();
  }

  _onCheckedPatient(event) {
    if (event.target.checked === true) {
      this.setState({
        patient_firstName: this.state.client_firstName,
        patient_lastName: this.state.client_lastName
      });
    } else {
      this.setState({
        patient_firstName: undefined,
        patient_lastName: undefined
      });
    }
  }

  _onNext(event) {
    if (this._bookingLocationForm.checkValidity()) {
      event.preventDefault();

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
        unitNumber: this.state.unitNumber || undefined
      };
      this.props.setOrderBooker(user);
      this.props.setOrderLocation(location);
      Util.isNextLastPage('booking2', this.props.lastPage) && this.props.setLastPage('booking2');

      Location.push({ pathname: '/booking3a', query: this.props.location.query });
    } else {
      event.preventDefault();
      // alert('Please fill up all required fields.');
      this.props.showAlertPopup('Please fill up all required fields.');
    }
  }

}

const mapStateToProps = (state) => {
  return {
    location: state.router && state.router.location,
    lastPage: state.lastPage,
    order: state.order
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setOrderBooker: (booker) => {
      return dispatch(setOrderBooker(booker));
    },
    setOrderLocation: (location) => {
      return dispatch(setOrderLocation(location));
    },
    setLastPage: (page) => {
      return dispatch(setLastPage(page));
    },
    showLoginPopup: () => {
      return dispatch(showLoginPopup());
    },
    showDayPickerPopup: (value) => {
      return dispatch(showDayPickerPopup(value));
    },
    showAlertPopup: (message) => {
      return dispatch(showAlertPopup(message));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingLocation);
