import React, { Component } from 'react';
import s from './Actions.css';
import Container from '../Container';
import Link from '../Link';

const imgActions1 = require('./actions-1.png');
const imgActions2 = require('./actions-2.png');

class Actions extends Component {

  handleContactUs = (event) => {
    event.preventDefault();

    typeof window !== 'undefined' && window.Tawk_API && window.Tawk_API.toggle();
  };

  render() {
    return (
      <div className={s.actions}>
        <Container>
          <div className={s.actionsList}>
            <div className={s.actionsItem}>
              <img src={imgActions1} alt="Find A Caregiver" />
              {/* <div className="Actions-item-title">Book A Caregiver Online</div> */}
              <div className={s.actionsButton}>
                <Link to="/booking1" className={s.actionsItemButton}>Find A Caregiver</Link>
              </div>
            </div>
            <div className={s.actionsItem}>
              <img src={imgActions2} alt="Contact Us" />
              {/* <div className="Actions-item-title">Call Ebeecare Hotline</div> */}
              <div className={s.actionsButton}>
                <a href="#" className={s.actionsItemButton} onClick={this.handleContactUs}>Contact Us</a>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

}

export default Actions;
