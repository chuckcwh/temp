import React, { Component } from 'react';
import AdminUsersManage from '../components/AdminUsersManage';

export default class extends Component {

  componentDidMount() {
    document.title = 'eBeeCare | Users Manage';
  }

  render() {
    return (
      <AdminUsersManage />
    );
  }

}
