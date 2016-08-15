import React, { Component } from 'react';
import Patients from '../components/Patients';

export default class extends Component {

  componentDidMount() {
    document.title = 'eBeeCare | Add Patient';
  }

  render() {
    return (
      <div>
        <Patients action="add" />
      </div>
    );
  }
}
