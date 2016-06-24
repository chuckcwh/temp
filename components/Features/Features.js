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
                <div>Only qualified caregivers are invited to our interview workshop. Besides verifying their qualification and experience, we also allocate them into different specialities, like wound care, dementia care speciality etc.</div>
              </div>
            </div>
            <div className="Features-item">
              <div className="Features-item-left">
                <img src={require('./features-2.png')} className="Features-item-icon" />
              </div>
              <div className="Features-item-right">
                <div className="Features-item-title">Certification</div>
                <div>Our caregivers are certified by Singapore Nursing Board, Singapore Allied Health Professions Council and Traditional Chinese Medicine Practitioners Board.</div>
              </div>
            </div>
            <div className="Features-item">
              <div className="Features-item-left">
                <img src={require('./features-3.png')} className="Features-item-icon" />
              </div>
              <div className="Features-item-right">
                <div className="Features-item-title">Experience</div>
                <div>All caregivers have 2 - 20 years of relevant experience.</div>
              </div>
            </div>
            <div className="Features-item">
              <div className="Features-item-left">
                <img src={require('./features-4.png')} className="Features-item-icon" />
              </div>
              <div className="Features-item-right">
                <div className="Features-item-title">Affordable Quality</div>
                <div>No more high agency fee, no more unnecessary travel. Our qualified caregivers work directly with patients, ensuring personalized care in their homes.</div>
              </div>
            </div>
            <div className="Features-item">
              <div className="Features-item-left">
                <img src={require('./features-5.png')} className="Features-item-icon" />
              </div>
              <div className="Features-item-right">
                <div className="Features-item-title">Convenience</div>
                <div>No minimum hours required. 24 hours booking. Caregivers who speak your language.</div>
              </div>
            </div>
            <div className="Features-item">
              <div className="Features-item-left">
                <img src={require('./features-6.png')} className="Features-item-icon" />
              </div>
              <div className="Features-item-right">
                <div className="Features-item-title">Safety Assurance</div>
                <div>Each service is Insurance protected.</div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

}
