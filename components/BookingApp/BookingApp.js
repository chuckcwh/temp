import React, { Component } from 'react';
import classNames from 'classNames';
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
import BookingActions from '../../actions/BookingActions';
import BookingStore from '../../stores/BookingStore';
import Location from '../../lib/Location';

export default class BookingApp extends Component {

  constructor(props) {
    super(props);
    if (this.props.path.indexOf('booking-confirmation') === -1 && !BookingStore.isNavigationAllowed(this.props.path)) {
      Location.replace('');
    } else {
      this.state = BookingStore.getState();
    }
  }

  componentDidMount() {
    BookingStore.addChangeListener(this._onChange.bind(this));

    if (!BookingStore.getServices()) {
      this.serverRequest1 = request
        .get('http://161.202.19.121/api/getServices')
        .auth('secret', 'secret0nlyWeilsonKnowsShhh852~')
        .end((err, res) => {
          if (err) {
            return console.error('http://161.202.19.121/api/getServices', err.toString());
          }
          if (res.body && res.body.services && Array.isArray(res.body.services)) {
            // console.log(res.body.services);
            BookingActions.setServices(res.body.services);
          } else {
            console.error('Failed to obtain services data.');
          }
        });
    }

    // if "bid" query parameter exists, must be booking confirmation
    if (this.props.location && this.props.location.query && this.props.location.query.bid && this.props.location.query.email) {
      if (this.props.location.query.token) {
        BookingActions.setPostStatus('payment-paypal');
      }

      this.serverRequest2 = request
        .get('http://161.202.19.121/api/getBooking')
        .query({
          bid: this.props.location.query.bid,
          email: this.props.location.query.email
        })
        .auth('secret', 'secret0nlyWeilsonKnowsShhh852~')
        .end((err, res) => {
          if (err) {
            return console.error('http://161.202.19.121/api/getBooking', status, err.toString());
          }
          if (res.body && res.body.booking && res.body.status) {
            // console.log(res.body.booking);
            if (res.body.booking && res.body.booking.case && res.body.booking.case.isPaid) {
              // if booking has already been completed
              BookingActions.setPostStatus('success');
            } else if (res.body.booking && res.body.booking.case && res.body.booking.case.status === 'Accepting Quotes') {
              // if booking is still pending service providers
              Location.replace({ pathname: '/booking-manage', query: { bid: this.props.location.query.bid, email: this.props.location.query.email } });
              // Location.replace({ pathname: '/manage-booking', query: { bid: this.props.location.query.bid, email: this.props.location.query.email } });
            }
            BookingActions.setBooking(res.body.booking);
          } else {
            console.error('Failed to obtain booking data.');
          }
        });
    }
  }

  componentWillUnmount() {
    BookingStore.removeChangeListener(this._onChange.bind(this));

    this.serverRequest1 && this.serverRequest1.abort();
    this.serverRequest2 && this.serverRequest2.abort();
  }

