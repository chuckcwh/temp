import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import './BookingPostComplete.scss';
import Container from '../Container';
import Link from '../Link';

class BookingPostComplete extends Component {

  render() {
    const { booking } = this.props;
    var component, message, bookingId, bookingAmt;

    if (booking && booking.case && booking.case.transactions && booking.case.transactions.length) {
      var transaction = booking.case.transactions[0];
      if (transaction)
      message = (
        <span>Your payment via {transaction.method} is {transaction.status}. Check your booking summary in our email.</span>
      );
    }

    if (booking && booking.id) {
      bookingId = booking.id;
    }

    if (booking && booking.case && booking.case.price) {
      bookingAmt = booking.case.price;
    }

    // if (this.state.bookingStatus) {
      component = (
        <div className="BookingPostCompleteBody">
          <div className="BookingPostCompleteHeader">
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
            For further inquiries, please email <a href="mailto:contact@ebeecare.com">contact@ebeecare.com</a> or call us at 9733 6938, Mon-Fri (9.00am - 6.00pm).
          </div>
          <div className="BookingPostCompleteFooter">
            <a href="/booking-manage" className="btn btn-primary" onClick={Link.handleClick}>Manage Booking</a>
            <a href="/" className="btn btn-primary" onClick={Link.handleClick}>Back To Homepage</a>
          </div>
        </div>
      );
    // } else if (this.state.bookingStatus < 1) {
    //   component = (
    //     <div className="BookingPostCompleteBody">
    //       <div className="BookingPostCompleteHeader">
    //         TECHNICAL ERROR
    //       </div>
    //       <div>
    //         Oops, there was an error creating your booking. Please contact us at <a href="mailto:contact@ebeecare.com">contact@ebeecare.com</a> or 9733 6938 immediately.
    //       </div>
    //     </div>
    //   );
    // } else {
    //   component = (
    //     <div className="BookingPostCompleteBody">
    //       <Loader className="spinner" loaded={this.state.bookingId ? true : false} />
    //     </div>
    //   );
    // }

    return (
      <div className="BookingPostComplete">
        <Container>
          <Loader className="spinner" loaded={this.props.bookingFetching ? false : true}>
            {component}
          </Loader>
        </Container>
      </div>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    booking: state.booking.items,
    bookingFetching: state.booking.isFetching
  }
}

export default connect(mapStateToProps)(BookingPostComplete);
