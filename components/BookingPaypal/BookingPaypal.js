import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import './BookingPaypal.scss';
import Link from '../Link';
import { createPaypalTransaction, executePaypalTransaction, setPostStatus } from '../../actions';
import Util from '../../core/Util';

class BookingPaypal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      paymentId: this.props.location && this.props.location.query && this.props.location.query['paymentId'],
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
            <p>There will be an additional 3% transaction charge.</p>
            <p>Please initiate your payment by clicking the "Pay Now" button below.<br/>You will be redirected to Paypal to complete your payment.</p>
            <p></p>
            <div className="BookingPaypalFooter">
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
      url = (window.location.href.indexOf('?') > -1 ? window.location.href.slice(0, window.location.href.indexOf('?')) : window.location.href) + '?bid=' + this.props.booking.id + '&email=' + this.props.booking.client_contactEmail;
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
    location: state.router && state.router.location,
    booking: state.booking.items
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
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
