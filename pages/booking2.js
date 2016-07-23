import React, { Component } from 'react';
import BookingApp from '../components/BookingApp/BookingApp';

export default class extends Component {

  componentDidMount() {
    document.title = 'eBeeCare | Booking';
  }

  render() {
    return (
      <BookingApp />
    );
  }

}
