import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Loader from 'react-loader';
import s from './Services.css';
import Container from '../Container';
import Link from '../Link';
import ServiceCard from '../ServiceCard';
import { fetchServices, setOrderService, setOrderServiceClass, setLastPage } from '../../actions';
import history from '../../core/history';
import { isNextLastPage, isId } from '../../core/util';
import shuffle from 'lodash/shuffle';
import groupBy from 'lodash/groupBy';

class Services extends Component {

  constructor(props) {
    super(props);
    const { categories } = props;
    const headCategories = categories && Object.values(categories)
      .filter(category => category.cType === 'category')
      .sort((a, b) => b.order - a.order);
    this.state = {
      filter: headCategories && headCategories[0] && headCategories[0]._id,
    };
  }

  componentDidMount() {
    this.props.fetchServices();
  }

  componentWillReceiveProps(newProps) {
    const { categories } = newProps;
    if (categories !== this.props.categories) {
      const headCategories = categories && Object.values(categories)
        .filter(category => category.cType === 'category')
        .sort((a, b) => b.order - a.order);
      this.setState({
        filter: headCategories && headCategories[0] && headCategories[0]._id,
      });
    }
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

  onClickBook = (serviceId, serviceClass) => (event) => {
    event.preventDefault();

    this.props.setOrderService(serviceId);
    this.props.setOrderServiceClass(serviceClass);
    isNextLastPage('booking1', this.props.lastPage) && this.props.setLastPage('booking1');

    history.push({ pathname: '/booking2' });
  };

  render() {
    const { params, services, servicesUnderCategory,
      servicesUnderSlug, categories, categoriesBySlug, servicesFetching } = this.props;
    const { filter } = this.state;

    let serviceContent;
    if (params && params.id && services) {
      const isIdSlug = isId(params.id);
      // services under subcat
      const services = isIdSlug
        ? servicesUnderCategory[params.id]
        : servicesUnderSlug[params.id];
      const category = isIdSlug
        ? categories[params.id]
        : categoriesBySlug[params.id];
      
      const relatedCategoryIds = (function getRelatedCategoryIds() {
        const map = {};
        if (services) {
          Object.values(services).forEach(service => {
            service.categories.forEach(cat => {
              if (cat !== category._id && categories[cat].cType === 'sub-category') {
                map[cat] = true;
              }
            })
          });
        }
        return Object.keys(map);
      }());
      serviceContent = (
        <div>
          <div>
            <Container>
              <div className={s.serviceSubcatBody}>
                <div className={s.serviceDescWrapper}>
                  <div className={s.serviceIconWrapper}>
                    <div className={`service-icon ${category.iconClassName}`}></div>
                  </div>
                  <div className={s.serviceContentWrapper}>
                    <div className={s.serviceSubTypeTitle}>
                      {category.name}
                    </div>
                    <div className={s.serviceSubTypeDesc}>
                      {category.description}
                    </div>
                  </div>
                </div>
                <div className={s.serviceSubTypeListWrapper}>
                  <div className={s.serviceSubTypeList}>
                    {
                      services && services.map((service) =>
                        <ServiceCard
                          service={service}
                          servicesFetching={servicesFetching}
                          onBook={this.onClickBook}
                          key={service._id}
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
                      relatedCategoryIds && relatedCategoryIds.map((catId) => {
                        const category = categories[catId];
                        return (
                          <div className={s.otherServicesItem} key={category._id}>
                            <Link to={`/services/${category.slug ? category.slug : category._id}`}>
                              <div className={`service-icon ${category.iconClassName}`}></div>
                            </Link>
                            <Link to={`/services/${category.slug ? category.slug : category._id}`}>
                              <div className={s.otherServicesItemTitle}>{category.name}</div>
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
      const headCategories = categories && Object.values(categories)
        .filter(category => category.cType === 'category')
        .sort((a, b) => b.order - a.order);
      serviceContent = (
        <div>
          <div className={s.servicesNavWrapper}>
            <Container>
              <ul className={s.servicesNav}>
              {
                headCategories && headCategories.map(category => {
                  return (
                    <li className={s.servicesNavItem} key={category._id}>
                      <a
                        className={classNames(s.servicesNavLink,
                          (filter === category._id) ? s.servicesNavLinkActive : '')}
                        href="#"
                        onClick={this.onClickFilter(category._id)}
                      >
                        {category.name}
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
                <div
                  className={s.servicesBodySubcatSection}
                >
                  <div className={s.servicesBodySubcatSectionBody}>
                    {
                      servicesUnderCategory && servicesUnderCategory[filter] && servicesUnderCategory[filter].map((service) => (
                        <ServiceCard
                          service={service}
                          services={services}
                          servicesFetching={servicesFetching}
                          onBook={this.onClickBook}
                          key={service._id}
                        />
                      ))
                    }
                  </div>
                </div>
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
        <Loader className="spinner" loaded={!servicesFetching}>
          {serviceContent}
        </Loader>
      </div>
    );
  }

}

Services.propTypes = {
  params: React.PropTypes.object,

  lastPage: React.PropTypes.string,
  services: React.PropTypes.object,
  servicesFetching: React.PropTypes.bool,
  servicesUnderCategory: React.PropTypes.object,
  servicesUnderSlug: React.PropTypes.object,
  categories: React.PropTypes.object,
  categoriesBySlug: React.PropTypes.object,

  fetchServices: React.PropTypes.func,
  setOrderService: React.PropTypes.func,
  setOrderServiceClass: React.PropTypes.func,
  setLastPage: React.PropTypes.func,
};

const mapStateToProps = (state) => ({
  lastPage: state.lastPage,
  services: state.services.data,
  servicesFetching: state.services.isFetching,
  servicesUnderCategory: state.services.servicesUnderCategory,
  servicesUnderSlug: state.services.servicesUnderSlug,
  categories: state.services.categories,
  categoriesBySlug: state.services.categoriesBySlug,
});

const mapDispatchToProps = (dispatch) => ({
  fetchServices: () => dispatch(fetchServices()),
  setOrderService: (service) => dispatch(setOrderService(service)),
  setOrderServiceClass: (service) => dispatch(setOrderServiceClass(service)),
  setLastPage: (page) => dispatch(setLastPage(page)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Services);
