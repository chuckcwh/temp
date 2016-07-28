import React from 'react';
import s from './BookingDateTime.css';
import Container from '../Container';
import BookingDateTimeNavItem from '../BookingDateTimeNavItem';

const BookingDateTime = (props) => (
  <div className={s.bookingDateTime}>
    <div className={s.bookingDateTimeNavWrapper}>
      <Container>
        <ul className={s.bookingDateTimeNav}>
          <BookingDateTimeNavItem active={'booking3a'} link={'booking3a'} name={'Select Service Dates'} />
          <BookingDateTimeNavItem active={'booking3b'} link={'booking3b'} name={'Select Timeslots'} />
          <BookingDateTimeNavItem active={'booking3c'} name={'Select Sessions'} />
        </ul>
      </Container>
    </div>
    <div>
      <Container>
        <div className={s.bookingDateTimeBody}>
          {props.children}
        </div>
      </Container>
    </div>
  </div>
);

BookingDateTime.propTypes = {
  children: React.PropTypes.node,
};

export default BookingDateTime;
