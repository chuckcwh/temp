import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import s from './CreditsPaymentSidebar.css';
import { fetchServices } from '../../actions';
import { configToName } from '../../core/util';
import history from '../../core/history';

class CreditsPaymentSidebar extends Component {

  componentDidMount() {
    // this.props.fetchServices();
  }

  render() {
    const location = history.getCurrentLocation();
    const { config, services, booking, applications, applicationsFetching, sessions, postStatus } = this.props;
    let deposit = 0,
      serviceFee = 0,
      sum = 0;
    if (location && location.query && location.query.deposit) {
      deposit = parseFloat(location.query.deposit);
      sum = parseFloat(location.query.deposit);
    }
    if (postStatus === 'payment-card') {
      serviceFee = ((deposit + config.stripe.fixed) / (1 - config.stripe.percentage)) - deposit;
      sum += serviceFee;
    }
    if (postStatus === 'payment-paypal') {
      serviceFee = ((deposit + config.paypal.fixed) / (1 - config.paypal.percentage)) - deposit;
      sum += serviceFee;
    }
    return (
      <div className={s.creditsPaymentSidebar}>
        <div className={s.creditsPaymentSidebarTitle}>
          Your Payment
        </div>
        <div className={s.creditsPaymentSidebarContent}>
          <div className={s.creditsPaymentSidebarCharges}>
            <div className={s.creditsPaymentSidebarItem}>
              <div className="TableRow">
                <div className="TableRowItem2">Credits Topup</div>
                <div className="TableRowItem1">
                  {`$ ${parseFloat(deposit).toFixed(2)}`}
                </div>
              </div>
            </div>
            {serviceFee > 0 &&
              <div className={s.creditsPaymentSidebarItem}>
                <div className="TableRow">
                  <div className="TableRowItem2">Service Fee</div>
                  <div className="TableRowItem1">
                    {`$ ${parseFloat(serviceFee).toFixed(2)}`}
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
        <div className={s.creditsPaymentSidebarFooter}>
          <div className={s.creditsPaymentSidebarPrice}>
            <span className={s.creditsPaymentSidebarPriceLabel}>{typeof sum === 'number' ? 'Total Cost' : ''}</span>
            <span className={s.creditsPaymentSidebarPriceCost}>{typeof sum === 'number' ? `SGD ${parseFloat(sum).toFixed(2)}` : ''}</span>
          </div>
        </div>
      </div>
    );
  }

}

CreditsPaymentSidebar.propTypes = {
  config: React.PropTypes.object,
  services: React.PropTypes.object,
  booking: React.PropTypes.object,
  bookingFetching: React.PropTypes.bool,
  applications: React.PropTypes.object,
  applicationsFetching: React.PropTypes.bool,
  sessions: React.PropTypes.object,
  postStatus: React.PropTypes.string,

  fetchServices: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  config: state.config.data,
  services: state.services.data,
  booking: state.booking.data,
  bookingFetching: state.booking.isFetching,
  applications: state.applications.data,
  applicationsFetching: state.applications.isFetching,
  sessions: state.sessions.data,
  postStatus: state.postStatus,
});

const mapDispatchToProps = (dispatch) => ({
  fetchServices: () => dispatch(fetchServices()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditsPaymentSidebar);
