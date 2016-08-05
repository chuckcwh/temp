import React, { Component } from 'react';
import Patients from '../components/Patients';

export default class extends Component {

  componentDidMount() {
    document.title = 'eBeeCare | Manage Patients';
  }

  render() {
    return (
      <div>
        <Patients />
      </div>
    );
  }
}
