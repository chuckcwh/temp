import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import s from './BookingSidebar.css';
import Link from '../Link';
import history from '../../core/history';

class BookingSidebar extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { allServices, order } = this.props;
    const location = history.getCurrentLocation();
    var service, patientName, loc, dates, timeslots, sessions, sum;
    if (allServices && allServices.data && order && order.service) {
      service = allServices.data[order.service].name + ' (' + parseFloat(allServices.data[order.service].duration) + ' hr' + (parseFloat(allServices.data[order.service].duration) > 1 ? 's)' : ')');
    }
    if (order && order.patient && order.patient.fullName) {
      patientName = order.patient.fullName;
    }
    if (order && order.location && order.location.postalCode) {
      loc = (<span>{order.location.address}<br/>{order.location.unitNumber}</span>);
    }
    if (order && order.dates) {
      dates = order.dates;
      // dates = order.range.start.format('DD-MM-YYYY') + ' - ' + order.range.end.format('DD-MM-YYYY');
    }
    if (order && order.timeslots) {
      timeslots = order.timeslots;
    }
    if (location.pathname.indexOf('booking4') > -1 && order && order.sessions) {
      sessions = order.sessions;
    }
    if ((location.pathname.indexOf('booking3c') > -1 || location.pathname.indexOf('booking4') > -1) && order && typeof order.sum === 'number') {
      sum = order.sum;
    }
    return (
      <div className={s.bookingSidebar}>
        <div className={s.bookingSidebarTitle}>
          Your Booking
        </div>
        <div className={s.bookingSidebarContent}>
          <Link to={{ pathname: '/booking1', query: location && location.query }}>
            <div className={s.bookingSidebarService}>
              <div className={s.bookingSidebarItem}>{service}</div>
            </div>
          </Link>
          <Link to={{ pathname: '/booking2', query: location && location.query }}>
            <div className={s.bookingSidebarLocation}>
              <div className={s.bookingSidebarItem}>
                <div>{patientName}</div>
                <div>{loc}</div>
              </div>
            </div>
          </Link>
          <Link to={{ pathname: '/booking3a', query: location && location.query }}>
            <div className={s.bookingSidebarDates}>
              <div className={s.bookingSidebarItem}>
              {
                dates && dates.map(date => {
                  return (
                    <div key={date.getTime()}>{moment(date).format('DD MMM YYYY, dddd')}</div>
                  );
                })
              }
              </div>
            </div>
          </Link>
          <Link to={{ pathname: '/booking3b', query: location && location.query }}>
            <div className={s.bookingSidebarTimings}>
              <div className={s.bookingSidebarItem}>
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
          </Link>
          <Link to={{ pathname: '/booking3c', query: location && location.query }}>
            <div className={s.bookingSidebarSlots}>
              <div className={s.bookingSidebarItem}>
              {
                sessions && sessions.map((session, index) => {
                  return (
                    <div key={index}>{session.date && moment(session.date, 'YYYY-MM-DD').format('DD MMM')} - {session.time}</div>
                  );
                })
              }
              </div>
            </div>
          </Link>
        </div>
        <div className={s.bookingSidebarFooter}>
          <div className={s.bookingSidebarPrice}>
            <span className={s.bookingSidebarPriceLabel}>{typeof sum === 'number' ? 'Estimated Costs' : ''}</span>
            <span className={s.bookingSidebarPriceCost}>{typeof sum === 'number' ? ('SGD ' + sum.toFixed(2)) : ''}</span>
          </div>
        </div>
      </div>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    allServices: state.allServices,
    order: state.order
  }
}

export default connect(mapStateToProps)(BookingSidebar);
