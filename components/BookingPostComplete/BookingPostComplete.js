import React, { Component } from 'react';
import Loader from 'react-loader';
import './BookingPostComplete.scss';
import Container from '../Container';
import Link from '../Link';
import BookingActions from '../../actions/BookingActions';

export default class BookingPostComplete extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    var component, message, bookingId, bookingAmt;

    if (this.props.booking && this.props.booking.case && this.props.booking.case.transactions && this.props.booking.case.transactions.length) {
      var transaction = this.props.booking.case.transactions[0];
      if (transaction)
      message = (
        <span>Your payment via {transaction.method} is {transaction.status}. Look out for our email on your booking summary.</span>
      );
    }

    if (this.props.booking && this.props.booking.id) {
      bookingId = this.props.booking.id;
    }
    
    if (this.props.booking && this.props.booking.case && this.props.booking.case.price) {
      bookingAmt = this.props.booking.case.price;
    }

    // if (this.state.bookingStatus) {
      component = (
        <div className="BookingPostCompleteBody">
          <div className="BookingPostCompleteHeader">
            THANK YOU
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
            <a href="/manage-booking" className="btn btn-primary" onClick={Link.handleClick}>Manage Booking</a>
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
          <Loader className="spinner" loaded={this.props.booking ? true : false}>
            {component}
          </Loader>
        </Container>
      </div>
    );
  }

}
