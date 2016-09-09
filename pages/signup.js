import React, { Component } from 'react';
import Account from '../components/Account';

export default class extends Component {

  componentDidMount() {
    document.title = 'eBeeCare | Signup';
  }

  render() {
    return (
      <div>
        <Account type="signup" />
      </div>
    );
  }
}
