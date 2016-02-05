import React, { Component } from 'react';
import Container from '../components/Container/Container';
import BookingNavigation from '../components/BookingNavigation/BookingNavigation';
import BookingServices from '../components/BookingServices/BookingServices';
import BookingStore from '../stores/BookingStore';

export default class extends Component {

  render() {
    return (
      <div>
        <div>
          <BookingNavigation />
          <BookingServices />
          
        </div>
      </div>
    );
  }

}
