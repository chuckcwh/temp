import React, { Component } from 'react';
import classNames from 'classNames';
import Loader from 'react-loader';
import './BookingComplete.scss';
import Container from '../Container';
import Link from '../Link';
import BookingActions from '../../actions/BookingActions';

export default class BookingComplete extends Component {

  constructor(props) {
    super(props);
    this.state = {
      bookingStatus: undefined,
      bookingId: undefined,
      bookingAmt: undefined
    };
  }

  componentDidMount() {
    if (this.props.booking) {
      var dates = [];
      for (var i = 0; i < this.props.booking.sessions.length; i++) {
        dates.push({
          type: 'Schedule',
          dateTimeStart: this.props.booking.sessions[i].date + ' 00:00:00',
          estTime: this.props.booking.sessions[i].time,
          price: this.props.booking.sessions[i].price
        });
      }
      fetch('http://161.202.19.121/api/createBooking', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('secret:secret0nlyWeilsonKnowsShhh852~')
        },
        body: JSON.stringify({
          booking: {
            client_contactEmail: this.props.booking && this.props.booking.user && this.props.booking.user.client_contactEmail,
            client_contactNumber: this.props.booking && this.props.booking.user && this.props.booking.user.client_contactNumber,
            client_firstName: this.props.booking && this.props.booking.user && this.props.booking.user.client_firstName,
            client_lastName: this.props.booking && this.props.booking.user && this.props.booking.user.client_lastName,
            patient_contactEmail: this.props.booking && this.props.booking.user && this.props.booking.user.client_contactEmail,
            patient_contactNumber: this.props.booking && this.props.booking.user && this.props.booking.user.client_contactNumber,
            patient_firstName: this.props.booking && this.props.booking.user && this.props.booking.user.patient_firstName,
            patient_lastName: this.props.booking && this.props.booking.user && this.props.booking.user.patient_lastName,
            patient_dob: this.props.booking && this.props.booking.user && this.props.booking.user.patient_dob.format('YYYY-MM-DD'),
            patient_gender: this.props.booking && this.props.booking.user && this.props.booking.user.patient_gender
          },
          case: {
            sid: this.props.booking && this.props.booking.service,
            notes: this.props.booking && this.props.booking.user && this.props.booking.user.additionalInfo,
            price: this.props.booking && this.props.booking.sum && this.props.booking.sum.toFixed(2),
            dates: dates,
            addresses: [{
              address: this.props.booking && this.props.booking.location && this.props.booking.location.address,
              postalCode: this.props.booking && this.props.booking.location && this.props.booking.location.postalCode,
              unitNumber: this.props.booking && this.props.booking.location && this.props.booking.location.unitNumber
            }]
          }
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data && data.booking && data.booking.case) {
          // Destroy booking
          BookingActions.destroyBooking();

          this.setState({
            bookingStatus: data.status,
            bookingId: data.booking.id,
            bookingAmt: data.booking.case.price
          });
        } else {
          console.error('Failed to create booking.');
        }
      })
      .catch(err => {
        console.error('http://161.202.19.121/api/createBooking', err.toString());
      });
    }
  }

  render() {
    if (!this.props.booking) return null;

    var component;

    if (this.state.bookingStatus) {
      component = (
        <div className="BookingCompleteBody">
          <div className="BookingCompleteHeader">
            THANK YOU
          </div>
          <div>
            Please check your email for your booking summary. We will notify you again once your booking is confirmed.
          </div>
          <div>
            <b>BOOKING ID : {this.state.bookingId}</b>
          </div>
          <div>
            TOTAL AMOUNT : SGD {this.state.bookingAmt}
          </div>
          <div>
            For inquiries on your order, please email <a href="mailto:contact@ebeecare.com">contact@ebeecare.com</a> or call us at 9733 6938, Mon-Fri (9.00am - 6.00pm).
          </div>
          <div className="BookingCompleteFooter">
            <a href="/booking1" className="btn btn-primary" onClick={Link.handleClick}>Make Another Booking</a>
            <a href="/" className="btn btn-primary" onClick={Link.handleClick}>Back To Homepage</a>
          </div>
        </div>
      );
    } else if (this.state.bookingStatus < 1) {
      component = (
        <div className="BookingCompleteBody">
          <div className="BookingCompleteHeader">
            TECHNICAL ERROR
          </div>
          <div>
            Oops, there was an error creating your booking. Please contact us at <a href="mailto:contact@ebeecare.com">contact@ebeecare.com</a> or 9733 6938 immediately.
          </div>
        </div>
      );
    } else {
      component = (
        <div className="BookingCompleteBody">
          <Loader className="spinner" loaded={this.state.bookingId ? true : false} />
        </div>
      );
    }

    return (
      <div className="BookingComplete">
        <Container>
          {component}
        </Container>
      </div>
    );
  }

}
