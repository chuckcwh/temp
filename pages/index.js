import React, { Component } from 'react';
import Home from '../components/Home';

class HomePage extends Component {

  componentDidMount() {
    document.title = 'eBeeCare | Home';
  }

  render() {
    return (
      <Home />
    );
  }

}

export default HomePage;
