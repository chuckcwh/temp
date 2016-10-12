import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Loader from 'react-loader';
import s from './CreditsPaymentSidebar.css';
import { configToName } from '../../core/util';
import history from '../../core/history';

const CreditsPaymentSidebar = ({ config, configFetching, postStatus }) => {
  const location = history.getCurrentLocation();
  let deposit = 0,
    serviceFee = 0,
    sum = 0;
  if (location && location.query && location.query.deposit) {
    deposit = parseFloat(location.query.deposit);
    sum = parseFloat(location.query.deposit);
  }
  if (config && config.stripe && config.paypal) {
    if (postStatus === 'payment-card') {
      serviceFee = ((deposit + parseFloat(config.stripe.fixed)) / (1 - parseFloat(config.stripe.percentage))) - deposit;
      sum += serviceFee;
    }
    if (postStatus === 'payment-paypal') {
      serviceFee = ((deposit + parseFloat(config.paypal.fixed)) / (1 - parseFloat(config.paypal.percentage))) - deposit;
      sum += serviceFee;
    }
  }
  return (
    <div className={s.creditsPaymentSidebar}>
      <div className={s.creditsPaymentSidebarTitle}>
        Your Payment
      </div>
      <Loader className="spinner" loaded={!configFetching}>
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
      </Loader>
    </div>
  );
};

CreditsPaymentSidebar.propTypes = {
  config: React.PropTypes.object,
  configFetching: React.PropTypes.bool,
  postStatus: React.PropTypes.string,
};

const mapStateToProps = (state) => ({
  config: state.config.data,
  configFetching: state.config.isFetching,
  postStatus: state.postStatus,
});

export default connect(mapStateToProps)(CreditsPaymentSidebar);
