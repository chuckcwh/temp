import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import s from './BookingPaymentCard.css';
import BookingPaymentCardForm from '../BookingPaymentCardForm';
import { APPLICATIONS_PAY_CARD_SUCCESS,
  getBooking, payApplicationsCard, setPostStatus, showAlertPopup } from '../../actions';
import history from '../../core/history';

const imgPaypal = require('../paypal.png');
const imgVisaMaster = require('../visamaster.png');

class BookingPaymentCard extends Component {

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
          this.props.getBooking({
            bookingId: location && location.query && location.query.bid,
            bookingToken: location && location.query && location.query.btoken,
          });

          this.props.setPostStatus('success');
        } else {
          // console.error('Failed to execute paypal payment.');
        }
      });
    }
  }

  handleSubmit = (values) => {
    return new Promise((resolve, reject) => {
      if (typeof window !== 'undefined' && window.Stripe) {
        window.Stripe.card.createToken(values, (status, response) => {
          if (response.error) {
            this.showAlertPopup('An error has occurred with the payment gateway. Please contact us to rectify the issue.');
            reject();
          } else {
            const token = response.id;
            const location = history.getCurrentLocation();
            this.props.payApplicationsCard({
              mode: 'stripe',
              applications: Object.keys(this.props.applications),
              payment: {
                stripeToken: token,
              },
              bookingId: this.props.booking && this.props.booking._id,
              bookingToken: this.props.booking && this.props.booking.adhocClient && this.props.booking.adhocClient.contact,
            }).then((res) => {
              if (res && res.type === APPLICATIONS_PAY_CARD_SUCCESS) {
                resolve();
                
                this.props.getBooking({
                  bookingId: location && location.query && location.query.bid,
                  bookingToken: location && location.query && location.query.btoken,
                });

                this.props.setPostStatus('success');
              } else {
                reject();
                // console.error('Failed to create paypal payment.');
              }
            });
          }
        });
      }
    });
  }

  render() {
    const location = history.getCurrentLocation();
    const { config, applications } = this.props;
    let sum = 0;
    if (location && location.query && location.query.paymentId) {
      return (
        <div className={s.bookingPaymentCard}>
          <Loader className="spinner" loaded={!this.state.pending} />
        </div>
      );
    } else if (this.state.redirecting) {
      return (
        <div className={s.bookingPaymentCard}>
          <div className="text-center">
            <p><b><i>Redirecting to Paypal in a few seconds ...</i></b></p>
          </div>
          <Loader className="spinner" loaded={!this.state.pending} />
        </div>
      );
    }
    if (applications && Object.values(applications) && Object.values(applications).length > 0) {
      Object.values(applications).map(application => {
        sum += parseFloat(application.price);
      });
    }
    const total = ((sum + config.stripe.fixed) / (1 - config.stripe.percentage));
    return (
      <div className={s.bookingPaymentCard}>
        <Loader className="spinner" loaded={!this.state.pending}>
          <div>
            <img className={s.bookingPaymentCardLogo} src={imgVisaMaster} alt="Visa/Master" />
          </div>
          <p><b>Your Total Amount is SGD {parseFloat(total).toFixed(2)}</b></p>
          <p>There will be an additional service fee of SGD {parseFloat(config.stripe.fixed).toFixed(2)} + {(parseFloat(config.stripe.percentage) * 100).toFixed(1)}%.</p>
          <BookingPaymentCardForm onSubmit={this.handleSubmit} />
        </Loader>
      </div>
    );
  }

}

BookingPaymentCard.propTypes = {
  config: React.PropTypes.object,
  booking: React.PropTypes.object,
  applications: React.PropTypes.object,
  applicationsFetching: React.PropTypes.bool,
  sessions: React.PropTypes.object,

  getBooking: React.PropTypes.func.isRequired,
  payApplicationsCard: React.PropTypes.func.isRequired,
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
  payApplicationsCard: (params) => dispatch(payApplicationsCard(params)),
  setPostStatus: (status) => dispatch(setPostStatus(status)),
  showAlertPopup: (message) => dispatch(showAlertPopup(message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookingPaymentCard);