  render() {
    // console.log('rendered ' + this.props.path + ' ' + this.state.postStatus);
    var component;
    if (this.state) {
      if (this.props.location && this.props.path === '/booking1') {
        component = 
          <div>
            <BookingNavigation path={this.props.path} />
            <BookingServices location={this.props.location} allServices={this.state.allServices} booking={this.state.booking} />
          </div>;
      } else if (this.props.location && this.props.path === '/booking2') {
        if (this.state.user) {
          component = 
            <div>
              <BookingNavigation path={this.props.path} />
              <BookingLocationUser allServicesHash={this.state.allServicesHash} booking={this.state.booking} user={this.state.user} patient={this.state.patient}>
                <BookingSidebar allServicesHash={this.state.allServicesHash} booking={this.state.booking} />
              </BookingLocationUser>
            </div>;
        } else {
          component = 
            <div>
              <BookingNavigation path={this.props.path} />
              <BookingLocation allServicesHash={this.state.allServicesHash} booking={this.state.booking}>
                <BookingSidebar allServicesHash={this.state.allServicesHash} booking={this.state.booking} />
              </BookingLocation>
            </div>;
        }
      } else if (this.props.location && (this.props.path === '/booking3' || this.props.path === '/booking3a')) {
        component = 
          <div>
            <BookingNavigation path={this.props.path} />
            <BookingDateTime booking={this.state.booking} path={this.props.path}>
              <BookingDate booking={this.state.booking} />
              <BookingSidebar allServicesHash={this.state.allServicesHash} booking={this.state.booking} />
            </BookingDateTime>
          </div>;
      } else if (this.props.location && this.props.path === '/booking3b') {
        component = 
          <div>
            <BookingNavigation path={this.props.path} />
            <BookingDateTime booking={this.state.booking} path={this.props.path}>
              <BookingTime booking={this.state.booking} />
              <BookingSidebar allServicesHash={this.state.allServicesHash} booking={this.state.booking} />
            </BookingDateTime>
          </div>;
      } else if (this.props.location && this.props.path === '/booking3c') {
        component = 
          <div>
            <BookingNavigation path={this.props.path} />
            <BookingDateTime booking={this.state.booking} path={this.props.path}>
              <BookingResults booking={this.state.booking} />
              <BookingSidebar allServicesHash={this.state.allServicesHash} booking={this.state.booking} />
            </BookingDateTime>
          </div>;
      } else if (this.props.location && this.props.path === '/booking4') {
        component = 
          <BookingComplete booking={this.state.booking} user={this.state.user} patient={this.state.patient} />;
      } else if (this.props.location && this.props.path === '/booking-confirmation' && this.state.postStatus === 'confirmation') {
        component = 
          <div>
            <BookingPostNavigation path={this.props.path} postStatus={this.state.postStatus} />
            <BookingConfirmation location={this.props.location} booking={this.state.booking}>
              <BookingPostSidebar allServicesHash={this.state.allServicesHash} booking={this.state.booking} />
            </BookingConfirmation>
          </div>;
      } else if (this.props.location && this.props.path === '/booking-confirmation' && this.state.postStatus === 'payment-paypal') {
        component = 
          <div>
            <BookingPostNavigation path={this.props.path} postStatus={this.state.postStatus} />
            <BookingPayment path={this.props.path} postStatus={this.state.postStatus}>
              <BookingPaypal location={this.props.location} booking={this.state.booking} />
              <BookingPostSidebar allServicesHash={this.state.allServicesHash} booking={this.state.booking} />
            </BookingPayment>
          </div>;
      } else if (this.props.location && this.props.path === '/booking-confirmation' && this.state.postStatus === 'payment-bank') {
        component = 
          <div>
            <BookingPostNavigation path={this.props.path} postStatus={this.state.postStatus} />
            <BookingPayment path={this.props.path} postStatus={this.state.postStatus}>
              <BookingBankTransfer booking={this.state.booking} />
              <BookingPostSidebar allServicesHash={this.state.allServicesHash} booking={this.state.booking} />
            </BookingPayment>
          </div>;
      } else if (this.props.location && this.props.path === '/booking-confirmation' && this.state.postStatus === 'payment-credits') {
        component = 
          <div>
            <BookingPostNavigation path={this.props.path} postStatus={this.state.postStatus} />
            <BookingPayment path={this.props.path} postStatus={this.state.postStatus}>
              <BookingCredits booking={this.state.booking} />
              <BookingPostSidebar allServicesHash={this.state.allServicesHash} booking={this.state.booking} />
            </BookingPayment>
          </div>;
      } else if (this.props.location && this.props.path === '/booking-confirmation' && this.state.postStatus === 'success') {
        component = 
          <BookingPostComplete booking={this.state.booking} />
      } else if (this.props.location && this.props.path === '/booking-manage') {
        if (this.state.booking && this.state.booking.id) {
          component = (
            <BookingDetails location={this.props.location} booking={this.state.booking} />
          );
        } else {
          component = (
            <Account type="login" location={this.props.location} booking={this.props.booking} />
          );
        }
      }
    }
    return (
      <div className="BookingApp">
        {component}
      </div>
    );
  }

  /**
   * Event handler for 'change' events coming from the BookingStore
   */
  _onChange() {
    this.setState(BookingStore.getState());
    // console.log(this.state);
  }

}
