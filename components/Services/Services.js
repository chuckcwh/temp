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
      const allServicesArr = Object.values(allServices);
      const selectedSubTypeId = (location.search).substr(8);
      const subcatClass = location.state.subcatClass;
      // services of same subtype category
      const relatedServices = allServicesArr.filter((service) => (String(service.categoryObj) == selectedSubTypeId));
      console.log('location', location);
      console.log('relatedServices', relatedServices);
      console.log('ALLSERVICES', allServices);
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
              <div className="ServiceBody">
                <div className="ServiceDesc-wrapper">
                  <div className="ServiceIcon-wrapper">
                    <div className={'service-icon ' + subcatClass}></div>
                  </div>
                  <div className="ServiceContent-wrapper">
                    <div className="ServiceSubTypeTitle">
                      {relatedServices[0].subType}
                    </div>
                    <div className="ServiceSubTypeDesc">
                      Veniam veniam sit cupidatat mollit dolor proident. Ea est reprehenderit reprehenderit ullamco. Sunt dolore sint velit incididunt dolore reprehenderit ad sit. Do esse voluptate sit in consequat sint Lorem consectetur laboris elit ipsum. Fugiat excepteur dolor veniam sit velit aliquip laboris consectetur dolor incididunt sint proident.
                      {relatedServices[0].subTypeDesc}
                    </div>
                    <div className="ServicesList">
                      <Accordion activeItems={-1}>
                        {
                          relatedServices.map(service => {
                            return (
                              <AccordionItem title={service.name} key={service.id}>
                                <div className="ServiceItem">
                                  <div className="ServiceItemDescription">
                                    {service.description} ({parseFloat(service.duration)} hours)<br />
                                    <span className="ServiceItemDescription-price">Starting from SGD {service.price} per session</span>
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
                  </div>
                </div>
                <div className="OtherServices">
                  <div className="OtherServicesTitle">
                    Other services you might be interested
                  </div>
                  <div className="OtherServicesList">
                    <div className="OtherServicesItem">
                      <div className="service-icon ebeecare"></div>
                      <div className="OtherServicesItemTitle">Test</div>
                    </div>
                    <div className="OtherServicesItem">
                      <div className="service-icon ebeecare"></div>
                      <div className="OtherServicesItemTitle">Test</div>
                    </div>
                    <div className="OtherServicesItem">
                      <div className="service-icon ebeecare"></div>
                      <div className="OtherServicesItemTitle">Test</div>
                    </div>
                    <div className="OtherServicesItem">
                      <div className="service-icon ebeecare"></div>
                      <div className="OtherServicesItemTitle">Test</div>
                    </div>
                    <div className="OtherServicesItem">
                      <div className="service-icon ebeecare"></div>
                      <div className="OtherServicesItemTitle">Test</div>
                    </div>
                  </div>
                </div>
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
