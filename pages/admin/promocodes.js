import React, { Component } from 'react';
import AdminPromocodes from '../../components/AdminPromocodes';

export default class extends Component {

  componentDidMount() {
    document.title = 'eBeeCare | Promocode Manage';
  }

  render() {
    return (
      <AdminPromocodes {...this.props}/>
    );
  }

}
