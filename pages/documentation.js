import React, { Component } from 'react';
import Documentation from '../components/Documentation';

export default class extends Component {

  componentDidMount() {
    document.title = 'eBeeCare | Case Documentation';
  }

  render() {
    return (
      <Documentation {...this.props} />
    );
  }

}
