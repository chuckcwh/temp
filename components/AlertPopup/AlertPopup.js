import React, { Component } from 'react';
import SkyLight from 'react-skylight';
import './AlertPopup.scss';

export default class AlertPopup extends Component {

  render() {
    var styles = {
      dialogStyles: {
        width: '25%',
        height: '150px',
        marginTop: '-75px',
        marginLeft: '-12.5%',
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
      <SkyLight className="AlertPopup" dialogStyles={styles.dialogStyles} title={styles.title} closeButtonStyle={styles.closeButtonStyle} hideOnOverlayClicked ref="alertDialog" title="Alert">
        {this.props.children}
        <div className="AlertPopup-footer">
          <a className="btn btn-primary btn-small" href="#" onClick={this._onClickClose.bind(this)}>OK</a>
        </div>
      </SkyLight>
    );
  }

  _onClickClose(event) {
    this.refs.alertDialog.hide();
  }

  show() {
    this.refs.alertDialog.show();
  }

}
