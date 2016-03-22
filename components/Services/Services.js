import React, { Component } from 'react';
import classNames from 'classNames';
import FaSpinner from 'react-icons/lib/fa/spinner';
import Loader from 'react-loader';
import { Accordion, AccordionItem } from 'react-sanfona';
import request from 'superagent';
import './Services.scss';
import Container from '../Container';
import Link from '../Link';
import AlertPopup from '../AlertPopup';
import BookingActions from '../../actions/BookingActions';
import Location from '../../lib/Location';
import Util from '../../lib/Util';

const ALL_SERVICES = 'All Services';

export default class Services extends Component {

  constructor(props) {
    super(props);
    this.state = {
      services: undefined,
      filter: ALL_SERVICES,
      selectedService: undefined
    };
  }

  componentDidMount() {
    if (!this.state.services) {
      this.serverRequest1 = request
        .get(Util.host + '/api/getServices')
        .auth(Util.authKey, Util.authSecret)
        .end((err, res) => {
          if (err) {
            return console.error(Util.host + '/api/getServices', err.toString());
          }
          if (res.body && res.body.services && Array.isArray(res.body.services)) {
            // console.log(res.body.services);
            this.setState({
              services: res.body.services
            });
          } else {
            console.error('Failed to obtain services data.');
          }
        });
    }
  }

  componentWillUnmount() {
    this.serverRequest1 && this.serverRequest1.abort();
  }

  render() {
    return (
      <div className="Services">
        <Container>
          <div>
            <h1 className="text-center">Services</h1>
          </div>
        </Container>
        <Loader className="spinner" loaded={this.state.services ? true : false}>
          <div className="ServicesNav-wrapper">
            <Container>
              <ul className="ServicesNav">
                <li className="ServicesNav-item">
                  <a className={classNames('ServicesNav-link', (this.state.filter === ALL_SERVICES) ? 'active' : '')} href="/" onClick={this._onClickFilter.bind(this, ALL_SERVICES)}>All Services<span className="ServicesNav-arrow"><div className="nav-caret"></div></span></a>
                </li>
                <li className="ServicesNav-item">
                  <a className={classNames('ServicesNav-link', (this.state.filter === 'Home Nursing') ? 'active' : '')} href="/about" onClick={this._onClickFilter.bind(this, 'Home Nursing')}>Home Nursing<span className="ServicesNav-arrow"><div className="nav-caret"></div></span></a>
                </li>
                <li className="ServicesNav-item">
                  <a className={classNames('ServicesNav-link', (this.state.filter === 'Home Social Care') ? 'active' : '')} href="/faq" onClick={this._onClickFilter.bind(this, 'Home Social Care')}>Home Social Care<span className="ServicesNav-arrow"><div className="nav-caret"></div></span></a>
                </li>
                <li className="ServicesNav-item">
                  <a className={classNames('ServicesNav-link', (this.state.filter === 'Home Medical') ? 'active' : '')} href="/faq" onClick={this._onClickFilter.bind(this, 'Home Medical')}>Home Medical<span className="ServicesNav-arrow"><div className="nav-caret"></div></span></a>
                </li>
                <li className="ServicesNav-item">
                  <a className={classNames('ServicesNav-link', (this.state.filter === 'Home TCM') ? 'active' : '')} href="/faq" onClick={this._onClickFilter.bind(this, 'Home TCM')}>Home TCM<span className="ServicesNav-arrow"><div className="nav-caret"></div></span></a>
                </li>
              </ul>
            </Container>
          </div>
          <div>
            <Container>
              <div className="ServicesBody">
                {
                  this.state.services && this._subFilterServices(this._filterServices(this.state.services, this.state.filter)).map((services) => {
                    return (
                      <div key={services[0].subType}>
                        <h3>{this.state.filter === ALL_SERVICES ? services[0].category + ' > ' : ''}{services[0].subType}</h3>
                        <Accordion activeItems={-1}>
                          {
                            services.map((service) => {
                              return (
                                <AccordionItem title={service.name} key={service.id}>
                                  <div>
                                    {service.description}
                                  </div>
                                  <div>
                                    <button className="btn btn-primary btn-small" onClick={this._onClickBook.bind(this, service)}>Book Service</button>
                                  </div>
                                </AccordionItem>
                              );
                            })
                          }
                        </Accordion>
                      </div>
                    );
                  })
                }
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

  _filterServices(services, filter) {
    return services.filter(function(service) {
      if (filter === ALL_SERVICES) return true;
      return service.category === filter;
    }).sort(function(a, b) {
      return a.name.localeCompare(b.name);
    });
  }

  _subFilterServices(services) {
    var hash = {}, arr = [];
    services.forEach(service => {
      if (hash[service.subType]) {
        hash[service.subType].push(service);
      } else {
        hash[service.subType] = [service];
      }
    });
    for (var subType in hash) {
      arr.push(hash[subType]);
    }
    return arr;
  }

  _onClickBook(service, event) {
    event.preventDefault();

    Location.push({ pathname: '/booking1', query: { sid: service.id } });
  }

}
