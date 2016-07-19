import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import s from './BookingPaypal.css';
import Link from '../Link';
import { getBooking, createPaypalTransaction, executePaypalTransaction, setPostStatus } from '../../actions';
import history from '../../core/history';
import util from '../../core/util';

class BookingPaypal extends Component {

  constructor(props) {
    super(props);
    const location = history.getCurrentLocation();
    this.state = {
      paymentId: location && location.query && location.query['paymentId'],
      bid: location && location.query && location.query['bid'],
      mobilePhone: location && location.query && location.query['mobilePhone'],
      pending: false,
      redirecting: false
    };
  }

  componentDidMount() {
    if (this.state.paymentId) {
      this.setState({
        pending: true
      });
      // Execute paypal payment since this is returned from Paypal
      this.props.executePaypalTransaction({
        ppid: this.state.paymentId
      }).then((res) => {
        if (res.response && res.response.status === 1) {
          // console.log(res.response.items);
          this.props.getBooking({
            bid: this.state.bid,
            mobilePhone: this.state.mobilePhone
          });

          this.props.setPostStatus('success');
        } else {
          console.error('Failed to execute paypal payment.');
        }
      });
    }
  }

  render() {
    if (this.state.paymentId) {
      return (
        <div className={s.bookingPaypal}>
          <Loader className="spinner" loaded={this.state.pending ? false : true} />
        </div>
      );
    } else if (this.state.redirecting) {
      return (
        <div className={s.bookingPaypal}>
          <div className="text-center">
            <p><b><i>Redirecting to Paypal in a few seconds ...</i></b></p>
          </div>
          <Loader className="spinner" loaded={this.state.pending ? false : true} />
        </div>
      );
    } else {
      return (
        <div className={s.bookingPaypal}>
          <Loader className="spinner" loaded={this.state.pending ? false : true}>
            <div>
              <img className={s.bookingPaypalLogo} src={require('../paypal.png')} />
              <img className={s.bookingPaypalLogo} src={require('../visamaster.png')} />
            </div>
            <p><b>Your Total Amount is SGD {this.props.booking && this.props.booking.case && this.props.booking.case.price}</b></p>
            <p>There will be an additional 3% transaction charge.</p>
            <p>Please initiate your payment by clicking the "Pay Now" button below.<br/>You will be redirected to Paypal to complete your payment.</p>
            <p></p>
            <div className={s.bookingPaypalFooter}>
              <a href="#" className="btn btn-primary" onClick={this._onConfirm.bind(this)}>PAY NOW</a>
            </div>
          </Loader>
        </div>
      );
    }
  }

  _onConfirm(event) {
    // Link.handleClick(event);
    event.preventDefault();

    this.setState({
      pending: true
    });

    var url;
    if (typeof window !== 'undefined') {
      url = (window.location.href.indexOf('?') > -1 ? window.location.href.slice(0, window.location.href.indexOf('?')) : window.location.href) + '?bid=' + this.props.booking.id + '&mobilePhone=' + this.props.booking.client_contactNumber;
      url = url.replace('#', '');
    }

    this.props.createPaypalTransaction({
      amount: this.props.booking && this.props.booking.case && this.props.booking.case.price,
      type: 'case',
      cid: this.props.booking && this.props.booking.case && this.props.booking.case.id,
      returnUrl: url,
      cancelUrl: url
    }).then((res) => {
      if (res.response && res.response.status === 1) {
        console.log(res.response.url);
        console.log(res.response.payment_id);
        this.setState({
          redirecting: true
        });
        console.log('Redirecting to ' + res.response.url);
        if (typeof window !== 'undefined') {
          window.location = res.response.url;
        }
      } else {
        console.error('Failed to create paypal payment.');
      }
    });
  }

}

const mapStateToProps = (state) => {
  return {
    booking: state.booking.data
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getBooking: (params) => {
      return dispatch(getBooking(params));
    },
    createPaypalTransaction: (params) => {
      return dispatch(createPaypalTransaction(params));
    },
    executePaypalTransaction: (params) => {
      return dispatch(executePaypalTransaction(params));
    },
    setPostStatus: (status) => {
      return dispatch(setPostStatus(status));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingPaypal);
