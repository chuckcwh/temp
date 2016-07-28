import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Loader from 'react-loader';
import s from './Services.css';
import Container from '../Container';
import Link from '../Link';
import ServiceCard from '../ServiceCard';
import { fetchServices, setOrderService, setLastPage } from '../../actions';
import history from '../../core/history';
import util from '../../core/util';
import shuffle from 'lodash/shuffle';
import groupBy from 'lodash/groupBy';

class Services extends Component {

  constructor(props) {
    super(props);
    this.state = {
      filter: util.ALL_SERVICES,
    };
  }

  componentDidMount() {
    this.props.fetchServices();
  }

  onClickAllServices = (event) => {
    event.preventDefault();

    history.push({ pathname: '/services' });
  };

  onClickFilter = (filter) => (event) => {
    event.preventDefault();

    this.setState({
      filter,
    });
  };

  onClickBook = (serviceId) => (event) => {
    event.preventDefault();

    this.props.setOrderService(serviceId);
    util.isNextLastPage('booking1', this.props.lastPage) && this.props.setLastPage('booking1');

    history.push({ pathname: '/booking2' });
  };

  render() {
    const { params, allServices, servicesTree, servicesTreeHash,
      servicesSubtypesHash, servicesSubtypesHashBySlug, allServicesFetching } = this.props;
    const { filter } = this.state;

    let serviceContent;
    if (params && params.id && allServices) {
      const isIdSlug = !util.isInt(params.id);
      // const id = isIdSlug ? params.id : parseInt(params.id);
      const allServicesArr = Object.values(allServices);
      // services under subcat
      const subcatServices = isIdSlug
        ? servicesSubtypesHashBySlug[params.id]
        : servicesSubtypesHash[params.id];
      const subcatClass = util.getServiceIconClass(
        parseInt(Object.values(subcatServices)[0].subTypeId, 10));
      const otherSubcats = (function getOtherSubcats() {
        if (subcatServices && subcatServices.length) {
          // relationship between main categories and sub catergories
          const mainCat = subcatServices[0].category;
          const subCat = subcatServices[0].subType;
          const map = {};
          allServicesArr.forEach((service) => {
            if (!map[service.category]) {
              map[service.category] = [];
            }
          });
          allServicesArr.forEach((service) => {
            Object.keys(map).forEach((currentCat) => {
              if (service.category === currentCat) {
                if (!(map[currentCat].find((servic) =>
                  (servic.subType === service.subType))) && service.subType !== subCat) {
                  // push the entire service obj for useful attributes
                  map[currentCat].push(service);
                }
              }
            });
          });
          // const map = allServicesArr.reduce();
          if (map[mainCat].length > 4) {
            return shuffle(map[mainCat]).slice(0, 4);
          }
          return map[mainCat];
        }
        return [];
      }());
      serviceContent = (
        <div>
          <div>
            <Container>
              <div className={s.serviceSubcatBody}>
                <div className={s.serviceDescWrapper}>
                  <div className={s.serviceIconWrapper}>
                    <div className={`service-icon ${subcatClass}`}></div>
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
                      Object.values(groupBy(subcatServices, 'name')).map((serviceGroup) =>
                        <ServiceCard
                          serviceGroup={serviceGroup}
                          allServicesFetching={allServicesFetching}
                          onBook={this.onClickBook}
                          key={subcatServices[0].id + serviceGroup[0].name}
                        />
                      )
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
                        const otherSubcatClass = util.getServiceIconClass(service.categoryObj);
                        return (
                          <div className={s.otherServicesItem} key={service.categoryObj}>
                            <Link to={`/services/${service.subTypeSlug ? service.subTypeSlug : service.categoryObj}`}>
                              <div className={`service-icon ${otherSubcatClass}`}></div>
                            </Link>
                            <Link to={`/services/${service.subTypeSlug ? service.subTypeSlug : service.categoryObj}`}>
                              <div className={s.otherServicesItemTitle}>{service.subType}</div>
                            </Link>
                          </div>
                        );
                      })
                    }
                    <div className={s.otherServicesItem}>
                      <a href="/services" onClick={this.onClickAllServices}>
                        <div className="service-icon ebeecare"></div>
                      </a>
                      <a href="/services" onClick={this.onClickAllServices}>
                        <div className={s.otherServicesItemTitle}>All Services</div>
                      </a>
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
                servicesTree && servicesTree.map(category => {
                  const { name } = category;
                  return (
                    <li className={s.servicesNavItem} key={name}>
                      <a
                        className={classNames(s.servicesNavLink,
                          (filter === name) ? s.servicesNavLinkActive : '')}
                        href="#"
                        onClick={this.onClickFilter(name)}
                      >
                        {name}
                        <span className={s.servicesNavArrow}>
                          <div className="nav-caret"></div>
                        </span>
                      </a>
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
                  servicesTreeHash && servicesTreeHash[filter].children.map(subType => (
                    <div
                      className={s.servicesBodySubcatSection}
                      key={subType.children[0].category + subType.name}
                    >
                      <h2 className={s.servicesBodySubcatSectionTitle}>
                        {this.state.filter === util.ALL_SERVICES &&
                          <a href="#" onClick={this.onClickFilter(subType.children[0].category)}>
                            {subType.children[0].category}
                          </a>}
                        {this.state.filter === util.ALL_SERVICES ? ' > ' : ''}
                        {subType.name}
                      </h2>
                      <div className={s.servicesBodySubcatSectionBody}>
                        {
                          Object.values(groupBy(subType.children, 'name')).map((serviceGroup) => (
                            <ServiceCard
                              serviceGroup={serviceGroup}
                              allServices={allServices}
                              allServicesFetching={allServicesFetching}
                              onBook={this.onClickBook}
                              key={serviceGroup[0].id}
                            />
                          ))
                        }
                      </div>
                    </div>
                  ))
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
        <Loader className="spinner" loaded={!allServicesFetching}>
          {serviceContent}
        </Loader>
      </div>
    );
  }

}

Services.propTypes = {
  params: React.PropTypes.object,

  lastPage: React.PropTypes.string,
  allServices: React.PropTypes.object,
  allServicesFetching: React.PropTypes.bool,
  servicesTree: React.PropTypes.array,
  servicesTreeHash: React.PropTypes.object,
  servicesSubtypesHash: React.PropTypes.object,
  servicesSubtypesHashBySlug: React.PropTypes.object,

  fetchServices: React.PropTypes.func,
  setOrderService: React.PropTypes.func,
  setLastPage: React.PropTypes.func,
};

const mapStateToProps = (state) => ({
  lastPage: state.lastPage,
  allServices: state.allServices.data,
  allServicesFetching: state.allServices.isFetching,
  servicesTree: state.allServices.servicesTree,
  servicesTreeHash: state.allServices.servicesTreeHash,
  servicesSubtypesHash: state.allServices.subTypesHash,
  servicesSubtypesHashBySlug: state.allServices.subTypesHashBySlug,
});

const mapDispatchToProps = (dispatch) => ({
  fetchServices: () => dispatch(fetchServices()),
  setOrderService: (service) => dispatch(setOrderService(service)),
  setLastPage: (page) => dispatch(setLastPage(page)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Services);
