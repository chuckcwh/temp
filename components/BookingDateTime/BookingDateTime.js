import React, { Component } from 'react';
import classNames from 'classNames';
import './BookingDateTime.scss';
import Container from '../Container';
import Link from '../Link';
import BookingSidebar from '../BookingSidebar';
import BookingStore from '../../stores/BookingStore';

const ALL_SERVICES = 'All Services';

export default class BookingDateTime extends Component {

  render() {
    return (
      <div className="BookingDateTime">
        <div className="BookingDateTimeNav-wrapper">
          <Container>
            <ul className="BookingDateTimeNav">
              <li className="BookingDateTimeNav-item">
                <a className={classNames('BookingDateTimeNav-link', (this.props.path === '/booking3a') ? 'active' : '')} href="/booking3a">Select Service Date<span className="BookingDateTimeNav-arrow"><div className="nav-caret"></div></span></a>
              </li>
              <li className="BookingDateTimeNav-item">
                <a className={classNames('BookingDateTimeNav-link', (this.props.path === '/booking3b') ? 'active' : '')} href="/booking3b">Select Timeslots<span className="BookingDateTimeNav-arrow"><div className="nav-caret"></div></span></a>
              </li>
              <li className="BookingDateTimeNav-item">
                <a className={classNames('BookingDateTimeNav-link', (this.props.path === '/booking3c') ? 'active' : '')} href="/booking3c">Select Service Time<span className="BookingDateTimeNav-arrow"><div className="nav-caret"></div></span></a>
              </li>
            </ul>
          </Container>
        </div>
        <div>
          <Container>
            <div className="BookingDateTimeBody">
              {this.props.children}
              <BookingSidebar />
            </div>
          </Container>
        </div>
      </div>
    );
  }

}
