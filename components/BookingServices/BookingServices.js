import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Loader from 'react-loader';
import s from './BookingServices.css';
import Container from '../Container';
import Link from '../Link';
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
      selectedService: undefined
    };
    if (order && order.service) {
      this.state.selectedService = order.service;
    } else if (allServices && location.query && location.query.sid) {
      if (allServices[parseInt(location.query.sid)]) {
        this.state.selectedService = parseInt(location.query.sid);
      }
    }
  }

  componentWillReceiveProps(props) {
    const { allServices, order } = props;
    const location = history.getCurrentLocation();
    if (order && order.service) {
      this.setState({
        selectedService: order.service
      });
    } else if (allServices && location.query && location.query.sid) {
      if (allServices[parseInt(location.query.sid)]) {
        this.setState({ selectedService: parseInt(location.query.sid) });
      }
    }
  }

  componentDidMount() {
    this.props.fetchServices();
  }

  render() {
    const { allServices, allServicesFetching } = this.props;
    const { filter, selectedService } = this.state;

    const serviceTree = util.appendAllServices(util.parseCategories(allServices));
    let serviceTreeHash = {};
    serviceTree.map(category => { serviceTreeHash[category.name] = category });
    
    return (
      <div className={s.bookingServices}>
        <Loader className="spinner" loaded={allServicesFetching ? false : true}>
          <div className={s.bookingServicesNavWrapper}>
            <Container>
              <ul className={s.bookingServicesNav}>
              {
                serviceTree.map(category => {
                  const { name } = category;
                  return (
                    <li className={s.bookingServicesNavItem} key={name}>
                      <a className={classNames(s.bookingServicesNavLink, (filter === name) ? s.bookingServicesNavLinkActive : '')} href="#" onClick={this._onClickFilter.bind(this, name)}>{name}<span className={s.bookingServicesNavArrow}><div className="nav-caret"></div></span></a>
                    </li>
                  );
                })
              }
              </ul>
            </Container>
          </div>
          <div>
            <Container>
              <form ref={(c) => this._bookingServicesForm = c}>
                <div className={s.bookingServicesBody}>
                {
                  serviceTreeHash[filter].children.map(subType => {
                    var header;
                    if (filter === util.ALL_SERVICES) {
                      header = (
                        <h3><a href="#" onClick={this._onClickFilter.bind(this, subType.children[0].category)}>{subType.children[0].category}</a> &gt; {subType.name}</h3>
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
                          subType.children.map(service => {
                            var id = "BookingServicesRadio" + service.id;
                            return (
                              <div className={classNames(s.bookingServicesItem, (service.id === selectedService) ? s.bookingServicesItemActive : '')} key={service.id}>
                                <input className={s.bookingServicesRadio} type="radio" id={service.id} name="service" value={service.id} checked={service.id === selectedService} onChange={this._onSelect.bind(this)} required />
                                <label className={s.bookingServicesRadioLabel} htmlFor={service.id}>
                                  <span><span></span></span><span>{`${service.name} (${parseFloat(service.duration)} hr${parseFloat(service.duration) > 1 ? 's' : ''})`}</span>
                                </label>
                                <div className={s.bookingServicesItemDescription}>
                                  {service.description} ({parseFloat(service.duration)} hours)<br />
                                  <span className={s.bookingServicesItemDescriptionPrice}>Starting from SGD {service.price} per session</span>
                                </div>
                              </div>
                            );
                          })
                        }
                      </div>
                    );
                  })
                }
                </div>
              </form>
              <div className={s.bookingServicesFooter}>
                <a href="/booking2" className="btn btn-primary" onClick={this._onNext.bind(this)}>NEXT</a>
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

  _onNext(event) {
    const location = history.getCurrentLocation();
    if (this._bookingServicesForm.checkValidity()) {
      event.preventDefault();

      this.props.setOrderService(this.state.selectedService);
      util.isNextLastPage('booking1', this.props.lastPage) && this.props.setLastPage('booking1');

      history.push({ pathname: '/booking2', query: location.query });
    } else {
      event.preventDefault();
      // alert('Please select a service');
      this.props.showAlertPopup('Please select a service.');
    }
  }

}

const mapStateToProps = (state) => {
  return {
    lastPage: state.lastPage,
    order: state.order,
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
    },
    showAlertPopup: (message) => {
      return dispatch(showAlertPopup(message));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingServices);
