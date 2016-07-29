import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import classNames from 'classnames';
import s from './ResendVerifyBookingPopup.css';
import Popup from '../Popup';
import { resendVerifyBookingPin, hideResendVerifyBookingPopup, showAlertPopup } from '../../actions';

class ResendVerifyBookingPopup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hp: undefined,
      error: undefined,
      pending: false,
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      hp: props.hp,
      error: props.error,
      pending: props.pending,
    });
  }

  onClickSubmit = (event) => {
    if (this.resendVerifyBookingForm.checkValidity()) {
      event.preventDefault();

      this.setState({ pending: true });

      this.props.resendVerifyBookingPin({
        bid: this.props.bookingId,
        contactNumber: this.state.hp,
      }).then((res) => {
        this.setState({ pending: false });
        if (res.response && res.response.status === 1) {
          // console.log(res.response);

          this.setState({
            error: undefined,
          });

          this.props.showAlertPopup('Your PIN has been resent.');

          this.props.hideResendVerifyBookingPopup();

          this.props.onResent && this.props.onResent();
        } else {
          this.setState({
            error: true,
          });
          // console.error('Failed to resend booking pin.');
        }
        return;
      });
      // .catch((err) => {
      //   return console.error('/api/resendBookingPin', err.toString());
      // });
    }
  };

  closePopup = () => {
    this.props.hideResendVerifyBookingPopup();
  };

  executeAfterModalOpen = () => {
    this.startInput && this.startInput.focus();
  };

  render() {
    return (
      <div>
        <div className={s.resendVerifyBookingPopup}>
          <Popup
            css={s}
            isOpen={this.props.visible}
            afterOpen={this.executeAfterModalOpen}
            onCloseClicked={this.closePopup}
            onOverlayClicked={this.closePopup}
          >
            <Loader className="spinner" loaded={!this.state.pending}>
              <div className={classNames(s.accountLogin, s.accountContainerItem)}>
                <form
                  ref={(c) => (this.resendVerifyBookingForm = c)}
                  autoComplete="off"
                  onSubmit={this.onClickSubmit}
                >
                  <h3>Resend Booking PIN</h3>
                  <p>Please enter your mobile number.</p>
                  <input
                    ref={(c) => (this.startInput = c)}
                    className="HpInput"
                    type="text"
                    value={this.state.hp}
                    onChange={(e) => this.setState({ hp: e.target.value })}
                    placeholder="Enter mobile number"
                    pattern="\d{8}"
                    required
                  />
                  <div className={s.accountContainerItemMiddle}>
                    <div className={this.state.error ? '' : 'hidden'}>
                      <span className="error">Mobile number does not match.</span>
                    </div>
                  </div>
                  <a href="#" className="btn btn-primary" onClick={this.onClickSubmit}>Submit</a>
                </form>
              </div>
            </Loader>
          </Popup>
        </div>
      </div>
    );
  }

}

ResendVerifyBookingPopup.propTypes = {
  onResent: React.PropTypes.func,

  visible: React.PropTypes.bool,
  bookingId: React.PropTypes.string,

  resendVerifyBookingPin: React.PropTypes.func,
  hideResendVerifyBookingPopup: React.PropTypes.func,
  showAlertPopup: React.PropTypes.func,
};

const mapStateToProps = (state) => ({
  visible: state.modal.resendVerifyBooking.visible,
  bookingId: state.modal.resendVerifyBooking.bookingId,
});

const mapDispatchToProps = (dispatch) => ({
  resendVerifyBookingPin: (params) => dispatch(resendVerifyBookingPin(params)),
  hideResendVerifyBookingPopup: () => dispatch(hideResendVerifyBookingPopup()),
  showAlertPopup: (message) => dispatch(showAlertPopup(message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResendVerifyBookingPopup);
