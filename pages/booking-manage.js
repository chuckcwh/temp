import React, { Component } from 'react';
import BookingApp from '../components/BookingApp/BookingApp';

export default class extends Component {

  componentDidMount() {
    document.title = 'eBeeCare | Manage Booking';
  }

  render() {
    return (
      <BookingApp />
    );
  }

}
