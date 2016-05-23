import React, { Component } from 'react';
import { connect } from 'react-redux';
import linkState from 'react-link-state';
import './BookingTime.scss';
import Link from '../Link';
import { setOrderTimeslots, setLastPage, showAlertPopup } from '../../actions';
import Util from '../../core/Util';

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
      <div className="BookingTime">
        <div>
          <div className="BookingTimeItem">
            <input className="BookingTimeCheckbox" type="checkbox" id="timeMorning" name="time" checkedLink={linkState(this, 'Morning')} value="Morning" />
            <label className="BookingTimeCheckboxLabel" htmlFor="timeMorning">
              <span></span><span>Morning: 8.00am - 11:00am</span>
            </label>
          </div>
          <div className="BookingTimeItem">
            <input className="BookingTimeCheckbox" type="checkbox" id="timeAfternoon" name="time" checkedLink={linkState(this, 'Afternoon')} value="Afternoon" />
            <label className="BookingTimeCheckboxLabel" htmlFor="timeAfternoon">
              <span></span><span>Afternoon: 12:00pm - 5:00pm</span>
            </label>
          </div>
          <div className="BookingTimeItem">
            <input className="BookingTimeCheckbox" type="checkbox" id="timeEvening" name="time" checkedLink={linkState(this, 'Evening')} value="Evening" />
            <label className="BookingTimeCheckboxLabel" htmlFor="timeEvening">
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

    Link.handleClickQuery(this.props.location && this.props.location.query, event);

    this.props.setOrderTimeslots(timeslots);
    Util.isNextLastPage('booking3b', this.props.lastPage) && this.props.setLastPage('booking3b');
  }

}

const mapStateToProps = (state) => {
  return {
    location: state.router && state.router.location,
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
