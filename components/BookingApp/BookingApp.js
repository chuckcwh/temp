import React, { Component } from 'react';
import { connect } from 'react-redux';
import './BookingApp.scss';
import Container from '../Container';
import BookingNavigation from '../BookingNavigation';
import BookingServices from '../BookingServices';
import BookingLocation from '../BookingLocation';
import BookingLocationUser from '../BookingLocationUser';
import BookingDateTime from '../BookingDateTime';
import BookingDate from '../BookingDate';
import BookingTime from '../BookingTime';
import BookingResults from '../BookingResults';
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
import Location from '../../core/Location';
import Util from '../../core/Util';

class BookingApp extends Component {

  constructor(props) {
    super(props);
    const { location, lastPage } = props;
    if (location && location.pathname && location.pathname.indexOf('booking-confirmation') === -1 && !Util.isNavigationAllowed(location.pathname, lastPage)) {
      Location.replace('');
    }
  }

  componentDidMount() {
    // if "bid" query parameter exists, must be booking manage/confirmation
    if (this.props.location && this.props.location.query && this.props.location.query.bid && this.props.location.query.email) {
      if (this.props.location.query.token) {
        this.props.setPostStatus('payment-paypal');
      }

      this.props.getBooking({
        bid: this.props.location.query.bid,
        email: this.props.location.query.email
      }).then((res) => {
        if (res.response && res.response.status >= 1) {
          const { data } = res.response;
          if (data && data.case && data.case.isPaid) {
            // if booking has already been completed
            this.props.setPostStatus('success');
          } else if (data && data.case && data.case.status === 'Accepting Quotes') {
            // if booking is still pending service providers
            Location.replace({ pathname: '/booking-manage', query: { bid: this.props.location.query.bid, email: this.props.location.query.email } });
          }
        } else {
          console.error('Failed to obtain booking data.');
        }
      });
    }

    // if "uid" query parameter exists, login automatically
    if (this.props.location && this.props.location.query && this.props.location.query.uid && this.props.location.query.token) {
      this.props.getUserWithToken({
        id: this.props.location.query.uid,
        token: this.props.location.query.token
      }).then((res) => {
        if (res.response && res.response.status < 1) {
          console.error('Failed to get user data.');
        }
      });
    }
  }

  componentWillReceiveProps(props) {
    const { location, lastPage } = props;
    if (location && location.pathname && location.pathname.indexOf('booking-confirmation') === -1 && !Util.isNavigationAllowed(location.pathname, lastPage)) {
      Location.replace('');
    }
  }

  render() {
    const { location, postStatus, user } = this.props;
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
          <Account type="login" bid={this.props.booking && this.props.booking && this.props.booking.id} email={this.props.location && this.props.location.query && this.props.location.query.email} />
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
    location: state.router && state.router.location,
    booking: state.booking.items,
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
