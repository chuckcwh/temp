import React, { Component } from 'react';
import classNames from 'classnames';
import Loader from 'react-loader';
import './BookingServices.scss';
import Container from '../Container';
import Link from '../Link';
import AlertPopup from '../AlertPopup';
import BookingActions from '../../actions/BookingActions';
import Util from '../../core/Util';

export default class BookingServices extends Component {

  constructor(props) {
    super(props);
    this.state = {
      filter: Util.ALL_SERVICES,
      selectedService: undefined
    };
    if (this.props.booking && this.props.booking.service) {
      this.state.selectedService = this.props.booking.service;
    } else if (this.props.allServices && this.props.location.query && this.props.location.query.sid) {
      for (var i = 0; i < this.props.allServices.length; i++) {
        if (parseInt(this.props.allServices[i].id) === parseInt(this.props.location.query.sid)) {
          this.state.selectedService = this.props.allServices[i].id;
          break;
        }
      }
    }
  }

  componentWillReceiveProps(props) {
    if (props.booking && props.booking.service) {
      this.setState({
        selectedService: props.booking.service
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
    return (
      <div className="BookingServices">
        <Loader className="spinner" loaded={this.props.allServices ? true : false}>
          <div className="BookingServicesNav-wrapper">
            <Container>
              <ul className="BookingServicesNav">
                <li className="BookingServicesNav-item">
                  <a className={classNames('BookingServicesNav-link', (this.state.filter === Util.ALL_SERVICES) ? 'active' : '')} href="/" onClick={this._onClickFilter.bind(this, Util.ALL_SERVICES)}>All Services<span className="BookingServicesNav-arrow"><div className="nav-caret"></div></span></a>
                </li>
                <li className="BookingServicesNav-item">
                  <a className={classNames('BookingServicesNav-link', (this.state.filter === 'Home Social Care') ? 'active' : '')} href="/faq" onClick={this._onClickFilter.bind(this, 'Home Social Care')}>Home Social Care<span className="BookingServicesNav-arrow"><div className="nav-caret"></div></span></a>
                </li>
                <li className="BookingServicesNav-item">
                  <a className={classNames('BookingServicesNav-link', (this.state.filter === 'Home Nursing') ? 'active' : '')} href="/about" onClick={this._onClickFilter.bind(this, 'Home Nursing')}>Home Nursing Care<span className="BookingServicesNav-arrow"><div className="nav-caret"></div></span></a>
                </li>
                <li className="BookingServicesNav-item">
                  <a className={classNames('BookingServicesNav-link', (this.state.filter === 'Home Medical') ? 'active' : '')} href="/faq" onClick={this._onClickFilter.bind(this, 'Home Medical')}>Home Medical<span className="BookingServicesNav-arrow"><div className="nav-caret"></div></span></a>
                </li>
                <li className="BookingServicesNav-item">
                  <a className={classNames('BookingServicesNav-link', (this.state.filter === 'Home TCM') ? 'active' : '')} href="/faq" onClick={this._onClickFilter.bind(this, 'Home TCM')}>Home TCM<span className="BookingServicesNav-arrow"><div className="nav-caret"></div></span></a>
                </li>
              </ul>
            </Container>
          </div>
          <div>
            <Container>
              <form ref={(c) => this._bookingServicesForm = c}>
                <div className="BookingServicesBody">
                {
                  this.props.allServices && Util.subFilterServices(Util.filterServices(this.props.allServices, this.state.filter)).map(services => {
                    return (
                      <div key={services[0].subType}>
                        <h3>{this.state.filter === Util.ALL_SERVICES ? services[0].category + ' > ' : ''}{services[0].subType}</h3>
                        {
                          services.map((service) => {
                            var id = "BookingServicesRadio" + service.id;
                            return (
                              <div className="BookingServicesItem" key={service.id}>
                                <input className="BookingServicesRadio" type="radio" id={id} name="service" value={service.id} checked={service.id === this.state.selectedService} onChange={this._onSelect.bind(this)} required />
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
      Link.handleClick(event);
      BookingActions.setService(this.state.selectedService);
      BookingActions.setLast('booking1');
    } else {
      event.preventDefault();
      // alert('Please select a service');
      this._alertPopup.show('Please select a service.');
    }
  }

}
