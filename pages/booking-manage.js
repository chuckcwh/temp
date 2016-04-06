import React, { Component } from 'react';
import Account from '../components/Account/Account';
import BookingDetails from '../components/BookingDetails/BookingDetails';
import BookingStore from '../stores/BookingStore';

export default class extends Component {

  constructor(props) {
    super(props);
    this.state = {
      booking: undefined
    };
  }

  componentDidMount() {
    BookingStore.addChangeListener(this._onChange.bind(this));
  }

  componentWillUnmount() {
    BookingStore.removeChangeListener(this._onChange.bind(this));
  }
  
  render() {
    var component;
    if (this.state.booking && this.state.booking.id) {
      component = (
        <BookingDetails booking={this.state.booking} />
      );
    } else {
      component = (
        <Account type="login" />
      );
    }
    return (
      <div>
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
