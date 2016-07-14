import React, { Component } from 'react';
import { connect } from 'react-redux';
import s from './BookingLocation.css';
import Container from '../Container';
import BookingLocationForm from '../BookingLocationForm';
import DayPickerPopup from '../DayPickerPopup';
import { fetchAddress, setOrderLocation, setLastPage, showLoginPopup, showDayPickerPopup } from '../../actions';
import history from '../../core/history';
import util from '../../core/util';

class BookingLocation extends Component {

  render() {
    return (
      <div className={s.bookingLocation}>
        <Container>
          <div className={s.bookingLocationWrapper}>
            <div className={s.bookingLocationBody}>
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
      const location = history.getCurrentLocation();
      var orderLocation = {
        postalCode: values.postalCode,
        address: values.address,
        unitNumber: values.unitNumber || undefined
      };
      this.props.setOrderLocation(orderLocation);
      util.isNextLastPage('booking2', this.props.lastPage) && this.props.setLastPage('booking2');

      history.push({ pathname: '/booking3a', query: location.query });
      resolve();
    });
  }

}

const mapStateToProps = (state) => {
  return {
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
