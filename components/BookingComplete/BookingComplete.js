import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import s from './BookingComplete.css';
import Container from '../Container';
import Link from '../Link';
import VerifyBookingPopup from '../VerifyBookingPopup';
import { getBooking, destroyOrder, showVerifyBookingPopup } from '../../actions';
import history from '../../core/history';
import util from '../../core/util';

class BookingComplete extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showedVerifyBookingPopup: false,
    };
  }

  componentDidMount() {
    const { booking } = this.props;

    // Destroy order
    this.props.destroyOrder();

    if (booking && booking.adhocClient && !booking.adhocClient.isVerified) {
      this.setState({ showedVerifyBookingPopup: true });
      this.props.showVerifyBookingPopup(booking._id);
    }
  }

  componentWillReceiveProps(props) {
    const { booking } = props;

    // Destroy order
    this.props.destroyOrder();

    if (booking && booking.adhocClient && !booking.adhocClient.isVerified
      && this.state.showedVerifyBookingPopup === false) {
      this.setState({ showedVerifyBookingPopup: true });
      this.props.showVerifyBookingPopup(booking._id);
    }
  }

  onVerified = () => {
    const { booking } = this.props;
    this.props.getBooking({
      bookingId: booking && booking._id,
      contact: booking && booking.adhocClient && booking.adhocClient.contact,
    }).then(() => {// Notify parent window of booking completion for embedded widget
      const location = history.getCurrentLocation();
      if (location && location.query && location.query.widget === 'true') {
        window.parent.postMessage('completedBooking', '*');
      }
    });
  };

  onClickActivateBooking = () => {
    this.props.booking && this.props.showVerifyBookingPopup(this.props.booking._id);
  };

  onClickClose = () => {
    window.parent.postMessage('closeebkwidget', '*');
  };

  render() {
    let component,
      identity,
      footer;
    const { booking, bookingFetching } = this.props;
    const location = history.getCurrentLocation();

    if (bookingFetching) {
      component = (
        <div className={s.bookingCompleteBody}>
          <Loader className="spinner" loaded={!bookingFetching} />
        </div>
      );
    } else {
      if (booking.adhocClient) {
        let bookingLink,
          activateText;
        if (location && location.query && location.query.widget === 'true') {
          bookingLink = (
            <div>
              <a href="#" className="btn btn-primary" style={{ color: '#fff' }} onClick={this.onClickClose}>Close Window</a>
            </div>
          );
        } else if (booking.adhocClient.isVerified) {
          bookingLink = (
            <div>
              <Link
                to={{ pathname: '/booking-manage',
                  query: { bid: booking._id, contact: booking.adhocClient.contact } }}
                className="btn btn-primary"
                style={{ color: '#fff' }}
              >View Booking</Link>
            </div>
          );
        } else {
          bookingLink = (
            <div>
              <a
                href="#"
                className="btn btn-primary"
                onClick={this.onClickActivateBooking}
                style={{ color: '#fff' }}
              >Activate Booking</a>
            </div>
          );
          activateText = (
            <div>
              You will need to <b>activate</b> your booking for it to go live.
            </div>
          );
        }
        identity = (
          <div>
            <b>BOOKING ID : {booking.bookingId}</b>
            {bookingLink}
            {activateText}
          </div>
        );
      } else {
        identity = (
          <div>
            <b>BOOKING ID : {booking.bookingId}</b>
            <div>
              <Link to={`/bookings/${booking._id}`}>View Booking</Link>
            </div>
          </div>
        );
      }

      if (!(location && location.query && location.query.widget === 'true')) {
        footer = (
          <div className={s.bookingCompleteFooter}>
            <Link to="/booking1" className="btn btn-primary">Make Another Booking</Link>
            <Link to="/" className="btn btn-primary">Back To Homepage</Link>
          </div>
        );
      }

      component = (
        <div className={s.bookingCompleteBody}>
          <div className={s.bookingCompleteHeader}>
            THANK YOU
          </div>
          <div>
            Please check your email for your booking summary. We will notify you again once your booking is confirmed.
          </div>
          {identity}
          <div>
            ESTIMATED AMOUNT : SGD {!isNaN(booking.totalAmount) && parseFloat(booking.totalAmount).toFixed(2)}
          </div>
          <div>
            For inquiries on your order, please email
            &nbsp;<a href="mailto:contact@ebeecare.com">contact@ebeecare.com</a>&nbsp;
            or call us at 6514 9729, Mon-Fri (9.00am - 6.00pm).
          </div>
          {footer}
        </div>
      );
    // } else if (this.state.bookingStatus < 1) {
    //   component = (
    //     <div className={s.bookingCompleteBody}>
    //       <div className={s.bookingCompleteHeader}>
    //         TECHNICAL ERROR
    //       </div>
    //       <div>
    //        Oops, there was an error creating your booking.
    //        Please contact us at <a href="mailto:contact@ebeecare.com">contact@ebeecare.com</a>
    //        or 6514 9729 immediately.
    //       </div>
    //     </div>
    //   );
    }

    return (
      <div className={s.bookingComplete}>
        <Container>
          {component}
        </Container>
        <VerifyBookingPopup onVerified={this.onVerified} />
      </div>
    );
  }

}

BookingComplete.propTypes = {
  booking: React.PropTypes.object,
  bookingFetching: React.PropTypes.bool,

  getBooking: React.PropTypes.func,
  destroyOrder: React.PropTypes.func,
  showVerifyBookingPopup: React.PropTypes.func,
};

const mapStateToProps = (state) => ({
  booking: state.booking.data,
  bookingFetching: state.booking.isFetching,
});

const mapDispatchToProps = (dispatch) => ({
  getBooking: (params) => dispatch(getBooking(params)),
  destroyOrder: () => dispatch(destroyOrder()),
  showVerifyBookingPopup: (bookingId) => dispatch(showVerifyBookingPopup(bookingId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookingComplete);
