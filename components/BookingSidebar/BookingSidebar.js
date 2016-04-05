import React, { Component } from 'react';
import moment from 'moment';
import './BookingSidebar.scss';
import Link from '../Link';

export default class BookingSidebar extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    var service, patient, location, dates, timeslots, sum;
    if (this.props.allServicesHash && this.props.booking && this.props.booking.service) {
      service = this.props.allServicesHash[this.props.booking.service].name;
    }
    if (this.props.patient && this.props.patient.fullName) {
      patient = this.props.patient.fullName;
    }
    if (this.props.booking && this.props.booking.location && this.props.booking.location.postalCode) {
      location = (<span>{this.props.booking.location.address}<br/>{this.props.booking.location.unitNumber}</span>);
    }
    if (this.props.booking && this.props.booking.dates) {
      dates = this.props.booking.dates;
      // dates = this.props.booking.range.start.format('DD-MM-YYYY') + ' - ' + this.props.booking.range.end.format('DD-MM-YYYY');
    }
    if (this.props.booking && this.props.booking.timeslots) {
      timeslots = this.props.booking.timeslots;
    }
    if (this.props.booking && typeof this.props.booking.sum === 'number') {
      sum = this.props.booking.sum;
    }
    return (
      <div className="BookingSidebar">
        <div className="BookingSidebarTitle">
          Your Booking
        </div>
        <div className="BookingSidebarContent">
          <a href="/booking1" onClick={Link.handleClick}>
            <div className="BookingSidebarService">
              <div className="BookingSidebarItem">{service}</div>
            </div>
          </a>
          <a href="/booking2" onClick={Link.handleClick}>
            <div className="BookingSidebarLocation">
              <div className="BookingSidebarItem">
                <div>{patient}</div>
                <div>{location}</div>
              </div>
            </div>
          </a>
          <a href="/booking3a" onClick={Link.handleClick}>
            <div className="BookingSidebarDates">
              <div className="BookingSidebarItem">
              {
                dates && dates.map(date => {
                  return (
                    <div key={date.getTime()}>{moment(date).format('DD MMM YYYY, dddd')}</div>
                  );
                })
              }
              </div>
            </div>
          </a>
          <a href="/booking3b" onClick={Link.handleClick}>
            <div className="BookingSidebarTimings">
              <div className="BookingSidebarItem">
              {
                timeslots && timeslots.map(timeslot => {
                  if (timeslot === 'Morning') {
                    return (
                      <div key="Morning">Morning: 8.00am - 11:00am</div>
                    );
                  } else if (timeslot === 'Afternoon') {
                    return (
                      <div key="Afternoon">Afternoon: 12:00pm - 5:00pm</div>
                    );
                  } else if (timeslot === 'Evening') {
                    return (
                      <div key="Evening">Evening: 7:00pm - 10:00pm</div>
                    );
                  }
                })
              }
              </div>
            </div>
          </a>
          <a href="/booking3c" onClick={Link.handleClick}>
            <div className="BookingSidebarSlots">
              <div className="BookingSidebarItem"></div>
            </div>
          </a>
        </div>
        <div className="BookingSidebarFooter">
          <div className="BookingSidebarPrice">
            <span className="BookingSidebarPriceLabel">{typeof sum === 'number' ? 'Estimated Costs' : ''}</span>
            <span className="BookingSidebarPriceCost">{typeof sum === 'number' ? ('SGD ' + sum.toFixed(2)) : ''}</span>
          </div>
        </div>
      </div>
    );
  }

}
