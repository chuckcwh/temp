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
              <div className="Features-item-left">
                <img src={require('./features-1.png')} className="Features-item-icon" />
              </div>
              <div className="Features-item-right">
                <div className="Features-item-title">Interview</div>
                <div>By both eBeeCare and community</div>
              </div>
            </div>
            <div className="Features-item">
              <div className="Features-item-left">
                <img src={require('./features-2.png')} className="Features-item-icon" />
              </div>
              <div className="Features-item-right">
                <div className="Features-item-title">Certification</div>
                <div>By both eBeeCare and community</div>
              </div>
            </div>
            <div className="Features-item">
              <div className="Features-item-left">
                <img src={require('./features-3.png')} className="Features-item-icon" />
              </div>
              <div className="Features-item-right">
                <div className="Features-item-title">Experience</div>
                <div>By both eBeeCare and community</div>
              </div>
            </div>
            <div className="Features-item">
              <div className="Features-item-left">
                <img src={require('./features-4.png')} className="Features-item-icon" />
              </div>
              <div className="Features-item-right">
                <div className="Features-item-title">Affordable Quality</div>
                <div>Every patient has different needs</div>
              </div>
            </div>
            <div className="Features-item">
              <div className="Features-item-left">
                <img src={require('./features-5.png')} className="Features-item-icon" />
              </div>
              <div className="Features-item-right">
                <div className="Features-item-title">Convenience</div>
                <div>No minimum hours required!</div>
              </div>
            </div>
            <div className="Features-item">
              <div className="Features-item-left">
                <img src={require('./features-6.png')} className="Features-item-icon" />
              </div>
              <div className="Features-item-right">
                <div className="Features-item-title">Safety Assurance</div>
                <div>Let us handle the coordination for you!</div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

}
