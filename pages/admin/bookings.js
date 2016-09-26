import React, { Component } from 'react';
import AdminBookings from '../../components/AdminBookings';
import AdminBookingsView from '../../components/AdminBookings/AdminBookingsView/AdminBookingsView';


export default class extends Component {

  componentDidMount() {
    document.title = 'eBeeCare | Booking Manage';
  }

  render() {
    const { view } = this.props.params;

    let content;

    if (view) {
      content = (<AdminBookingsView {...this.props} />)
    } else {
      content = (<AdminBookings {...this.props} />)
    }

    return (
      <div>{content}</div>
    );
  }

}
