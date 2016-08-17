import React, { Component } from 'react';
import Credits from '../components/Credits';

export default class extends Component {

  componentDidMount() {
    document.title = 'eBeeCare | Credits';
  }

  render() {
    return (
      <div>
        <Credits />
      </div>
    );
  }
}
