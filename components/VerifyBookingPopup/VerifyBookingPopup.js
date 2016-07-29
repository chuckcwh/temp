import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import classNames from 'classnames';
import s from './VerifyBookingPopup.css';
import Popup from '../Popup';
import ResendVerifyBookingPopup from '../ResendVerifyBookingPopup';
import { verifyBookingPin, hideVerifyBookingPopup, showResendVerifyBookingPopup, showAlertPopup } from '../../actions';

class VerifyBookingPopup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pin: undefined,
      error: undefined,
      pending: false,
      resent: false,
    };
  }

  onClickNoPin = () => {
    this.props.showResendVerifyBookingPopup(this.props.bookingId);
  };

  onClickSubmit = (event) => {
    if (this.verifyBookingForm.checkValidity()) {
      event.preventDefault();

      this.setState({ pending: true });

      this.props.verifyBookingPin({
        bid: this.props.bookingId,
        pin: this.state.pin,
      }).then((res) => {
        this.setState({ pending: false });
        if (res.response && res.response.status === 1) {
          // console.log(res.response);

          this.setState({
            error: undefined,
          });

          this.props.hideVerifyBookingPopup();

          this.props.onVerified && this.props.onVerified();
        } else {
          this.setState({
            error: true,
          });
          // console.error('Failed to verify booking pin.');
        }
      });

      this.setState({
        pin: undefined,
      });
    }
  };

  executeAfterModalOpen = () => {
    this.startInput && this.startInput.focus();
  };

  render() {
    let resentText;
    if (this.state.resent) {
      resentText = <div>PIN has been resent!</div>;
    }
    return (
      <div>
        <div className={s.verifyBookingPopup}>
          <Popup css={s} isOpen={this.props.visible} afterOpen={this.executeAfterModalOpen} hideCloseButton>
            <Loader className="spinner" loaded={!this.state.pending}>
              <div className={classNames(s.accountLogin, s.accountContainerItem)}>
                <form
                  ref={(c) => (this.verifyBookingForm = c)}
                  autoComplete="off"
                  onSubmit={this.onClickSubmit}
                >
                  <h3>Verify Booking</h3>
                  <p>Please enter the 4-digit PIN sent to your mobile phone.</p>
                  <input
                    ref={(c) => (this.startInput = c)}
                    className="PinInput"
                    type="password"
                    value={this.state.pin}
                    onChange={(e) => this.setState({ pin: e.target.value })}
                    placeholder="Enter PIN"
                    required
                  />
                  <div className={s.accountContainerItemMiddle}>
                    <div className={this.state.error ? '' : 'hidden'}><span className="error">Wrong PIN.</span></div>
                    <div><a href="#" onClick={this.onClickNoPin}>Resend PIN</a></div>
                    {resentText}
                  </div>
                  <a href="#" className="btn btn-primary" onClick={this.onClickSubmit}>Submit</a>
                </form>
              </div>
            </Loader>
          </Popup>
        </div>
        <ResendVerifyBookingPopup />
      </div>
    );
  }

}

VerifyBookingPopup.propTypes = {
  onVerified: React.PropTypes.func,

  visible: React.PropTypes.bool,
  bookingId: React.PropTypes.string,

  verifyBookingPin: React.PropTypes.func,
  hideVerifyBookingPopup: React.PropTypes.func,
  showResendVerifyBookingPopup: React.PropTypes.func,
  showAlertPopup: React.PropTypes.func,
};

const mapStateToProps = (state) => ({
  visible: state.modal.verifyBooking.visible,
  bookingId: state.modal.verifyBooking.bookingId,
});

const mapDispatchToProps = (dispatch) => ({
  verifyBookingPin: (params) => dispatch(verifyBookingPin(params)),
  hideVerifyBookingPopup: () => dispatch(hideVerifyBookingPopup()),
  showResendVerifyBookingPopup: (bookingId) => dispatch(showResendVerifyBookingPopup(bookingId)),
  showAlertPopup: (message) => dispatch(showAlertPopup(message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VerifyBookingPopup);
