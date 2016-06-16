import React, { Component } from 'react';
import Banner from '../components/Banner';
import Popular from '../components/Popular';
import Partners from '../components/Partners';
import Testimonials from '../components/Testimonials';
import Features from '../components/Features';
import Actions from '../components/Actions';
import Download from '../components/Download';

export default class extends Component {

  render() {
    return (
      <div>
        <Banner location={this.props.location} />
        <Popular />
        <Partners />
        <Testimonials location={this.props.location} />
        <Features />
        <Actions />
        <Download />
      </div>
    );
  }

}
