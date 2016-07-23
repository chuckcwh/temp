import React, { Component } from 'react';
import Account from '../components/Account/Account';

export default class extends Component {

  componentDidMount() {
    document.title = 'eBeeCare | Forgot Password';
  }

  render() {
    return (
      <div>
        <Account type="forgot-password" />
      </div>
    );
  }
}
