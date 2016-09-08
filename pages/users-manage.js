import React, { Component } from 'react';
import UsersManage from '../components/UsersManage';

export default class extends Component {

  componentDidMount() {
    document.title = 'eBeeCare | Users Manage';
  }

  render() {
    return (
      <UsersManage />
    );
  }

}
