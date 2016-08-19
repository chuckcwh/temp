import React, { Component } from 'react';
import Profile from '../components/Profile';

export default class extends Component {

  componentDidMount() {
    document.title = 'eBeeCare | Profile';
  }

  render() {
    return (
      <Profile {...this.props}/>
    );
  }

}
