import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Loader from 'react-loader';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import s from './BookingPaymentBankTransfer.css';
import { APPLICATIONS_PAY_BANK_SUCCESS,
  getBooking, payApplicationsBankTransfer, setPostStatus, showAlertPopup } from '../../actions';
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
      this.props.payApplicationsBankTransfer({
        mode: 'bank',
        applications: location && location.query && location.query.applications && location.query.applications.split(','),
        transferTime: this.state.transferTime,
        transferRef: this.state.transferRef,
        bookingId: location && location.query && location.query.bid,
        bookingToken: location && location.query && location.query.btoken,
      }).then((res) => {
        if (res && res.type === APPLICATIONS_PAY_BANK_SUCCESS) {
          if (this.props.booking && this.props.booking._id && this.props.booking.adhocClient) {
            this.props.getBooking({
              bookingId: this.props.booking && this.props.booking._id,
              bookingToken: this.props.booking && this.props.booking.adhocClient && this.props.booking.adhocClient.contact,
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
    } else {
      event.preventDefault();
      this.props.showAlertPopup('Please fill up all required fields.');
    }
  };

  render() {
    const location = history.getCurrentLocation();
    const { config: { bankDetails }, applications, applicationsFetching, sessions } = this.props;
    let sum = 0;
    if (location && location.pathname.indexOf('/booking-confirmation') === 0) {
      if (applications && Object.values(applications) && Object.values(applications).length > 0) {
        Object.values(applications).map(application => {
          sum += parseFloat(application.price);
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
                Transfer the total amount via bank transfer (ATM / iBanking).
              </li>
              <li>
                Take note of the <b>reference number</b> of the bank transfer.
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
  booking: React.PropTypes.object,
  applications: React.PropTypes.object,
  applicationsFetching: React.PropTypes.bool,
  sessions: React.PropTypes.object,

  getBooking: React.PropTypes.func.isRequired,
  payApplicationsBankTransfer: React.PropTypes.func.isRequired,
  setPostStatus: React.PropTypes.func.isRequired,
  showAlertPopup: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  config: state.config.data,
  booking: state.booking.data,
  applications: state.applications.data,
  applicationsFetching: state.applications.isFetching,
  sessions: state.sessions.data,
});

const mapDispatchToProps = (dispatch) => ({
  getBooking: (params) => dispatch(getBooking(params)),
  payApplicationsBankTransfer: (params) => dispatch(payApplicationsBankTransfer(params)),
  setPostStatus: (status) => dispatch(setPostStatus(status)),
  showAlertPopup: (message) => dispatch(showAlertPopup(message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookingPaymentBankTransfer);
