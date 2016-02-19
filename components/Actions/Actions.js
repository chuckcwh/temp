import React, { Component } from 'react';
import './Actions.scss';
import Container from '../Container';

export default class Features extends Component {

  render() {
    return (
      <div className="Actions">
        <Container>
          <div className="Actions-list">
            <div className="Actions-item">
              <img src={require('./actions-1.png')} />
              <div className="Actions-item-title">Book A Caregiver Online</div>
              <a href="" className="btn Actions-item-button">Book A Caregiver</a>
            </div>
            <div className="Actions-item">
              <img src={require('./actions-2.png')} />
              <div className="Actions-item-title">Call Ebeecare Hotline</div>
              <a href="#" className="btn Actions-item-button" disabled={true}>9733 6938</a>
            </div>
          </div>
        </Container>
      </div>
    );
  }

}
