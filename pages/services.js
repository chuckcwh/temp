import React, { Component } from 'react';
import Services from '../components/Services';

class ServicesPage extends Component {

  componentDidMount() {
    document.title = 'eBeeCare | Services';
  }

  render() {
    return (
      <div>
        <Services {...this.props} />
      </div>
    );
  }

}

export default ServicesPage;
