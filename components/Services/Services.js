import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Loader from 'react-loader';
import { Accordion, AccordionItem } from 'react-sanfona';
import s from './Services.css';
import Container from '../Container';
import Link from '../Link';
import ServiceCard from '../ServiceCard';
import AlertPopup from '../AlertPopup';
import { fetchServices, setOrderService, setLastPage } from '../../actions';
import history from '../../core/history';
import util from '../../core/util';
import find from 'lodash/find';
import shuffle from 'lodash/shuffle';
import groupBy from 'lodash/groupBy';

class Services extends Component {

  constructor(props) {
    super(props);
    this.state = {
      filter: util.ALL_SERVICES
    };
  }

  componentDidMount() {
    this.props.fetchServices();
  }

  render() {
    const { params, allServices, allServicesFetching } = this.props;
    const { filter } = this.state;
    const location = history.getCurrentLocation();

    const serviceTree = util.appendAllServices(util.parseCategories(allServices));
    let serviceTreeHash = {};
    serviceTree.map(category => { serviceTreeHash[category.name] = category });

    let serviceContent;
    if (params && params.id && allServices) {
      const subcatClass = util.getServiceIconClass(parseInt(params.id));
      const allServicesArr = Object.values(allServices);
      // services of same subtype category
      const subcatServices = allServicesArr.filter((service) => (String(service.categoryObj) === params.id));
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
              <div className={s.serviceSubcatBody}>
                <div className={s.serviceDescWrapper}>
                  <div className={s.serviceIconWrapper}>
                    <div className={'service-icon ' + subcatClass}></div>
                  </div>
                  <div className={s.serviceContentWrapper}>
                    <div className={s.serviceSubTypeTitle}>
                      {subcatServices && subcatServices[0] && subcatServices[0].subType}
                    </div>
                    <div className={s.serviceSubTypeDesc}>
                      {subcatServices && subcatServices[0] && subcatServices[0].subTypeDesc}
                    </div>
                  </div>
                </div>
                <div className={s.serviceSubTypeListWrapper}>
                  <div className={s.serviceSubTypeList}>
                    {
                      Object.values(groupBy(subcatServices, 'name')).map((serviceGroup) => {
                        return (
                          <ServiceCard serviceGroup={serviceGroup} allServices={allServices} allServicesFetching={allServicesFetching} onBook={this._onClickBook.bind(this)} key={subcatServices[0].id+serviceGroup[0].name}></ServiceCard>
                        );
                      })
                    }
                  </div>
                </div>
                <div className={s.otherServices}>
                  <div className={s.otherServicesTitle}>
                    Other services you might be interested in
                  </div>
                  <div className={s.otherServicesList}>
                    {
                      otherSubcats && otherSubcats.map((service) => {
                        const subcatClass = util.getServiceIconClass(service.categoryObj);
                        return (
                          <div className={s.otherServicesItem} key={service.categoryObj}>
                            <Link to={`/services/${service.categoryObj}`}><div className={'service-icon ' + subcatClass}></div></Link>
                            <Link to={`/services/${service.categoryObj}`}><div className={s.otherServicesItemTitle}>{service.subType}</div></Link>
                          </div>
                        );
                      })
                    }
                    <div className={s.otherServicesItem}>
                      <a href="/services" onClick={this._onClickAllServices.bind(this)}><div className="service-icon ebeecare"></div></a>
                      <a href="/services" onClick={this._onClickAllServices.bind(this)}><div className={s.otherServicesItemTitle}>All Services</div></a>
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
          <div className={s.servicesNavWrapper}>
            <Container>
              <ul className={s.servicesNav}>
              {
                serviceTree && serviceTree.map(category => {
                  const { name } = category;
                  return (
                    <li className={s.servicesNavItem} key={name}>
                      <a className={classNames(s.servicesNavLink, (filter === name) ? s.servicesNavLinkActive : '')} href="#" onClick={this._onClickFilter.bind(this, name)}>{name}<span className={s.servicesNavArrow}><div className="nav-caret"></div></span></a>
                    </li>
                  );
                })
              }
              </ul>
            </Container>
          </div>
          <div>
            <Container>
              <div className={s.servicesBody}>
                {
                  serviceTreeHash[filter].children.map(subType => {
                    return (
                      <div className={s.servicesBodySubcatSection} key={subType.children[0].category + subType.name}>
                        <h3 className={s.servicesBodySubcatSectionTitle}>{this.state.filter === util.ALL_SERVICES ? subType.children[0].category + ' > ' : ''}{subType.name}</h3>
                        <div className={s.servicesBodySubcatSectionBody}>
                          {
                            Object.values(groupBy(subType.children, 'name')).map((serviceGroup) => {
                              return (
                                <ServiceCard serviceGroup={serviceGroup} allServices={allServices} allServicesFetching={allServicesFetching} onBook={this._onClickBook.bind(this)}></ServiceCard>
                              );
                            })
                          }
                        </div>
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
      <div className={s.services}>
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

  _onClickAllServices(event) {
    event.preventDefault();

    history.push({ pathname: '/services'});
  }

  _onClickFilter(filter, event) {
    event.preventDefault();

    this.setState({
      filter: filter
    });
  }

  _onClickBook(serviceId, event) {
    event.preventDefault();

    this.props.setOrderService(serviceId);
    util.isNextLastPage('booking1', this.props.lastPage) && this.props.setLastPage('booking1');

    history.push({ pathname: '/booking2' });
  }

}

const mapStateToProps = (state) => {
  return {
    lastPage: state.lastPage,
    allServices: state.allServices.data,
    allServicesFetching: state.allServices.isFetching
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchServices: () => {
      return dispatch(fetchServices());
    },
    setOrderService: (service) => {
      return dispatch(setOrderService(service));
    },
    setLastPage: (page) => {
      return dispatch(setLastPage(page));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Services);
