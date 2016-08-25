import React, { Component } from 'react';
import Schedule from '../components/Schedule';

export default class extends Component {

  componentDidMount() {
    document.title = 'eBeeCare | Schedule';
  }

  render() {
    return (
      <div>
        <Schedule />
      </div>
    );
  }
}
