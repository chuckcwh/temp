import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import './BookingPayment.scss';
import Container from '../Container';
import Link from '../Link';
import { setPostStatus } from '../../actions';

class BookingPayment extends Component {

  render() {
    const { location, booking, postStatus } = this.props;
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
          <li className="BookingPaymentNav-item">
            <a className={classNames('BookingPaymentNav-link', (location && location.pathname === '/booking-confirmation' && postStatus === 'payment-bank') ? 'active' : '')} href="#" onClick={this._onClick.bind(this, 'bank')}>Bank Transfer<span className="BookingPaymentNav-arrow"><div className="nav-caret"></div></span></a>
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
                <a className={classNames('BookingPaymentNav-link', (location && location.pathname === '/booking-confirmation' && postStatus === 'payment-paypal') ? 'active' : '')} href="#" onClick={this._onClick.bind(this, 'paypal')}>Paypal (Credit/Debit)<span className="BookingPaymentNav-arrow"><div className="nav-caret"></div></span></a>
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

    this.props.setPostStatus('payment-' + paymentType);
  }

}

const mapStateToProps = (state) => {
  return {
    location: state.router && state.router.location,
    booking: state.booking.items,
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
