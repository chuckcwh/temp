import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Loader from 'react-loader';
import './BookingServices.scss';
import Container from '../Container';
import Link from '../Link';
import AlertPopup from '../AlertPopup';
import { setOrderService, setLastPage } from '../../actions';
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
      if (allServices[location.query.sid]) {
        this.state.selectedService = location.query.sid;
      }
    }
  }

  componentWillReceiveProps(props) {
    if (props.order && props.order.service) {
      this.setState({
        selectedService: props.order.service
      });
    } else if (props.allServices && props.location.query && props.location.query.sid) {
      for (var i = 0; i < props.allServices.length; i++) {
        if (parseInt(props.allServices[i].id) === parseInt(props.location.query.sid)) {
          this.setState({
            selectedService: props.allServices[i].id
          });
          break;
        }
      }
    }
  }

  render() {
    const { allServices } = this.props;
    const { filter, selectedService } = this.state;

    return (
      <div className="BookingServices">
        <Loader className="spinner" loaded={allServices ? true : false}>
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
                              <div className="BookingServicesItem" key={service.id}>
                                <input className="BookingServicesRadio" type="radio" id={id} name="service" value={service.id} checked={service.id === selectedService} onChange={this._onSelect.bind(this)} required />
                                <label className="BookingServicesRadioLabel" htmlFor={id}>
                                  <span><span></span></span><span>{service.name}</span>
                                </label>
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
        <AlertPopup ref={(c) => this._alertPopup = c} />
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
      this.props.setLastPage('booking1');
    } else {
      event.preventDefault();
      // alert('Please select a service');
      this._alertPopup.show('Please select a service.');
    }
  }

}

const mapStateToProps = (state) => {
  return {
    location: state.router && state.router.location,
    order: state.order,
    allServices: state.allServices
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setOrderService: (service) => {
      dispatch(setOrderService(service));
    },
    setLastPage: (page) => {
      dispatch(setLastPage(page));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingServices);
