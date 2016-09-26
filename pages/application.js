import React, { Component } from 'react';
import ApplicationsView from '../components/ApplicationsView';

export default class extends Component {

  componentDidMount() {
    document.title = 'eBeeCare | View Case';
  }

  render() {
    return (
      <div>
        <ApplicationsView params={this.props.params} />
      </div>
    );
  }
}
