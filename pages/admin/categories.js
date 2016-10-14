import React, { Component } from 'react';
import AdminCategories from '../../components/AdminCategories';

export default class extends Component {

  componentDidMount() {
    document.title = 'eBeeCare | Category Manage';
  }

  render() {
    return (
      <AdminCategories {...this.props}/>
    );
  }

}
