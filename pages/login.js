import React, { Component } from 'react';
import Account from '../components/Account';
import history from '../core/history';

export default class extends Component {

  componentDidMount() {
    document.title = 'eBeeCare | Login';
  }

  handleSuccess = () => {
    history.push({ pathname: '/dashboard', query: location.query });
  };

  render() {
    return (
      <div>
        <Account type="login" onSuccess={this.handleSuccess} />
      </div>
    );
  }
}
