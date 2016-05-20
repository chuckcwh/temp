import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import './BookingPostNavigation.scss';
import Container from '../Container';
import Link from '../Link';
import { setPostStatus } from '../../actions';

class BookingPostNavigation extends Component {

  render() {
    const { location, postStatus } = this.props;
    return (
      <div className="BookingPostNavigation-wrapper">
        <Container>
          <ul className="BookingPostNavigation">
            <li className="BookingPostNavigation-item">
              <a className={classNames('BookingPostNavigation-link', (location && location.pathname === '/booking-confirmation' && postStatus === 'confirmation') ? 'active' : '')} href="#" onClick={this._onClick.bind(this)}>
                <div className="BookingPostNavigation-item-icon">1</div>
                <span className="BookingPostNavigation-item-text">Booking Confirmation</span>
              </a>
            </li>
            <li className="BookingPostNavigation-item">
              <span className={classNames('BookingPostNavigation-link', (location && location.pathname === '/booking-confirmation' && postStatus.indexOf('payment') > -1) ? 'active' : '')}>
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

    this.props.setPostStatus('confirmation');
  }

}

const mapStateToProps = (state) => {
  return {
    location: state.router && state.router.location,
    postStatus: state.postStatus
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setPostStatus: (status) => {
      return dispatch(setPostStatus(status));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingPostNavigation);
