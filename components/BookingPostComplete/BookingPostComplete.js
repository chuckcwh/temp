import React from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import s from './BookingPostComplete.css';
import Container from '../Container';
import Link from '../Link';

const BookingPostComplete = ({ transaction, transactionFetching }) => {
  let component,
    message;

  if (transaction) {
    message = (
      <span>Your payment via {transaction.mode} is {transaction.status}. Check your booking summary in our email.</span>
    );
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
        <b>TRANSACTION ID : {transaction && transaction._id && transaction._id.toUpperCase()}</b>
      </div>
      <div>
        TOTAL AMOUNT : SGD {transaction && parseFloat(transaction.value).toFixed(2)}
      </div>
      <div>
        For further inquiries, please email&nbsp;
        <a href="mailto:contact@ebeecare.com">contact@ebeecare.com</a>&nbsp;
        or call us at 6514 9729, Mon-Fri (9.00am - 6.00pm).
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
        <Loader className="spinner" loaded={!transactionFetching}>
          {component}
        </Loader>
      </Container>
    </div>
  );
};

BookingPostComplete.propTypes = {
  transaction: React.PropTypes.object,
  transactionFetching: React.PropTypes.bool,
};

const mapStateToProps = (state) => ({
  transaction: state.transaction.data,
  transactionFetching: state.transaction.isFetching,
});

export default connect(mapStateToProps)(BookingPostComplete);
