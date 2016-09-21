import React, { Component } from 'react';
import AdminPromocodeManage from '../components/AdminPromocodeManage';

export default class extends Component {

  componentDidMount() {
    document.title = 'eBeeCare | Promocode Manage';
  }

  render() {
    return (
      <AdminPromocodeManage {...this.props}/>
    );
  }

}
