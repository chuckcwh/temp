import React, { Component } from 'react';
import classNames from 'classNames';
import './BookingApp.scss';
import Container from '../Container';
import Link from '../Link';
import BookingNavigation from '../BookingNavigation';
import BookingServices from '../BookingServices';
import BookingLocation from '../BookingLocation';
import BookingDateTime from '../BookingDateTime';
import BookingDate from '../BookingDate';
import BookingTime from '../BookingTime';
import BookingResults from '../BookingResults';
import BookingSidebar from '../BookingSidebar';
import BookingActions from '../../actions/BookingActions';
import BookingStore from '../../stores/BookingStore';

export default class BookingApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      allServices: undefined,
      allServicesHash: undefined,
      filteredServices: undefined,
      selectedService: undefined,
      // query: BookingStore.getQuery()
      query: {}
    };
  }

  componentDidMount() {
    BookingStore.addChangeListener(this._onChange.bind(this));

    this.serverRequest = $.ajax({
      url: 'http://161.202.19.121/api/getServices',
      dataType: 'json',
      headers: {
        'Authorization': 'Basic ' + btoa('secret:secret0nlyWeilsonKnowsShhh852~')
      },
      success: data => {
        if (data && data.services && Array.isArray(data.services)) {
          // BookingActions.setServices(data.services);
          this.setState({
            allServices: data.services,
            allServicesHash: this._hashServices(data.services)
          });
          // console.log(this.state.allServices);
        } else {
          console.error('Failed to obtain services data.');
        }
      },
      error: (xhr, status, err) => {
        console.error('http://161.202.19.121/api/getServices', status, err.toString());
      }
    });
  }

  componentWillUnmount() {
    BookingStore.removeChangeListener(this._onChange.bind(this));

    this.serverRequest.abort();
  }

  render() {
    var component;
    if (this.props.location && this.props.path === '/booking1') {
      component = 
        <BookingServices allServices={this.state.allServices} query={this.state.query} />;
    } else if (this.props.location && this.props.path === '/booking2') {
      component = 
        <BookingLocation allServicesHash={this.state.allServicesHash} query={this.state.query}>
          <BookingSidebar allServicesHash={this.state.allServicesHash} query={this.state.query} />
        </BookingLocation>;
    } else if (this.props.location && this.props.path === '/booking3a') {
      component = 
        <BookingDateTime query={this.state.query} path={this.props.path}>
          <BookingDate query={this.state.query} />
          <BookingSidebar allServicesHash={this.state.allServicesHash} query={this.state.query} />
        </BookingDateTime>;
    } else if (this.props.location && this.props.path === '/booking3b') {
      component = 
        <BookingDateTime query={this.state.query} path={this.props.path}>
          <BookingTime query={this.state.query} />
          <BookingSidebar allServicesHash={this.state.allServicesHash} query={this.state.query} />
        </BookingDateTime>;
    } else if (this.props.location && this.props.path === '/booking3c') {
      component = 
        <BookingDateTime query={this.state.query} path={this.props.path}>
          <BookingResults query={this.state.query} />
          <BookingSidebar allServicesHash={this.state.allServicesHash} query={this.state.query} />
        </BookingDateTime>;
    }
    return (
      <div className="BookingApp">
        <BookingNavigation path={this.props.path} />
        {component}
      </div>
    );
  }

  /**
   * Event handler for 'change' events coming from the BookingStore
   */
  _onChange() {
    this.setState({
      allServices: BookingStore.getServices(),
      allServicesHash: BookingStore.getServicesHash(),
      query: BookingStore.getQuery()
    });
    // this.setState(BookingStore.getState());
  }

  _hashServices(services) {
    var hash = {};
    services.forEach(function(service) {
      hash[service.id] = service;
    });
    return hash;
  }

}
