import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import s from './BookingPaymentPaypal.css';
import { APPLICATIONS_PAY_PAYPAL_CREATE_SUCCESS, APPLICATIONS_PAY_PAYPAL_EXECUTE_SUCCESS,
  USER_CREDITS_TOPUP_PAYPAL_CREATE_SUCCESS, USER_CREDITS_TOPUP_PAYPAL_EXECUTE_SUCCESS,
  getBooking, payApplicationsPaypalCreate, payApplicationsPaypalExecute,
  topupCreditsPaypalCreate, topupCreditsPaypalExecute, setPostStatus } from '../../actions';
import history from '../../core/history';

const imgPaypal = require('../paypal.png');
const imgVisaMaster = require('../visamaster.png');

class BookingPaymentPaypal extends Component {

  constructor(props) {
    super(props);
    const location = history.getCurrentLocation();
    this.state = {
      pending: location && location.query && location.query.paymentId && true,
      redirecting: false,
    };
  }

  componentDidMount() {
    const location = history.getCurrentLocation();
    if (location && location.query && location.query.action === 'paypal-return') {
      if (location.query.applications) {
        // Execute paypal payment since this is returned from Paypal
        this.props.payApplicationsPaypalExecute({
          mode: 'paypal',
          applications: location && location.query && location.query.applications && location.query.applications.split(','),
          payment: {
            paymentId: location && location.query && location.query.paymentId,
            payerId: location && location.query && location.query.PayerID,
          },
          bookingId: location && location.query && location.query.bid,
          bookingToken: location && location.query && location.query.btoken,
        }).then((res) => {
          if (res && res.type === APPLICATIONS_PAY_PAYPAL_EXECUTE_SUCCESS) {
            // console.log(res.response.items);
            if (location && location.query && location.query.bid && location.query.bid !== 'undefined') {
              this.props.getBooking({
                bookingId: location && location.query && location.query.bid,
                bookingToken: location && location.query && location.query.btoken,
              });
            }

            this.props.setPostStatus('success');
          } else {
            // console.error('Failed to execute paypal payment.');
          }
        });
      } else if (location.query.deposit) {
        // Execute paypal payment since this is returned from Paypal
        this.props.topupCreditsPaypalExecute({
          mode: 'paypal',
          value: location && location.query && location.query.deposit && parseFloat(location.query.deposit),
          payment: {
            paymentId: location && location.query && location.query.paymentId,
            payerId: location && location.query && location.query.PayerID,
          },
        }).then((res) => {
          if (res && res.type === APPLICATIONS_PAY_PAYPAL_EXECUTE_SUCCESS) {
            // console.log(res.response.items);
            
            this.props.setPostStatus('success');
          } else {
            // console.error('Failed to execute paypal payment.');
          }
        });
      }
    }
  }

  onConfirm = (event) => {
    const location = history.getCurrentLocation();
    let returnUrl,
      cancelUrl;

    event.preventDefault();

    this.setState({ pending: true });

    if (location && location.pathname && location.pathname.indexOf('/booking-confirmation') === 0) {
      if (typeof window !== 'undefined') {
        returnUrl = `${(window.location.href.indexOf('?') > -1
          ? window.location.href.slice(0, window.location.href.indexOf('?'))
          : window.location.href)}`
          + `?action=${encodeURIComponent('paypal-return')}`
          + `&bid=${encodeURIComponent(this.props.booking && this.props.booking._id)}`
          + `&btoken=${encodeURIComponent(this.props.booking && this.props.booking.adhocClient && this.props.booking.adhocClient.contact)}`
          + `&applications=${encodeURIComponent(Object.keys(this.props.applications).join())}`;
        returnUrl = returnUrl.replace('#', '');
        cancelUrl = `${(window.location.href.indexOf('?') > -1
          ? window.location.href.slice(0, window.location.href.indexOf('?'))
          : window.location.href)}`
          + `?action=${encodeURIComponent('paypal-cancel')}`
          + `&bid=${encodeURIComponent(this.props.booking && this.props.booking._id)}`
          + `&btoken=${encodeURIComponent(this.props.booking && this.props.booking.adhocClient && this.props.booking.adhocClient.contact)}`
          + `&applications=${encodeURIComponent(Object.keys(this.props.applications).join())}`;
        cancelUrl = cancelUrl.replace('#', '');

        this.props.payApplicationsPaypalCreate({
          mode: 'paypal',
          applications: Object.keys(this.props.applications),
          payment: {
            return_url: returnUrl,
            cancel_url: cancelUrl,
          },
          bookingId: this.props.booking && this.props.booking._id,
          bookingToken: this.props.booking && this.props.booking.adhocClient && this.props.booking.adhocClient.contact,
        }).then((res) => {
          if (res && res.type === APPLICATIONS_PAY_PAYPAL_CREATE_SUCCESS) {
            // console.log(res);
            // console.log(res.response.url.href);
            // console.log(res.response.payment_id);
            this.setState({ redirecting: true });
            console.log('Redirecting to ' + res.response.url.href);
            if (typeof window !== 'undefined') {
              window.location = res.response.url.href;
            }
          } else {
            // console.error('Failed to create paypal payment.');
          }
        });
      }
    } else if (location && location.pathname && location.pathname.indexOf('/credits-payment') === 0) {
      if (typeof window !== 'undefined') {
        returnUrl = `${(window.location.href.indexOf('?') > -1
          ? window.location.href.slice(0, window.location.href.indexOf('?'))
          : window.location.href)}`
          + `?action=${encodeURIComponent('paypal-return')}`
          + `&deposit=${encodeURIComponent(location.query.deposit)}`
        returnUrl = returnUrl.replace('#', '');
        cancelUrl = `${(window.location.href.indexOf('?') > -1
          ? window.location.href.slice(0, window.location.href.indexOf('?'))
          : window.location.href)}`
          + `?action=${encodeURIComponent('paypal-cancel')}`
          + `&deposit=${encodeURIComponent(location.query.deposit)}`
        cancelUrl = cancelUrl.replace('#', '');

        this.props.topupCreditsPaypalCreate({
          mode: 'paypal',
          value: parseFloat(location.query.deposit),
          payment: {
            return_url: returnUrl,
            cancel_url: cancelUrl,
          },
        }).then((res) => {
          if (res && res.type === USER_CREDITS_TOPUP_PAYPAL_CREATE_SUCCESS) {
            // console.log(res);
            // console.log(res.response.url.href);
            // console.log(res.response.payment_id);
            this.setState({ redirecting: true });
            console.log('Redirecting to ' + res.response.url.href);
            if (typeof window !== 'undefined') {
              window.location = res.response.url.href;
            }
          } else {
            // console.error('Failed to create paypal payment.');
          }
        });
      }
    }
  };

