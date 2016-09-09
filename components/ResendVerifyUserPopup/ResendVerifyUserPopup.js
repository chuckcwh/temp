import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import classNames from 'classnames';
import s from './ResendVerifyUserPopup.css';
import Popup from '../Popup';
import { resendVerifyUserPin, hideResendVerifyUserPopup, showAlertPopup } from '../../actions';

class ResendVerifyUserPopup extends Component {

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
    if (this.resendVerifyUserForm.checkValidity()) {
      event.preventDefault();

      this.setState({ pending: true });

      this.props.resendVerifyUserPin({
        userId: this.props.userId,
        contactNumber: this.state.hp,
      }).then((res) => {
        this.setState({ pending: false });
        if (res.response && res.response.status === 1) {
          // console.log(res.response);

          this.setState({
            error: undefined,
          });

          this.props.showAlertPopup('Your PIN has been resent.');

          this.props.hideResendVerifyUserPopup();

          this.props.onResent && this.props.onResent();
        } else {
          this.setState({
            error: true,
          });
          // console.error('Failed to resend user pin.');
        }
        return;
      });
      // .catch((err) => {
      //   return console.error('/api/resendUserPin', err.toString());
      // });
    }
  };

  closePopup = () => {
    this.props.hideResendVerifyUserPopup();
  };

  executeAfterModalOpen = () => {
    this.startInput && this.startInput.focus();
  };

  render() {
    return (
      <div>
        <div className={s.ResendVerifyUserPopup}>
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
                  ref={(c) => (this.resendVerifyUserForm = c)}
                  autoComplete="off"
                  onSubmit={this.onClickSubmit}
                >
                  <h3>Resend User PIN</h3>
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

ResendVerifyUserPopup.propTypes = {
  onResent: React.PropTypes.func,

  visible: React.PropTypes.bool,
  userId: React.PropTypes.string,

  resendVerifyUserPin: React.PropTypes.func,
  hideResendVerifyUserPopup: React.PropTypes.func,
  showAlertPopup: React.PropTypes.func,
};

const mapStateToProps = (state) => ({
  visible: state.modal.resendVerifyUser.visible,
  userId: state.modal.resendVerifyUser.userId,
});

const mapDispatchToProps = (dispatch) => ({
  resendVerifyUserPin: (params) => dispatch(resendVerifyUserPin(params)),
  hideResendVerifyUserPopup: () => dispatch(hideResendVerifyUserPopup()),
  showAlertPopup: (message) => dispatch(showAlertPopup(message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResendVerifyUserPopup);
