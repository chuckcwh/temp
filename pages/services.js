import React, { Component } from 'react';
import Services from '../components/Services';

export default class extends Component {

  render() {
    return (
      <div>
        <Services {...this.props} />
      </div>
    );
  }

}
