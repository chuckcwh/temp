import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import s from './BookingComplete.css';
import Container from '../Container';
import Link from '../Link';
import VerifyBookingPopup from '../VerifyBookingPopup';
import { createBooking, createCase, getBooking, destroyOrder, showVerifyBookingPopup } from '../../actions';
import history from '../../core/history';
import util from '../../core/util';

class BookingComplete extends Component {

  constructor(props) {
    super(props);
    const { order, booking, caze, user } = props;
    this.state = {
      bookingStatus: undefined,
      booking: order && order.service && order.sessions && order.booker && booking,
      bookingId: order && order.service && order.sessions && order.booker && booking && booking.id,
      bookingAmt: (user && order && order.patient && caze && caze.price)
        || (order && order.service && order.sessions && order.booker && booking && booking.case && booking.case.price),
      bookingHp: order && order.service && order.sessions && order.booker && booking && booking.client_contactNumber,
      caseId: undefined,
      bookingVerified: false,
    };
  }

  componentDidMount() {
    const { order, user, booking, caze } = this.props;
    if (user && order && order.patient && caze) {
      // Destroy order
      this.props.destroyOrder();
    } else if (order && order.service && order.sessions && order.booker && booking) {
      // Destroy order
      this.props.destroyOrder();

      this.props.showVerifyBookingPopup(booking.id);
    }
  }

  componentWillReceiveProps(props) {
    const { order, user, booking, caze } = props;
    if (user && order && order.patient && caze) {
      // Destroy order
      this.props.destroyOrder();

      this.setState({
        bookingAmt: caze.price,
        caseId: caze.id,
      });
    } else if (order && order.service && order.sessions && order.booker && booking) {
      // Destroy order
      this.props.destroyOrder();

      this.setState({
        bookingId: booking.id,
        bookingAmt: booking.case.price,
        bookingHp: booking.client_contactNumber,
        booking,
      });

      this.props.showVerifyBookingPopup(booking.id);
    }
  }

  onVerified = () => {
    this.props.getBooking({
      bid: this.state.bookingId,
      mobilePhone: this.state.bookingHp,
    }).then(() => {
      this.setState({
        bookingVerified: true,
      });

      // Notify parent window of booking completion for embedded widget
      const location = history.getCurrentLocation();
      if (location && location.query && location.query.widget === 'true') {
        window.parent.postMessage('completedBooking', '*');
      }
    });
  };

  onClickActivateBooking = () => {
    this.props.showVerifyBookingPopup(this.state.bookingId);
  };

  onClickClose = () => {
    window.parent.postMessage('closeebkwidget', '*');
  };

  render() {
    let component,
      identity,
      footer;
    const { bookingFetching, cazeFetching } = this.props;
    const location = history.getCurrentLocation();

    if (bookingFetching || cazeFetching) {
      component = (
        <div className={s.bookingCompleteBody}>
          <Loader className="spinner" loaded={!(bookingFetching || cazeFetching)} />
        </div>
      );
    } else {
      if (this.state.bookingId) {
        let bookingLink,
          activateText;
        if (location && location.query && location.query.widget === 'true') {
          bookingLink = (
            <div>
              <a href="#" className="btn btn-primary" style={{ color: '#fff' }} onClick={this.onClickClose}>Close Window</a>
            </div>
          );
        } else if (this.state.bookingVerified) {
          bookingLink = (
            <div>
              <Link
                to={{ pathname: '/booking-manage',
                  query: { bid: this.state.bookingId, mobilePhone: this.state.booking.client_contactNumber } }}
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
            <b>BOOKING ID : {this.state.bookingId}</b>
            {bookingLink}
            {activateText}
          </div>
        );
      } else if (this.state.caseId) {
        identity = (
          <div>
            <b>CASE ID : {this.state.caseId}</b>
            <div>
              <a href={`${util.backend}/case/${this.state.caseId}`}>View Case</a>
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
            ESTIMATED AMOUNT : SGD {parseFloat(this.state.bookingAmt).toFixed(2)}
          </div>
          <div>
            For inquiries on your order, please email
            <a href="mailto:contact@ebeecare.com">contact@ebeecare.com</a>
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
  order: React.PropTypes.object,
  user: React.PropTypes.object,
  booking: React.PropTypes.object,
  bookingFetching: React.PropTypes.bool,
  caze: React.PropTypes.object,
  cazeFetching: React.PropTypes.bool,

  createBooking: React.PropTypes.func,
  createCase: React.PropTypes.func,
  getBooking: React.PropTypes.func,
  destroyOrder: React.PropTypes.func,
  showVerifyBookingPopup: React.PropTypes.func,
};

const mapStateToProps = (state) => ({
  order: state.order,
  user: state.user.data,
  booking: state.booking.data,
  bookingFetching: state.booking.isFetching,
  caze: state.caze.data,
  cazeFetching: state.caze.isFetching,
});

const mapDispatchToProps = (dispatch) => ({
  createBooking: (booking) => dispatch(createBooking(booking)),
  createCase: (caze) => dispatch(createCase(caze)),
  getBooking: (params) => dispatch(getBooking(params)),
  destroyOrder: () => dispatch(destroyOrder()),
  showVerifyBookingPopup: (bookingId) => dispatch(showVerifyBookingPopup(bookingId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookingComplete);
