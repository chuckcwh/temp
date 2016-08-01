import React, { Component } from 'react';
import Dashboard from '../components/Dashboard';

export default class extends Component {

  componentDidMount() {
    document.title = 'eBeeCare | Dashboard';
  }

  render() {
    return (
      <div>
        <Dashboard />
      </div>
    );
  }
}
