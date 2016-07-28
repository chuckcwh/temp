import React from 'react';
import s from './Download.css';
import Container from '../Container';

const imgIllustration = require('./download-illustration.jpg');
const imgIOS = require('./download-ios.png');
const imgAndroid = require('./download-android.png');

const Download = () => (
  <div className={s.download}>
    <Container>
      <div className={s.downloadList}>
        <div className={s.downloadItem}>
          <img src={imgIllustration} className={s.downloadItemImage} alt="eBeeCare App" />
        </div>
        <div className={s.downloadItem}>
          <h1 className="text-center">Download eBeeCare App</h1>
          <div className={s.downloadItemContent}>
            <a href="https://itunes.apple.com/sg/app/ebeecare/id1063929569" className={s.downloadItemStoreLink}>
              <img src={imgIOS} className={s.downloadItemStore} alt="Available on the App Store" />
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.ebeecare.app" className={s.downloadItemStoreLink}>
              <img src={imgAndroid} className={s.downloadItemStore} alt="Get it on Google play" />
            </a>
          </div>
        </div>
      </div>
    </Container>
  </div>
);

export default Download;
