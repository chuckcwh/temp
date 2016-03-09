import React, { Component } from 'react';
import Loader from 'react-loader';
import './BookingPaypal.scss';
import Link from '../Link';
import BookingActions from '../../actions/BookingActions';

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
      fetch('http://161.202.19.121/api/verifyPaypalTransaction', {
        method: 'post',
        headers: {
          'Authorization': 'Basic ' + btoa('secret:secret0nlyWeilsonKnowsShhh852~')
        },
        body: JSON.stringify({
          ppid: this.state.paymentId
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data && data.status) {
          // console.log(data.items);
          BookingActions.setPostStatus('success');
        } else {
          console.error('Failed to execute paypal payment.');
        }
      })
      .catch(err => {
        console.error('http://161.202.19.121/api/verifyPaypalTransaction', status, err.toString());
      });
    }
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
            <div>
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

    fetch('http://161.202.19.121/api/makePaypalWebPayment', {
      method: 'post',
      headers: {
        'Authorization': 'Basic ' + btoa('secret:secret0nlyWeilsonKnowsShhh852~')
      },
      body: JSON.stringify({
        amount: this.props.booking.case.price,
        type: 'case',
        cid: this.props.booking.case.id,
        returnUrl: window.location.href.slice(0, window.location.href.indexOf('?')) + '?bid=' + this.props.booking.id,
        cancelUrl: window.location.href.slice(0, window.location.href.indexOf('?')) + '?bid=' + this.props.booking.id
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data && data.status) {
        console.log(data.url);
        console.log(data.payment_id);
        // this.setState(data.booking);
        // BookingActions.setBooking(data.booking);
        this.setState({
          redirecting: true
        });
        window.location = data.url;
      } else {
        console.error('Failed to create paypal payment.');
      }
    })
    .catch(err => {
      console.error('http://161.202.19.121/api/makePaypalWebPayment', status, err.toString());
    });
  }

}
