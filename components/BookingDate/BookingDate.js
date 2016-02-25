import React, { Component } from 'react';
import classNames from 'classNames';
import './BookingDate.scss';
import Container from '../Container';
import Link from '../Link';
import BookingSidebar from '../BookingSidebar';
import BookingStore from '../../stores/BookingStore';

const ALL_SERVICES = 'All Services';

export default class BookingDate extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="BookingDate">
        <div className="text-center">
          <input className="btn-inline" type="text" name="unit" placeholder="22-01-2016" />
          <div className="BookingDateTo"><i>to</i></div>
          <input className="btn-inline" type="text" name="unit" placeholder="27-01-2016" />
        </div>
        <p></p>
        <div className="text-center">
          <a href="/booking3b" className="btn btn-primary">NEXT</a>
        </div>
      </div>
    );
  }

}
