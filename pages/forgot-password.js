import React, { Component } from 'react';
import Account from '../components/Account';

export default class extends Component {

  componentDidMount() {
    document.title = 'eBeeCare | Forgot Password';
  }

  handleSuccess = () => {
    history.push({ pathname: '/dashboard', query: location.query });
  };

  render() {
    return (
      <div>
        <Account type="forgot-password" onSuccess={this.handleSuccess} />
      </div>
    );
  }
}
