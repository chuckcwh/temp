import React, { Component } from 'react';
import { connect } from 'react-redux';
import linkState from 'react-link-state';
import Loader from 'react-loader';
import './VerifyBookingPopup.scss';
import Link from '../Link';
import Popup from '../Popup';
import ResendVerifyBookingPopup from '../ResendVerifyBookingPopup';
import { verifyBookingPin, hideVerifyBookingPopup, showResendVerifyBookingPopup, showAlertPopup } from '../../actions';
import Util from '../../core/Util';

class VerifyBookingPopup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pin: undefined,
      error: undefined,
      pending: false,
      resent: false
    };
  }

  render() {
    var resentText;
    if (this.state.resent) {
      resentText = <div>PIN has been resent!</div>;
    }
    return (
      <div>
        <div className="VerifyBookingPopup">
          <Popup ref={(c) => this._verifyBookingPopup = c} isOpen={this.props.visible} afterOpen={this._executeAfterModalOpen.bind(this)} hideCloseButton>
            <Loader className="spinner" loaded={this.state.pending ? false : true}>
              <div className="Account-login Account-container-item">
                <form id="VerifyBookingForm" ref={(c) => this._verifyBookingForm = c} autoComplete="off">
                  <h3>Verify Booking</h3>
                  <p>Please enter the 4-digit PIN sent to your mobile phone.</p>
                  <input ref={(c) => this._startInput = c} className="PinInput" type="password" name="pin" valueLink={linkState(this, 'pin')} placeholder="Enter PIN" required />
                  <div className="Account-container-item-middle">
                    <div className={this.state.error ? '' : 'hidden'}><span className="error">Wrong PIN.</span></div>
                    <div><a href="#" onClick={this._onClickNoPin.bind(this)}>Resend PIN</a></div>
                    {resentText}
                  </div>
                  <a href="#" className="btn btn-primary" onClick={this._onClickSubmit.bind(this)}>Submit</a>
                </form>
              </div>
            </Loader>
          </Popup>
        </div>
        <ResendVerifyBookingPopup />
      </div>
    );
  }

  _onClickSubmit(event) {
    if (this._verifyBookingForm.checkValidity()) {
      event.preventDefault();

      this.setState({pending: true});

      this.props.verifyBookingPin({
        bid: this.props.bookingId,
        pin: this.state.pin
      }).then((res) => {
        this.setState({pending: false});
        if (res.response && res.response.status === 1) {
          // console.log(res.response);

          this.setState({
            error: undefined
          });

          this.props.hideVerifyBookingPopup();

          this.props.onVerified && this.props.onVerified();
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
    this.props.showResendVerifyBookingPopup(this.props.bookingId);
  }

  _executeAfterModalOpen() {
    this._startInput && this._startInput.focus();
  }

}

VerifyBookingPopup.propTypes = {
  onVerified: React.PropTypes.func
};

const mapStateToProps = (state) => {
  return {
    visible: state.modal.verifyBooking.visible,
    bookingId: state.modal.verifyBooking.bookingId
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    verifyBookingPin: (params) => {
      return dispatch(verifyBookingPin(params));
    },
    hideVerifyBookingPopup: () => {
      return dispatch(hideVerifyBookingPopup());
    },
    showResendVerifyBookingPopup: (bookingId) => {
      return dispatch(showResendVerifyBookingPopup(bookingId));
    },
    showAlertPopup: (message) => {
      return dispatch(showAlertPopup(message));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VerifyBookingPopup);
