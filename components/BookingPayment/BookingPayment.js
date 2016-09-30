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
    const { booking, applications, sessions, postStatus } = this.props;
    const location = history.getCurrentLocation();
    let bankTransferItem;
    const dates = booking && booking.case && booking.case.dates;
    if (applications && Object.values(applications) && Object.values(applications).length > 0) {
      const earliestDate = Object.values(applications).reduce((result, application) => {
        const sessionId = (application && application.session && application.session._id) || application.session;
        const session = sessionId && sessions && sessions[sessionId];
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

  booking: React.PropTypes.object,
  applications: React.PropTypes.object,
  applicationsFetching: React.PropTypes.bool,
  sessions: React.PropTypes.object,
  sessionsFetching: React.PropTypes.bool,
  postStatus: React.PropTypes.string,

  setPostStatus: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  booking: state.booking.data,
  applications: state.applications.data,
  applicationsFetching: state.applications.isFetching,
  sessions: state.sessions.data,
  sessionsFetching: state.sessions.isFetching,
  postStatus: state.postStatus,
});

const mapDispatchToProps = (dispatch) => ({
  setPostStatus: (status) => dispatch(setPostStatus(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookingPayment);
