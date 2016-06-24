import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Loader from 'react-loader';
import { Accordion, AccordionItem } from 'react-sanfona';
import './Services.scss';
import Container from '../Container';
import Link from '../Link';
import AlertPopup from '../AlertPopup';
import { fetchServices } from '../../actions';
import Location from '../../core/Location';
import Util from '../../core/Util';

class Services extends Component {

  constructor(props) {
    super(props);
    this.state = {
      filter: Util.ALL_SERVICES
    };
  }

  componentDidMount() {
    this.props.fetchServices();
  }

  render() {
    const { location, allServices, allServicesFetching } = this.props;
    const { filter } = this.state;

    const serviceTree = Util.appendAllServices(Util.parseCategories(allServices));
    let serviceTreeHash = {};
    serviceTree.map(category => { serviceTreeHash[category.name] = category });

    let serviceContent;
    if (location.query && location.query.subcat && allServices) {
      let subcat = parseInt(location.query.subcat);
      serviceContent = (
        <div>
          <div className="ServicesNav-wrapper">
            <Container>
              <ul className="ServicesNav">
              {
                serviceTree.map(category => {
                  const { name } = category;
                  return (
                    <li className="ServicesNav-item" key={name}>
                      <a className={classNames('ServicesNav-link', (filter === name) ? 'active' : '')} href="#" onClick={this._onClickFilter.bind(this, name)}>{name}<span className="ServicesNav-arrow"><div className="nav-caret"></div></span></a>
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
                  serviceTreeHash[filter].children.map(subType => {
                    return (
                      <div key={subType.children[0].category + subType.name}>
                        <h3>{this.state.filter === Util.ALL_SERVICES ? subType.children[0].category + ' > ' : ''}{subType.name}</h3>
                        <Accordion activeItems={-1}>
                          {
                            subType.children.map((service) => {
                              return (
                                <AccordionItem title={service.name} key={service.id}>
                                  <div className="ServicesItem">
                                    <div className="ServicesItemDescription">
                                      {service.description} ({parseFloat(service.duration)} hours)<br />
                                      <span className="ServicesItemDescription-price">Starting from SGD {service.price} per session</span>
                                    </div>
                                    <div>
                                      <button className="btn btn-primary btn-small" onClick={this._onClickBook.bind(this, service)}>Book Service</button>
                                    </div>
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
        </div>
      );
    } else {
      serviceContent = (
        <div>
          <div className="ServicesNav-wrapper">
            <Container>
              <ul className="ServicesNav">
              {
                serviceTree.map(category => {
                  const { name } = category;
                  return (
                    <li className="ServicesNav-item" key={name}>
                      <a className={classNames('ServicesNav-link', (filter === name) ? 'active' : '')} href="#" onClick={this._onClickFilter.bind(this, name)}>{name}<span className="ServicesNav-arrow"><div className="nav-caret"></div></span></a>
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
                  serviceTreeHash[filter].children.map(subType => {
                    return (
                      <div key={subType.children[0].category + subType.name}>
                        <h3>{this.state.filter === Util.ALL_SERVICES ? subType.children[0].category + ' > ' : ''}{subType.name}</h3>
                        <Accordion activeItems={-1}>
                          {
                            subType.children.map((service) => {
                              return (
                                <AccordionItem title={service.name} key={service.id}>
                                  <div className="ServicesItem">
                                    <div className="ServicesItemDescription">
                                      {service.description} ({parseFloat(service.duration)} hours)<br />
                                      <span className="ServicesItemDescription-price">Starting from SGD {service.price} per session</span>
                                    </div>
                                    <div>
                                      <button className="btn btn-primary btn-small" onClick={this._onClickBook.bind(this, service)}>Book Service</button>
                                    </div>
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
        </div>
      );
    }

    return (
      <div className="Services">
        <Container>
          <div>
            <h1 className="text-center">Services</h1>
          </div>
        </Container>
        <Loader className="spinner" loaded={allServicesFetching ? false : true}>
          {serviceContent}
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

  _onClickBook(service, event) {
    event.preventDefault();

    Location.push({ pathname: '/booking1', query: { sid: service.id } });
  }

}

const mapStateToProps = (state) => {
  return {
    location: state.router && state.router.location,
    allServices: state.allServices.data,
    allServicesFetching: state.allServices.isFetching
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchServices: () => {
      return dispatch(fetchServices());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Services);