  render() {
    const location = history.getCurrentLocation();
    const { config, applications } = this.props;
    let sum = 0;
    if (location && location.query && location.query.paymentId) {
      // View for paypal return
      return (
        <div className={s.bookingPaymentPaypal}>
          <Loader className="spinner" loaded={!this.state.pending} />
        </div>
      );
    } else if (this.state.redirecting) {
      // View for pending paypal redirection
      return (
        <div className={s.bookingPaymentPaypal}>
          <div className="text-center">
            <p><b><i>Redirecting to Paypal in a few seconds ...</i></b></p>
          </div>
          <Loader className="spinner" loaded={!this.state.pending} />
        </div>
      );
    }
    if (location && location.pathname.indexOf('/booking-confirmation') === 0) {
      if (applications && Object.values(applications) && Object.values(applications).length > 0) {
        Object.values(applications).map(application => {
          sum += parseFloat(application.price);
        });
      }
    } else if (location && location.pathname.indexOf('/credits-payment') === 0 && location.query && location.query.deposit) {
      sum = parseFloat(location.query.deposit);
    }
    const total = ((sum + parseFloat(config.paypal.fixed)) / (1 - parseFloat(config.paypal.percentage)));
    return (
      <div className={s.bookingPaymentPaypal}>
        <Loader className="spinner" loaded={!this.state.pending}>
          <div>
            <img className={s.bookingPaymentPaypalLogo} src={imgPaypal} alt="Paypal" />
          </div>
          <p><b>Your Total Amount is SGD {parseFloat(total).toFixed(2)}</b></p>
          <p>There will be an additional service fee of SGD {parseFloat(config.paypal.fixed).toFixed(2)} + {(parseFloat(config.paypal.percentage) * 100).toFixed(1)}%.</p>
          <p>Please initiate your payment by clicking the "Pay Now" button below.<br />You will be redirected to Paypal to complete your payment.</p>
          <p></p>
          <div className={s.bookingPaymentPaypalFooter}>
            <a href="#" className="btn btn-primary" onClick={this.onConfirm}>PAY NOW</a>
          </div>
        </Loader>
      </div>
    );
  }

}

BookingPaymentPaypal.propTypes = {
  config: React.PropTypes.object,
  booking: React.PropTypes.object,
  applications: React.PropTypes.object,
  applicationsFetching: React.PropTypes.bool,
  sessions: React.PropTypes.object,

  getBooking: React.PropTypes.func.isRequired,
  payApplicationsPaypalCreate: React.PropTypes.func.isRequired,
  payApplicationsPaypalExecute: React.PropTypes.func.isRequired,
  topupCreditsPaypalCreate: React.PropTypes.func.isRequired,
  topupCreditsPaypalExecute: React.PropTypes.func.isRequired,
  setPostStatus: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  config: state.config.data,
  booking: state.booking.data,
  applications: state.applications.data,
  applicationsFetching: state.applications.isFetching,
  sessions: state.sessions.data,
});

const mapDispatchToProps = (dispatch) => ({
  getBooking: (params) => dispatch(getBooking(params)),
  payApplicationsPaypalCreate: (params) => dispatch(payApplicationsPaypalCreate(params)),
  payApplicationsPaypalExecute: (params) => dispatch(payApplicationsPaypalExecute(params)),
  topupCreditsPaypalCreate: (params) => dispatch(topupCreditsPaypalCreate(params)),
  topupCreditsPaypalExecute: (params) => dispatch(topupCreditsPaypalExecute(params)),
  setPostStatus: (status) => dispatch(setPostStatus(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookingPaymentPaypal);
