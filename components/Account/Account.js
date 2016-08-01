import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import classNames from 'classnames';
import s from './Account.css';
import Container from '../Container';
import Link from '../Link';
import FindBookingForm from '../FindBookingForm';
import LoginForm from '../LoginForm';
import VerifyBookingPopup from '../VerifyBookingPopup';
import { getBooking, setLastPage, showAlertPopup, showVerifyBookingPopup } from '../../actions';
import history from '../../core/history';

class Account extends Component {

  constructor(props) {
    super(props);
    this.state = {
      bid: this.props.bid || undefined,
      mobilePhone: this.props.mobilePhone || undefined,
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
      mobilePhone: props.mobilePhone || this.state.mobilePhone,
    });
    if (props.booking && props.booking.id && !props.booking.isHPVerified) {
      this.props.showVerifyBookingPopup(props.booking.id);
    }
  }

  onVerified = () => {
    this.props.getBooking({
      bid: this.state.bid,
      mobilePhone: this.state.mobilePhone,
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
                && location.query.bid && location.query.mobilePhone))}
            >
              <FindBookingForm />
            </Loader>
          </div>
        </div>
      );
    } else if (this.props.type === 'login') {
      components = (
        <div className={s.accountContainer}>
          <div className={classNames(s.accountLogin, s.accountContainerItem)}>
            <LoginForm />
          </div>
        </div>
      );
    } else if (this.props.type === 'forgot-password') {
      components = (
        <div className={s.accountContainer}>
          <div className={classNames(s.accountForgot, s.accountContainerItem)}>
            <form ref={(c) => (this.accountForgotPasswordForm = c)}>
              <h3>Forgot Password?</h3>
              <div className="IconInput EmailInput">
                <input type="email" placeholder="Enter Email*" />
              </div>
              <div className={s.accountContainerItemMiddle}>
                <div className={s.forgotPasswordContainer}>
                  <Link to="/manage-booking" className={s.forgotPasswordLink}>Remembered Password?</Link>
                </div>
              </div>
              <a href="#" className="btn btn-primary">Submit</a>
            </form>
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
  mobilePhone: React.PropTypes.string,
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
