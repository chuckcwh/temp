import React, { Component } from 'react';
import AdminBookings from '../../components/AdminBookings';
import AdminBookingsView from '../../components/AdminBookings/AdminBookingsView/AdminBookingsView';
import AdminBookingsForm from '../../components/AdminBookings/AdminBookingsForm/AdminBookingsForm';


export default class extends Component {

  componentDidMount() {
    document.title = 'eBeeCare | Booking Manage';
  }

  render() {
    const { pageAction, bookingId } = this.props.params;

    let content;

    if (pageAction === 'view') {

      content = (<AdminBookingsView {...this.props} />)

    } else if (pageAction === 'add' || pageAction === 'edit') {

      content = (<AdminBookingsForm {...this.props} />)

    } else {

      content = (<AdminBookings {...this.props} />)

    }

    return (
      <div>{content}</div>
    );
  }

}
