import React, { Component } from 'react';
import './Logo.scss';

export default class extends Component {

  render() {
    return (
      <div className="Logo">
        <img src={require('./logo.png')} />
      </div>
    );
  }

}
