import React, { Component } from 'react';
import { connect } from 'react-redux';
import Popup from '../Popup';
import s from './AlertPopup.css';
import { hideAlertPopup } from '../../actions';

class AlertPopup extends Component {

  render() {
    return (
      <div className={s.alertPopup}>
        <Popup css={s} title="Alert" isOpen={this.props.visible} onCloseClicked={this._closePopup.bind(this)}>
          {this.props.message}
          {this.props.children}
          <div className={s.alertPopupFooter}>
            <a className="btn btn-primary btn-small" href="#" onClick={this._closePopup.bind(this)}>OK</a>
          </div>
        </Popup>
      </div>
    );
  }

  _closePopup() {
    this.props.hideAlertPopup();
  }

}

const mapStateToProps = (state) => {
  return {
    visible: state.modal.alert && state.modal.alert.visible,
    message: state.modal.alert && state.modal.alert.message
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    hideAlertPopup: () => {
      return dispatch(hideAlertPopup());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AlertPopup);
