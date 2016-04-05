import React, { Component } from 'react';
import Popup from '../Popup';
import './ConfirmPopup.scss';

export default class ConfirmPopup extends Component {

  render() {
    return (
      <div className="ConfirmPopup">
        <Popup ref={(c) => this._confirmPopup = c} title="Confirmation">
          {this.props.children}
          <div className="ConfirmPopup-footer">
            <a className="btn btn-primary btn-small" href="#" onClick={this._onClickOk.bind(this)}>OK</a>
            <a className="btn btn-primary btn-small" href="#" onClick={this._onClickCancel.bind(this)}>Cancel</a>
          </div>
        </Popup>
      </div>
    );
  }

  _onClickOk(event) {
    this._confirmPopup.hide();
    this._ok();
  }

  _onClickCancel(event) {
    this._confirmPopup.hide();
  }

  show(ok) {
    this._ok = ok || () => {};
    this._confirmPopup.show();
  }

}
