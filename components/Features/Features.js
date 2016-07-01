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
                <div>Only qualified caregivers are invited to our interview workshop. We also allocate them into different specialities; wound care, dementia care &  etc.</div>
              </div>
            </div>
            <div className="Features-item">
              <div className="Features-item-left">
                <img src={require('./features-2.png')} className="Features-item-icon" />
              </div>
              <div className="Features-item-right">
                <div className="Features-item-title">Certification</div>
                <div className="Features-item-description">Our caregivers are certified by Singapore Nursing Board, Singapore Allied Health Professions Council and Traditional Chinese Medicine Practitioners Board.</div>
              </div>
            </div>
            <div className="Features-item">
              <div className="Features-item-left">
                <img src={require('./features-3.png')} className="Features-item-icon" />
              </div>
              <div className="Features-item-right">
                <div className="Features-item-title">Experience</div>
                <div className="Features-item-description">We ensure that all of our caregivers have minimum of 2 years experience with specialties they are assigned to. Some goes to 20 years!</div>
              </div>
            </div>
            <div className="Features-item">
              <div className="Features-item-left">
                <img src={require('./features-4.png')} className="Features-item-icon" />
              </div>
              <div className="Features-item-right">
                <div className="Features-item-title">Affordable Quality</div>
                <div className="Features-item-description">No more high agency fee, no more unnecessary travel. Our qualified caregivers work directly with patients, ensuring personalized care in their homes.</div>
              </div>
            </div>
            <div className="Features-item">
              <div className="Features-item-left">
                <img src={require('./features-5.png')} className="Features-item-icon" />
              </div>
              <div className="Features-item-right">
                <div className="Features-item-title">Convenience</div>
                <div className="Features-item-description">No minimum hours required. 24 hours booking. We also provide caregivers who speak your language to take care of you at your comfort home.</div>
              </div>
            </div>
            <div className="Features-item">
              <div className="Features-item-left">
                <img src={require('./features-6.png')} className="Features-item-icon" />
              </div>
              <div className="Features-item-right">
                <div className="Features-item-title">Safety Assurance</div>
                <div className="Features-item-description">Each service is Insurance protected.</div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

}
