import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import s from './LoginPopup.css';
import sAccount from '../Account/Account.css';
import LoginForm from '../LoginForm';
import Popup from '../Popup';
import { login, hideLoginPopup, destroyUser } from '../../actions';

class LoginPopup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: undefined,
      password: undefined,
      error: undefined,
      pending: false,
      open: false,
    };
  }

  closePopup = () => {
    this.props.hideLoginPopup();
  };

  render() {
    return (
      <div className={s.loginPopup}>
        <Popup
          css={s}
          isOpen={this.props.visible}
          onCloseClicked={this.closePopup}
          onOverlayClicked={this.closePopup}
        >
          <div className={classNames(sAccount.accountLogin, s.accountContainerItem)}>
            {this.props.visible && <LoginForm type="client" onSuccess={this.closePopup} />}
          </div>
        </Popup>
      </div>
    );
  }

}

LoginPopup.propTypes = {
  onLogin: React.PropTypes.func,

  visible: React.PropTypes.bool,

  login: React.PropTypes.func,
  hideLoginPopup: React.PropTypes.func,
  destroyUser: React.PropTypes.func,
};

const mapStateToProps = (state) => ({
  visible: state.modal.login,
});

const mapDispatchToProps = (dispatch) => ({
  login: (params) => dispatch(login(params)),
  hideLoginPopup: () => dispatch(hideLoginPopup()),
  destroyUser: () => dispatch(destroyUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPopup);
