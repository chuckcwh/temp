import React, { Component } from 'react';
import classNames from 'classNames';
import './BookingServices.scss';
import Container from '../Container';
import Link from '../Link';
import BookingStore from '../../stores/BookingStore';

export default class BookingServices extends Component {

  constructor(props) {
    super(props);
    this.state = {
      services: undefined,
      filter: 'All'
    };
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
          console.log(this.state.services);
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
    if (!this.state.services) return null;
    return (
      <div className="BookingServices">
        <div className="BookingServicesNav-wrapper">
          <Container>
            <ul className="BookingServicesNav">
              <li className="BookingServicesNav-item">
                <a className={classNames('BookingServicesNav-link', (this.state.filter === 'All') ? 'active' : '')} href="/" onClick={this._onClickFilter.bind(this, 'All')}>All Services</a>
              </li>
              <li className="BookingServicesNav-item">
                <a className={classNames('BookingServicesNav-link', (this.state.filter === 'Home Nursing') ? 'active' : '')} href="/about" onClick={this._onClickFilter.bind(this, 'Home Nursing')}>Home Nursing</a>
              </li>
              <li className="BookingServicesNav-item">
                <a className={classNames('BookingServicesNav-link', (this.state.filter === 'Home TCM') ? 'active' : '')} href="/faq" onClick={this._onClickFilter.bind(this, 'Home TCM')}>Home TCM</a>
              </li>
              <li className="BookingServicesNav-item">
                <a className={classNames('BookingServicesNav-link', (this.state.filter === 'Home Care') ? 'active' : '')} href="/faq" onClick={this._onClickFilter.bind(this, 'Home Care')}>Home Care</a>
              </li>
              <li className="BookingServicesNav-item">
                <a className={classNames('BookingServicesNav-link', (this.state.filter === 'Home Medical') ? 'active' : '')} href="/faq" onClick={this._onClickFilter.bind(this, 'Home Medical')}>Home Medical</a>
              </li>
            </ul>
          </Container>
        </div>
        <div>
          <Container>
            <div className="BookingServicesBody">
            {
              this.state.services && this.state.services.map(function(service) {
                var id = "BookingServicesRadio" + service.id;
                return <div className="BookingServicesItem" key={service.id}><input className="BookingServicesRadio" type="radio" id={id} name="service" value={service.id}/><label className="BookingServicesRadioLabel" htmlFor={id}><span><span></span></span><span>{service.name}</span></label></div>
              })
            }
              {/*}
              <li className="BookingServicesNav-item">
                <a className={classNames('BookingServicesNav-link', (this.state.filter === '/') ? 'active' : '')} href="/" onClick={Link.handleClick}>{service.name}</a>
              </li>
              */}
            </div>
            <div className="BookingServicesFooter">
              <a href="/booking1" className="btn btn-primary">NEXT</a>
            </div>
          </Container>
        </div>
      </div>
    );
  }

  _onClickFilter(filter, event) {
    event.preventDefault();
    
    this.setState({filter: filter});
  }

  _onNext() {

  }

}
