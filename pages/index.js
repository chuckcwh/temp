import React, { Component } from 'react';
import Banner from '../components/Banner';
import Popular from '../components/Popular';
import Partners from '../components/Partners';
import Testimonials from '../components/Testimonials';
import Features from '../components/Features';
import Actions from '../components/Actions';
import Download from '../components/Download';
import AlertPopup from '../components/AlertPopup';

class HomePage extends Component {

  componentDidMount() {
    document.title = 'eBeeCare | Home';
  }

  render() {
    return (
      <div>
        <Banner />
        <Popular />
        <Partners />
        <Testimonials />
        <Features />
        <Actions />
        <Download />
        <AlertPopup />
      </div>
    );
  }

}

export default HomePage;
