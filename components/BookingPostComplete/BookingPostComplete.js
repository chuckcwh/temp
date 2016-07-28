import React from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import s from './BookingPostComplete.css';
import Container from '../Container';
import Link from '../Link';

const BookingPostComplete = (props) => {
  const { booking } = props;
  let component,
    message,
    bookingId,
    bookingAmt;

  if (booking && booking.case && booking.case.transactions && booking.case.transactions.length) {
    const transaction = booking.case.transactions[0];
    if (transaction) {
      message = (
        <span>Your payment via {transaction.method} is {transaction.status}. Check your booking summary in our email.</span>
      );
    }
  }

  if (booking && booking.id) {
    bookingId = booking.id;
  }

  if (booking && booking.case && booking.case.price) {
    bookingAmt = booking.case.price;
  }

  // if (this.state.bookingStatus) {
  component = (
    <div className={s.bookingPostCompleteBody}>
      <div className={s.bookingPostCompleteHeader}>
        THANK YOU FOR YOUR PAYMENT
      </div>
      <div>
        {message}
      </div>
      <div>
        <b>BOOKING ID : {bookingId}</b>
      </div>
      <div>
        TOTAL AMOUNT : SGD {bookingAmt}
      </div>
      <div>
        For further inquiries, please email
        <a href="mailto:contact@ebeecare.com">contact@ebeecare.com</a>
        or call us at 9733 6938, Mon-Fri (9.00am - 6.00pm).
      </div>
      <div className={s.bookingPostCompleteFooter}>
        <Link to="/booking-manage" className="btn btn-primary">Manage Booking</Link>
        <Link to="/" className="btn btn-primary">Back To Homepage</Link>
      </div>
    </div>
  );
  // } else if (this.state.bookingStatus < 1) {
  //   component = (
  //     <div className={s.bookingPostCompleteBody}>
  //       <div className={s.bookingPostCompleteHeader}>
  //         TECHNICAL ERROR
  //       </div>
  //       <div>
  //        Oops, there was an error creating your booking.
  //        Please contact us at <a href="mailto:contact@ebeecare.com">contact@ebeecare.com</a>
  //        or 9733 6938 immediately.
  //       </div>
  //     </div>
  //   );
  // } else {
  //   component = (
  //     <div className={s.bookingPostCompleteBody}>
  //       <Loader className="spinner" loaded={this.state.bookingId ? true : false} />
  //     </div>
  //   );
  // }

  return (
    <div className={s.bookingPostComplete}>
      <Container>
        <Loader className="spinner" loaded={!props.bookingFetching}>
          {component}
        </Loader>
      </Container>
    </div>
  );
};

BookingPostComplete.propTypes = {
  booking: React.PropTypes.object,
  bookingFetching: React.PropTypes.bool,
};

const mapStateToProps = (state) => ({
  booking: state.booking.data,
  bookingFetching: state.booking.isFetching,
});

export default connect(mapStateToProps)(BookingPostComplete);
