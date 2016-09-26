import React, { Component } from 'react';
import AdminUsers from '../../components/AdminUsers';

export default class extends Component {

  componentDidMount() {
    document.title = 'eBeeCare | Users Manage';
  }

  render() {
    return (
      <AdminUsers />
    );
  }

}
