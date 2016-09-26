import React, { Component } from 'react';
import { connect } from 'react-redux';
import s from './BookingLocation.css';
import Container from '../Container';
import BookingLocationForm from '../BookingLocationForm';
import DayPickerPopup from '../DayPickerPopup';
import { fetchAddress, setOrderLocation, setLastPage, showLoginPopup, showDayPickerPopup } from '../../actions';
import history from '../../core/history';
import { isNextLastPage } from '../../core/util';

class BookingLocation extends Component {

  onNext = (values) => (
    new Promise((resolve) => {
      const location = history.getCurrentLocation();
      const orderLocation = {
        postal: values.postal,
        description: values.description,
        unit: values.unit || undefined,
        lat: values.lat,
        lng: values.lng,
        region: values.region,
        neighborhood: values.neighborhood,
      };
      this.props.setOrderLocation(orderLocation);
      isNextLastPage('booking2', this.props.lastPage) && this.props.setLastPage('booking2');

      history.push({ pathname: '/booking3a', query: location.query });
      resolve();
    })
  );

  render() {
    return (
      <div className={s.bookingLocation}>
        <Container>
          <div className={s.bookingLocationWrapper}>
            <div className={s.bookingLocationBody}>
              <BookingLocationForm
                showLoginPopup={this.props.showLoginPopup}
                fetchAddress={this.props.fetchAddress}
                onNext={this.onNext}
              />
            </div>
            {this.props.children}
          </div>
        </Container>
        <DayPickerPopup
          title="Date of Birth"
          toMonth={new Date()}
        />
      </div>
    );
  }

}

BookingLocation.propTypes = {
  children: React.PropTypes.node,

  lastPage: React.PropTypes.string,
  order: React.PropTypes.object,

  fetchAddress: React.PropTypes.func.isRequired,
  setOrderLocation: React.PropTypes.func.isRequired,
  setLastPage: React.PropTypes.func.isRequired,
  showLoginPopup: React.PropTypes.func.isRequired,
  showDayPickerPopup: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  lastPage: state.lastPage,
  order: state.order,
});

const mapDispatchToProps = (dispatch) => ({
  fetchAddress: (postalCode) => dispatch(fetchAddress(postalCode)),
  setOrderLocation: (location) => dispatch(setOrderLocation(location)),
  setLastPage: (page) => dispatch(setLastPage(page)),
  showLoginPopup: () => dispatch(showLoginPopup()),
  showDayPickerPopup: (value, source) => dispatch(showDayPickerPopup(value, source)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookingLocation);
