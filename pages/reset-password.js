import React, { Component } from 'react';
import Account from '../components/Account';
import history from '../core/history';

export default class extends Component {

  componentDidMount() {
    document.title = 'eBeeCare | Reset Password';
  }

  handleSuccess = () => {
    const location = history.getCurrentLocation();
    history.push({ pathname: '/dashboard', query: location.query });
  };

  render() {
    return (
      <div>
        <Account type="reset-password" onSuccess={this.handleSuccess} />
      </div>
    );
  }
}
