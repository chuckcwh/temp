import React, { Component } from 'react';
import { connect } from 'react-redux';
import s from './BookingApp.css';
import Container from '../Container';
import BookingNavigation from '../BookingNavigation';
import BookingServices from '../BookingServices';
import BookingLocation from '../BookingLocation';
import BookingLocationUser from '../BookingLocationUser';
import BookingDateTime from '../BookingDateTime';
import BookingDate from '../BookingDate';
import BookingTime from '../BookingTime';
import BookingResults from '../BookingResults';
import BookingPatient from '../BookingPatient';
import BookingComplete from '../BookingComplete';
import BookingPostNavigation from '../BookingPostNavigation';
import BookingConfirmation from '../BookingConfirmation';
import BookingPayment from '../BookingPayment';
import BookingPaypal from '../BookingPaypal';
import BookingBankTransfer from '../BookingBankTransfer';
import BookingCredits from '../BookingCredits';
import BookingPostComplete from '../BookingPostComplete';
import BookingSidebar from '../BookingSidebar';
import BookingPostSidebar from '../BookingPostSidebar';
import BookingDetails from '../BookingDetails';
import Account from '../Account';
import AlertPopup from '../AlertPopup';
import LoginPopup from '../LoginPopup';
import { fetchServicesIfNeeded, getBooking, getUserWithToken, setPostStatus } from '../../actions';
import history from '../../core/history';
import util from '../../core/util';

class BookingApp extends Component {

  constructor(props) {
    super(props);
    const { lastPage } = props;
    const location = history.getCurrentLocation();
    if (location && location.pathname && location.pathname.indexOf('booking-confirmation') === -1 && !util.isNavigationAllowed(location.pathname, lastPage)) {
      history.replace('');
    }
  }

  componentDidMount() {
    const location = history.getCurrentLocation();
    // if "bid" query parameter exists, must be booking manage/confirmation
    if (location && location.query && location.query.bid && location.query.mobilePhone) {
      if (location.query.token) {
        this.props.setPostStatus('payment-paypal');
      }

      this.props.getBooking({
        bid: location.query.bid,
        mobilePhone: location.query.mobilePhone
      }).then((res) => {
        if (res.response && res.response.status >= 1) {
          const { data } = res.response;
          if (data && data.case && data.case.isPaid) {
            // if booking has already been completed
            this.props.setPostStatus('success');
          } else if (data && data.case && data.case.status === 'Accepting Quotes') {
            // if booking is still pending service providers
            history.replace({ pathname: '/booking-manage', query: { bid: location.query.bid, mobilePhone: location.query.mobilePhone } });
          }
        } else {
          console.error('Failed to obtain booking data.');
        }
      });
    }

    // if "uid" query parameter exists, login automatically
    if (location && location.query && location.query.uid && location.query.token) {
      this.props.getUserWithToken({
        id: location.query.uid,
        token: location.query.token
      }).then((res) => {
        if (res.response && res.response.status < 1) {
          console.error('Failed to get user data.');
        }
      });
    }
  }

  componentWillReceiveProps(props) {
    const { lastPage } = props;
    const location = history.getCurrentLocation();
    if (location && location.pathname && location.pathname.indexOf('booking-confirmation') === -1 && !util.isNavigationAllowed(location.pathname, lastPage)) {
      history.replace('');
    }
  }

  render() {
    const { postStatus, user } = this.props;
    const location = history.getCurrentLocation();

    var component;
    if (location && location.pathname === '/booking1') {
      component =
        <div>
          <BookingNavigation />
          <BookingServices />
        </div>;
    } else if (location && location.pathname === '/booking2') {
      if (user && user.type === 'Client') {
        component =
          <div>
            <BookingNavigation />
            <BookingLocationUser>
              <BookingSidebar />
            </BookingLocationUser>
          </div>;
      } else {
        component =
          <div>
            <BookingNavigation />
            <BookingLocation>
              <BookingSidebar />
            </BookingLocation>
          </div>;
      }
    } else if (location && (location.pathname === '/booking3' || location.pathname === '/booking3a')) {
      component =
        <div>
          <BookingNavigation />
          <BookingDateTime>
            <BookingDate />
            <BookingSidebar />
          </BookingDateTime>
        </div>;
    } else if (location && location.pathname === '/booking3b') {
      component =
        <div>
          <BookingNavigation />
          <BookingDateTime>
            <BookingTime />
            <BookingSidebar />
          </BookingDateTime>
        </div>;
    } else if (location && location.pathname === '/booking3c') {
      component =
        <div>
          <BookingNavigation />
          <BookingDateTime>
            <BookingResults />
            <BookingSidebar />
          </BookingDateTime>
        </div>;
    } else if (location && location.pathname === '/booking4') {
      component =
        <div>
          <BookingNavigation />
          <BookingPatient>
            <BookingSidebar />
          </BookingPatient>
        </div>;
    } else if (location && location.pathname === '/booking5') {
      component =
        <BookingComplete />;
    } else if (location && location.pathname === '/booking-confirmation' && postStatus === 'confirmation') {
      component =
        <div>
          <BookingPostNavigation />
          <BookingConfirmation>
            <BookingPostSidebar />
          </BookingConfirmation>
        </div>;
    } else if (location && location.pathname === '/booking-confirmation' && postStatus === 'payment-paypal') {
      component =
        <div>
          <BookingPostNavigation />
          <BookingPayment>
            <BookingPaypal />
            <BookingPostSidebar />
          </BookingPayment>
        </div>;
    } else if (location && location.pathname === '/booking-confirmation' && postStatus === 'payment-bank') {
      component =
        <div>
          <BookingPostNavigation />
          <BookingPayment>
            <BookingBankTransfer />
            <BookingPostSidebar />
          </BookingPayment>
        </div>;
    } else if (location && location.pathname === '/booking-confirmation' && postStatus === 'payment-credits') {
      component =
        <div>
          <BookingPostNavigation />
          <BookingPayment>
            <BookingCredits />
            <BookingPostSidebar />
          </BookingPayment>
        </div>;
    } else if (location && location.pathname === '/booking-confirmation' && postStatus === 'success') {
      component =
        <BookingPostComplete />
    } else if (location && location.pathname === '/booking-manage') {
      if (this.props.booking && this.props.booking && this.props.booking.id && this.props.booking.isHPVerified) {
        component = (
          <BookingDetails />
        );
      } else {
        component = (
          <Account type="login" bid={this.props.booking && this.props.booking && this.props.booking.id} mobilePhone={location && location.query && location.query.mobilePhone} />
        );
      }
    }
    return (
      <div className="BookingApp">
        {component}
        <AlertPopup />
        <LoginPopup />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    booking: state.booking.data,
    bookingFetching: state.booking.isFetching,
    allServices: state.allServices,
    postStatus: state.postStatus,
    user: state.user.data,
    lastPage: state.lastPage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchServicesIfNeeded: () => {
      return dispatch(fetchServicesIfNeeded());
    },
    getBooking: (params) => {
      return dispatch(getBooking(params));
    },
    getUserWithToken: (params) => {
      return dispatch(getUserWithToken(params));
    },
    setPostStatus: (status) => {
      return dispatch(setPostStatus(status));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingApp);
