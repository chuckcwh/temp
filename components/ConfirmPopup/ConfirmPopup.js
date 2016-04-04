import React, { Component } from 'react';
import Popup from 'react-popup';
import './ConfirmPopup.scss';

export default class ConfirmPopup extends Component {

  render() {
    return (
      <Popup 
        btnClass="btn btn-primary btn-small" 
        closeBtn={false} 
        defaultOk="OK" 
        wildClasses={true} />
    );
  }

  // _onClickOk(event) {
  //   this._confirmDialog.hide();
  //   this._ok();
  // }

  // _onClickCancel(event) {
  //   this._confirmDialog.hide();
  // }

  show(message, ok) {
    this._ok = ok || () => {};
    // this._confirmDialog.show();
    Popup.create({
      title: 'Confirm',
      content: message,
      buttons: {
        right: [{
          text: 'OK',
          action: (popup) => {
            popup.close();
            this._ok();
          }
        }, {
          text: 'Cancel',
          action: (popup) => {
            popup.close();
          }
        }]
      }
    });
  }

}
