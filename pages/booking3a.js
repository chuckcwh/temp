import React, { Component } from 'react';
import Container from '../components/Container/Container';
import BookingNavigation from '../components/BookingNavigation/BookingNavigation';
import BookingDateTime from '../components/BookingDateTime/BookingDateTime';
import BookingDate from '../components/BookingDate/BookingDate';
import BookingStore from '../stores/BookingStore';

export default class extends Component {

  render() {
    return (
      <div>
        <div>
          <BookingNavigation path={this.props.path} />
          <BookingDateTime path={this.props.path}>
            <BookingDate />
          </BookingDateTime>
        </div>
      </div>
    );
  }

}
