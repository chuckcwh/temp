import React, { Component } from 'react';
import s from './Features.css';
import Container from '../Container';

export default class Features extends Component {

  render() {
    return (
      <div className={s.features}>
        <Container>
          <h1 className="text-center">Quality & Trust</h1>
          <p className="text-center featured">eBeeCare is the largest online home health care provider in Singapore. Since 2015 our caregivers have provided over 2000 home care visits for patients … and they are ready to serve you!</p>
          <div className={s.featuresList}>
            <div className={s.featuresItem}>
              <div className={s.featuresItemLeft}>
                <img src={require('./features-1.png')} className={s.featuresItemIcon} />
              </div>
              <div className={s.featuresItemRight}>
                <div className={s.featuresItemTitle}>Interview</div>
                <div>Only qualified caregivers are invited to our interview workshop. We also allocate them into different specialities; wound care, dementia care, etc.</div>
              </div>
            </div>
            <div className={s.featuresItem}>
              <div className={s.featuresItemLeft}>
                <img src={require('./features-2.png')} className={s.featuresItemIcon} />
              </div>
              <div className={s.featuresItemRight}>
                <div className={s.featuresItemTitle}>Certification</div>
                <div className={s.featuresItemDescription}>Our caregivers are certified by Singapore Nursing Board, Singapore Allied Health Professions Council and Traditional Chinese Medicine Practitioners Board.</div>
              </div>
            </div>
            <div className={s.featuresItem}>
              <div className={s.featuresItemLeft}>
                <img src={require('./features-3.png')} className={s.featuresItemIcon} />
              </div>
              <div className={s.featuresItemRight}>
                <div className={s.featuresItemTitle}>Experience</div>
                <div className={s.featuresItemDescription}>We ensure that all of our caregivers have minimum of 2 years experience with specialties they are assigned to. Some goes to 20 years!</div>
              </div>
            </div>
            <div className={s.featuresItem}>
              <div className={s.featuresItemLeft}>
                <img src={require('./features-4.png')} className={s.featuresItemIcon} />
              </div>
              <div className={s.featuresItemRight}>
                <div className={s.featuresItemTitle}>Affordable Quality</div>
                <div className={s.featuresItemDescription}>No more high agency fee, no more unnecessary travel. Our qualified caregivers work directly with patients, ensuring personalized care in their homes.</div>
              </div>
            </div>
            <div className={s.featuresItem}>
              <div className={s.featuresItemLeft}>
                <img src={require('./features-5.png')} className={s.featuresItemIcon} />
              </div>
              <div className={s.featuresItemRight}>
                <div className={s.featuresItemTitle}>Convenience</div>
                <div className={s.featuresItemDescription}>No minimum hours required. 24 hours booking. We also provide caregivers who speak your language to take care of you at your comfort home.</div>
              </div>
            </div>
            <div className={s.featuresItem}>
              <div className={s.featuresItemLeft}>
                <img src={require('./features-6.png')} className={s.featuresItemIcon} />
              </div>
              <div className={s.featuresItemRight}>
                <div className={s.featuresItemTitle}>Safety Assurance</div>
                <div className={s.featuresItemDescription}>Each service is insurance protected.</div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

}
