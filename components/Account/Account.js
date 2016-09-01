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
import VerifyBookingPopup from '../VerifyBookingPopup';
import { getBooking, setLastPage, showAlertPopup, showVerifyBookingPopup } from '../../actions';
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
    if (this.props.booking && this.props.booking.id && !this.props.booking.isHPVerified) {
      this.props.showVerifyBookingPopup(this.props.booking.id);
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      bid: props.bid || this.state.bid,
      contact: props.contact || this.state.contact,
    });
    if (props.booking && props.booking.id && !props.booking.isHPVerified) {
      this.props.showVerifyBookingPopup(props.booking.id);
    }
  }

  onVerified = () => {
    this.props.getBooking({
      bookingId: this.state.bid,
      contact: this.state.contact,
    }).then((res) => {
      if (res.response && res.response.status < 1) {
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
                && location.query.bid && location.query.contact))}
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
            <SignupForm {...this.props} />
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
        <VerifyBookingPopup onVerified={this.onVerified} />
      </div>
    );
  }

}

Account.propTypes = {
  bid: React.PropTypes.string,
  contact: React.PropTypes.string,
  type: React.PropTypes.string,

  booking: React.PropTypes.object,
  bookingFetching: React.PropTypes.bool,
  user: React.PropTypes.object,
  patient: React.PropTypes.object,

  getBooking: React.PropTypes.func,
  setLastPage: React.PropTypes.func,
  showAlertPopup: React.PropTypes.func,
  showVerifyBookingPopup: React.PropTypes.func,
};

const mapStateToProps = (state) => ({
  booking: state.booking.data,
  bookingFetching: state.booking.isFetching,
  user: state.user,
  patient: state.patient,
});

const mapDispatchToProps = (dispatch) => ({
  getBooking: (params) => dispatch(getBooking(params)),
  setLastPage: (page) => dispatch(setLastPage(page)),
  showAlertPopup: (message) => dispatch(showAlertPopup(message)),
  showVerifyBookingPopup: (bookingId) => dispatch(showVerifyBookingPopup(bookingId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Account);
