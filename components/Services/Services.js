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
import _ from 'lodash';

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
      const { subcatClass, rankedSubcategories } = location.state;
      const allServicesArr = Object.values(allServices);
      const selectedSubTypeId = (location.search).substr(8);
      // services of same subtype category
      const subcatServices = allServicesArr.filter((service) => (String(service.categoryObj) === selectedSubTypeId));
      const otherSubcats = (function () {
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
              if (map[mainCat].indexOf(service.subType) === -1 && service.subType !==  subCat) {
                map[mainCat].push(service.subType);
              }
            }
          }
        });
        console.log('FULLMAP', map)
        if (map[mainCat].length > 4) {
          return _.shuffle(map[mainCat]).slice(0, 5);
        } else {
          return map[mainCat];
        }
      })();
      console.log('PROCMAP', otherSubcats);
      console.log('SERVICES', allServices);

      let subcat = parseInt(location.query.subcat);
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
                      {subcatServices[0].subType}
                    </div>
                    <div className="ServiceSubTypeDesc">
                      Veniam veniam sit cupidatat mollit dolor proident. Ea est reprehenderit reprehenderit ullamco. Sunt dolore sint velit incididunt dolore reprehenderit ad sit. Do esse voluptate sit in consequat sint Lorem consectetur laboris elit ipsum. Fugiat excepteur dolor veniam sit velit aliquip laboris consectetur dolor incididunt sint proident.
                      {subcatServices[0].subTypeDesc}
                    </div>
                    <div className="ServicesList">
                      <Accordion activeItems={-1}>
                        {
                          subcatServices.map(service => {
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
                  {
                    (() => {
                      if (otherSubcats.length > 0) {
                        return (
                          <div className="OtherServicesTitle">
                            Other services you might be interested
                          </div>
                        );
                      }
                    })()
                  }
                  <div className="OtherServicesList">
                    {
                      otherSubcats.map((subcategory) => {
                        return (
                          <div className="OtherServicesItem">
                            <div className="service-icon ebeecare"></div>
                            <div className="OtherServicesItemTitle">{subcategory}</div>
                          </div>
                        );
                      })
                    }
                    <div className="OtherServicesItem">
                      <div className="service-icon ebeecare"></div>
                      <div className="OtherServicesItemTitle">All Services</div>
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

  _onClickSubcat(state, event) {
    event.preventDefault();

    Location.push({ pathname: '/services', query: { subcat: state.subcat.id }, state: {subcatClass: state.subcatClass, rankedSubcategories: state.rankedSubcategories} });
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
