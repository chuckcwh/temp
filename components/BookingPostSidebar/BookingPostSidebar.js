import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import './BookingPostSidebar.scss';
import { fetchServices } from '../../actions';

class BookingPostSidebar extends Component {

  componentDidMount() {
    this.props.fetchServices();
  }

  render() {
    const { allServices, booking } = this.props;
    var service, location, sessions, sum;
    if (allServices && booking && booking.case && booking.case.service) {
      service = allServices[booking.case.service].name;
    }
    if (booking && booking.case && booking.case.addresses && booking.case.addresses[0]) {
      location = (<span>{booking.case && booking.case.addresses && booking.case.addresses[0] && booking.case.addresses[0].address}<br/>{booking.case && booking.case.addresses && booking.case.addresses[0] && booking.case.addresses[0].unitNumber}</span>);
    }
    if (booking && booking.case && booking.case.dates) {
      sessions = booking.case.dates.filter((date) => date.status === 'Active');
    }
    if (booking && booking.case) {
      sum = parseFloat(booking.case.price);
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

const mapStateToProps = (state) => {
  return {
    allServices: state.allServices.data,
    booking: state.booking.data,
    bookingFetching: state.booking.isFetching
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchServices: () => {
      return dispatch(fetchServices());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingPostSidebar);
