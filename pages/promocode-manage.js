import React, { Component } from 'react';
import PromocodeManage from '../components/PromocodeManage';

export default class extends Component {

  componentDidMount() {
    document.title = 'eBeeCare | Promocode Manage';
  }

  render() {
    return (
      <PromocodeManage {...this.props}/>
    );
  }

}
