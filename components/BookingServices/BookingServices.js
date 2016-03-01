import React, { Component } from 'react';
import classNames from 'classNames';
import './BookingServices.scss';
import Container from '../Container';
import Link from '../Link';
import BookingActions from '../../actions/BookingActions';
import BookingStore from '../../stores/BookingStore';

const ALL_SERVICES = 'All Services';

export default class BookingServices extends Component {

  constructor(props) {
    super(props);
    this.state = {
      filter: ALL_SERVICES,
      selectedService: undefined
    };
  }

  render() {
    if (!this.props.allServices) return null;

    var filteredServices = this._filterServices(this.props.allServices, this.state.filter);

    return (
      <div className="BookingServices">
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
            {
              filteredServices.map(service => {
                var id = "BookingServicesRadio" + service.id;
                return <div className="BookingServicesItem" key={service.id}><input className="BookingServicesRadio" type="radio" id={id} name="service" value={service.id} checked={service.id === this.state.selectedService} onChange={this._onSelect.bind(this)} /><label className="BookingServicesRadioLabel" htmlFor={id}><span><span></span></span><span>{service.name}</span></label></div>
              })
            }
              {/*}
              <li className="BookingServicesNav-item">
                <a className={classNames('BookingServicesNav-link', (this.state.filter === '/') ? 'active' : '')} href="/" onClick={Link.handleClick}>{service.name}</a>
              </li>
              */}
            </div>
            <div className="BookingServicesFooter">
              <a href="/booking2" className="btn btn-primary" onClick={this._onNext.bind(this)}>NEXT</a>
            </div>
          </Container>
        </div>
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
    Link.handleClick(event);

    this.props.query.service = this.state.selectedService;
    // BookingActions.setService(this.state.selectedService);
  }

  _filterServices(services, filter) {
    return services.filter(function(service) {
      if (filter === ALL_SERVICES) return true;
      return service.category === filter;
    });
  }

}
