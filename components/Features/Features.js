import React, { Component } from 'react';
import './Features.scss';
import Container from '../Container';

export default class Features extends Component {

  render() {
    return (
      <div className="Features">
        <Container>
          <h1 className="text-center">A family caregiver for every needing family</h1>
          <p className="text-center featured">As caregivers ourselves, we understand the stress and urgency involved, often in the busiest period of the day in the mornings. Let our healthcare professionals assist you in reducing your load and in supporting you to get your loved ones ready to start the day!</p>
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
