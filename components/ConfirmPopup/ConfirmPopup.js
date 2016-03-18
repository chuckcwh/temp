import React, { Component } from 'react';
import SkyLight from 'react-skylight';
import './ConfirmPopup.scss';

export default class ConfirmPopup extends Component {

  render() {
    var styles = {
      dialogStyles: {
        width: '50%',
        height: 'auto',
        marginTop: '0',
        marginLeft: '-25%',
        top: '100px',
        textAlign: 'center'
      },
      title: {
        color: '#f78d00'
      },
      closeButtonStyle: {
        color: '#f78d00',
        textDecoration: 'none'
      }
    };

    return (
      <SkyLight dialogStyles={styles.dialogStyles} title={styles.title} closeButtonStyle={styles.closeButtonStyle} hideOnOverlayClicked ref={(c) => this._confirmDialog = c} title="Confirmation">
        <div className="ConfirmPopup">
          {this.props.children}
          <div className="ConfirmPopup-footer">
            <a className="btn btn-primary btn-small" href="#" onClick={this._onClickOk.bind(this)}>OK</a>
            <a className="btn btn-primary btn-small" href="#" onClick={this._onClickCancel.bind(this)}>Cancel</a>
          </div>
        </div>
      </SkyLight>
    );
  }

  _onClickOk(event) {
    this._confirmDialog.hide();
    this._ok();
  }

  _onClickCancel(event) {
    this._confirmDialog.hide();
  }

  show(ok) {
    this._ok = ok || () => {};
    this._confirmDialog.show();
  }

}
