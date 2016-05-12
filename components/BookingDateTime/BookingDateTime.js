import React, { Component } from 'react';
import './BookingDateTime.scss';
import Container from '../Container';
import Link from '../Link';
import BookingDateTimeNavItem from '../BookingDateTimeNavItem';

class BookingDateTime extends Component {

  render() {
    return (
      <div className="BookingDateTime">
        <div className="BookingDateTimeNav-wrapper">
          <Container>
            <ul className="BookingDateTimeNav">
              <BookingDateTimeNavItem active={'booking3a'} link={'booking3a'} name={'Select Service Dates'} />
              <BookingDateTimeNavItem active={'booking3b'} link={'booking3b'} name={'Select Timeslots'} />
              <BookingDateTimeNavItem active={'booking3c'} name={'Select Sessions'} />
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

export default BookingDateTime;
