import React, { Component } from 'react';
import { connect } from 'react-redux';
import DayPicker, { DateUtils } from 'react-day-picker';
import some from 'lodash/some';
import remove from 'lodash/remove';
import moment from 'moment';
import 'react-day-picker/lib/style.css';
import s from './BookingDate.css';
import { setOrderDates, setLastPage, showAlertPopup } from '../../actions';
import history from '../../core/history';
import { isNextLastPage } from '../../core/util';

class BookingDate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedDates: this.props.order && this.props.order.dates || [],
    };
  }

  onSelectDay = (e, day) => {
    if (!this.isDisabled(day)) {
      const days = this.state.selectedDates;

      if (some(days, item => DateUtils.isSameDay(item, day))) {
        remove(days, item => DateUtils.isSameDay(item, day));
      } else {
        days.push(day);
        days.sort((a, b) => a.getTime() - b.getTime());
      }

      this.setState({ selectedDates: days });
    }
  };

  onNext = (event) => {
    const location = history.getCurrentLocation();
    if (this.state.selectedDates.length) {
      event.preventDefault();

      // this.props.booking.range = this.state.range;
      this.props.setOrderDates(this.state.selectedDates);
      isNextLastPage('booking3a', this.props.lastPage) && this.props.setLastPage('booking3a');

      history.push({ pathname: '/booking3b', query: location.query });
    } else {
      event.preventDefault();
      // alert('Please select a date range.');
      this.props.showAlertPopup('Please select at least one day.');
    }
  };

  isDisabled = (day) => {
    const d = DateUtils.clone(day);
    d.setDate(d.getDate() - 1);
    return DateUtils.isPastDay(d);
  };

  render() {
    let selectedDates;
    if (this.state.selectedDates.length) {
      selectedDates = (
        <h3>Selected Dates:</h3>
      );
    }
    return (
      <div className={s.bookingDate}>
        <div className="text-center">
          <DayPicker
            numberOfMonths={2}
            modifiers={{
              selected: day => this.state.selectedDates
                && some(this.state.selectedDates, item => DateUtils.isSameDay(item, day)),
              disabled: this.isDisabled,
            }}
            onDayClick={this.onSelectDay}
          />
        </div>
        <div className="text-center">
          {selectedDates}
          {
            this.state.selectedDates && this.state.selectedDates.map((day) => (
              <div key={day.getTime()}>{moment(day).format('DD MMM YYYY, dddd')}</div>
            ))
          }
        </div>
        <p></p>
        <div className="text-center">
          <a href="/booking3b" className="btn btn-primary" onClick={this.onNext}>NEXT</a>
        </div>
      </div>
    );
  }

}

BookingDate.propTypes = {
  lastPage: React.PropTypes.string,
  order: React.PropTypes.object,

  setOrderDates: React.PropTypes.func.isRequired,
  setLastPage: React.PropTypes.func.isRequired,
  showAlertPopup: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  lastPage: state.lastPage,
  order: state.order,
});

const mapDispatchToProps = (dispatch) => ({
  setOrderDates: (dates) => dispatch(setOrderDates(dates)),
  setLastPage: (page) => dispatch(setLastPage(page)),
  showAlertPopup: (message) => dispatch(showAlertPopup(message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookingDate);
