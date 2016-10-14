import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import s from './BookingPayment.css';
import Container from '../Container';
import { setPostStatus } from '../../actions';
import history from '../../core/history';

class BookingPayment extends Component {

  onClick = (paymentType) => (event) => {
    event.preventDefault();

    this.props.setPostStatus(`payment-${paymentType}`);
  };

  render() {
    const { user, booking, sessions, postStatus } = this.props;
    const location = history.getCurrentLocation();
    let bankTransferItem;
    const dates = booking && booking.case && booking.case.dates;
    if (sessions && Object.values(sessions) && Object.values(sessions).length > 0) {
      const earliestDate = Object.values(sessions).reduce((result, session) => {
        if (session) {
          if (!result) return new Date(session.date);
          if (new Date(result) > new Date(session.date)) {
            result = new Date(session.date);
          }
        }
        return result;
      }, new Date(8640000000000000));
      earliestDate.setDate(earliestDate.getDate() - 3);
      if (earliestDate > new Date()) {
        bankTransferItem = (
          <li className={s.bookingPaymentNavItem}>
            <a
              className={classNames(s.bookingPaymentNavLink,
                (location && location.pathname === '/booking-confirmation' && postStatus === 'payment-bank')
                ? s.bookingPaymentNavLinkActive : '')}
              href="#"
              onClick={this.onClick('bank')}
            >
              Bank Transfer<span className={s.bookingPaymentNavArrow}><div className="nav-caret"></div></span>
            </a>
          </li>
        );
      }
    }
    return (
      <div className={s.bookingPayment}>
        <div className={s.bookingPaymentNavWrapper}>
          <Container>
            <ul className={s.bookingPaymentNav}>
              {user && user._id &&
                <li className={s.bookingPaymentNavItem}>
                  <a
                    className={classNames(s.bookingPaymentNavLink,
                      (location && location.pathname === '/booking-confirmation' && postStatus === 'payment-credits')
                      ? s.bookingPaymentNavLinkActive : '')}
                    href="#"
                    onClick={this.onClick('credits')}
                  >
                    eBeeCare Credits<span className={s.bookingPaymentNavArrow}><div className="nav-caret"></div></span>
                  </a>
                </li>
              }
              <li className={s.bookingPaymentNavItem}>
                <a
                  className={classNames(s.bookingPaymentNavLink,
                    (location && location.pathname === '/booking-confirmation' && postStatus === 'payment-card')
                    ? s.bookingPaymentNavLinkActive : '')}
                  href="#"
                  onClick={this.onClick('card')}
                >
                  Credit Card<span className={s.bookingPaymentNavArrow}><div className="nav-caret"></div></span>
                </a>
              </li>
              <li className={s.bookingPaymentNavItem}>
                <a
                  className={classNames(s.bookingPaymentNavLink,
                    (location && location.pathname === '/booking-confirmation' && postStatus === 'payment-paypal')
                    ? s.bookingPaymentNavLinkActive : '')}
                  href="#"
                  onClick={this.onClick('paypal')}
                >
                  Paypal<span className={s.bookingPaymentNavArrow}><div className="nav-caret"></div></span>
                </a>
              </li>
              {bankTransferItem}
              {/*
              <li className={s.bookingPaymentNavItem}>
                <a
                  className={classNames(s.bookingPaymentNavLink,
                    (this.props.path === '/booking-confirmation' && this.props.postStatus === 'payment-credits')
                    ? s.bookingPaymentNavLinkActive : '')}
                  href="#"
                  onClick={this._onClick.bind(this, 'credits')}
                >
                  eBeeCare Credits
                  <span className={s.bookingPaymentNavArrow}><div className="nav-caret"></div></span>
                </a>
              </li> */}
            </ul>
          </Container>
        </div>
        <div>
          <Container>
            <div className={s.bookingPaymentBody}>
              {this.props.children}
            </div>
          </Container>
        </div>
      </div>
    );
  }

}

BookingPayment.propTypes = {
  children: React.PropTypes.node.isRequired,

  user: React.PropTypes.object,
  booking: React.PropTypes.object,
  sessions: React.PropTypes.object,
  sessionsFetching: React.PropTypes.bool,
  postStatus: React.PropTypes.string,

  setPostStatus: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user.data,
  booking: state.booking.data,
  sessions: state.sessions.data,
  sessionsFetching: state.sessions.isFetching,
  postStatus: state.postStatus,
});

const mapDispatchToProps = (dispatch) => ({
  setPostStatus: (status) => dispatch(setPostStatus(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookingPayment);
