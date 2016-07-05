import React, { Component } from 'react';
import { connect } from 'react-redux';
import linkState from 'react-link-state';
import Loader from 'react-loader';
import './ResendVerifyBookingPopup.scss';
import Link from '../Link';
import Popup from '../Popup';
import { resendVerifyBookingPin, hideResendVerifyBookingPopup, showAlertPopup } from '../../actions';
import Util from '../../core/Util';

class ResendVerifyBookingPopup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hp: undefined,
      error: undefined,
      pending: false
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      hp: props.hp,
      error: props.error,
      pending: props.pending
    });
  }

  render() {
    return (
      <div>
        <div className="ResendVerifyBookingPopup">
          <Popup isOpen={this.props.visible} afterOpen={this._executeAfterModalOpen.bind(this)} onCloseClicked={this._closePopup.bind(this)} onOverlayClicked={this._closePopup.bind(this)}>
            <Loader className="spinner" loaded={this.state.pending ? false : true}>
              <div className="Account-login Account-container-item">
                <form id="ResendVerifyBookingForm" ref={(c) => this._resendVerifyBookingForm = c} autoComplete="off">
                  <h3>Resend Booking PIN</h3>
                  <p>Please enter your mobile number.</p>
                  <input ref={(c) => this._startInput = c} className="HpInput" type="text" name="pin" valueLink={linkState(this, 'hp')} placeholder="Enter mobile number" pattern="\d{8}" required />
                  <div className="Account-container-item-middle">
                    <div className={this.state.error ? '' : 'hidden'}><span className="error">Mobile number does not match.</span></div>
                  </div>
                  <a href="#" className="btn btn-primary" onClick={this._onClickSubmit.bind(this)}>Submit</a>
                </form>
              </div>
            </Loader>
          </Popup>
        </div>
      </div>
    );
  }

  _onClickSubmit(event) {
    if (this._resendVerifyBookingForm.checkValidity()) {
      event.preventDefault();

      this.setState({pending: true});

      this.props.resendVerifyBookingPin({
        bid: this.props.bookingId,
        contactNumber: this.state.hp
      }).then((res) => {
        this.setState({pending: false});
        if (err) {
          return console.error(Util.host + '/api/resendBookingPin', status, err.toString());
        }
        if (res.response && res.response.status === 1) {
          // console.log(res.response);

          this.setState({
            error: undefined
          });

          this.props.showAlertPopup('Your PIN has been resent.');

          this.props.hideResendVerifyBookingPopup();

          this.props.onResent && this.props.onResent();
        } else {
          this.setState({
            error: true
          });
          console.error('Failed to resend booking pin.');
        }
      });

      // this.setState({
      //   pin: undefined
      // });
    }
  }

  _closePopup() {
    this.props.hideResendVerifyBookingPopup();
  }

  _executeAfterModalOpen() {
    this._startInput && this._startInput.focus();
  }

}

ResendVerifyBookingPopup.propTypes = {
  onResent: React.PropTypes.func
};

const mapStateToProps = (state) => {
  return {
    visible: state.modal.resendVerifyBooking.visible,
    bookingId: state.modal.resendVerifyBooking.bookingId
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    resendVerifyBookingPin: (params) => {
      return dispatch(resendVerifyBookingPin(params));
    },
    hideResendVerifyBookingPopup: () => {
      return dispatch(hideResendVerifyBookingPopup());
    },
    showAlertPopup: (message) => {
      return dispatch(showAlertPopup(message));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResendVerifyBookingPopup);
