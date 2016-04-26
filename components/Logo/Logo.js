import React, { Component } from 'react';
import './Logo.scss';
import Link from '../Link';

export default class extends Component {

  render() {
    return (
      <div className="Logo">
        <a href="/" onClick={Link.handleClick}>
          <img src={require('./logo.png')} />
        </a>
      </div>
    );
  }

}
