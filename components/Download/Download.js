import React, { Component } from 'react';
import './Download.scss';
import Container from '../Container';

export default class Download extends Component {

  render() {
    return (
      <div className="Download">
        <Container>
          <div className="Download-list">
            <div className="Download-item">
              <img src={require('./download-illustration.jpg')} className="Download-item-image" />
            </div>
            <div className="Download-item">
              <h1 className="text-center">Download eBeeCare App</h1>
              <div className="Download-item-content">
                <a href="https://itunes.apple.com/sg/app/ebeecare/id1063929569" className="Download-item-store-link"><img src={require('./download-ios.png')} className="Download-item-store" /></a>
                <a href="https://play.google.com/store/apps/details?id=com.ebeecare.app" className="Download-item-store-link"><img src={require('./download-android.png')} className="Download-item-store" /></a>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

}
