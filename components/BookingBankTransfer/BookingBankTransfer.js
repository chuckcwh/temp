import React, { Component } from 'react';
import request from 'superagent';
import classNames from 'classNames';
import linkState from 'react-link-state';
import Loader from 'react-loader';
import './BookingBankTransfer.scss';
import Link from '../Link';
import AlertPopup from '../AlertPopup';
import BookingActions from '../../actions/BookingActions';

export default class BookingBankTransfer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pending: false,
      error: false,
      ref: undefined
    };
  }

  componentWillUnmount() {
    this.serverRequest && this.serverRequest.abort();
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
              Bank: <b>POSB</b><br />
              Type: <b>Savings</b><br />
              Account Number: <b>150-27506-7</b><br />
            </p>
            <ol>
              <li>Transfer the total amount via bank transfer (ATM / iBanking).</li>
              <li>Take note of the <b>reference number</b> of the bank transfer.</li>
              <li>Fill in the input box below with the <b>reference number</b>.</li>
              <li>It will take around 1 working day to verify your payment. We will notify you via email.</li>
            </ol>
            <input type="text" id="ref" name="ref" valueLink={linkState(this, 'ref')} placeholder="Reference Number*" required />
            <p></p>
            <p></p>
            <div>
              <a href="#" className="btn btn-primary" onClick={this._onConfirm.bind(this)}>CONFIRM BOOKING</a>
            </div>
          </form>
        </Loader>
        <AlertPopup ref="alertPopup">
          Please fill up your bank transfer reference number.
        </AlertPopup>
      </div>
    );
  }

  _onConfirm(event) {
    var form = document.getElementById('BookingBankTransferForm');
    if (form.checkValidity()) {
      event.preventDefault();

      this.setState({
        pending: true,
        ref: undefined
      });

      this.serverRequest = request
        .post('http://161.202.19.121/api/verifyBankTransaction')
        .auth('secret', 'secret0nlyWeilsonKnowsShhh852~')
        .send({
          amount: this.props.booking.case.price,
          type: 'Payment',
          ref: this.state.ref,
          sku: 'ebc-case-' + this.props.booking.case.id
        })
        .end((err, res) => {
          if (err) {
            return console.error('http://161.202.19.121/api/verifyBankTransaction', status, err.toString());
          }
          if (res.body && res.body.status === 1) {
            console.log(res.body);
            BookingActions.setPostStatus('success');
          } else {
            this.setState({
              pending: false,
              error: true
            });
            console.error('Failed to verify bank transfer payment.');
          }
        });
    } else {
      event.preventDefault();
      this.refs.alertPopup.show();
    }
  }

}
