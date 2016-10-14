import React, { Component } from 'react';
import Account from '../components/Account';
import history from '../core/history';

export default class extends Component {

  componentDidMount() {
    document.title = 'eBeeCare | Verify Email';
  }

  render() {
    return (
      <div>
        <Account type="verify-email" />
      </div>
    );
  }
}
