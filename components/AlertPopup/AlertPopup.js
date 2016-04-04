import React, { Component } from 'react';
import Popup from 'react-popup';
import './AlertPopup.scss';

export default class AlertPopup extends Component {

  render() {
    return (
      <Popup
        btnClass="btn btn-primary btn-small"
        closeHtml={
          <span role="button">×</span>
        }
        defaultOk="OK"
        wildClasses={true} />
    );
  }

  alert(message) {
    Popup.alert(message, 'Oops...');
  }

  // _onClickClose(event) {
  //   this._alertDialog.hide();
  // }

  // show() {
  //   this._alertDialog.show();
  // }

}
