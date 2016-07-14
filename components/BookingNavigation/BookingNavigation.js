import React, { Component } from 'react';
import { connect } from 'react-redux';
import s from './BookingNavigation.css';
import Container from '../Container';
import BookingNavigationItem from '../BookingNavigationItem';

class BookingNavigation extends Component {

  render() {
    return (
      <div className={s.bookingNavigationWrapper}>
        <Container>
          {this.props.user ? (
            <ul className={s.bookingNavigation}>
              <BookingNavigationItem active={'booking1'} link={'booking1'} icon={'1'} text={'Select Service'} />
              <BookingNavigationItem active={'booking2'} link={'booking2'} icon={'2'} text={'Select Location'} />
              <BookingNavigationItem active={'booking3'} link={'booking3a'} icon={'3'} text={'Select Date/Time'} />
            </ul>
          ) : (
            <ul className={s.bookingNavigation}>
              <BookingNavigationItem active={'booking1'} link={'booking1'} icon={'1'} text={'Service'} />
              <BookingNavigationItem active={'booking2'} link={'booking2'} icon={'2'} text={'Location'} />
              <BookingNavigationItem active={'booking3'} link={'booking3a'} icon={'3'} text={'Date/Time'} />
              <BookingNavigationItem active={'booking4'} link={'booking4'} icon={'4'} text={'Patient'} />
            </ul>
          )}
        </Container>
      </div>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    user: state.user.data
  }
}

export default connect(mapStateToProps)(BookingNavigation);