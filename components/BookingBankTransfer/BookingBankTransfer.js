import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Loader from 'react-loader';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import s from './BookingBankTransfer.css';
import { getBooking, createBankTransferTransaction, setPostStatus, showAlertPopup } from '../../actions';

class BookingBankTransfer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pending: false,
      error: false,
      transferTime: undefined,
      ref: undefined,
    };
  }

  onSelectTransferTime = (moment) => {
    this.setState({ transferTime: moment });
  };

  onConfirm = (event) => {
    if (this.bookingBankTransferForm.checkValidity()) {
      event.preventDefault();

      this.setState({ pending: true });

      this.props.createBankTransferTransaction({
        amount: this.props.booking.case.price,
        type: 'Payment',
        ref: this.state.ref,
        sku: `ebc-case-${this.props.booking.case.id}`,
        transactionDate: this.state.transferTime.format('YYYY-MM-DD HH:mm:ss'),
      }).then((res) => {
        if (res.response && res.response.status === 1) {
          this.props.getBooking({
            bookingId: this.props.booking.id,
            contact: this.props.booking.adhocClient.contact,
          });

          this.props.setPostStatus('success');
        } else {
          this.setState({
            pending: false,
            error: true,
            ref: undefined,
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
    return (
      <div className={s.bookingBankTransfer}>
        <Loader className="spinner" loaded={!this.state.pending}>
          <form ref={(c) => (this.bookingBankTransferForm = c)}>
            <p className={classNames('error', this.state.error ? '' : 'hidden')}>Your bank transfer reference number was not accepted.</p>
            <p><b>Your Total Amount is SGD {this.props.booking.case.price}</b></p>
            <p>
              Please transfer the total amount to<br />
              Bank: <b>UOB</b><br />
              Type: <b>Current</b><br />
              Account Number: <b>341-306-307-6</b><br />
            </p>
            <ol>
              <li>
                Transfer the total amount via bank transfer (ATM / iBanking).
                If you are using internet banking, please set your booking ID
                <b>{this.props.booking.id}</b> as transaction reference for faster verification.
              </li>
              <li>
                Take note of the <b>reference number</b> of the bank transfer.
              </li>
              <li>
                Fill in the input boxes below with the
                <b>estimated time of transfer</b> and <b>reference number</b>.
              </li>
              <li>
                It will take around 1 working day to verify your payment.
                We will notify you via email.
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
              id="ref"
              name="ref"
              value={this.state.ref}
              onChange={(e) => this.setState({ ref: e.target.value })}
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

BookingBankTransfer.propTypes = {
  booking: React.PropTypes.object,

  getBooking: React.PropTypes.func.isRequired,
  createBankTransferTransaction: React.PropTypes.func.isRequired,
  setPostStatus: React.PropTypes.func.isRequired,
  showAlertPopup: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  booking: state.booking.data,
});

const mapDispatchToProps = (dispatch) => ({
  getBooking: (params) => dispatch(getBooking(params)),
  createBankTransferTransaction: (params) => dispatch(createBankTransferTransaction(params)),
  setPostStatus: (status) => dispatch(setPostStatus(status)),
  showAlertPopup: (message) => dispatch(showAlertPopup(message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookingBankTransfer);
