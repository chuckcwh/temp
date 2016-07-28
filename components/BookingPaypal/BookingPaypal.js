import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import s from './BookingPaypal.css';
import { getBooking, createPaypalTransaction, executePaypalTransaction, setPostStatus } from '../../actions';
import history from '../../core/history';

const imgPaypal = require('../paypal.png');
const imgVisaMaster = require('../visamaster.png');

class BookingPaypal extends Component {

  constructor(props) {
    super(props);
    const location = history.getCurrentLocation();
    this.state = {
      paymentId: location && location.query && location.query.paymentId,
      bid: location && location.query && location.query.bid,
      mobilePhone: location && location.query && location.query.mobilePhone,
      pending: location && location.query && location.query.paymentId && true,
      redirecting: false,
    };
  }

  componentDidMount() {
    if (this.state.paymentId) {
      // Execute paypal payment since this is returned from Paypal
      this.props.executePaypalTransaction({
        ppid: this.state.paymentId,
      }).then((res) => {
        if (res.response && res.response.status === 1) {
          // console.log(res.response.items);
          this.props.getBooking({
            bid: this.state.bid,
            mobilePhone: this.state.mobilePhone,
          });

          this.props.setPostStatus('success');
        } else {
          // console.error('Failed to execute paypal payment.');
        }
      });
    }
  }

  onConfirm = (event) => {
    let url;

    event.preventDefault();

    this.setState({ pending: true });

    if (typeof window !== 'undefined') {
      url = `${(window.location.href.indexOf('?') > -1
        ? window.location.href.slice(0, window.location.href.indexOf('?'))
        : window.location.href)}`
      + `?bid=${this.props.booking.id}&mobilePhone=${this.props.booking.client_contactNumber}`;
      url = url.replace('#', '');
    }

    this.props.createPaypalTransaction({
      amount: this.props.booking && this.props.booking.case && this.props.booking.case.price,
      type: 'case',
      cid: this.props.booking && this.props.booking.case && this.props.booking.case.id,
      returnUrl: url,
      cancelUrl: url,
    }).then((res) => {
      if (res.response && res.response.status === 1) {
        // console.log(res.response.url);
        // console.log(res.response.payment_id);
        this.setState({ redirecting: true });
        // console.log('Redirecting to ' + res.response.url);
        if (typeof window !== 'undefined') {
          window.location = res.response.url;
        }
      } else {
        // console.error('Failed to create paypal payment.');
      }
    });
  };

  render() {
    if (this.state.paymentId) {
      return (
        <div className={s.bookingPaypal}>
          <Loader className="spinner" loaded={!this.state.pending} />
        </div>
      );
    } else if (this.state.redirecting) {
      return (
        <div className={s.bookingPaypal}>
          <div className="text-center">
            <p><b><i>Redirecting to Paypal in a few seconds ...</i></b></p>
          </div>
          <Loader className="spinner" loaded={!this.state.pending} />
        </div>
      );
    }
    return (
      <div className={s.bookingPaypal}>
        <Loader className="spinner" loaded={!this.state.pending}>
          <div>
            <img className={s.bookingPaypalLogo} src={imgPaypal} alt="Paypal" />
            <img className={s.bookingPaypalLogo} src={imgVisaMaster} alt="Visa/Master" />
          </div>
          <p><b>Your Total Amount is SGD {this.props.booking && this.props.booking.case && this.props.booking.case.price}</b></p>
          <p>There will be an additional 3% transaction charge.</p>
          <p>Please initiate your payment by clicking the "Pay Now" button below.<br />You will be redirected to Paypal to complete your payment.</p>
          <p></p>
          <div className={s.bookingPaypalFooter}>
            <a href="#" className="btn btn-primary" onClick={this.onConfirm}>PAY NOW</a>
          </div>
        </Loader>
      </div>
    );
  }

}

BookingPaypal.propTypes = {
  booking: React.PropTypes.object,

  getBooking: React.PropTypes.func.isRequired,
  createPaypalTransaction: React.PropTypes.func.isRequired,
  executePaypalTransaction: React.PropTypes.func.isRequired,
  setPostStatus: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  booking: state.booking.data,
});

const mapDispatchToProps = (dispatch) => ({
  getBooking: (params) => dispatch(getBooking(params)),
  createPaypalTransaction: (params) => dispatch(createPaypalTransaction(params)),
  executePaypalTransaction: (params) => dispatch(executePaypalTransaction(params)),
  setPostStatus: (status) => dispatch(setPostStatus(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookingPaypal);
