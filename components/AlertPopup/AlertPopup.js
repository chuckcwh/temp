import React, { Component } from 'react';
import SkyLight from 'react-skylight';
import './AlertPopup.scss';

export default class AlertPopup extends Component {

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
      <SkyLight dialogStyles={styles.dialogStyles} title={styles.title} closeButtonStyle={styles.closeButtonStyle} hideOnOverlayClicked ref={(c) => this._alertDialog = c} title="Alert">
        <div className="AlertPopup">
          {this.props.children}
          <div className="AlertPopup-footer">
            <a className="btn btn-primary btn-small" href="#" onClick={this._onClickClose.bind(this)}>OK</a>
          </div>
        </div>
      </SkyLight>
    );
  }

  _onClickClose(event) {
    this._alertDialog.hide();
  }

  show() {
    this._alertDialog.show();
  }

}
