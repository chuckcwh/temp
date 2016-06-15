import React, { Component } from 'react';
import './Features.scss';
import Container from '../Container';

export default class Features extends Component {

  render() {
    return (
      <div className="Features">
        <Container>
          <h1 className="text-center">Quality & Trust</h1>
          <p className="text-center featured">eBeeCare is the largest online local home healthcare provider in Singapore. Since 2015 our caregivers have provided over 50,000 hours of care for patients... and they are ready to serve you!</p>
          <div className="Features-list">
            <div className="Features-item">
              <img src={require('./features-1.png')} className="Features-item-icon" />
              <div className="Features-item-title">Short-hours care</div>
              <div>No minimum hours required!</div>
            </div>
            <div className="Features-item">
              <img src={require('./features-2.png')} className="Features-item-icon" />
              <div className="Features-item-title">Hassle-Free</div>
              <div>Let us handle the coordination for you!</div>
            </div>
            <div className="Features-item">
              <img src={require('./features-3.png')} className="Features-item-icon" />
              <div className="Features-item-title">Customised Care</div>
              <div>Every patient has different needs</div>
            </div>
            <div className="Features-item">
              <img src={require('./features-4.png')} className="Features-item-icon" />
              <div className="Features-item-title">Verified Caregivers</div>
              <div>By both eBeeCare and community</div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

}
