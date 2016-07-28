import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Loader from 'react-loader';
import s from './BookingServices.css';
import Container from '../Container';
import { fetchServices, setOrderService, setLastPage, showAlertPopup } from '../../actions';
import history from '../../core/history';
import util from '../../core/util';

class BookingServices extends Component {

  constructor(props) {
    super(props);
    const { allServices, order } = this.props;
    const location = history.getCurrentLocation();
    this.state = {
      filter: util.ALL_SERVICES,
      selectedService: undefined,
    };
    if (order && order.service) {
      this.state.selectedService = order.service;
    } else if (allServices && location.query && location.query.sid) {
      if (allServices[parseInt(location.query.sid, 10)]) {
        this.state.selectedService = parseInt(location.query.sid, 10);
      }
    }
  }

  componentDidMount() {
    this.props.fetchServices();
  }

  componentWillReceiveProps(props) {
    const { allServices, order } = props;
    const location = history.getCurrentLocation();
    if (order && order.service) {
      this.setState({
        selectedService: order.service,
      });
    } else if (allServices && location.query && location.query.sid) {
      if (allServices[parseInt(location.query.sid, 10)]) {
        this.setState({ selectedService: parseInt(location.query.sid, 10) });
      }
    }
  }

  onClickFilter = (filter) => (event) => {
    event.preventDefault();

    this.setState({ filter });
  };

  onSelect = (event) => {
    this.setState({ selectedService: parseInt(event.target.value, 10) });
  };

  onNext = (event) => {
    const location = history.getCurrentLocation();
    if (this.bookingServicesForm.checkValidity()) {
      event.preventDefault();

      this.props.setOrderService(this.state.selectedService);
      util.isNextLastPage('booking1', this.props.lastPage) && this.props.setLastPage('booking1');

      history.push({ pathname: '/booking2', query: location.query });
    } else {
      event.preventDefault();
      // alert('Please select a service');
      this.props.showAlertPopup('Please select a service.');
    }
  };

  render() {
    const { allServices, allServicesFetching } = this.props;
    const { filter, selectedService } = this.state;

    const serviceTree = util.appendAllServices(util.parseCategories(allServices));
    const serviceTreeHash = serviceTree.reduce((hash, category) => {
      hash[category.name] = category;
      return hash;
    }, {});

    return (
      <div className={s.bookingServices}>
        <Loader className="spinner" loaded={!allServicesFetching}>
          <div className={s.bookingServicesNavWrapper}>
            <Container>
              <ul className={s.bookingServicesNav}>
              {
                serviceTree && serviceTree.map(category => {
                  const { name } = category;
                  return (
                    <li className={s.bookingServicesNavItem} key={name}>
                      <a
                        className={classNames(s.bookingServicesNavLink, (filter === name) ? s.bookingServicesNavLinkActive : '')}
                        href="#"
                        onClick={this.onClickFilter(name)}
                      >
                        {name}
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
                  serviceTreeHash && filter && serviceTreeHash[filter] && serviceTreeHash[filter].children.map(subType => {
                    let header;
                    if (filter === util.ALL_SERVICES) {
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
                        <h3>{subType.name}</h3>
                      );
                    }
                    return (
                      <div className={s.bookingServicesSection} key={subType.children[0].category + subType.name}>
                        {header}
                        {
                          subType && subType.children.map(service => (
                            <div
                              className={classNames(s.bookingServicesItem, (service.id === selectedService) ? s.bookingServicesItemActive : '')}
                              key={service.id}
                            >
                              <input
                                className={s.bookingServicesRadio}
                                type="radio"
                                id={service.id}
                                name="service"
                                value={service.id}
                                checked={service.id === selectedService}
                                onChange={this.onSelect}
                                required
                              />
                              <label
                                className={s.bookingServicesRadioLabel}
                                htmlFor={service.id}
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
  allServices: React.PropTypes.object,
  allServicesFetching: React.PropTypes.bool,

  fetchServices: React.PropTypes.func,
  setOrderService: React.PropTypes.func,
  setLastPage: React.PropTypes.func,
  showAlertPopup: React.PropTypes.func,
};

const mapStateToProps = (state) => ({
  lastPage: state.lastPage,
  order: state.order,
  allServices: state.allServices.data,
  allServicesFetching: state.allServices.isFetching,
});

const mapDispatchToProps = (dispatch) => ({
  fetchServices: () => dispatch(fetchServices()),
  setOrderService: (service) => dispatch(setOrderService(service)),
  setLastPage: (page) => dispatch(setLastPage(page)),
  showAlertPopup: (message) => dispatch(showAlertPopup(message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookingServices);
