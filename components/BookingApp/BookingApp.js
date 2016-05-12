import React, { Component } from 'react';
import { connect } from 'react-redux';
import request from 'superagent';
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
import { setServices, setPostStatus, setBooking, setUser } from '../../actions';
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
    if (!this.props.allServices) {
      this.serverRequest1 = request
        .get(Util.host + '/api/getServices')
        .auth(Util.authKey, Util.authSecret)
        .end((err, res) => {
          if (err) {
            return console.error(Util.host + '/api/getServices', err.toString());
          }
          if (res.body && res.body.services && Array.isArray(res.body.services)) {
            // console.log(res.body.services);
            this.props.setServices(res.body.services);
          } else {
            console.error('Failed to obtain services data.');
          }
        });
    }

    // if "bid" query parameter exists, must be booking manage/confirmation
    if (this.props.location && this.props.location.query && this.props.location.query.bid && this.props.location.query.email) {
      if (this.props.location.query.token) {
        this.props.setPostStatus('payment-paypal');
      }

      this.serverRequest2 = request
        .get(Util.host + '/api/getBooking')
        .query({
          bid: this.props.location.query.bid,
          email: this.props.location.query.email
        })
        .auth(Util.authKey, Util.authSecret)
        .end((err, res) => {
          if (err) {
            return console.error(Util.host + '/api/getBooking', status, err.toString());
          }
          if (res.body && res.body.booking && res.body.status) {
            console.log(res.body.booking);
            if (res.body.booking && res.body.booking.case && res.body.booking.case.isPaid) {
              // if booking has already been completed
              this.props.setPostStatus('success');
            } else if (res.body.booking && res.body.booking.case && res.body.booking.case.status === 'Accepting Quotes') {
              // if booking is still pending service providers
              Location.replace({ pathname: '/booking-manage', query: { bid: this.props.location.query.bid, email: this.props.location.query.email } });
            }
            this.props.setBooking(res.body.booking);
          } else {
            console.error('Failed to obtain booking data.');
          }
        });
    }

    // if "uid" query parameter exists, login automatically
    if (this.props.location && this.props.location.query && this.props.location.query.uid && this.props.location.query.token) {
      this.serverRequest3 = request
        .get(Util.host + '/api/getUser')
        .auth(this.props.location.query.uid, this.props.location.query.token)
        .end((err, res) => {
          if (err) {
            return console.error(Util.host + '/api/getUser', status, err.toString());
          }
          if (res.body && res.body.status === 1) {
            console.log(res.body.user);
            this.props.setUser(res.body.user);
          } else {
            console.error('Failed to get user data.');
          }
        });
    }
  }

  componentWillUnmount() {
    this.serverRequest1 && this.serverRequest1.abort();
    this.serverRequest2 && this.serverRequest2.abort();
    this.serverRequest3 && this.serverRequest3.abort();
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
      if (user) {
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
      if (this.props.booking && this.props.booking.id && this.props.booking.isHPVerified) {
        component = (
          <BookingDetails />
        );
      } else {
        component = (
          <Account type="login" bid={this.props.booking && this.props.booking.id} email={this.props.location && this.props.location.query && this.props.location.query.email} />
        );
      }
    }
    return (
      <div className="BookingApp">
        {component}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    location: state.router && state.router.location,
    booking: state.booking,
    allServices: state.allServices,
    postStatus: state.postStatus,
    user: state.user,
    lastPage: state.lastPage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setServices: (services) => {
      dispatch(setServices(services));
    },
    setPostStatus: (status) => {
      dispatch(setPostStatus(status));
    },
    setBooking: (booking) => {
      dispatch(setBooking(booking));
    },
    setUser: (user) => {
      dispatch(setUser(user));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingApp);
