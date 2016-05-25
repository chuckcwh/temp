import React, { Component } from 'react';
import { connect } from 'react-redux';
import './BookingLocation.scss';
import Container from '../Container';
import BookingLocationForm from '../BookingLocationForm';
import DayPickerPopup from '../DayPickerPopup';
import { fetchAddress, setOrderBooker, setOrderLocation, setLastPage, showLoginPopup, showDayPickerPopup, showAlertPopup } from '../../actions';
import Location from '../../core/Location';
import Util from '../../core/Util';

class BookingLocation extends Component {

  render() {
    return (
      <div className="BookingLocation">
        <Container>
          <div className="BookingLocationWrapper">
            <div className="BookingLocationBody">
              <BookingLocationForm 
                showDayPickerPopup={this.props.showDayPickerPopup} 
                showLoginPopup={this.props.showLoginPopup}
                showAlertPopup={this.props.showAlertPopup}
                fetchAddress={this.props.fetchAddress}
                onNext={this._onNext.bind(this)}
              />
            </div>
            {this.props.children}
          </div>
        </Container>
        <DayPickerPopup title="Date of Birth" />
      </div>
    );
  }

  _onNext(values) {
    return new Promise((resolve) => {
      var user =  {
        client_contactEmail: values.client_contactEmail,
        client_contactNumber: values.client_contactNumber,
        client_firstName: values.client_firstName,
        client_lastName: values.client_lastName,
        patient_contactEmail: values.client_contactEmail,
        patient_contactNumber: values.client_contactNumber,
        patient_firstName: values.patient_firstName,
        patient_lastName: values.patient_lastName,
        patient_dob: values.patient_dob,
        patient_gender: values.patient_gender,
        additionalInfo: values.additionalInfo,
        isPatient: values.isPatient
      };
      // console.log(user);
      var location = {
        postalCode: values.postalCode,
        address: values.address,
        unitNumber: values.unitNumber || undefined
      };
      this.props.setOrderBooker(user);
      this.props.setOrderLocation(location);
      Util.isNextLastPage('booking2', this.props.lastPage) && this.props.setLastPage('booking2');

      Location.push({ pathname: '/booking3a', query: this.props.location.query });
      resolve();
    });
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
    fetchAddress: (postalCode) => {
      return dispatch(fetchAddress(postalCode));
    },
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
    showDayPickerPopup: (value, source) => {
      return dispatch(showDayPickerPopup(value, source));
    },
    showAlertPopup: (message) => {
      return dispatch(showAlertPopup(message));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingLocation);
