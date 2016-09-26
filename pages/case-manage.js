import React, { Component } from 'react';
import AdminCaseManage from '../components/AdminCaseManage';
import AdminCaseManageView from '../components/AdminCaseManage/AdminCaseManageView/AdminCaseManageView';


export default class extends Component {

  componentDidMount() {
    document.title = 'eBeeCare | Case Manage';
  }

  render() {
    const { view } = this.props.params;

    let content;

    if (view) {
      content = (<AdminCaseManageView {...this.props} />)
    } else {
      content = (<AdminCaseManage {...this.props} />)
    }

    return (
      <div>{content}</div>
    );
  }

}
