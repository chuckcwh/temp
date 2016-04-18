import React, { Component } from 'react';
import classNames from 'classnames';
import './BookingPayment.scss';
import Container from '../Container';
import Link from '../Link';
import BookingActions from '../../actions/BookingActions';

export default class BookingPayment extends Component {

  render() {
    var bankTransferItem;
    var dates = this.props.booking && this.props.booking.case && this.props.booking.case.dates;
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
          <li className="BookingPaymentNav-item">
            <a className={classNames('BookingPaymentNav-link', (this.props.path === '/booking-confirmation' && this.props.postStatus === 'payment-bank') ? 'active' : '')} href="#" onClick={this._onClick.bind(this, 'bank')}>Bank Transfer<span className="BookingPaymentNav-arrow"><div className="nav-caret"></div></span></a>
          </li>
        );
      }
    }
    return (
      <div className="BookingPayment">
        <div className="BookingPaymentNav-wrapper">
          <Container>
            <ul className="BookingPaymentNav">
              <li className="BookingPaymentNav-item">
                <a className={classNames('BookingPaymentNav-link', (this.props.path === '/booking-confirmation' && this.props.postStatus === 'payment-paypal') ? 'active' : '')} href="#" onClick={this._onClick.bind(this, 'paypal')}>Paypal (Credit/Debit)<span className="BookingPaymentNav-arrow"><div className="nav-caret"></div></span></a>
              </li>
              {bankTransferItem}
              {/*<li className="BookingPaymentNav-item">
                <a className={classNames('BookingPaymentNav-link', (this.props.path === '/booking-confirmation' && this.props.postStatus === 'payment-credits') ? 'active' : '')} href="#" onClick={this._onClick.bind(this, 'credits')}>eBeeCare Credits<span className="BookingPaymentNav-arrow"><div className="nav-caret"></div></span></a>
              </li>*/}
            </ul>
          </Container>
        </div>
        <div>
          <Container>
            <div className="BookingPaymentBody">
              {this.props.children}
            </div>
          </Container>
        </div>
      </div>
    );
  }

  _onClick(paymentType, event) {
    event.preventDefault();

    BookingActions.setPostStatus('payment-' + paymentType);
  }

}
