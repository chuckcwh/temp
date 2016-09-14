import React, { Component } from 'react';
import CaseManage from '../components/CaseManage';

export default class extends Component {

  componentDidMount() {
    document.title = 'eBeeCare | Case Manage';
  }

  render() {
    return (
      <CaseManage {...this.props} />
    );
  }

}
