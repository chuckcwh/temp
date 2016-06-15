import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Actions.scss';
import Container from '../Container';
import Link from '../Link';
import { getTotalSessionsCount } from '../../actions';
import Util from '../../core/Util';

class Actions extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sessionsCount: undefined
    }
  }

  componentDidMount() {
    // this._startCounter();
  }

  render() {
    var sessionsCountText;
    if (this.props.totalSessionsCount) {
      sessionsCountText = (
        <h1 className="text-center">
          <span className="lead">{this.props.totalSessionsCount}</span><br />APPOINTMENTS BOOKED!
        </h1>
      );
    }
    return (
      <div className="Actions">
        <Container>
          {/*<div className="Actions-statistics">
            {sessionsCountText}
          </div>*/}
          <div className="Actions-list">
            <div className="Actions-item">
              <img src={require('./actions-1.png')} />
              {/*<div className="Actions-item-title">Book A Caregiver Online</div>*/}
              <div>
                <a href="/booking1" className="btn Actions-item-button" onClick={Link.handleClick}>Find A Caregiver</a>
              </div>
            </div>
            <div className="Actions-item">
              <img src={require('./actions-2.png')} />
              {/*<div className="Actions-item-title">Call Ebeecare Hotline</div>*/}
              <div>
                <a href="#" className="btn Actions-item-button" onClick={this._handleContactUs.bind(this)}>Contact Us</a>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  _startCounter() {
    if (typeof window !== 'undefined') {
      if (window.location.hostname.indexOf('localhost') > -1) {
        // just retrieve once only during development, to prevent annoying multiple GET requests
        this._getStatistics();
      } else {
        window.setInterval(this._getStatistics.bind(this), 5000);
      }
    }
  }

  _getStatistics() {
    this.props.getTotalSessionsCount().then((res) => {
      if (res.response && res.response.status < 1) {
        console.error('Failed to obtain statistics data.');
      }
    });
  }

  _handleContactUs(event) {
    event.preventDefault();

    typeof window !== 'undefined' && window.Tawk_API && window.Tawk_API.toggle();
  }

}
const mapStateToProps = (state) => {
  return {
    totalSessionsCount: state.totalSessionsCount.data
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getTotalSessionsCount: () => {
      return dispatch(getTotalSessionsCount());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Actions);
