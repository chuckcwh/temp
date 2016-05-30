import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Loader from 'react-loader';
import './BookingServices.scss';
import Container from '../Container';
import Link from '../Link';
import { fetchServices, setOrderService, setLastPage, showAlertPopup } from '../../actions';
import Util from '../../core/Util';

class BookingServices extends Component {

  constructor(props) {
    super(props);
    const { allServices, order, location } = this.props;
    this.state = {
      filter: Util.ALL_SERVICES,
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
    const { allServices, order, location } = props;
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

    return (
      <div className="BookingServices">
        <Loader className="spinner" loaded={allServicesFetching ? false : true}>
          <div className="BookingServicesNav-wrapper">
            <Container>
              <ul className="BookingServicesNav">
              {
                Util.SERVICES_CATEGORY_ORDER.map(category => {
                  return (
                    <li className="BookingServicesNav-item" key={category}>
                      <a className={classNames('BookingServicesNav-link', (filter === category) ? 'active' : '')} href="#" onClick={this._onClickFilter.bind(this, category)}>{category}<span className="BookingServicesNav-arrow"><div className="nav-caret"></div></span></a>
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
                <div className="BookingServicesBody">
                {
                  allServices && Util.subFilterServices(Util.filterServices(allServices, filter)).map(services => {
                    var header;
                    if (filter === Util.ALL_SERVICES) {
                      header = (
                        <h3><a href="#" onClick={this._onClickFilter.bind(this, services[0].category)}>{services[0].category}</a> &gt; {services[0].subType}</h3>
                      );
                    } else {
                      header = (
                        <h3>{services[0].subType}</h3>
                      );
                    }
                    return (
                      <div className="BookingServicesSection" key={services[0].subType}>
                        {header}
                        {
                          services.map((service, index) => {
                            var id = "BookingServicesRadio" + service.id;
                            return (
                              <div className={classNames('BookingServicesItem', (service.id === selectedService) ? 'active' : '')} key={service.id}>
                                <input className="BookingServicesRadio" type="radio" id={id} name="service" value={service.id} checked={service.id === selectedService} onChange={this._onSelect.bind(this)} required />
                                <label className="BookingServicesRadioLabel" htmlFor={id}>
                                  <span><span></span></span><span>{service.name}</span>
                                </label>
                                <div className="BookingServicesItemDescription">
                                  {service.description} ({parseFloat(service.duration)} hours)<br />
                                  <span className="BookingServicesItemDescription-price">Starting from SGD {service.price} per session</span>
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
              <div className="BookingServicesFooter">
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
    if (this._bookingServicesForm.checkValidity()) {
      Link.handleClickQuery(this.props.location && this.props.location.query, event);

      this.props.setOrderService(this.state.selectedService);
      Util.isNextLastPage('booking1', this.props.lastPage) && this.props.setLastPage('booking1');
    } else {
      event.preventDefault();
      // alert('Please select a service');
      this.props.showAlertPopup('Please select a service.');
    }
  }

}

const mapStateToProps = (state) => {
  return {
    location: state.router && state.router.location,
    lastPage: state.lastPage,
    order: state.order,
    allServices: state.allServices.items,
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
