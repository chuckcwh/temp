import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Loader from 'react-loader';
import s from './BookingPaymentCredits.css';
import Link from '../Link';
import { APPLICATIONS_PAY_CREDITS_SUCCESS,
  getBooking, payApplicationsCredits, setPostStatus } from '../../actions';
import { isFloat } from '../../core/util';
import history from '../../core/history';

class BookingPaymentCredits extends Component {

  constructor(props) {
    super(props);
  }

  onConfirm = (event) => {
    event.preventDefault();

    this.setState({ pending: true });

    const location = history.getCurrentLocation();
    this.props.payApplicationsCredits({
      mode: 'credit',
      applications: location && location.query && location.query.applications && location.query.applications.split(','),
    }).then((res) => {
      if (res && res.type === APPLICATIONS_PAY_CREDITS_SUCCESS) {
        if (this.props.booking && this.props.booking._id && this.props.booking.isAdhoc) {
          this.props.getBooking({
            bookingId: this.props.booking && this.props.booking._id,
            bookingToken: this.props.booking && this.props.booking.client && this.props.booking.client.contact,
          });
        }

        this.props.setPostStatus('success');
      } else {
        this.setState({
          pending: false,
          error: true,
          transferTime: undefined,
          transferRef: undefined,
        });
        // console.error('Failed to verify bank transfer payment.');
      }
    });
  };

  render() {
    const location = history.getCurrentLocation();
    const { user, userFetching, applications } = this.props;
    const credits = user && user.credits && user.credits.current && parseFloat(user.credits.current) || 0;
    let sum = 0;
    if (applications && Object.values(applications) && Object.values(applications).length > 0) {
      Object.values(applications).map(application => {
        sum += parseFloat(application.price);
      });
    }
    return (
      <div className={s.bookingPaymentCredits}>
        <Loader className="spinner" loaded={!userFetching}>
          <p><b>Your Total Amount is SGD {parseFloat(sum).toFixed(2)}</b></p>
          {(() => {
            if (credits > sum) {
              return (
                <div className={s.bookingPaymentCreditsSection}>
                  <div className={s.bookingPaymentCreditsSectionBoxWrapper}>
                    <div className={s.bookingPaymentCreditsSectionBox}>
                      <div className={s.bookingPaymentCreditsSectionBoxContent}>
                        <div className={s.bookingPaymentCreditsSectionBoxValue}>
                          {`SGD ${user && parseFloat(credits).toFixed(2)}`}
                        </div>
                        <div className={s.bookingPaymentCreditsSectionBoxTitle}>Balance Credits</div>
                      </div>
                    </div>
                    <div className={s.bookingPaymentCreditsSectionBox}>
                      <div className={s.bookingPaymentCreditsSectionBoxContent}>
                        <div className={s.bookingPaymentCreditsSectionBoxValue}>
                          {`SGD ${user && parseFloat(credits - sum).toFixed(2)}`}
                        </div>
                        <div className={s.bookingPaymentCreditsSectionBoxTitle}>*Balance Credits After Payment</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <a href="#" className="btn btn-primary" onClick={this.onConfirm}>CONFIRM PAYMENT</a>
                  </div>
                </div>
              );
            } else {
              return (
                <div className={s.bookingPaymentCreditsSection}>
                  <div className={s.bookingPaymentCreditsSectionBoxWrapper}>
                    <div className={s.bookingPaymentCreditsSectionBox}>
                      <div className={s.bookingPaymentCreditsSectionBoxContent}>
                        <div className={s.bookingPaymentCreditsSectionBoxValue}>
                          {`SGD ${user && parseFloat(credits).toFixed(2)}`}
                        </div>
                        <div className={s.bookingPaymentCreditsSectionBoxTitle}>Balance Credits</div>
                      </div>
                    </div>
                  </div>
                  <p>You do not have enough credits in your account.</p>
                  <p><Link to="/credits">Top up your credits</Link></p>
                </div>
              );
            }
          })()}
        </Loader>
      </div>
    );
  }

}

BookingPaymentCredits.propTypes = {
  config: React.PropTypes.object,
  user: React.PropTypes.object,
  userFetching: React.PropTypes.bool,
  applications: React.PropTypes.object,
  applicationsFetching: React.PropTypes.bool,

  getBooking: React.PropTypes.func.isRequired,
  payApplicationsCredits: React.PropTypes.func.isRequired,
  setPostStatus: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  config: state.config.data,
  user: state.user.data,
  userFetching: state.user.isFetching,
  applications: state.applications.data,
  applicationsFetching: state.applications.isFetching,
});

const mapDispatchToProps = (dispatch) => ({
  getBooking: (params) => dispatch(getBooking(params)),
  payApplicationsCredits: (params) => dispatch(payApplicationsCredits(params)),
  setPostStatus: (status) => dispatch(setPostStatus(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookingPaymentCredits);
