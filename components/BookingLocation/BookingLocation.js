import React, { Component } from 'react';
import { connect } from 'react-redux';
import './BookingLocation.scss';
import Container from '../Container';
import BookingLocationForm from '../BookingLocationForm';
import DayPickerPopup from '../DayPickerPopup';
import { fetchAddress, setOrderLocation, setLastPage, showLoginPopup, showDayPickerPopup } from '../../actions';
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
                showLoginPopup={this.props.showLoginPopup}
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
      var location = {
        postalCode: values.postalCode,
        address: values.address,
        unitNumber: values.unitNumber || undefined
      };
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
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingLocation);
