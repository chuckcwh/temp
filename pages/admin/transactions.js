import React, { Component } from 'react';
import AdminTransactions from '../../components/AdminTransactions';

export default class extends Component {

  componentDidMount() {
    document.title = 'eBeeCare | Transaction Manage';
  }

  render() {
    return (
      <AdminTransactions {...this.props}/>
    );
  }

}
