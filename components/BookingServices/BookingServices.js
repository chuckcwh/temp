import React, { Component } from 'react';
import classNames from 'classNames';
import './BookingServices.scss';
import Container from '../Container';
import Link from '../Link';
import BookingStore from '../../stores/BookingStore';

export default class BookingServices extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.serverRequest = $.ajax({
      url: 'http://161.202.19.121/api/getServices',
      dataType: 'json',
      headers: {
        'Authorization': 'Basic ' + btoa('secret:secret0nlyWeilsonKnowsShhh852~')
      },
      success: data => {
        if (data && data.services) {
          this.setState({services: data.services});
        } else {
          console.error('Services data not obtained');
        }
      },
      error: (xhr, status, err) => {
        console.error('http://161.202.19.121/api/getServices', status, err.toString());
      }
    });
  }

  componentWillUnmount() {
    this.serverRequest.abort();
  }

  render() {
    return (
      <div className="BookingServices">
        <div className="BookingServicesNav-wrapper">
          <Container>
            <ul className="BookingServicesNav">
              <li className="BookingServicesNav-item">
                <a className={classNames('BookingServicesNav-link', (this.props.path === '/') ? 'active' : '')} href="/" onClick={Link.handleClick}>All Services</a>
              </li>
              <li className="BookingServicesNav-item">
                <a className={classNames('BookingServicesNav-link', (this.props.path === '/about') ? 'active' : '')} href="/about" onClick={Link.handleClick}>Home Nursing</a>
              </li>
              <li className="BookingServicesNav-item">
                <a className={classNames('BookingServicesNav-link', (this.props.path === '/faq') ? 'active' : '')} href="/faq" onClick={Link.handleClick}>Home TCM</a>
              </li>
              <li className="BookingServicesNav-item">
                <a className={classNames('BookingServicesNav-link', (this.props.path === '/faq') ? 'active' : '')} href="/faq" onClick={Link.handleClick}>Home Care</a>
              </li>
              <li className="BookingServicesNav-item">
                <a className={classNames('BookingServicesNav-link', (this.props.path === '/faq') ? 'active' : '')} href="/faq" onClick={Link.handleClick}>Home Medical</a>
              </li>
            </ul>
          </Container>
        </div>
      </div>
    );
  }

  _onNext() {

  }

}
