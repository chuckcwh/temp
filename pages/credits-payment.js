import React, { Component } from 'react';
import CreditsPayment from '../components/CreditsPayment';

export default class extends Component {

  componentDidMount() {
    document.title = 'eBeeCare | Payment';
  }

  render() {
    return (
      <CreditsPayment />
    );
  }
}
