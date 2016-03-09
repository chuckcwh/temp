import React, { Component } from 'react';
import classNames from 'classNames';
import './BookingPayment.scss';
import Container from '../Container';
import Link from '../Link';
import BookingActions from '../../actions/BookingActions';

export default class BookingPayment extends Component {

  render() {
    return (
      <div className="BookingPayment">
        <div className="BookingPaymentNav-wrapper">
          <Container>
            <ul className="BookingPaymentNav">
              <li className="BookingPaymentNav-item">
                <a className={classNames('BookingPaymentNav-link', (this.props.path === '/booking-confirmation' && this.props.postStatus === 'payment-paypal') ? 'active' : '')} href="#" onClick={this._onClick.bind(this, 'paypal')}>Paypal (Credit/Debit)<span className="BookingPaymentNav-arrow"><div className="nav-caret"></div></span></a>
              </li>
              <li className="BookingPaymentNav-item">
                <a className={classNames('BookingPaymentNav-link', (this.props.path === '/booking-confirmation' && this.props.postStatus === 'payment-bank') ? 'active' : '')} href="#" onClick={this._onClick.bind(this, 'bank')}>Bank Transfer<span className="BookingPaymentNav-arrow"><div className="nav-caret"></div></span></a>
              </li>
              <li className="BookingPaymentNav-item">
                <a className={classNames('BookingPaymentNav-link', (this.props.path === '/booking-confirmation' && this.props.postStatus === 'payment-credits') ? 'active' : '')} href="#" onClick={this._onClick.bind(this, 'credits')}>eBeeCare Credits<span className="BookingPaymentNav-arrow"><div className="nav-caret"></div></span></a>
              </li>
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
