import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import './BookingSidebar.scss';
import Link from '../Link';

class BookingSidebar extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { allServices, order } = this.props;
    var service, patientName, location, dates, timeslots, sessions, sum;
    if (allServices && allServices.data && order && order.service) {
      service = allServices.data[order.service].name;
    }
    if (order && order.patient && order.patient.fullName) {
      patientName = order.patient.fullName;
    }
    if (order && order.location && order.location.postalCode) {
      location = (<span>{order.location.address}<br/>{order.location.unitNumber}</span>);
    }
    if (order && order.dates) {
      dates = order.dates;
      // dates = order.range.start.format('DD-MM-YYYY') + ' - ' + order.range.end.format('DD-MM-YYYY');
    }
    if (order && order.timeslots) {
      timeslots = order.timeslots;
    }
    if (this.props.location.pathname.indexOf('booking4') > -1 && order && order.sessions) {
      sessions = order.sessions;
    }
    if ((this.props.location.pathname.indexOf('booking3c') > -1 || this.props.location.pathname.indexOf('booking4') > -1) && order && typeof order.sum === 'number') {
      sum = order.sum;
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
                <div>{patientName}</div>
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
              <div className="BookingSidebarItem">
              {
                sessions && sessions.map((session, index) => {
                  return (
                    <div key={index}>{session.date && moment(session.date, 'YYYY-MM-DD').format('DD MMM')} - {session.time}</div>
                  );
                })
              }
              </div>
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

const mapStateToProps = (state) => {
  return {
    location: state.router && state.router.location,
    allServices: state.allServices,
    order: state.order
  }
}

export default connect(mapStateToProps)(BookingSidebar);
