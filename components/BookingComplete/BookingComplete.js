import React, { Component } from 'react';
import request from 'superagent';
import Loader from 'react-loader';
import moment from 'moment';
import './BookingComplete.scss';
import Container from '../Container';
import Link from '../Link';
import VerifyBookingPopup from '../VerifyBookingPopup';
import BookingActions from '../../actions/BookingActions';
import Location from '../../core/Location';
import Util from '../../core/Util';

export default class BookingComplete extends Component {

  constructor(props) {
    super(props);
    this.state = {
      bookingStatus: undefined,
      booking: undefined,
      bookingId: undefined,
      bookingAmt: undefined,
      caseId: undefined,
      bookingVerified: false
    };
  }

  componentDidMount() {
    if (this.props.user && this.props.patient) {
      var dates = [];
      for (var i = 0; i < this.props.booking.sessions.length; i++) {
        dates.push({
          type: 'Schedule',
          dateTimeStart: this.props.booking.sessions[i].date + ' 00:00:00',
          estTime: this.props.booking.sessions[i].time,
          price: this.props.booking.sessions[i].price
        });
      }
      this.serverRequest = request
        .post(Util.host + '/api/createCase')
        .auth(this.props.user.id, this.props.user.token)
        .send({
          notes: this.props.booking && this.props.booking.booker && this.props.booking.booker.additionalInfo,
          price: this.props.booking && this.props.booking.sum && this.props.booking.sum.toFixed(2),
          pid: this.props.patient.id,
          sid: this.props.booking && this.props.booking.service,
          dates: dates,
          addresses: [{
            address: this.props.booking && this.props.booking.location && this.props.booking.location.address,
            postalCode: this.props.booking && this.props.booking.location && this.props.booking.location.postalCode,
            unitNumber: this.props.booking && this.props.booking.location && this.props.booking.location.unitNumber
          }],
          promoCode: this.props.booking && this.props.booking.promoCode && this.props.booking.promoCode.code
        })
        .end((err, res) => {
          if (err) {
            return console.error(Util.host + '/api/createCase', err.toString());
          }
          // console.log(res.body);
          if (res.body && res.body.case) {
            // Destroy booking
            BookingActions.destroyBooking();

            this.setState({
              bookingStatus: res.body.status,
              bookingAmt: res.body.case.price,
              caseId: res.body.case.id
            });
          } else {
            console.error('Failed to create case.');
          }
        });
    } else if (this.props.booking) {
      var dates = [];
      for (var i = 0; i < this.props.booking.sessions.length; i++) {
        dates.push({
          type: 'Schedule',
          dateTimeStart: this.props.booking.sessions[i].date + ' 00:00:00',
          estTime: this.props.booking.sessions[i].time,
          price: this.props.booking.sessions[i].price
        });
      }
      this.serverRequest = request
        .post(Util.host + '/api/createBooking')
        .auth(Util.authKey, Util.authSecret)
        .send({
          booking: {
            client_contactEmail: this.props.booking && this.props.booking.booker && this.props.booking.booker.client_contactEmail,
            client_contactNumber: this.props.booking && this.props.booking.booker && this.props.booking.booker.client_contactNumber,
            client_firstName: this.props.booking && this.props.booking.booker && this.props.booking.booker.client_firstName,
            client_lastName: this.props.booking && this.props.booking.booker && this.props.booking.booker.client_lastName,
            patient_contactEmail: this.props.booking && this.props.booking.booker && this.props.booking.booker.client_contactEmail,
            patient_contactNumber: this.props.booking && this.props.booking.booker && this.props.booking.booker.client_contactNumber,
            patient_firstName: this.props.booking && this.props.booking.booker && this.props.booking.booker.patient_firstName,
            patient_lastName: this.props.booking && this.props.booking.booker && this.props.booking.booker.patient_lastName,
            patient_dob: moment(this.props.booking && this.props.booking.booker && this.props.booking.booker.patient_dob).format('YYYY-MM-DD'),
            patient_gender: this.props.booking && this.props.booking.booker && this.props.booking.booker.patient_gender,
            organization: this.props.location && this.props.location.query && this.props.location.query.organization || undefined
          },
          case: {
            sid: this.props.booking && this.props.booking.service,
            notes: this.props.booking && this.props.booking.booker && this.props.booking.booker.additionalInfo,
            price: this.props.booking && this.props.booking.sum && this.props.booking.sum.toFixed(2),
            dates: dates,
            addresses: [{
              address: this.props.booking && this.props.booking.location && this.props.booking.location.address,
              postalCode: this.props.booking && this.props.booking.location && this.props.booking.location.postalCode,
              unitNumber: this.props.booking && this.props.booking.location && this.props.booking.location.unitNumber
            }]
          },
          promoCode: this.props.booking && this.props.booking.promoCode && this.props.booking.promoCode.code
        })
        .end((err, res) => {
          if (err) {
            return console.error(Util.host + '/api/createBooking', err.toString());
          }
          // console.log(res.body);
          if (res.body && res.body.booking && res.body.booking.case) {
            // Destroy booking
            BookingActions.destroyBooking();

            this.setState({
              bookingStatus: res.body.status,
              bookingId: res.body.booking.id,
              bookingAmt: res.body.booking.case.price,
              booking: res.body.booking
            });

            // Show Verify Booking Popup
            this._verifyBookingPopup.show(this.state.booking, () => {
              this.setState({
                bookingVerified: true
              });
            });
          } else {
            console.error('Failed to create booking.');
          }
        });
    }
  }

