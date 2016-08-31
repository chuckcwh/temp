import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Loader from 'react-loader';
import s from './BookingServices.css';
import Container from '../Container';
import { fetchServices, setOrderService, setOrderServiceClass, setLastPage, showAlertPopup } from '../../actions';
import history from '../../core/history';
import { ALL_SERVICES, isNextLastPage } from '../../core/util';
import groupBy from 'lodash/groupBy';

class BookingServices extends Component {

  constructor(props) {
    super(props);
    const { services, order } = this.props;
    const location = history.getCurrentLocation();
    this.state = {
      filter: ALL_SERVICES,
      selectedService: undefined,
      selectedServiceClass: undefined,
    };
    if (order && order.service) {
      this.state.selectedService = order.service;
      this.state.selectedServiceClass = order.serviceClass;
    } else if (services && location.query && location.query.sid && location.query.scid) {
      if (services[location.query.sid]) {
        this.state.selectedService = location.query.sid;
        this.state.selectedServiceClass = location.query.scid;
      }
    }
  }

  componentDidMount() {
    this.props.fetchServices();
  }

  componentWillReceiveProps(props) {
    const { services, order } = props;
    const location = history.getCurrentLocation();
    if (order && order.service) {
      this.setState({
        selectedService: order.service,
        selectedServiceClass: order.serviceClass,
      });
    } else if (services && location.query && location.query.sid && location.query.scid) {
      if (services[location.query.sid]) {
        this.setState({
          selectedService: location.query.sid,
          selectedServiceClass: location.query.scid,
        });
      }
    }
  }

  onClickFilter = (filter) => (event) => {
    event.preventDefault();

    this.setState({ filter });
  };

  onSelect = (event) => {
    const values = event.target.value.split(':');
    this.setState({
      selectedService: values[0],
      selectedServiceClass: values[1],
    });
  };

  onNext = (event) => {
    const location = history.getCurrentLocation();
    if (this.bookingServicesForm.checkValidity()) {
      event.preventDefault();

      this.props.setOrderService(this.state.selectedService);
      this.props.setOrderServiceClass(this.state.selectedServiceClass);
      isNextLastPage('booking1', this.props.lastPage) && this.props.setLastPage('booking1');

      history.push({ pathname: '/booking2', query: location.query });
    } else {
      event.preventDefault();
      // alert('Please select a service');
      this.props.showAlertPopup('Please select a service.');
    }
  };

  render() {
    const { services, servicesFetching, categories, servicesUnderCategory } = this.props;
    const { filter, selectedService, selectedServiceClass } = this.state;

    const headCategories = categories && Object.values(categories)
      .filter(category => category.cType === 'category')
      .sort((a, b) => b.order - a.order);
    const filteredServices = servicesUnderCategory && this.state.filter && servicesUnderCategory[this.state.filter] || [];
    const servicesGroupedByParent = filteredServices && groupBy(filteredServices, 'parentCategory');

    return (
      <div className={s.bookingServices}>
        <Loader className="spinner" loaded={!servicesFetching}>
          <div className={s.bookingServicesNavWrapper}>
            <Container>
              <ul className={s.bookingServicesNav}>
              {
                headCategories && headCategories.map(category => {
                  return (
                    <li className={s.bookingServicesNavItem} key={category._id}>
                      <a
                        className={classNames(s.bookingServicesNavLink, (filter === category._id) ? s.bookingServicesNavLinkActive : '')}
                        href="#"
                        onClick={this.onClickFilter(category._id)}
                      >
                        {category.name}
                        <span className={s.bookingServicesNavArrow}>
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
              <form ref={(c) => (this.bookingServicesForm = c)}>
                <div className={s.bookingServicesBody}>
                {
                  servicesGroupedByParent && Object.keys(servicesGroupedByParent).map(parentCategoryId => {
                    const parentCategory = categories[parentCategoryId];
                    const services = servicesGroupedByParent[parentCategoryId];
                    const flattenedServices = services && services.reduce((result, service) => {
                      service.classes.forEach((serviceClass, index) => {
                        result.push(Object.assign({}, service, {
                          price: serviceClass.price,
                          duration: serviceClass.duration,
                          key: `${service._id}:${index}`,
                        }));
                      });
                      return result;
                    }, []) || [];
                    let header;
                    if (filter === ALL_SERVICES) {
                      header = (
                        <h3>
                          <a
                            href="#"
                            onClick={this.onClickFilter(subType.children[0].category)}
                          >
                            {subType.children[0].category}
                          </a> &gt; {subType.name}</h3>
                      );
                    } else {
                      header = (
                        <h3>{parentCategory.name}</h3>
                      );
                    }
                    return (
                      <div className={s.bookingServicesSection} key={parentCategory._id}>
                        {header}
                        {
                          flattenedServices && flattenedServices.map(service => (
                            <div
                              className={classNames(s.bookingServicesItem, (service.key === `${selectedService}:${selectedServiceClass}`) ? s.bookingServicesItemActive : '')}
                              key={service.key}
                            >
                              <input
                                className={s.bookingServicesRadio}
                                type="radio"
                                id={service.key}
                                name="service"
                                value={service.key}
                                checked={service.key === `${selectedService}:${selectedServiceClass}`}
                                onChange={this.onSelect}
                                required
                              />
                              <label
                                className={s.bookingServicesRadioLabel}
                                htmlFor={service.key}
                              >
                                <span><span></span></span>
                                <span>{`${service.name} (${parseFloat(service.duration)} hr${parseFloat(service.duration) > 1 ? 's' : ''})`}</span>
                              </label>
                              <div className={s.bookingServicesItemDescription}>
                                {service.description} ({parseFloat(service.duration)} hours)<br />
                                <span className={s.bookingServicesItemDescriptionPrice}>Starting from SGD {service.price} per session</span>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    );
                  })
                }
                </div>
              </form>
              <div className={s.bookingServicesFooter}>
                <a href="/booking2" className="btn btn-primary" onClick={this.onNext}>NEXT</a>
              </div>
            </Container>
          </div>
        </Loader>
      </div>
    );
  }

}

BookingServices.propTypes = {
  lastPage: React.PropTypes.string,
  order: React.PropTypes.object,
  services: React.PropTypes.object,
  servicesFetching: React.PropTypes.bool,
  categories: React.PropTypes.object,
  servicesUnderCategory: React.PropTypes.object,

  fetchServices: React.PropTypes.func,
  setOrderService: React.PropTypes.func,
  setOrderServiceClass: React.PropTypes.func,
  setLastPage: React.PropTypes.func,
  showAlertPopup: React.PropTypes.func,
};

const mapStateToProps = (state) => ({
  lastPage: state.lastPage,
  order: state.order,
  services: state.services.data,
  servicesFetching: state.services.isFetching,
  categories: state.services.categories,
  servicesUnderCategory: state.services.servicesUnderCategory,
});

const mapDispatchToProps = (dispatch) => ({
  fetchServices: () => dispatch(fetchServices()),
  setOrderService: (service) => dispatch(setOrderService(service)),
  setOrderServiceClass: (service) => dispatch(setOrderServiceClass(service)),
  setLastPage: (page) => dispatch(setLastPage(page)),
  showAlertPopup: (message) => dispatch(showAlertPopup(message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookingServices);
