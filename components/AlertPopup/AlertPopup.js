import React, { Component } from 'react';
import Popup from '../Popup';
import './AlertPopup.scss';

export default class AlertPopup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      message: undefined
    };
  }

  render() {
    return (
      <div className="AlertPopup">
        <Popup ref={(c) => this._alertPopup = c} title="Alert">
          {this.state.message}
          {this.props.children}
          <div className="AlertPopup-footer">
            <a className="btn btn-primary btn-small" href="#" onClick={this._onClickClose.bind(this)}>OK</a>
          </div>
        </Popup>
      </div>
    );
  }

  _onClickClose(event) {
    if (this.state.message) this.setState({ message: undefined });
    this._alertPopup.hide();
  }

  show(message) {
    if (message) this.setState({ message: message });
    this._alertPopup.show();
  }

}
