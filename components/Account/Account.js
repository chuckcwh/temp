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
import VerifyUserPopup from '../VerifyUserPopup';
import VerifyBookingPopup from '../VerifyBookingPopup';
import { USER_SUCCESS, BOOKING_FAILURE, getUser, getBooking, setLastPage, showAlertPopup, showVerifyUserPopup, showVerifyBookingPopup } from '../../actions';
import history from '../../core/history';

class Account extends Component {

  constructor(props) {
    super(props);
    this.state = {
      bid: this.props.bid || undefined,
      contact: this.props.contact || undefined,
      pin: undefined,
      resend: false,
      resent: false,
    };
  }

  componentDidMount() {
    if (this.props.booking && this.props.booking._id && !this.props.booking.adhocClient.isVerified) {
      this.props.showVerifyBookingPopup(this.props.booking._id);
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      bid: props.bid || this.state.bid,
      btoken: props.contact || this.state.btoken,
    });
    if (props.booking && props.booking !== this.props.booking && props.booking._id && !props.booking.adhocClient.isVerified) {
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
      const token = location && location.query && location.query.token;
      components = (
        <div className={s.accountContainer}>
          <div className={classNames(s.accountReset, s.accountContainerItem)}>
            <ResetPasswordForm {...this.props} token={token} />
          </div>
        </div>
      );
    }
    return (
      <div className={s.account}>
        <Container>
          {components}
        </Container>
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
  booking: React.PropTypes.object,
  bookingFetching: React.PropTypes.bool,
  patient: React.PropTypes.object,

  getUser: React.PropTypes.func,
  getBooking: React.PropTypes.func,
  setLastPage: React.PropTypes.func,
  showAlertPopup: React.PropTypes.func,
  showVerifyUserPopup: React.PropTypes.func,
  showVerifyBookingPopup: React.PropTypes.func,
};

const mapStateToProps = (state) => ({
  user: state.user.data,
  booking: state.booking.data,
  bookingFetching: state.booking.isFetching,
  patient: state.patient,
});

const mapDispatchToProps = (dispatch) => ({
  getUser: (params) => dispatch(getUser(params)),
  getBooking: (params) => dispatch(getBooking(params)),
  setLastPage: (page) => dispatch(setLastPage(page)),
  showAlertPopup: (message) => dispatch(showAlertPopup(message)),
  showVerifyUserPopup: (userId) => dispatch(showVerifyUserPopup(userId)),
  showVerifyBookingPopup: (bookingId) => dispatch(showVerifyBookingPopup(bookingId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Account);
