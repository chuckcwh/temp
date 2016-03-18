import React, { Component } from 'react';
import './Actions.scss';
import Container from '../Container';
import Link from '../Link';

export default class Features extends Component {

  render() {
    return (
      <div className="Actions">
        <Container>
          <div className="Actions-list">
            <div className="Actions-item">
              <img src={require('./actions-1.png')} />
              <div className="Actions-item-title">Book A Caregiver Online</div>
              <div>
                <a href="/booking1" className="btn Actions-item-button" onClick={Link.handleClick}>Book A Caregiver</a>
              </div>
            </div>
            <div className="Actions-item">
              <img src={require('./actions-2.png')} />
              <div className="Actions-item-title">Call Ebeecare Hotline</div>
              <div>
                <a href="#" className="btn Actions-item-button" onClick={(e) => {e.preventDefault()}}>9733 6938</a>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

}
