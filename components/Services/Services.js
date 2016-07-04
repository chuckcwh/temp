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
import find from 'lodash/find';
import shuffle from 'lodash/shuffle';

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
    if (location && location.query && location.query.subcat && allServices) {
      const subcatClass = Util.getServiceIconClass(parseInt(location.query.subcat));
      const allServicesArr = Object.values(allServices);
      // services of same subtype category
      const subcatServices = allServicesArr.filter((service) => (String(service.categoryObj) === location.query.subcat));
      const otherSubcats = (function () {
        if (subcatServices && subcatServices.length) {
          // relationship between main categories and sub catergories
          const mainCat = subcatServices[0].category;
          const subCat = subcatServices[0].subType;
          let map = {};
          allServicesArr.forEach((service) => {
            if (!map[service.category]) {
              map[service.category] = [];
            }
          });
          allServicesArr.forEach((service) => {
            for (let mainCat in map) {
              if (service.category === mainCat) {
                if (!(find(map[mainCat], (servic) => (servic.subType === service.subType))) && service.subType !==  subCat) {
                  // push the entire service obj for useful attributes
                  map[mainCat].push(service);
                }
              }
            }
          });
          if (map[mainCat].length > 4) {
            return shuffle(map[mainCat]).slice(0, 4);
          } else {
            return map[mainCat];
          }
        } else return [];
      })();
      serviceContent = (
        <div>
          <div>
            <Container>
              <div className="ServiceBody">
                <div className="ServiceDesc-wrapper">
                  <div className="ServiceIcon-wrapper">
                    <div className={'service-icon ' + subcatClass}></div>
                  </div>
                  <div className="ServiceContent-wrapper">
                    <div className="ServiceSubTypeTitle">
                      {subcatServices && subcatServices[0] && subcatServices[0].subType}
                    </div>
                    <div className="ServiceSubTypeDesc">
                      {subcatServices && subcatServices[0] && subcatServices[0].subTypeDesc}
                    </div>
                    <div className="ServicesList">
                      <Accordion activeItems={-1}>
                        {
                          subcatServices && subcatServices.map(service => {
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
                    Other services you might be interested in
                  </div>
                  <div className="OtherServicesList">
                    {
                      otherSubcats && otherSubcats.map((service) => {
                        const subcatClass = Util.getServiceIconClass(service.categoryObj);
                        return (
                          <div className="OtherServicesItem" key={service.categoryObj}>
                            <a href={'/services?subcat=' + service.categoryObj} onClick={this._onClickSubcat.bind(this, { subcat: service.categoryObj, subcatClass: subcatClass})}><div className={'service-icon ' + subcatClass}></div></a>
                            <a href={'/services?subcat=' + service.categoryObj} onClick={this._onClickSubcat.bind(this, { subcat: service.categoryObj, subcatClass: subcatClass})}><div className="OtherServicesItemTitle">{service.subType}</div></a>
                          </div>
                        );
                      })
                    }
                    <div className="OtherServicesItem">
                        <a href="/services" onClick={this._onClickAllServices.bind(this)}><div className="service-icon ebeecare"></div></a>
                        <a href="/services" onClick={this._onClickAllServices.bind(this)}><div className="OtherServicesItemTitle">All Services</div></a>
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
                serviceTree && serviceTree.map(category => {
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

  _onClickSubcat(state, event) {
    event.preventDefault();

    Location.push({ pathname: '/services', query: { subcat: state.subcat } });
  }

  _onClickAllServices(event) {
    event.preventDefault();

    Location.push({ pathname: '/services'});
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
