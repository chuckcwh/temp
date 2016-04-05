import React, { Component } from 'react';
import DayPicker from 'react-day-picker';
import some from 'lodash.some';
import remove from 'lodash.remove';
import moment from 'moment';
import './BookingDate.scss';
import Link from '../Link';
import AlertPopup from '../AlertPopup';
import BookingActions from '../../actions/BookingActions';

export default class BookingDate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedDates: this.props.booking && this.props.booking.dates || []
    };
  }

  render() {
    var selectedDates;
    if (this.state.selectedDates.length) {
      selectedDates = (
        <h3>Selected Dates:</h3>
      );
    }
    return (
      <div className="BookingDate">
        <div className="text-center">
          {/*
          <DateRangePicker numberOfCalendars={2} selectionType="range" singleDateRange={true} minimumDate={minimumDate} value={this.state.range} onSelect={this._handleSelect.bind(this)} />
          */}
          <DayPicker
            numberOfMonths={2}
            modifiers={{
              selected: day => {
                return this.state.selectedDates && some(this.state.selectedDates, item => this._isSameDay(item, day));
              },
              disabled: this._isDisabled
            }}
            onDayClick={this._onSelectDay.bind(this)}
          />
        </div>
        <div className="text-center">
          {selectedDates}
          {
            this.state.selectedDates && this.state.selectedDates.map((day, k) => {
              return (
                <div key={day.getTime()}>{moment(day).format('DD MMM YYYY, dddd')}</div>
              );
            })
          }
        </div>
        <p></p>
        <div className="text-center">
          <a href="/booking3b" className="btn btn-primary" onClick={this._onNext.bind(this)}>NEXT</a>
        </div>
        <AlertPopup ref={(c) => this._alertPopup = c} />
      </div>
    );
  }

  _isSameDay(d1, d2) {
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);

    return d1.getTime() === d2.getTime();
  }

  _isDisabled(day) {
    let today = new Date();
    today.setDate(today.getDate() + 3);
    return day < today;
  }

  _onSelectDay(e, day) {
    if (!this._isDisabled(day)) {
      let days = this.state.selectedDates;

      if (some(days, item => this._isSameDay(item, day))) {
        remove(days, item => this._isSameDay(item, day));
      } else {
        days.push(day);
        days.sort((a, b) => {
          return a.getTime() - b.getTime();
        });
      }

      this.setState({
        selectedDates: days
      });
    }
  }

  _handleSelect(range) {
    this.setState({
      range: range
    });
  }

  _onNext(event) {
    if (this.state.selectedDates.length) {
      Link.handleClick(event);

      // this.props.booking.range = this.state.range;
      BookingActions.setDates(this.state.selectedDates);
      BookingActions.setLast('booking3a');
    } else {
      event.preventDefault();
      // alert('Please select a date range.');
      this._alertPopup.show('Please select at least one day.');
    }
  }

}
