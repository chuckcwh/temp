import React, { Component } from 'react';
import { connect } from 'react-redux';
import s from './BookingPatient.css';
import Container from '../Container';
import BookingPatientForm from '../BookingPatientForm';
import DayPickerPopup from '../DayPickerPopup';
import ConfirmPopup from '../ConfirmPopup';
import { setOrderBooker, setLastPage, createBookingWithOrder, showLoginPopup, showDayPickerPopup, showAlertPopup, showConfirmPopup } from '../../actions';
import history from '../../core/history';
import util from '../../core/util';

class BookingPatient extends Component {

  constructor(props) {
    super(props);
    this.state = {
      agree: false
    };
  }

  componentWillReceiveProps(props) {
    if (props.order.booker !== this.props.order.booker) {
      props.createBookingWithOrder(props.order, location);
      util.isNextLastPage('booking4', props.lastPage) && props.setLastPage('booking4');
      const location = history.getCurrentLocation();
      history.push({ pathname: '/booking5', query: location && location.query });
    }
  }

  render() {
    return (
      <div className={s.bookingPatient}>
        <Container>
          <div className={s.bookingPatientWrapper}>
            <div className={s.bookingPatientBody}>
              <BookingPatientForm 
                showDayPickerPopup={this.props.showDayPickerPopup} 
                showLoginPopup={this.props.showLoginPopup}
                showAlertPopup={this.props.showAlertPopup}
                onNext={this._onNext.bind(this)}
              />
            </div>
            {this.props.children}
          </div>
        </Container>
        <DayPickerPopup title="Date of Birth" />
        <ConfirmPopup onConfirmed={this._onConfirmed.bind(this)}>
          <div>
            <form ref={(c) => this._agreeForm = c}>
              <input className={s.agreeCheckbox} type="checkbox" id="agree" name="agree" checked={this.state.agree} onChange={this._onCheckedAgree.bind(this)} required />
              <label className={s.agreeCheckboxLabel} htmlFor="agree">
                <span></span><span>By making this booking, I agree to the <a href="/terms-of-service" target="_blank">Terms of Service</a> and <a href="/privacy-policy" target="_blank">Privacy Policy</a>.</span>
              </label>
            </form>
          </div>
        </ConfirmPopup>
      </div>
    );
  }

  _onCheckedAgree(event) {
    this.setState({
      agree: event.target.checked
    });
  }

  _onConfirmed() {
    if (this._agreeForm.checkValidity()) {
      if (!this._values) return;
      var values = this._values;
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
      this.props.setOrderBooker(user);
      
      // Delay execution till order is officially updated
      // this.props.createBookingWithOrder(this.props.order, location);
      // util.isNextLastPage('booking4', this.props.lastPage) && this.props.setLastPage('booking4');
      // history.push({ pathname: '/booking5', query: location && location.query });
    } else {
      this.props.showAlertPopup('To continue, please accept our Terms of Service and Privacy Policy.');
    }
  }

  _onNext(values) {
    this._values = values;
    return new Promise((resolve) => {
      this.props.showConfirmPopup();

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
    setOrderBooker: (booker) => {
      return dispatch(setOrderBooker(booker));
    },
    setLastPage: (page) => {
      return dispatch(setLastPage(page));
    },
    createBookingWithOrder: (order, location) => {
      return dispatch(createBookingWithOrder(order, location));
    },
    showLoginPopup: () => {
      return dispatch(showLoginPopup());
    },
    showDayPickerPopup: (value, source) => {
      return dispatch(showDayPickerPopup(value, source));
    },
    showAlertPopup: (message) => {
      return dispatch(showAlertPopup(message));
    },
    showConfirmPopup: () => {
      return dispatch(showConfirmPopup());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingPatient);
