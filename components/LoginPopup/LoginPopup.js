import React, { Component } from 'react';
import { connect } from 'react-redux';
import linkState from 'react-link-state';
import './LoginPopup.scss';
import Link from '../Link';
import LoginForm from '../LoginForm';
import Popup from '../Popup';
import { login, hideLoginPopup, destroyUser } from '../../actions';
import Util from '../../core/Util';

class LoginPopup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: undefined,
      password: undefined,
      error: undefined,
      pending: false,
      open: false
    };
  }

  render() {
    return (
      <div className="LoginPopup">
        <Popup isOpen={this.props.visible} onCloseClicked={this._closePopup.bind(this)} onOverlayClicked={this._closePopup.bind(this)}>
          <div className="Account-login Account-container-item">
            {this.props.visible && <LoginForm type="client" onSuccess={this._closePopup.bind(this)} />}
          </div>
        </Popup>
      </div>
    );
  }

  _closePopup() {
    this.props.hideLoginPopup();
  }

}

LoginPopup.propTypes = {
  onLogin: React.PropTypes.func
};

const mapStateToProps = (state) => {
  return {
    visible: state.modal.login
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    login: (params) => {
      return dispatch(login(params));
    },
    hideLoginPopup: () => {
      return dispatch(hideLoginPopup());
    },
    destroyUser: () => {
      return dispatch(destroyUser());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPopup);
