import React, { Component } from 'react';
import { connect } from 'react-redux';
import linkState from 'react-link-state';
import s from './BookingTime.css';
import Link from '../Link';
import { setOrderTimeslots, setLastPage, showAlertPopup } from '../../actions';
import history from '../../core/history';
import util from '../../core/util';

class BookingTime extends Component {

  constructor(props) {
    super(props);
    const { order } = this.props;
    this.state = {
      Morning: order && order.timeslots && order.timeslots.indexOf('Morning')>-1,
      Afternoon: order && order.timeslots && order.timeslots.indexOf('Afternoon')>-1,
      Evening: order && order.timeslots && order.timeslots.indexOf('Evening')>-1
    };
  }

  render() {
    return (
      <div className={s.bookingTime}>
        <div>
          <div className={s.bookingTimeItem}>
            <input className={s.bookingTimeCheckbox} type="checkbox" id="timeMorning" name="time" checkedLink={linkState(this, 'Morning')} value="Morning" />
            <label className={s.bookingTimeCheckboxLabel} htmlFor="timeMorning">
              <span></span><span>Morning: 8.00am - 11:00am</span>
            </label>
          </div>
          <div className={s.bookingTimeItem}>
            <input className={s.bookingTimeCheckbox} type="checkbox" id="timeAfternoon" name="time" checkedLink={linkState(this, 'Afternoon')} value="Afternoon" />
            <label className={s.bookingTimeCheckboxLabel} htmlFor="timeAfternoon">
              <span></span><span>Afternoon: 12:00pm - 5:00pm</span>
            </label>
          </div>
          <div className={s.bookingTimeItem}>
            <input className={s.bookingTimeCheckbox} type="checkbox" id="timeEvening" name="time" checkedLink={linkState(this, 'Evening')} value="Evening" />
            <label className={s.bookingTimeCheckboxLabel} htmlFor="timeEvening">
              <span></span><span>Evening: 7:00pm - 10:00pm</span>
            </label>
          </div>
        </div>
        <p></p>
        <div className="text-center">
          <a href="/booking3c" className="btn btn-primary" onClick={this._onNext.bind(this)}>NEXT</a>
        </div>
      </div>
    );
  }

  _onNext(event) {
    const location = history.getCurrentLocation();

    var timeslots = [];
    for (var timeslot in this.state) {
      if (this.state[timeslot]) {
        timeslots.push(timeslot);
      }
    }

    if (timeslots.length === 0) {
      this.props.showAlertPopup('Please select at least one timeslot.');
      return event.preventDefault();
    }

    event.preventDefault();

    this.props.setOrderTimeslots(timeslots);
    util.isNextLastPage('booking3b', this.props.lastPage) && this.props.setLastPage('booking3b');

    history.push({ pathname: '/booking3c', query: location.query });
  }

}

const mapStateToProps = (state) => {
  return {
    lastPage: state.lastPage,
    order: state.order
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setOrderTimeslots: (timeslots) => {
      return dispatch(setOrderTimeslots(timeslots));
    },
    setLastPage: (page) => {
      return dispatch(setLastPage(page));
    },
    showAlertPopup: (message) => {
      return dispatch(showAlertPopup(message));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingTime);
