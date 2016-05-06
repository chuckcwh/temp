import React, { Component } from 'react';
import moment from 'moment';
import './BookingPostSidebar.scss';

export default class BookingPostSidebar extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    var service, location, sessions, sum;
    if (this.props.allServicesHash && this.props.booking && this.props.booking.case && this.props.booking.case.service) {
      service = this.props.allServicesHash[this.props.booking.case.service].name;
    }
    if (this.props.booking && this.props.booking.case) {
      location = (<span>{this.props.booking.case.addresses[0].address}<br/>{this.props.booking.case.addresses[0].unitNumber}</span>);
    }
    if (this.props.booking && this.props.booking.case) {
      sessions = this.props.booking.case.dates;
    }
    if (this.props.booking && this.props.booking.case) {
      sum = parseFloat(this.props.booking.case.price);
    }
    return (
      <div className="BookingPostSidebar">
        <div className="BookingPostSidebarTitle">
          Your Booking
        </div>
        <div className="BookingPostSidebarContent">
          <div className="BookingPostSidebarService">
            <div className="BookingPostSidebarItem">{service}</div>
          </div>
          <div className="BookingPostSidebarLocation">
            <div className="BookingPostSidebarItem">{location}</div>
          </div>
          <div className="BookingPostSidebarTimings">
            <div className="BookingPostSidebarItem">
            {
              sessions && sessions.map(session => {
                return (
                  <div key={session.id}>
                    <span className="BookingPostSidebarItemLeft">{moment(session.dateTimeStart).format('D MMM')}</span>
                    <span className="BookingPostSidebarItemRight">$ {session.pdiscount ? ((100 - parseFloat(session.pdiscount)) * parseFloat(session.price) / 100).toFixed(2) : session.price}</span>
                  </div>
                );
              })
            }
            </div>
          </div>
          <div className="BookingPostSidebarSlots">
            <div className="BookingPostSidebarItem"></div>
          </div>
        </div>
        <div className="BookingPostSidebarFooter">
          <div className="BookingPostSidebarPrice">
            <span className="BookingPostSidebarPriceLabel">{typeof sum === 'number' ? 'Total Cost' : ''}</span>
            <span className="BookingPostSidebarPriceCost">{typeof sum === 'number' ? ('SGD ' + sum.toFixed(2)) : ''}</span>
          </div>
        </div>
      </div>
    );
  }

}
