import React, { Component } from 'react';
import linkState from 'react-link-state';
import Loader from 'react-loader';
import request from 'superagent';
import './ResendVerifyBookingPopup.scss';
import Link from '../Link';
import Popup from '../Popup';
import AlertPopup from '../AlertPopup';
import Util from '../../core/Util';

export default class ResendVerifyBookingPopup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hp: undefined,
      error: undefined,
      pending: false
    };
  }

  componentWillUnmount() {
    this.serverRequest && this.serverRequest.abort();
  }

  render() {
    return (
      <div>
        <div className="ResendVerifyBookingPopup">
          <Popup ref={(c) => this._resendVerifyBookingPopup = c} afterOpen={this._executeAfterModalOpen.bind(this)}>
            <Loader className="spinner" loaded={this.state.pending ? false : true}>
              <div className="Account-login Account-container-item">
                <form id="ResendVerifyBookingForm" ref={(c) => this._resendVerifyBookingForm = c} autoComplete="off">
                  <h3>Resend Booking PIN</h3>
                  <p>Please enter your mobile number.</p>
                  <input ref={(c) => this._startInput = c} className="HpInput" type="text" name="pin" valueLink={linkState(this, 'hp')} placeholder="Enter mobile number" pattern="\d{8}" required />
                  <div className="Account-container-item-middle">
                    <div className={this.state.error ? '' : 'hidden'}><span className="error">Mobile number does not match.</span></div>
                  </div>
                  <button className="btn btn-primary" onClick={this._onClickSubmit.bind(this)}>Submit</button>
                </form>
              </div>
            </Loader>
          </Popup>
        </div>
        <AlertPopup ref={(c) => this._alertPopup = c} />
      </div>
    );
  }

  _onClickSubmit(event) {
    if (this._resendVerifyBookingForm.checkValidity()) {
      event.preventDefault();

      this.setState({pending: true});

      this.serverRequest = request
        .post(Util.host + '/api/resendBookingPin')
        .auth(Util.authKey, Util.authSecret)
        .send({
          bid: this._booking.id,
          contactNumber: this.state.hp
        })
        .end((err, res) => {
          this.setState({pending: false});
          if (err) {
            return console.error(Util.host + '/api/resendBookingPin', status, err.toString());
          }
          if (res.body && res.body.status === 1) {
            console.log(res.body);
            
            this.setState({
              error: undefined
            });

            this._alertPopup.show('Your PIN has been resent.');

            this._resendVerifyBookingPopup.hide();
            
            this._success();
          } else {
            this.setState({
              error: true
            });
            console.error('Failed to resend booking pin.');
          }
        });

      this.setState({
        pin: undefined
      });
    }
  }

  _executeAfterModalOpen() {
    this._startInput && this._startInput.focus();
  }

  show(booking, success) {
    this._booking = booking;
    this._success = success || () => {};
    this.setState({
      hp: undefined,
      error: undefined,
      pending: false
    });
    this._resendVerifyBookingPopup.show();
  }

}
