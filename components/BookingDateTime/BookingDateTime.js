import React, { Component } from 'react';
import classNames from 'classNames';
import './BookingDateTime.scss';
import Container from '../Container';
import Link from '../Link';
import BookingDateTimeNavItem from '../BookingDateTimeNavItem';

export default class BookingDateTime extends Component {

  render() {
    return (
      <div className="BookingDateTime">
        <div className="BookingDateTimeNav-wrapper">
          <Container>
            <ul className="BookingDateTimeNav">
              <BookingDateTimeNavItem path={this.props.path} active={'booking3a'} link={'booking3a'} name={'Select Service Dates'} />
              <BookingDateTimeNavItem path={this.props.path} active={'booking3b'} link={'booking3b'} name={'Select Timeslots'} />
              <BookingDateTimeNavItem path={this.props.path} active={'booking3c'} link={'booking3c'} name={'Select Sessions'} />
            </ul>
          </Container>
        </div>
        <div>
          <Container>
            <div className="BookingDateTimeBody">
              {this.props.children}
            </div>
          </Container>
        </div>
      </div>
    );
  }

}
