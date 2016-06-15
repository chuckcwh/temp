import React, { Component } from 'react';
import Banner from '../components/Banner';
import Features from '../components/Features';
import Actions from '../components/Actions';
import Testimonials from '../components/Testimonials';
import Download from '../components/Download';

export default class extends Component {

  render() {
    return (
      <div>
        <Banner location={this.props.location} />
        <Testimonials />
        <Features />
        <Actions />
        <Download />
      </div>
    );
  }

}
