import React, { Component } from 'react';
import Banner from '../components/Banner/Banner';
import Features from '../components/Features/Features';
import Actions from '../components/Actions/Actions';
import Testimonials from '../components/Testimonials/Testimonials';

export default class extends Component {

  render() {
    return (
      <div>
        <Banner location={this.props.location} />
        <Features />
        <Actions />
        <Testimonials />
      </div>
    );
  }

}
