import React, { Component } from 'react';
import classNames from 'classnames';
import './BookingPostNavigation.scss';
import Container from '../Container';
import Link from '../Link';
import BookingActions from '../../actions/BookingActions';

export default class BookingPostNavigation extends Component {

  render() {
    return (
      <div className="BookingPostNavigation-wrapper">
        <Container>
          <ul className="BookingPostNavigation">
            <li className="BookingPostNavigation-item">
              <a className={classNames('BookingPostNavigation-link', (this.props.path === '/booking-confirmation' && this.props.postStatus === 'confirmation') ? 'active' : '')} href="#" onClick={this._onClick.bind(this)}>
                <div className="BookingPostNavigation-item-icon">1</div>
                <span className="BookingPostNavigation-item-text">Booking Confirmation</span>
              </a>
            </li>
            <li className="BookingPostNavigation-item">
              <span className={classNames('BookingPostNavigation-link', (this.props.path === '/booking-confirmation' && this.props.postStatus.indexOf('payment') > -1) ? 'active' : '')}>
                <div className="BookingPostNavigation-item-icon">2</div>
                <span className="BookingPostNavigation-item-text">Booking Payment</span>
              </span>
            </li>
          </ul>
        </Container>
      </div>
    );
  }

  _onClick(event) {
    event.preventDefault();

    BookingActions.setPostStatus('confirmation');
  }

}
