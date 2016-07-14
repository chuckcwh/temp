import React, { Component } from 'react';
import s from './Download.css';
import Container from '../Container';

export default class Download extends Component {

  render() {
    return (
      <div className={s.download}>
        <Container>
          <div className={s.downloadList}>
            <div className={s.downloadItem}>
              <img src={require('./download-illustration.jpg')} className={s.downloadItemImage} />
            </div>
            <div className={s.downloadItem}>
              <h1 className="text-center">Download eBeeCare App</h1>
              <div className={s.downloadItemContent}>
                <a href="https://itunes.apple.com/sg/app/ebeecare/id1063929569" className={s.downloadItemStoreLink}><img src={require('./download-ios.png')} className={s.downloadItemStore} /></a>
                <a href="https://play.google.com/store/apps/details?id=com.ebeecare.app" className={s.downloadItemStoreLink}><img src={require('./download-android.png')} className={s.downloadItemStore} /></a>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

}
