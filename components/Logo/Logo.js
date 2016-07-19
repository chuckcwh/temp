import React, { Component } from 'react';
import s from './Logo.css';
import Link from '../Link';

export default class extends Component {

  render() {
    return (
      <div className={s.logo}>
        <Link to="/">
          <img src={require('./logo.png')} />
        </Link>
      </div>
    );
  }

}
