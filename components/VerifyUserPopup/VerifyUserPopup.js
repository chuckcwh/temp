import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import classNames from 'classnames';
import s from './VerifyUserPopup.css';
import Popup from '../Popup';
import ResendVerifyUserPopup from '../ResendVerifyUserPopup';
import { VERIFY_USER_PIN_SUCCESS, verifyUserPin, hideVerifyUserPopup,
  showResendVerifyUserPopup, showAlertPopup } from '../../actions';

class VerifyUserPopup extends Component {

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
    this.props.showResendVerifyUserPopup(this.props.userId);
  };

  onClickSubmit = (event) => {
    if (this.verifyUserForm.checkValidity()) {
      event.preventDefault();

      this.setState({ pending: true });

      this.props.verifyUserPin({
        userId: this.props.userId,
        pin: this.state.pin,
      }).then((res) => {
        this.setState({ pending: false });
        if (res && res.type === VERIFY_USER_PIN_SUCCESS) {
          // console.log(res.response);

          this.setState({
            error: undefined,
          });

          this.props.hideVerifyUserPopup();

          this.props.onVerified && this.props.onVerified();
        } else {
          this.setState({
            error: true,
          });
          // console.error('Failed to verify user pin.');
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
        <div className={s.verifyUserPopup}>
          <Popup css={s} isOpen={this.props.visible} afterOpen={this.executeAfterModalOpen} hideCloseButton>
            <Loader className="spinner" loaded={!this.state.pending}>
              <div className={classNames(s.accountLogin, s.accountContainerItem)}>
                <form
                  ref={(c) => (this.verifyUserForm = c)}
                  autoComplete="off"
                  onSubmit={this.onClickSubmit}
                >
                  <h3>User Verification</h3>
                  <p>Please enter the 4-digit PIN sent to your mobile phone.</p>
                  <input
                    ref={(c) => (this.startInput = c)}
                    className="PinInput"
                    type="password"
                    value={this.state.pin || ''}
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
        <ResendVerifyUserPopup />
      </div>
    );
  }

}

VerifyUserPopup.propTypes = {
  onVerified: React.PropTypes.func,

  visible: React.PropTypes.bool,
  userId: React.PropTypes.string,

  verifyUserPin: React.PropTypes.func,
  hideVerifyUserPopup: React.PropTypes.func,
  showResendVerifyUserPopup: React.PropTypes.func,
  showAlertPopup: React.PropTypes.func,
};

const mapStateToProps = (state) => ({
  visible: state.modal.verifyUser.visible,
  userId: state.modal.verifyUser.userId,
});

const mapDispatchToProps = (dispatch) => ({
  verifyUserPin: (params) => dispatch(verifyUserPin(params)),
  hideVerifyUserPopup: () => dispatch(hideVerifyUserPopup()),
  showResendVerifyUserPopup: (userId) => dispatch(showResendVerifyUserPopup(userId)),
  showAlertPopup: (message) => dispatch(showAlertPopup(message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VerifyUserPopup);
