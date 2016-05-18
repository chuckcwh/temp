import React, { Component } from 'react';
import request from 'superagent';
import './Actions.scss';
import Container from '../Container';
import Link from '../Link';
import Util from '../../core/Util';

export default class Actions extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sessionsCount: undefined
    }
  }

  componentDidMount() {
    // this._startCounter();
  }

  componentWillUnmount() {
    this.serverRequest1 && this.serverRequest1.abort();
  }

  render() {
    var sessionsCountText;
    if (this.state.sessionsCount) {
      sessionsCountText = (
        <h1 className="text-center">
          <span className="lead">{this.state.sessionsCount}</span><br />APPOINTMENTS BOOKED!
        </h1>
      );
    }
    return (
      <div className="Actions">
        <Container>
          <div className="Actions-statistics">
            {sessionsCountText}
          </div>
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
                <a href="#" className="btn Actions-item-button" onClick={(e) => {e.preventDefault()}}>6514 9729</a>
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
    this.serverRequest1 = request
      .get(Util.host + '/api/getTotalSessionsCount')
      .auth(Util.authKey, Util.authSecret)
      .end((err, res) => {
        if (err) {
          return console.error(Util.host + '/api/getTotalSessionsCount', err.toString());
        }
        // console.log(res.body);
        if (res.body && res.body.status) {
          this.setState({
            sessionsCount: res.body.count
          });
        } else {
          console.error('Failed to obtain statistics data.');
        }
      });
  }

}
