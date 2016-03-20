import React, { Component } from 'react';
import './BookingNavigation.scss';
import Container from '../Container';
import BookingNavigationItem from '../BookingNavigationItem';

export default class BookingNavigation extends Component {

  render() {
    return (
      <div className="BookingNavigation-wrapper">
        <Container>
          <ul className="BookingNavigation">
            <BookingNavigationItem path={this.props.path} active={'booking1'} link={'booking1'} icon={'1'} text={'Select Service'} />
            <BookingNavigationItem path={this.props.path} active={'booking2'} link={'booking2'} icon={'2'} text={'Select Location'} />
            <BookingNavigationItem path={this.props.path} active={'booking3'} link={'booking3a'} icon={'3'} text={'Select Date & Time'} />
          </ul>
        </Container>
      </div>
    );
  }

}
