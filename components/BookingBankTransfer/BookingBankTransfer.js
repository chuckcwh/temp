import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import linkState from 'react-link-state';
import Loader from 'react-loader';
import moment from 'moment';
import Datetime from 'react-datetime';
import './BookingBankTransfer.scss';
import Link from '../Link';
import { getBooking, createBankTransferTransaction, setPostStatus, showAlertPopup } from '../../actions';
import Util from '../../core/Util';

class BookingBankTransfer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pending: false,
      error: false,
      transferTime: undefined,
      ref: undefined
    };
  }

  componentWillUnmount() {
    this.serverRequest1 && this.serverRequest1.abort();
    this.serverRequest2 && this.serverRequest2.abort();
  }

  render() {
    return (
      <div className="BookingBankTransfer">
        <Loader className="spinner" loaded={this.state.pending ? false : true}>
          <form id="BookingBankTransferForm">
            <p className={classNames('error', this.state.error ? '' : 'hidden')}>Your bank transfer reference number was not accepted.</p>
            <p><b>Your Total Amount is SGD {this.props.booking.case.price}</b></p>
            <p>
              Please transfer the total amount to<br />
              Bank: <b>UOB</b><br />
              Type: <b>Current</b><br />
              Account Number: <b>341-306-307-6</b><br />
            </p>
            <ol>
              <li>Transfer the total amount via bank transfer (ATM / iBanking). If you are using internet banking, please set your booking ID <b>{this.props.booking.id}</b> as transaction reference for faster verification.</li>
              <li>Take note of the <b>reference number</b> of the bank transfer.</li>
              <li>Fill in the input boxes below with the <b>estimated time of transfer</b> and <b>reference number</b>.</li>
              <li>It will take around 1 working day to verify your payment. We will notify you via email.</li>
            </ol>
            <Datetime closeOnSelect={true} onChange={this._onSelectTransferTime.bind(this)} value={this.state.transferTime} strictParsing={true} inputProps={{'placeholder': 'Transfer Time*', 'required': 'required'}} />
            <input type="text" id="ref" name="ref" valueLink={linkState(this, 'ref')} placeholder="Reference Number*" required />
            <br /><br /><br /><br /><br /><br /><br /><br />
            <div>
              <a href="#" className="btn btn-primary" onClick={this._onConfirm.bind(this)}>CONFIRM PAYMENT</a>
            </div>
          </form>
        </Loader>
      </div>
    );
  }

  _onSelectTransferTime(moment) {
    this.setState({transferTime: moment});
  }

  _onConfirm(event) {
    var form = document.getElementById('BookingBankTransferForm');
    if (form.checkValidity()) {
      event.preventDefault();

      this.setState({
        pending: true
      });

      this.props.createBankTransferTransaction({
        amount: this.props.booking.case.price,
        type: 'Payment',
        ref: this.state.ref,
        sku: 'ebc-case-' + this.props.booking.case.id,
        transactionDate: this.state.transferTime.format('YYYY-MM-DD HH:mm:ss')
      }).then((res) => {
        if (res.response && res.response.status === 1) {
          this.props.getBooking({
            bid: this.props.booking.id,
            email: this.props.booking.client_contactEmail
          });

          this.props.setPostStatus('success');
        } else {
          this.setState({
            pending: false,
            error: true,
            ref: undefined
          });
          console.error('Failed to verify bank transfer payment.');
        }
      });
    } else {
      event.preventDefault();
      this.props.showAlertPopup('Please fill up all required fields.');
    }
  }

}

const mapStateToProps = (state) => {
  return {
    booking: state.booking.items
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getBooking: (params) => {
      return dispatch(getBooking(params));
    },
    createBankTransferTransaction: (params) => {
      return dispatch(createBankTransferTransaction(params));
    },
    setPostStatus: (status) => {
      return dispatch(setPostStatus(status));
    },
    showAlertPopup: (message) => {
      return dispatch(showAlertPopup(message));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingBankTransfer);
