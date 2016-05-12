import React, { Component } from 'react';
import classNames from 'classnames';
import Loader from 'react-loader';
import { Accordion, AccordionItem } from 'react-sanfona';
import request from 'superagent';
import './Services.scss';
import Container from '../Container';
import Link from '../Link';
import AlertPopup from '../AlertPopup';
import Location from '../../core/Location';
import Util from '../../core/Util';

export default class Services extends Component {

  constructor(props) {
    super(props);
    this.state = {
      services: undefined,
      filter: Util.ALL_SERVICES,
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
              {
                Util.SERVICES_CATEGORY_ORDER.map(category => {
                  return (
                    <li className="ServicesNav-item" key={category}>
                      <a className={classNames('ServicesNav-link', (this.state.filter === category) ? 'active' : '')} href="#" onClick={this._onClickFilter.bind(this, category)}>{category}<span className="ServicesNav-arrow"><div className="nav-caret"></div></span></a>
                    </li>
                  );
                })
              }
              </ul>
            </Container>
          </div>
          <div>
            <Container>
              <div className="ServicesBody">
                {
                  this.state.services && Util.subFilterServices(Util.filterServices(this.state.services, this.state.filter)).map((services) => {
                    return (
                      <div key={services[0].subType}>
                        <h3>{this.state.filter === Util.ALL_SERVICES ? services[0].category + ' > ' : ''}{services[0].subType}</h3>
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

  _onClickBook(service, event) {
    event.preventDefault();

    Location.push({ pathname: '/booking1', query: { sid: service.id } });
  }

}
