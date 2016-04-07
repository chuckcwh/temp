import React, { Component } from 'react';
import linkState from 'react-link-state';
import Loader from 'react-loader';
import request from 'superagent';
import './VerifyBookingPopup.scss';
import Link from '../Link';
import Popup from '../Popup';
import ResendVerifyBookingPopup from '../ResendVerifyBookingPopup';
import Util from '../../core/Util';

export default class VerifyBookingPopup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pin: undefined,
      error: undefined,
      pending: false,
      resend: false,
      resent: false
    };
  }

  componentWillUnmount() {
    this.serverRequest && this.serverRequest.abort();
  }

  render() {
    var resendLink, resentText;
    if (this.state.resend) {
      resendLink = <div><a href="#" className="btn btn-primary btn-small" onClick={this._onClickResend.bind(this)}>Resend PIN Now</a></div>;
    }
    if (this.state.resent) {
      resentText = <div>PIN has been resent!</div>;
    }
    return (
      <div>
        <div className="VerifyBookingPopup">
          <Popup ref={(c) => this._verifyBookingPopup = c} afterOpen={this._executeAfterModalOpen.bind(this)} hideOnOverlayClicked={false} hideCloseButton>
            <Loader className="spinner" loaded={this.state.pending ? false : true}>
              <div className="Account-login Account-container-item">
                <form id="VerifyBookingForm" ref={(c) => this._verifyBookingForm = c} autoComplete="off">
                  <h3>Verify Booking</h3>
                  <p>Please enter the 4-digit PIN sent to your mobile phone.</p>
                  <input ref={(c) => this._startInput = c} className="PinInput" type="password" name="pin" valueLink={linkState(this, 'pin')} placeholder="Enter PIN" required />
                  <div className="Account-container-item-middle">
                    <div className={this.state.error ? '' : 'hidden'}><span className="error">Wrong PIN.</span></div>
                    <div><a href="#" onClick={this._onClickNoPin.bind(this)}>Never receive PIN?</a></div>
                    {resendLink}
                    {resentText}
                  </div>
                  <button className="btn btn-primary" onClick={this._onClickSubmit.bind(this)}>Submit</button>
                </form>
              </div>
            </Loader>
          </Popup>
        </div>
        <ResendVerifyBookingPopup ref={(c) => this._resendVerifyBookingPopup = c} />
      </div>
    );
  }

  _onClickSubmit(event) {
    if (this._verifyBookingForm.checkValidity()) {
      event.preventDefault();

      this.setState({pending: true});

      this.serverRequest = request
        .post(Util.host + '/api/verifyBookingPin')
        .auth(Util.authKey, Util.authSecret)
        .send({
          bid: this._booking.id,
          pin: this.state.pin
        })
        .end((err, res) => {
          this.setState({pending: false});
          if (err) {
            return console.error(Util.host + '/api/verifyBookingPin', status, err.toString());
          }
          if (res.body && res.body.status === 1) {
            console.log(res.body);
            
            this.setState({
              error: undefined
            });

            this._verifyBookingPopup.hide();
            
            this._success();
          } else {
            this.setState({
              error: true
            });
            console.error('Failed to verify booking pin.');
          }
        });

      this.setState({
        pin: undefined
      });
    }
  }

  _onClickNoPin(event) {
    // this.setState({
    //   resend: true
    // });

    // if (typeof window !== 'undefined') {
    //   window.setTimeout(() => {
    //     this.setState({
    //       resend: false
    //     });
    //   }, 7000);
    // }
    this._resendVerifyBookingPopup.show(this._booking, () => {

    });
  }

  _onClickResend(event) {
    this.serverRequest = request
      .post(Util.host + '/api/resendBookingPin')
      .auth(Util.authKey, Util.authSecret)
      .send({
        bid: this._booking.id,
        contactNumber: this._booking.client_contactNumber
      })
      .end((err, res) => {
        if (err) {
          return console.error(Util.host + '/api/resendBookingPin', status, err.toString());
        }
        if (res.body && res.body.status === 1) {
          console.log(res.body);
          
          this.setState({
            resend: false,
            resent: true
          });

          if (typeof window !== 'undefined') {
            window.setTimeout(() => {
              this.setState({
                resent: false
              });
            }, 7000);
          }
        } else {
          console.error('Failed to resend booking pin.');
        }
      });
  }

  _executeAfterModalOpen() {
    this._startInput && this._startInput.focus();
  }

  show(booking, success) {
    this._booking = booking;
    this._success = success || () => {};
    this._verifyBookingPopup.show();
  }

}
