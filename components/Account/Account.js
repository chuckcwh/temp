import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import classNames from 'classnames';
import s from './Account.css';
import Container from '../Container';
import Link from '../Link';
import FindBookingForm from '../FindBookingForm';
import SignupForm from '../SignupForm';
import LoginForm from '../LoginForm';
import ForgotPasswordForm from '../ForgotPasswordForm';
import ResetPasswordForm from '../ResetPasswordForm';
import VerifyEmail from '../VerifyEmail';
import ConfirmPopup from '../ConfirmPopup';
import VerifyUserPopup from '../VerifyUserPopup';
import VerifyBookingPopup from '../VerifyBookingPopup';
import { USER_SUCCESS, BOOKING_FAILURE, VERIFY_USER_EMAIL_SUCCESS,
  getUser, getBooking, setLastPage, verifyUserEmail, showAlertPopup,
  showConfirmPopup, showVerifyUserPopup, showVerifyBookingPopup,
  resendVerifyUserEmail } from '../../actions';
import { getUriQueryParam } from '../../core/util';
import history from '../../core/history';

class Account extends Component {

  constructor(props) {
    super(props);
    this.state = {
      bid: this.props.bid || undefined,
      contact: this.props.contact || undefined,
    };
  }

  componentDidMount() {
    if (this.props.booking && this.props.booking._id && !this.props.booking.isVerified) {
      this.props.showVerifyBookingPopup(this.props.booking._id);
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      bid: props.bid || this.state.bid,
      btoken: props.contact || this.state.btoken,
    });
    if (props.booking && props.booking !== this.props.booking && props.booking._id && !props.booking.isVerified) {
      this.props.showVerifyBookingPopup(props.booking._id);
    }
  }

  onVerifiedUser = () => {
    this.props.getUser({
      userId: this.props.user && this.props.user._id,
    }).then((res) => {
      if (res && res.type === USER_SUCCESS) {
        history.push({ pathname: '/dashboard', query: location.query });
      }
    });
  };

  onVerifiedBooking = () => {
    this.props.getBooking({
      bookingId: this.props.booking && this.props.booking._id,
      bookingToken: this.props.booking && this.props.booking.contact,
    }).then((res) => {
      if (res && res.type === BOOKING_FAILURE) {
        this.props.showAlertPopup('Sorry, we are not able to find your booking.');
      }
    });
  };

  render() {
    const location = history.getCurrentLocation();
    let components;
    if (this.props.type === 'find-booking') {
      components = (
        <div className={s.accountContainer}>
          <div className={classNames(s.accountFind, s.accountContainerItem)}>
            <Loader
              className="spinner"
              loaded={(!(!(this.props.bookingFetching) && location && location.query
                && location.query.bid && location.query.btoken))}
            >
              <FindBookingForm />
            </Loader>
          </div>
        </div>
      );
    } else if (this.props.type === 'signup') {
      components = (
        <div className={s.accountContainer}>
          <div className={classNames(s.accountSignup, s.accountContainerItem)}>
            <SignupForm {...this.props}
              onSuccess={() => {
                this.props.showVerifyUserPopup(this.props.user._id);
              }}
            />
          </div>
        </div>
      );
    } else if (this.props.type === 'login') {
      components = (
        <div className={s.accountContainer}>
          <div className={classNames(s.accountLogin, s.accountContainerItem)}>
            <LoginForm {...this.props} />
          </div>
        </div>
      );
    } else if (this.props.type === 'forgot-password') {
      components = (
        <div className={s.accountContainer}>
          <div className={classNames(s.accountForgot, s.accountContainerItem)}>
            <ForgotPasswordForm {...this.props} />
          </div>
        </div>
      );
    } else if (this.props.type === 'reset-password') {
      const token = getUriQueryParam('token');
      components = (
        <div className={s.accountContainer}>
          <div className={classNames(s.accountReset, s.accountContainerItem)}>
            <ResetPasswordForm {...this.props} initialValues={{ token }} />
          </div>
        </div>
      );
    } else if (this.props.type === 'verify-email') {
      const token = getUriQueryParam('token');
      components = (
        <div className={s.accountContainer}>
          <div className={classNames(s.accountVerify, s.accountContainerItem)}>
            <VerifyEmail {...this.props} token={token} />
          </div>
        </div>
      );
    }
    return (
      <div className={s.account}>
        <Container>
          {components}
        </Container>
        <ConfirmPopup />
        <VerifyBookingPopup onVerified={this.onVerifiedBooking} />
        <VerifyUserPopup onVerified={this.onVerifiedUser} />
      </div>
    );
  }

}

Account.propTypes = {
  bid: React.PropTypes.string,
  contact: React.PropTypes.string,
  type: React.PropTypes.string,

  user: React.PropTypes.object,
  userFetching: React.PropTypes.bool,
  booking: React.PropTypes.object,
  bookingFetching: React.PropTypes.bool,
  patient: React.PropTypes.object,

  getUser: React.PropTypes.func,
  getBooking: React.PropTypes.func,
  setLastPage: React.PropTypes.func,
  verifyUserEmail: React.PropTypes.func,
  resendVerifyUserEmail: React.PropTypes.func,
  showAlertPopup: React.PropTypes.func,
  showConfirmPopup: React.PropTypes.func,
  showVerifyUserPopup: React.PropTypes.func,
  showVerifyBookingPopup: React.PropTypes.func,
};

const mapStateToProps = (state) => ({
  user: state.user.data,
  userFetching: state.user.isFetching,
  booking: state.booking.data,
  bookingFetching: state.booking.isFetching,
  patient: state.patient,
});

const mapDispatchToProps = (dispatch) => ({
  getUser: (params) => dispatch(getUser(params)),
  getBooking: (params) => dispatch(getBooking(params)),
  setLastPage: (page) => dispatch(setLastPage(page)),
  verifyUserEmail: (params) => dispatch(verifyUserEmail(params)),
  resendVerifyUserEmail: (params) => dispatch(resendVerifyUserEmail(params)),
  showAlertPopup: (message) => dispatch(showAlertPopup(message)),
  showConfirmPopup: (message, accept) => dispatch(showConfirmPopup(message, accept)),
  showVerifyUserPopup: (userId) => dispatch(showVerifyUserPopup(userId)),
  showVerifyBookingPopup: (bookingId) => dispatch(showVerifyBookingPopup(bookingId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Account);
