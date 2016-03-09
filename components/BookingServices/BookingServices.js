import React, { Component } from 'react';
import classNames from 'classNames';
import FaSpinner from 'react-icons/lib/fa/spinner';
import Loader from 'react-loader';
import './BookingServices.scss';
import Container from '../Container';
import Link from '../Link';
import BookingActions from '../../actions/BookingActions';

const ALL_SERVICES = 'All Services';

export default class BookingServices extends Component {

  constructor(props) {
    super(props);
    this.state = {
      filter: ALL_SERVICES,
      selectedService: undefined
    };
    if (this.props.booking && this.props.booking.service)
      this.state.selectedService = this.props.booking.service;
  }

  render() {
    return (
      <div className="BookingServices">
        <Loader className="spinner" loaded={this.props.allServices ? true : false}>
          <div className="BookingServicesNav-wrapper">
            <Container>
              <ul className="BookingServicesNav">
                <li className="BookingServicesNav-item">
                  <a className={classNames('BookingServicesNav-link', (this.state.filter === ALL_SERVICES) ? 'active' : '')} href="/" onClick={this._onClickFilter.bind(this, ALL_SERVICES)}>All Services<span className="BookingServicesNav-arrow"><div className="nav-caret"></div></span></a>
                </li>
                <li className="BookingServicesNav-item">
                  <a className={classNames('BookingServicesNav-link', (this.state.filter === 'Home Nursing') ? 'active' : '')} href="/about" onClick={this._onClickFilter.bind(this, 'Home Nursing')}>Home Nursing<span className="BookingServicesNav-arrow"><div className="nav-caret"></div></span></a>
                </li>
                <li className="BookingServicesNav-item">
                  <a className={classNames('BookingServicesNav-link', (this.state.filter === 'Home TCM') ? 'active' : '')} href="/faq" onClick={this._onClickFilter.bind(this, 'Home TCM')}>Home TCM<span className="BookingServicesNav-arrow"><div className="nav-caret"></div></span></a>
                </li>
                <li className="BookingServicesNav-item">
                  <a className={classNames('BookingServicesNav-link', (this.state.filter === 'Home Care') ? 'active' : '')} href="/faq" onClick={this._onClickFilter.bind(this, 'Home Care')}>Home Care<span className="BookingServicesNav-arrow"><div className="nav-caret"></div></span></a>
                </li>
                <li className="BookingServicesNav-item">
                  <a className={classNames('BookingServicesNav-link', (this.state.filter === 'Home Medical') ? 'active' : '')} href="/faq" onClick={this._onClickFilter.bind(this, 'Home Medical')}>Home Medical<span className="BookingServicesNav-arrow"><div className="nav-caret"></div></span></a>
                </li>
              </ul>
            </Container>
          </div>
          <div>
            <Container>
              <div className="BookingServicesBody">
                <form id="BookingServicesForm">
                {
                  this.props.allServices && this._filterServices(this.props.allServices, this.state.filter).map(service => {
                    var id = "BookingServicesRadio" + service.id;
                    return (
                      <div className="BookingServicesItem" key={service.id}>
                        <input className="BookingServicesRadio" type="radio" id={id} name="service" value={service.id} checked={service.id === this.state.selectedService} onChange={this._onSelect.bind(this)} required />
                        <label className="BookingServicesRadioLabel" htmlFor={id}>
                          <span><span></span></span><span>{service.name}</span>
                        </label>
                      </div>
                    );
                  })
                }
                </form>
              </div>
              <div className="BookingServicesFooter">
                <a href="/booking2" className="btn btn-primary" onClick={this._onNext.bind(this)}>NEXT</a>
              </div>
            </Container>
          </div>
        </Loader>
      </div>
    );
  }

  _onClickFilter(filter, event) {
    event.preventDefault();

    this.setState({
      filter: filter
    });
  }

  _onSelect(event) {
    this.setState({
      selectedService: parseInt(event.target.value)
    });
  }

  _onNext(event) {
    var form = document.getElementById('BookingServicesForm');
    if (form.checkValidity()) {
      Link.handleClick(event);
      BookingActions.setService(this.state.selectedService);
      BookingActions.setLast('booking1');
    } else {
      event.preventDefault();
      alert('Please select a service');
    }
  }

  _filterServices(services, filter) {
    return services.filter(function(service) {
      if (filter === ALL_SERVICES) return true;
      return service.category === filter;
    }).sort(function(a, b) {
      return a.name.localeCompare(b.name);
    });
  }

}
