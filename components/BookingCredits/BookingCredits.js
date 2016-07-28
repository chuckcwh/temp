import React, { Component } from 'react';
import s from './BookingCredits.css';
import Link from '../Link';
// import BookingActions from '../../actions/BookingActions';

export default class BookingCredits extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  onNext = (event) => {
    Link.handleClick(event);

    const timeslots = [];
    Object.keys(this.state).forEach(timeslot => {
      if (this.state[timeslot]) {
        timeslots.push(timeslot);
      }
    });
  };

  render() {
    return (
      <div className={s.bookingCredits}>
        <div>
        {/*
          <img className={s.bookingCreditsLogo} src={require('../paypal.png')} />
          <img className={s.bookingCreditsLogo} src={require('../visamaster.png')} />
        */}
        </div>
        <p><b>Your Total Amount is SGD {/* this.props.booking.case.price */}</b></p>
        <p>
          Please confirm your booking by clicking the "Confirm Booking" button below.<br />You will be
          redirected to the Paypal page to complete your booking process.
        </p>
        <p></p>
        <div>
          <a href="/booking3c" className="btn btn-primary" onClick={this.onNext}>CONFIRM BOOKING</a>
        </div>
      </div>
    );
  }

}
