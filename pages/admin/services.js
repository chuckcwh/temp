import React, { Component } from 'react';
import AdminServices from '../../components/AdminServices';

export default class extends Component {

  componentDidMount() {
    document.title = 'eBeeCare | Service Manage';
  }

  render() {
    return (
      <AdminServices {...this.props}/>
    );
  }

}
