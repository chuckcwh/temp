import React, { Component } from 'react';
import request from 'superagent';
import Loader from 'react-loader';
import './BookingPaypal.scss';
import Link from '../Link';
import BookingActions from '../../actions/BookingActions';
import Util from '../../lib/Util';

export default class BookingPaypal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      paymentId: this.props.location.query['paymentId'],
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
      this.serverRequest1 = request
        .post(Util.host + '/api/verifyPaypalTransaction')
        .auth(Util.authKey, Util.authSecret)
        .send({
          ppid: this.state.paymentId
        })
        .end((err, res) => {
          if (err) {
            return console.error(Util.host + '/api/verifyPaypalTransaction', status, err.toString());
          }
          console.log(res.body);
          if (res.body && res.body.status) {
            // console.log(res.body.items);
            BookingActions.setPostStatus('success');
          } else {
            console.error('Failed to execute paypal payment.');
          }
        });
    }
  }

  componentWillUnmount() {
    this.serverRequest1 && this.serverRequest1.abort();
    this.serverRequest2 && this.serverRequest2.abort();
  }

  render() {
    if (this.state.paymentId) {
      return (
        <div className="BookingPaypal">
          <Loader className="spinner" loaded={this.state.pending ? false : true} />
        </div>
      );
    } else if (this.state.redirecting) {
      return (
        <div className="BookingPaypal">
          <div className="text-center">
            <p><b><i>Redirecting to Paypal in a few seconds ...</i></b></p>
          </div>
          <Loader className="spinner" loaded={this.state.pending ? false : true} />
        </div>
      );
    } else {
      return (
        <div className="BookingPaypal">
          <Loader className="spinner" loaded={this.state.pending ? false : true}>
            <div>
              <img className="BookingPaypalLogo" src={require('../paypal.png')} />
              <img className="BookingPaypalLogo" src={require('../visamaster.png')} />
            </div>
            <p><b>Your Total Amount is SGD {this.props.booking && this.props.booking.case && this.props.booking.case.price}</b></p>
            <p>Please confirm your booking by clicking the "Confirm Booking" button below.<br/>You will be redirected to Paypal to complete your payment.</p>
            <p></p>
            <div className="BookingPaypalFooter">
              <a href="#" className="btn btn-primary" onClick={this._onConfirm.bind(this)}>CONFIRM BOOKING</a>
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

    this.serverRequest2 = request
      .post(Util.host + '/api/makePaypalWebPayment')
      .auth(Util.authKey, Util.authSecret)
      .send({
        amount: this.props.booking.case.price,
        type: 'case',
        cid: this.props.booking.case.id,
        returnUrl: window.location.href.slice(0, window.location.href.indexOf('?')) + '?bid=' + this.props.booking.id + '&email=' + this.props.booking.client_contactEmail,
        cancelUrl: window.location.href.slice(0, window.location.href.indexOf('?')) + '?bid=' + this.props.booking.id + '&email=' + this.props.booking.client_contactEmail
      })
      .end((err, res) => {
        if (err) {
          return console.error(Util.host + '/api/makePaypalWebPayment', status, err.toString());
        }
        if (res.body && res.body.status) {
          console.log(res.body.url);
          console.log(res.body.payment_id);
          this.setState({
            redirecting: true
          });
          console.log('Redirecting to ' + res.body.url);
          window.location = res.body.url;
        } else {
          console.error('Failed to create paypal payment.');
        }
      });
  }

}
