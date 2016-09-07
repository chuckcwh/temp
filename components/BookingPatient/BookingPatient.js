import React, { Component } from 'react';
import { connect } from 'react-redux';
import s from './BookingPatient.css';
import Container from '../Container';
import BookingPatientForm from '../BookingPatientForm';
import DayPickerPopup from '../DayPickerPopup';
import ConfirmPopup from '../ConfirmPopup';
import { setOrderBooker, setLastPage, createBookingWithOptions, showLoginPopup, showDayPickerPopup,
  showAlertPopup, showConfirmPopup } from '../../actions';
import history from '../../core/history';
import { isNextLastPage } from '../../core/util';

class BookingPatient extends Component {

  constructor(props) {
    super(props);
    this.state = {
      agree: false,
    };
  }

  componentWillReceiveProps(props) {
    if (props.order.booker !== this.props.order.booker) {
      const location = history.getCurrentLocation();
      props.createBookingWithOptions({
        services: props.services,
        order: props.order,
        location,
      });
      isNextLastPage('booking4', props.lastPage) && props.setLastPage('booking4');
      history.push({ pathname: '/booking5', query: location && location.query });
    }
  }

  onCheckedAgree = (event) => {
    this.setState({
      agree: event.target.checked,
    });
  };

  onConfirmed = () => {
    if (this.agreeForm.checkValidity()) {
      if (!this.formValues) return;
      const values = this.formValues;
      const user = {
        clientName: values.clientName,
        clientEmail: values.clientEmail,
        clientContact: values.clientContact,
        patientName: values.patientName,
        patientDob: values.patientDob,
        patientContact: values.patientContact,
        patientGender: values.patientGender,
        additionalInfo: values.additionalInfo,
        isPatient: values.isPatient,
      };
      // console.log(user);
      this.props.setOrderBooker(user);

      // Delay execution till order is officially updated
      // this.props.createBookingWithOptions(this.props.order, location);
      // util.isNextLastPage('booking4', this.props.lastPage) && this.props.setLastPage('booking4');
      // history.push({ pathname: '/booking5', query: location && location.query });
    } else {
      this.props.showAlertPopup('To continue, please accept our Terms of Service and Privacy Policy.');
    }
  };

  onNext = (values) => {
    this.formValues = values;
    return new Promise((resolve) => {
      this.props.showConfirmPopup();

      resolve();
    });
  };

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
                onNext={this.onNext}
              />
            </div>
            {this.props.children}
          </div>
        </Container>
        <DayPickerPopup title="Date of Birth" />
        <ConfirmPopup onConfirmed={this.onConfirmed}>
          <div>
            <form ref={(c) => (this.agreeForm = c)}>
              <input
                className={s.agreeCheckbox}
                type="checkbox"
                id="agree"
                name="agree"
                checked={this.state.agree}
                onChange={this.onCheckedAgree}
                required
              />
              <label className={s.agreeCheckboxLabel} htmlFor="agree">
                <span></span>
                <span>
                  By making this booking, I agree to the&nbsp;
                  <a href="/terms-of-service" target="_blank">Terms of Service</a> and&nbsp;
                  <a href="/privacy-policy" target="_blank">Privacy Policy</a>.
                </span>
              </label>
            </form>
          </div>
        </ConfirmPopup>
      </div>
    );
  }

}

BookingPatient.propTypes = {
  children: React.PropTypes.node.isRequired,

  services: React.PropTypes.object,
  lastPage: React.PropTypes.string,
  order: React.PropTypes.object,

  setOrderBooker: React.PropTypes.func.isRequired,
  setLastPage: React.PropTypes.func.isRequired,
  createBookingWithOptions: React.PropTypes.func.isRequired,
  showLoginPopup: React.PropTypes.func.isRequired,
  showDayPickerPopup: React.PropTypes.func.isRequired,
  showAlertPopup: React.PropTypes.func.isRequired,
  showConfirmPopup: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  services: state.services.data,
  lastPage: state.lastPage,
  order: state.order,
});

const mapDispatchToProps = (dispatch) => ({
  setOrderBooker: (booker) => dispatch(setOrderBooker(booker)),
  setLastPage: (page) => dispatch(setLastPage(page)),
  createBookingWithOptions: (options) => dispatch(createBookingWithOptions(options)),
  showLoginPopup: () => dispatch(showLoginPopup()),
  showDayPickerPopup: (value, source) => dispatch(showDayPickerPopup(value, source)),
  showAlertPopup: (message) => dispatch(showAlertPopup(message)),
  showConfirmPopup: () => dispatch(showConfirmPopup()),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookingPatient);
