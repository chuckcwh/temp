import React, { Component } from 'react';
import { connect } from 'react-redux';
import linkState from 'react-link-state';
import s from './BookingTime.css';
import { setOrderTimeslots, setLastPage, showAlertPopup } from '../../actions';
import history from '../../core/history';
import util from '../../core/util';

class BookingTime extends Component {

  constructor(props) {
    super(props);
    const { order } = this.props;
    this.state = {
      morning: order && order.timeslots && order.timeslots.indexOf('morning') > -1,
      afternoon: order && order.timeslots && order.timeslots.indexOf('afternoon') > -1,
      evening: order && order.timeslots && order.timeslots.indexOf('evening') > -1,
    };
  }

  onNext = (event) => {
    const location = history.getCurrentLocation();

    const timeslots = Object.keys(this.state).reduce((arr, timeslot) => {
      if (this.state[timeslot]) arr.push(timeslot);
      return arr;
    }, []);

    if (timeslots.length === 0) {
      this.props.showAlertPopup('Please select at least one timeslot.');
      event.preventDefault();
      return;
    }

    event.preventDefault();

    this.props.setOrderTimeslots(timeslots);
    util.isNextLastPage('booking3b', this.props.lastPage) && this.props.setLastPage('booking3b');

    history.push({ pathname: '/booking3c', query: location.query });
  };

  render() {
    const checkedLink = key => linkState(this, key);
    const handleChange = key => e => {
      checkedLink(key).requestChange(e.target.checked);
    };
    return (
      <div className={s.bookingTime}>
        <div>
          <div className={s.bookingTimeItem}>
            <input
              className={s.bookingTimeCheckbox}
              type="checkbox"
              id="timeMorning"
              checked={checkedLink('morning').value}
              onChange={handleChange('morning')}
              value="morning"
            />
            <label className={s.bookingTimeCheckboxLabel} htmlFor="timeMorning">
              <span></span><span>Morning: 8.00am - 11:00am</span>
            </label>
          </div>
          <div className={s.bookingTimeItem}>
            <input
              className={s.bookingTimeCheckbox}
              type="checkbox"
              id="timeAfternoon"
              checked={checkedLink('afternoon').value}
              onChange={handleChange('afternoon')}
              value="afternoon"
            />
            <label className={s.bookingTimeCheckboxLabel} htmlFor="timeAfternoon">
              <span></span><span>Afternoon: 12:00pm - 5:00pm</span>
            </label>
          </div>
          <div className={s.bookingTimeItem}>
            <input
              className={s.bookingTimeCheckbox}
              type="checkbox"
              id="timeEvening"
              checked={checkedLink('evening').value}
              onChange={handleChange('evening')}
              value="evening"
            />
            <label className={s.bookingTimeCheckboxLabel} htmlFor="timeEvening">
              <span></span><span>Evening: 7:00pm - 10:00pm</span>
            </label>
          </div>
        </div>
        <p></p>
        <div className="text-center">
          <a href="/booking3c" className="btn btn-primary" onClick={this.onNext}>NEXT</a>
        </div>
      </div>
    );
  }

}

BookingTime.propTypes = {
  lastPage: React.PropTypes.string.isRequired,
  order: React.PropTypes.object.isRequired,

  setOrderTimeslots: React.PropTypes.func,
  setLastPage: React.PropTypes.func,
  showAlertPopup: React.PropTypes.func,
};

const mapStateToProps = (state) => ({
  lastPage: state.lastPage,
  order: state.order,
});

const mapDispatchToProps = (dispatch) => ({
  setOrderTimeslots: (timeslots) => dispatch(setOrderTimeslots(timeslots)),
  setLastPage: (page) => dispatch(setLastPage(page)),
  showAlertPopup: (message) => dispatch(showAlertPopup(message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookingTime);
