import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import s from './BookingPostSidebar.css';
import { fetchServices } from '../../actions';
import { configToName } from '../../core/util';

class BookingPostSidebar extends Component {

  componentDidMount() {
    this.props.fetchServices();
  }

  render() {
    const { config, services, booking, sessions, postStatus } = this.props;
    let service,
      loc,
      serviceFee = 0,
      sum = 0;
    if (services && booking && booking.sessions && booking.sessions[0] && booking.sessions[0].service && booking.sessions[0].serviceClass && services[booking.sessions[0].service] && services[booking.sessions[0].service].classes && services[booking.sessions[0].service].classes[booking.sessions[0].serviceClass]) {
      service = `${services[booking.sessions[0].service].name} ` +
        `(${parseFloat(services[booking.sessions[0].service].classes[booking.sessions[0].serviceClass].duration)} ` +
        `hr${parseFloat(services[booking.sessions[0].service].classes[booking.sessions[0].serviceClass].duration) > 1 ? 's' : ''})`;
    }
    if (booking && booking.sessions && booking.sessions[0] && booking.sessions[0].address) {
      loc = (
        <span>
          {booking.sessions[0].address && booking.sessions[0].address.description}
          <br />
          {booking.sessions[0].address && booking.sessions[0].address.unit}
          {booking.sessions[0].address && booking.sessions[0].address.unit && <br />}
          {booking.sessions[0].address && booking.sessions[0].address.postal}
        </span>
      );
    }
    if (sessions && Object.values(sessions) && Object.values(sessions).length > 0) {
      Object.values(sessions).map(session => {
        sum += parseFloat(session.price);
      });
    }
    if (postStatus === 'payment-card') {
      serviceFee = ((sum + parseFloat(config.stripe.fixed)) / (1 - parseFloat(config.stripe.percentage))) - sum;
      sum += serviceFee;
    }
    if (postStatus === 'payment-paypal') {
      serviceFee = ((sum + parseFloat(config.paypal.fixed)) / (1 - parseFloat(config.paypal.percentage))) - sum;
      sum += serviceFee;
    }
    return (
      <div className={s.bookingPostSidebar}>
        <div className={s.bookingPostSidebarTitle}>
          Your Payment
        </div>
        <div className={s.bookingPostSidebarContent}>
          <div className={s.bookingPostSidebarService}>
            <div className={s.bookingPostSidebarItem}>{service}</div>
          </div>
          <div className={s.bookingPostSidebarLocation}>
            <div className={s.bookingPostSidebarItem}>{loc}</div>
          </div>
          <div className={s.bookingPostSidebarSessions}>
            <div className={s.bookingPostSidebarItem}>
            {
              sessions && Object.values(sessions).length > 0 && Object.values(sessions).map(session => {
                if (session) {
                  return (
                    <div className="TableRow" key={session._id}>
                      <div className="TableRowItem2">{moment(session.date).format('D MMM YY')}</div>
                      <div className="TableRowItem2">
                        {configToName(config, 'timeSlotsByValue', session.timeSlot)}
                      </div>
                      <div className="TableRowItem2">
                        {`$ ${session.pdiscount ? ((100 - parseFloat(session.pdiscount)) * parseFloat(session.price) / 100).toFixed(2) : parseFloat(session.price).toFixed(2)}`}
                      </div>
                    </div>
                  );
                } else {
                  return;
                }
              })
            }
            </div>
          </div>
          {serviceFee > 0 &&
            <div className={s.bookingPostSidebarCharges}>
              <div className={s.bookingPostSidebarItem}>
                <div className="TableRow">
                  <div className="TableRowItem2">Service Fee</div>
                  <div className="TableRowItem1">
                    {`$ ${parseFloat(serviceFee).toFixed(2)}`}
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
        <div className={s.bookingPostSidebarFooter}>
          <div className={s.bookingPostSidebarPrice}>
            <span className={s.bookingPostSidebarPriceLabel}>{typeof sum === 'number' ? 'Total Cost' : ''}</span>
            <span className={s.bookingPostSidebarPriceCost}>{typeof sum === 'number' ? `SGD ${parseFloat(sum).toFixed(2)}` : ''}</span>
          </div>
        </div>
      </div>
    );
  }

}

BookingPostSidebar.propTypes = {
  config: React.PropTypes.object,
  services: React.PropTypes.object,
  booking: React.PropTypes.object,
  bookingFetching: React.PropTypes.bool,
  sessions: React.PropTypes.object,
  postStatus: React.PropTypes.string,

  fetchServices: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  config: state.config.data,
  services: state.services.data,
  booking: state.booking.data,
  bookingFetching: state.booking.isFetching,
  sessions: state.sessions.data,
  postStatus: state.postStatus,
});

const mapDispatchToProps = (dispatch) => ({
  fetchServices: () => dispatch(fetchServices()),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookingPostSidebar);
