import React, { Component } from 'react';
import classNames from 'classNames';
import './BookingApp.scss';
import Container from '../Container';
import BookingNavigation from '../BookingNavigation';
import BookingServices from '../BookingServices';
import BookingLocation from '../BookingLocation';
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
import BookingActions from '../../actions/BookingActions';
import BookingStore from '../../stores/BookingStore';
import { serialize } from '../../lib/Utils';
import Location from '../../lib/Location';

export default class BookingApp extends Component {

  constructor(props) {
    super(props);
    if (!BookingStore.isNavigationAllowed(this.props.path)) {
      Location.replace('');
    } else {
      this.state = BookingStore.getState();
    }
  }

  componentDidMount() {
    BookingStore.addChangeListener(this._onChange.bind(this));

    if (!BookingStore.getServices()) {
      fetch('http://161.202.19.121/api/getServices', {
        headers: {
          'Authorization': 'Basic ' + btoa('secret:secret0nlyWeilsonKnowsShhh852~')
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data && data.services && Array.isArray(data.services)) {
          BookingActions.setServices(data.services);
        } else {
          console.error('Failed to obtain services data.');
        }
      })
      .catch(err => {
        console.error('http://161.202.19.121/api/getServices', err.toString());
      });
    }

    // if "bid" query parameter exists, must be booking confirmation
    if (this.props.location && this.props.location.query && this.props.location.query.bid) {
      if (this.props.location.query.token) {
        BookingActions.setPostStatus('payment-paypal');
      }

      var params = {
        bid: this.props.location.query.bid
      };
      fetch('http://161.202.19.121/api/getBooking?' + serialize(params), {
        headers: {
          'Authorization': 'Basic ' + btoa('secret:secret0nlyWeilsonKnowsShhh852~')
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data && data.booking && data.status) {
          console.log(data.booking);
          // if booking has already been completed
          if (data.booking && data.booking.case && data.booking.case.transactions && data.booking.case.transactions.length) {
            BookingActions.setPostStatus('success');
          }
          BookingActions.setBooking(data.booking);
        } else {
          console.error('Failed to obtain booking data.');
        }
      })
      .catch(err => {
        console.error('http://161.202.19.121/api/getBooking', status, err.toString());
      });
    }
  }

  componentWillUnmount() {
    BookingStore.removeChangeListener(this._onChange.bind(this));
  }

  render() {
    // console.log('rendered ' + this.props.path + ' ' + this.state.postStatus);
    var component;
    if (this.state) {
      if (this.props.location && this.props.path === '/booking1') {
        component = 
          <div>
            <BookingNavigation path={this.props.path} />
            <BookingServices allServices={this.state.allServices} booking={this.state.booking} />
          </div>;
      } else if (this.props.location && this.props.path === '/booking2') {
        component = 
          <div>
            <BookingNavigation path={this.props.path} />
            <BookingLocation allServicesHash={this.state.allServicesHash} booking={this.state.booking}>
              <BookingSidebar allServicesHash={this.state.allServicesHash} booking={this.state.booking} />
            </BookingLocation>
          </div>;
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
          <BookingComplete booking={this.state.booking} />;
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
