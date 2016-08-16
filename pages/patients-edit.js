import React, { Component } from 'react';
import Patients from '../components/Patients';

export default class extends Component {

  componentDidMount() {
    document.title = 'eBeeCare | Edit Patient';
  }

  render() {
    return (
      <div>
        <Patients action="edit" />
      </div>
    );
  }
}
