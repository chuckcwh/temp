import React, { Component } from 'react';
import AdminCases from '../../components/AdminCases';
import AdminCasesView from '../../components/AdminCases/AdminCasesView/AdminCasesView';


export default class extends Component {

  componentDidMount() {
    document.title = 'eBeeCare | Case Manage';
  }

  render() {
    const { view } = this.props.params;

    let content;

    if (view) {
      content = (<AdminCasesView {...this.props} />)
    } else {
      content = (<AdminCases {...this.props} />)
    }

    return (
      <div>{content}</div>
    );
  }

}
