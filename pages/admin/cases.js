import React, { Component } from 'react';
import AdminCases from '../../components/AdminCases';
import AdminCasesEditForm from '../../components/AdminCases/AdminCasesEditForm/AdminCasesEditForm';


export default class extends Component {

  componentDidMount() {
    document.title = 'eBeeCare | Case Manage';
  }

  render() {
    const { view } = this.props.params;

    let content;

    if (view) {
      content = (<AdminCasesEditForm {...this.props} />)
    } else {
      content = (<AdminCases {...this.props} />)
    }

    return (
      <div>{content}</div>
    );
  }

}
