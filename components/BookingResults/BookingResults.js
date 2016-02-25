import React, { Component } from 'react';
import classNames from 'classNames';
import './BookingResults.scss';
import Container from '../Container';
import Link from '../Link';
import BookingSidebar from '../BookingSidebar';
import BookingStore from '../../stores/BookingStore';

const ALL_SERVICES = 'All Services';

export default class BookingResults extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="BookingResults">
        <div>
          <div className="BookingResultsItem">
            <input className="BookingResultsCheckbox" type="checkbox" id="timeMorning" name="time" value="morning" />
            <label className="BookingResultsCheckboxLabel" htmlFor="timeMorning">
              <span></span>
              <span>22 Jan</span>
              <span>Morning</span>
              <span>$ 30</span>
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
