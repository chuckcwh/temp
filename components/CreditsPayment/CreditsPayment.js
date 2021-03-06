import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import s from './CreditsPayment.css';
import Container from '../Container';
import Header from '../Header';
import BookingPaymentCard from '../BookingPaymentCard';
import BookingPaymentPaypal from '../BookingPaymentPaypal';
import BookingPaymentBankTransfer from '../BookingPaymentBankTransfer';
import BookingPostComplete from '../BookingPostComplete';
import CreditsPaymentSidebar from '../CreditsPaymentSidebar';
import { setPostStatus } from '../../actions';
import history from '../../core/history';

class CreditsPayment extends Component {

  componentDidMount() {
    const location = history.getCurrentLocation();
    // Redirect to Paypal page if it's return from Paypal
    if (location && location.query && location.query.action && location.query.action.indexOf('paypal') > -1) {
      this.props.setPostStatus('payment-paypal');
    }
  }

  onClick = (paymentType) => (event) => {
    event.preventDefault();

    this.props.setPostStatus(`payment-${paymentType}`);
  };

  render() {
    const { config, postStatus } = this.props;
    const location = history.getCurrentLocation();
    const deposit = location && location.query && parseFloat(location.query.deposit);
    let component,
      header;
    if (postStatus === 'payment-card') {
      component = (
        <div className={s.creditsPaymentBody}>
          <BookingPaymentCard />
          <CreditsPaymentSidebar />
        </div>
      );
    } else if (postStatus === 'payment-paypal') {
      component = (
        <div className={s.creditsPaymentBody}>
          <BookingPaymentPaypal />
          <CreditsPaymentSidebar />
        </div>
      );
    } else if (postStatus === 'payment-bank') {
      component = (
        <div className={s.creditsPaymentBody}>
          <BookingPaymentBankTransfer />
          <CreditsPaymentSidebar />
        </div>
      );
    }
    else if (postStatus === 'success') {
      component = (
        <BookingPostComplete />
      );
    }
    if (postStatus !== 'success') {
      header = (
        <ul className={s.creditsPaymentNav}>
          <li className={s.creditsPaymentNavItem}>
            <a
              className={classNames(s.creditsPaymentNavLink,
                (location && location.pathname === '/credits-payment' && postStatus === 'payment-card')
                ? s.creditsPaymentNavLinkActive : '')}
              href="#"
              onClick={this.onClick('card')}
            >
              Credit Card<span className={s.creditsPaymentNavArrow}><div className="nav-caret"></div></span>
            </a>
          </li>
          <li className={s.creditsPaymentNavItem}>
            <a
              className={classNames(s.creditsPaymentNavLink,
                (location && location.pathname === '/credits-payment' && postStatus === 'payment-paypal')
                ? s.creditsPaymentNavLinkActive : '')}
              href="#"
              onClick={this.onClick('paypal')}
            >
              Paypal<span className={s.creditsPaymentNavArrow}><div className="nav-caret"></div></span>
            </a>
          </li>
          <li className={s.creditsPaymentNavItem}>
            <a
              className={classNames(s.creditsPaymentNavLink,
                (location && location.pathname === '/credits-payment' && postStatus === 'payment-bank')
                ? s.creditsPaymentNavLinkActive : '')}
              href="#"
              onClick={this.onClick('bank')}
            >
              Bank Transfer<span className={s.creditsPaymentNavArrow}><div className="nav-caret"></div></span>
            </a>
          </li>
        </ul>
      );
    }
    return (
      <div className={s.creditsPayment}>
        <Header title="Credits" style={{marginBottom: 0}} />
        <div className={s.creditsPaymentNavWrapper}>
          <Container>
            {header}
          </Container>
        </div>
        <div>
          <Container>
            {component}
          </Container>
        </div>
      </div>
    );
  }

}

CreditsPayment.propTypes = {
  config: React.PropTypes.object,
  booking: React.PropTypes.object,
  applications: React.PropTypes.object,
  applicationsFetching: React.PropTypes.bool,
  sessions: React.PropTypes.object,
  sessionsFetching: React.PropTypes.bool,
  postStatus: React.PropTypes.string,

  setPostStatus: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  config: state.config.data,
  booking: state.booking.data,
  applications: state.applications.data,
  applicationsFetching: state.applications.isFetching,
  sessions: state.sessions.data,
  sessionsFetching: state.sessions.isFetching,
  postStatus: state.postStatus,
});

const mapDispatchToProps = (dispatch) => ({
  setPostStatus: (status) => dispatch(setPostStatus(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditsPayment);
