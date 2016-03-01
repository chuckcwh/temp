import React, { Component } from 'react';
import classNames from 'classNames';
import './BookingTime.scss';
import Container from '../Container';
import Link from '../Link';
import BookingSidebar from '../BookingSidebar';
import BookingStore from '../../stores/BookingStore';

const ALL_SERVICES = 'All Services';

export default class BookingTime extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="BookingTime">
        <div>
          <div className="BookingTimeItem">
            <input className="BookingTimeCheckbox" type="checkbox" id="timeMorning" name="time" value="Morning" />
            <label className="BookingTimeCheckboxLabel" htmlFor="timeMorning">
              <span></span><span>Morning: 8.00am - 11:00am</span>
            </label>
          </div>
          <div className="BookingTimeItem">
            <input className="BookingTimeCheckbox" type="checkbox" id="timeAfternoon" name="time" value="Afternoon" />
            <label className="BookingTimeCheckboxLabel" htmlFor="timeAfternoon">
              <span></span><span>Afternoon: 12:00pm - 05:00pm</span>
            </label>
          </div>
          <div className="BookingTimeItem">
            <input className="BookingTimeCheckbox" type="checkbox" id="timeEvening" name="time" value="Evening" />
            <label className="BookingTimeCheckboxLabel" htmlFor="timeEvening">
              <span></span><span>Evening: 07:00pm - 10:00pm</span>
            </label>
          </div>
        </div>
        <p></p>
        <div className="text-center">
          <a href="/booking3c" className="btn btn-primary">NEXT</a>
        </div>
      </div>
    );
  }

}
