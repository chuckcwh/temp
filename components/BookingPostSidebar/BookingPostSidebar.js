import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import s from './BookingPostSidebar.css';
import { fetchServices } from '../../actions';

class BookingPostSidebar extends Component {

  componentDidMount() {
    this.props.fetchServices();
  }

  render() {
    const { allServices, booking } = this.props;
    let service,
      loc,
      sessions,
      sum;
    if (allServices && booking && booking.case && booking.case.service) {
      service = `${allServices[booking.case.service].name} ` +
        `(${parseFloat(allServices[booking.case.service].duration)} ` +
        `hr${parseFloat(allServices[booking.case.service].duration) > 1 ? 's' : ''})`;
    }
    if (booking && booking.case && booking.case.addresses && booking.case.addresses[0]) {
      loc = (
        <span>
          {booking.case && booking.case.addresses && booking.case.addresses[0] && booking.case.addresses[0].address}
          <br />
          {booking.case && booking.case.addresses && booking.case.addresses[0] && booking.case.addresses[0].unitNumber}
        </span>
      );
    }
    if (booking && booking.case && booking.case.dates) {
      sessions = booking.case.dates.filter((date) => date.status === 'Active');
    }
    if (booking && booking.case) {
      sum = parseFloat(booking.case.price);
    }
    return (
      <div className={s.bookingPostSidebar}>
        <div className={s.bookingPostSidebarTitle}>
          Your Booking
        </div>
        <div className={s.bookingPostSidebarContent}>
          <div className={s.bookingPostSidebarService}>
            <div className={s.bookingPostSidebarItem}>{service}</div>
          </div>
          <div className={s.bookingPostSidebarLocation}>
            <div className={s.bookingPostSidebarItem}>{loc}</div>
          </div>
          <div className={s.bookingPostSidebarTimings}>
            <div className={s.bookingPostSidebarItem}>
            {
              sessions && sessions.map(session => (
                <div key={session.id}>
                  <span className={s.bookingPostSidebarItemLeft}>{moment(session.dateTimeStart).format('D MMM')}</span>
                  <span className={s.bookingPostSidebarItemRight}>
                    $ {session.pdiscount ? ((100 - parseFloat(session.pdiscount)) * parseFloat(session.price) / 100).toFixed(2) : session.price}
                  </span>
                </div>
              ))
            }
            </div>
          </div>
          <div className={s.bookingPostSidebarSlots}>
            <div className={s.bookingPostSidebarItem}></div>
          </div>
        </div>
        <div className={s.bookingPostSidebarFooter}>
          <div className={s.bookingPostSidebarPrice}>
            <span className={s.bookingPostSidebarPriceLabel}>{typeof sum === 'number' ? 'Total Cost' : ''}</span>
            <span className={s.bookingPostSidebarPriceCost}>{typeof sum === 'number' ? `SGD ${sum.toFixed(2)}` : ''}</span>
          </div>
        </div>
      </div>
    );
  }

}

BookingPostSidebar.propTypes = {
  allServices: React.PropTypes.object,
  booking: React.PropTypes.object,
  bookingFetching: React.PropTypes.bool,

  fetchServices: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  allServices: state.allServices.data,
  booking: state.booking.data,
  bookingFetching: state.booking.isFetching,
});

const mapDispatchToProps = (dispatch) => ({
  fetchServices: () => dispatch(fetchServices()),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookingPostSidebar);
