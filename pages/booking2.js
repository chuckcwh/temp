import React, { Component } from 'react';
import Container from '../components/Container/Container';
import BookingNavigation from '../components/BookingNavigation/BookingNavigation';
import BookingLocation from '../components/BookingLocation/BookingLocation';
import BookingStore from '../stores/BookingStore';

export default class extends Component {

  render() {
    return (
      <div>
        <div>
          <BookingNavigation path={this.props.path} />
          <BookingLocation />          
        </div>
      </div>
    );
  }

}
