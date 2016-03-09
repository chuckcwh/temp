import React, { Component } from 'react';
import linkState from 'react-link-state';
import './BookingCredits.scss';
import Link from '../Link';
import BookingActions from '../../actions/BookingActions';

export default class BookingCredits extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="BookingCredits">
        <div>
          <img className="BookingCreditsLogo" src={require('../paypal.png')} />
          <img className="BookingCreditsLogo" src={require('../visamaster.png')} />
        </div>
        <p><b>Your Total Amount is SGD {this.props.booking.case.price}</b></p>
        <p>Please confirm your booking by clicking the "Confirm Booking" button below.<br/>You will be redirected to the Paypal page to complete your booking process.</p>
        <p></p>
        <div>
          <a href="/booking3c" className="btn btn-primary" onClick={this._onNext.bind(this)}>CONFIRM BOOKING</a>
        </div>
      </div>
    );
  }

  _onNext(event) {
    Link.handleClick(event);

    var timeslots = [];
    for (var timeslot in this.state) {
      if (this.state[timeslot]) {
        timeslots.push(timeslot);
      }
    }
    // this.props.booking.timeslots = timeslots;
    BookingActions.setTimeslots(timeslots);
  }

}
