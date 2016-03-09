import React, { Component } from 'react';
import BookingNavigation from '../components/BookingNavigation/BookingNavigation';
import BookingServices from '../components/BookingServices/BookingServices';

export default class extends Component {

  render() {
    return (
      <div>
        <div>
          <BookingNavigation path={this.props.path} />
          <BookingServices />
        </div>
      </div>
    );
  }

}
