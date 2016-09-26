import React, { Component } from 'react';
import SessionsView from '../components/SessionsView';

export default class extends Component {

  componentDidMount() {
    document.title = 'eBeeCare | View Session';
  }

  render() {
    return (
      <div>
        <SessionsView params={this.props.params} />
      </div>
    );
  }
}
