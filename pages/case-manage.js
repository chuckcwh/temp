import React, { Component } from 'react';
import AdminCaseManage from '../components/AdminCaseManage';

export default class extends Component {

  componentDidMount() {
    document.title = 'eBeeCare | Case Manage';
  }

  render() {
    return (
      <AdminCaseManage {...this.props} />
    );
  }

}
