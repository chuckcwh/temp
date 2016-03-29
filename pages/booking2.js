import React, { Component } from 'react';
import BookingApp from '../components/BookingApp/BookingApp';

export default class extends Component {

  render() {
    return (
      <BookingApp location={this.props.location} path={this.props.path} />
    );
  }

}
