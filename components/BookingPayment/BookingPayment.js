import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import s from './BookingPayment.css';
import Container from '../Container';
import Link from '../Link';
import { setPostStatus } from '../../actions';
import history from '../../core/history';

class BookingPayment extends Component {

  render() {
    const { booking, postStatus } = this.props;
    const location = history.getCurrentLocation();
    var bankTransferItem;
    var dates = booking && booking.case && booking.case.dates;
    if (dates) {
      var earliestDate;
      for (var i = 0; i < dates.length; i++) {
        if (earliestDate) {
          var d = new Date(dates[i]['dateTimeStart']);
          if (earliestDate > d) {
            earliestDate = d;
          }
        } else {
          earliestDate = new Date(dates[i]['dateTimeStart']);
        }
      }
      earliestDate.setDate(earliestDate.getDate() - 3);
      if (earliestDate > new Date()) {
        bankTransferItem = (
          <li className={s.bookingPaymentNavItem}>
            <a className={classNames(s.bookingPaymentNavLink, (location && location.pathname === '/booking-confirmation' && postStatus === 'payment-bank') ? s.bookingPaymentNavLinkActive : '')} href="#" onClick={this._onClick.bind(this, 'bank')}>Bank Transfer<span className={s.bookingPaymentNavArrow}><div className="nav-caret"></div></span></a>
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
                <a className={classNames(s.bookingPaymentNavLink, (location && location.pathname === '/booking-confirmation' && postStatus === 'payment-paypal') ? s.bookingPaymentNavLinkActive : '')} href="#" onClick={this._onClick.bind(this, 'paypal')}>Paypal (Credit/Debit)<span className={s.bookingPaymentNavArrow}><div className="nav-caret"></div></span></a>
              </li>
              {bankTransferItem}
              {/*<li className={s.bookingPaymentNavItem}>
                <a className={classNames(s.bookingPaymentNavLink, (this.props.path === '/booking-confirmation' && this.props.postStatus === 'payment-credits') ? s.bookingPaymentNavLinkActive : '')} href="#" onClick={this._onClick.bind(this, 'credits')}>eBeeCare Credits<span className={s.bookingPaymentNavArrow}><div className="nav-caret"></div></span></a>
              </li>*/}
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

  _onClick(paymentType, event) {
    event.preventDefault();

    this.props.setPostStatus('payment-' + paymentType);
  }

}

const mapStateToProps = (state) => {
  return {
    booking: state.booking.data,
    postStatus: state.postStatus
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setPostStatus: (status) => {
      return dispatch(setPostStatus(status));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingPayment);
