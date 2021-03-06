import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Loader from 'react-loader';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import s from './BookingPaymentBankTransfer.css';
import { SESSIONS_PAY_BANK_SUCCESS, USER_CREDITS_TOPUP_BANK_SUCCESS,
  getUser, getBooking, paySessionsBankTransfer, topupCreditsBankTransfer, setPostStatus, showAlertPopup } from '../../actions';
import history from '../../core/history';

class BookingPaymentBankTransfer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pending: false,
      error: false,
      transferTime: undefined,
      transferRef: undefined,
    };
  }

  onSelectTransferTime = (moment) => {
    this.setState({ transferTime: moment });
  };

  onConfirm = (event) => {
    if (this.bookingPaymentBankTransferForm.checkValidity()) {
      event.preventDefault();

      this.setState({ pending: true });

      const location = history.getCurrentLocation();
      if (location.query.sessions) {
        this.props.paySessionsBankTransfer({
          mode: 'bank',
          sessions: location && location.query && location.query.sessions && location.query.sessions.split(','),
          transferTime: this.state.transferTime,
          transferRef: this.state.transferRef,
        }).then((res) => {
          if (res && res.type === SESSIONS_PAY_BANK_SUCCESS) {
            if (this.props.booking && this.props.booking._id && this.props.booking.isAdhoc) {
              this.props.getBooking({
                bookingId: this.props.booking && this.props.booking._id,
                bookingToken: this.props.booking && this.props.booking.client && this.props.booking.client.contact,
              });
            }

            this.props.setPostStatus('success');
          } else {
            this.setState({
              pending: false,
              error: true,
              transferTime: undefined,
              transferRef: undefined,
            });
            // console.error('Failed to verify bank transfer payment.');
          }
        });
      } else if (location.query.deposit) {
        this.props.topupCreditsBankTransfer({
          mode: 'bank',
          value: parseFloat(location.query.deposit),
          transferTime: this.state.transferTime,
          transferRef: this.state.transferRef,
          userId: this.props.user && this.props.user._id,
        }).then((res) => {
          if (res && res.type === USER_CREDITS_TOPUP_BANK_SUCCESS) {
            this.props.getUser({
              userId: this.props.user && this.props.user._id,
            });
            
            this.props.setPostStatus('success');
          } else {
            // console.error('Failed to execute paypal payment.');
          }
        });
      }
    } else {
      event.preventDefault();
      this.props.showAlertPopup('Please fill up all required fields.');
    }
  };

  render() {
    const location = history.getCurrentLocation();
    const { config: { bankDetails }, sessions } = this.props;
    let sum = 0;
    if (location && location.pathname.indexOf('/booking-confirmation') === 0) {
      if (sessions && Object.values(sessions) && Object.values(sessions).length > 0) {
        Object.values(sessions).map(session => {
          sum += parseFloat(session.price);
        });
      }
    } else if (location && location.pathname.indexOf('/credits-payment') === 0 && location.query && location.query.deposit) {
      sum = parseFloat(location.query.deposit);
    }
    return (
      <div className={s.bookingPaymentBankTransfer}>
        <Loader className="spinner" loaded={!this.state.pending}>
          <form ref={(c) => (this.bookingPaymentBankTransferForm = c)}>
            <p className={classNames('error', this.state.error ? '' : 'hidden')}>Your bank transfer reference number was not accepted.</p>
            <p><b>Your Total Amount is SGD {parseFloat(sum).toFixed(2)}</b></p>
            <p>
              Please transfer the total amount to :-<br />
              Bank: <b>{bankDetails.bank}</b><br />
              Type: <b>{bankDetails.accountType}</b><br />
              Account Number: <b>{bankDetails.accountNumber}</b><br />
              Bank Code: <b>{bankDetails.bankCode}</b><br />
              Branch Code: <b>{bankDetails.branchCode}</b><br />
            </p>
            <ol>
              <li>
                Transfer the <b>exact</b> total amount of SGD {parseFloat(sum).toFixed(2)} via bank transfer (ATM / iBanking).
              </li>
              <li>
                Take note of the <b>reference number</b> of the bank transfer. If the reference number is not correct, the transfer may not be recognized.
              </li>
              <li>
                Fill in the input boxes below with the&nbsp;
                <b>estimated time of transfer</b> and <b>reference number</b>.
              </li>
              <li>
                It will take around 1 working day to verify your payment.
                We will notify you of any update via email.
              </li>
            </ol>
            <Datetime
              closeOnSelect
              onChange={this.onSelectTransferTime}
              value={this.state.transferTime}
              strictParsing
              inputProps={{ placeholder: 'Transfer Time*', required: 'required' }}
            />
            <input
              type="text"
              value={this.state.transferRef}
              onChange={(e) => this.setState({ transferRef: e.target.value })}
              placeholder="Reference Number*"
              required
            />
            <br /><br /><br /><br /><br /><br /><br /><br />
            <div>
              <a href="#" className="btn btn-primary" onClick={this.onConfirm}>CONFIRM PAYMENT</a>
            </div>
          </form>
        </Loader>
      </div>
    );
  }

}

BookingPaymentBankTransfer.propTypes = {
  config: React.PropTypes.object,
  user: React.PropTypes.object,
  booking: React.PropTypes.object,
  sessions: React.PropTypes.object,

  getUser: React.PropTypes.func.isRequired,
  getBooking: React.PropTypes.func.isRequired,
  paySessionsBankTransfer: React.PropTypes.func.isRequired,
  topupCreditsBankTransfer: React.PropTypes.func.isRequired,
  setPostStatus: React.PropTypes.func.isRequired,
  showAlertPopup: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  config: state.config.data,
  user: state.user.data,
  booking: state.booking.data,
  sessions: state.sessions.data,
});

const mapDispatchToProps = (dispatch) => ({
  getUser: (params) => dispatch(getUser(params)),
  getBooking: (params) => dispatch(getBooking(params)),
  paySessionsBankTransfer: (params) => dispatch(paySessionsBankTransfer(params)),
  topupCreditsBankTransfer: (params) => dispatch(topupCreditsBankTransfer(params)),
  setPostStatus: (status) => dispatch(setPostStatus(status)),
  showAlertPopup: (message) => dispatch(showAlertPopup(message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookingPaymentBankTransfer);