  componentWillUnmount() {
    this.serverRequest && this.serverRequest.abort();
  }

  render() {
    if (!this.props.booking) return null;

    var component, identity;

    if (this.state.bookingStatus) {
      if (this.state.bookingId) {
        var bookingLink, activateText;
        if (this.state.bookingVerified) {
          bookingLink = (
            <div>
              <a href={'/booking-manage?bid=' + this.state.bookingId + '&email=' + this.state.booking.client_contactEmail} className="btn btn-primary" style={{'color': '#fff'}}>View Booking</a>
            </div>
          );
        } else {
          bookingLink = (
            <div>
              <a href="#" className="btn btn-primary" onClick={this._onClickActivateBooking.bind(this)} style={{'color': '#fff'}}>Activate Booking</a>
            </div>
          );
          activateText = (
            <div>
              You will need to <b>activate</b> your booking for it to go live.
            </div>
          );
        }
        identity = (
          <div>
            <b>BOOKING ID : {this.state.bookingId}</b>
            {bookingLink}
            {activateText}
          </div>
        );
      } else if (this.state.caseId) {
        identity = (
          <div>
            <b>CASE ID : {this.state.caseId}</b>
            <div>
              <a href={Util.backend + '/case/' + this.state.caseId}>View Case</a>
            </div>
          </div>
        );
      }

      component = (
        <div className="BookingCompleteBody">
          <div className="BookingCompleteHeader">
            THANK YOU
          </div>
          <div>
            Please check your email for your booking summary. We will notify you again once your booking is confirmed.
          </div>
          {identity}
          <div>
            ESTIMATED AMOUNT : SGD {parseFloat(this.state.bookingAmt).toFixed(2)}
          </div>
          <div>
            For inquiries on your order, please email <a href="mailto:contact@ebeecare.com">contact@ebeecare.com</a> or call us at 6514 9729, Mon-Fri (9.00am - 6.00pm).
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
            Oops, there was an error creating your booking. Please contact us at <a href="mailto:contact@ebeecare.com">contact@ebeecare.com</a> or 6514 9729 immediately.
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
        <VerifyBookingPopup ref={(c) => this._verifyBookingPopup = c} />
      </div>
    );
  }

  _onClickActivateBooking(event) {
    // Show Verify Booking Popup
    this._verifyBookingPopup.show(this.state.booking, () => {
      this.setState({
        bookingVerified: true
      });
    });
  }

  _onClickViewBooking(event) {
    event.preventDefault();

    Location.replace({ pathname: '/booking-manage', query: { bid: this.state.bookingId, email: this.state.bookingEmail } });
  }

}
