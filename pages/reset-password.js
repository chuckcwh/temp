import React, { Component } from 'react';
import Account from '../components/Account';

export default class extends Component {

  componentDidMount() {
    document.title = 'eBeeCare | Reset Password';
  }

  render() {
    return (
      <div>
        <Account type="reset-password" />
      </div>
    );
  }
}
