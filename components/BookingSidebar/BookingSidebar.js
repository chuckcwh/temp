import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import s from './BookingSidebar.css';
import Link from '../Link';
import { configToName } from '../../core/util';
import history from '../../core/history';

const BookingSidebar = (props) => {
  const { config, services, patients, order } = props;
  const location = history.getCurrentLocation();
  let service,
    patientName,
    loc,
    dates,
    timeslots,
    sessions,
    sum;
  if (services && order && order.service && services[order.service] && !isNaN(order.serviceClass) && services[order.service].classes[order.serviceClass]) {
    service = `${services[order.service].name} ` +
      `(${parseFloat(services[order.service].classes[order.serviceClass].duration)} hr${parseFloat(services[order.service].classes[order.serviceClass].duration) > 1 ? 's' : ''})`;
  }
  if (order && order.patient && patients && patients[order.patient] && patients[order.patient].name) {
    patientName = patients[order.patient].name;
  }
  if (order && order.location && order.location.description && order.location.unit) {
    loc = (<span>{order.location.description}<br />{order.location.unit}</span>);
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
              dates && dates.map(date => (
                <div key={date.getTime()}>{moment(date).format('DD MMM YYYY, dddd')}</div>
              ))
            }
            </div>
          </div>
        </Link>
        <Link to={{ pathname: '/booking3b', query: location && location.query }}>
          <div className={s.bookingSidebarTimings}>
            <div className={s.bookingSidebarItem}>
            {
              timeslots && timeslots.map(timeslot => {
                if (timeslot === 'morning') {
                  return (
                    <div key="morning">Morning: 8.00am - 11:00am</div>
                  );
                } else if (timeslot === 'afternoon') {
                  return (
                    <div key="afternoon">Afternoon: 12:00pm - 5:00pm</div>
                  );
                } else if (timeslot === 'evening') {
                  return (
                    <div key="evening">Evening: 7:00pm - 10:00pm</div>
                  );
                }
                return undefined;
              })
            }
            </div>
          </div>
        </Link>
        <Link to={{ pathname: '/booking3c', query: location && location.query }}>
          <div className={s.bookingSidebarSlots}>
            <div className={s.bookingSidebarItem}>
            {
              sessions && sessions.map((session, index) => (
                <div key={index}>{session.date && moment(session.date, 'YYYY-MM-DD').format('DD MMM')} - {configToName(config, 'timeSlotsByValue', session.time)}</div>
              ))
            }
            </div>
          </div>
        </Link>
      </div>
      <div className={s.bookingSidebarFooter}>
        <div className={s.bookingSidebarPrice}>
          <span className={s.bookingSidebarPriceLabel}>{typeof sum === 'number' ? 'Estimated Costs' : ''}</span>
          <span className={s.bookingSidebarPriceCost}>{typeof sum === 'number' ? `SGD ${sum.toFixed(2)}` : ''}</span>
        </div>
      </div>
    </div>
  );
};

BookingSidebar.propTypes = {
  config: React.PropTypes.object.isRequired,
  services: React.PropTypes.object.isRequired,
  patients: React.PropTypes.object.isRequired,
  order: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  config: state.config.data,
  services: state.services.data,
  patients: state.user.data && state.user.data._id
    && state.patientsByClient[state.user.data._id]
    && state.patientsByClient[state.user.data._id].data,
  order: state.order,
});

export default connect(mapStateToProps)(BookingSidebar);
