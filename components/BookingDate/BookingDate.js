import React, { Component } from 'react';
import { connect } from 'react-redux';
import DayPicker, { DateUtils } from 'react-day-picker';
import some from 'lodash/some';
import remove from 'lodash/remove';
import moment from 'moment';
import './BookingDate.scss';
import Link from '../Link';
import { setOrderDates, setLastPage, showAlertPopup } from '../../actions';

class BookingDate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedDates: this.props.order && this.props.order.dates || []
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
                return this.state.selectedDates && some(this.state.selectedDates, item => DateUtils.isSameDay(item, day));
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
      </div>
    );
  }

  _isDisabled(day) {
    var d = DateUtils.clone(day);
    d.setDate(d.getDate() - 1);
    return DateUtils.isPastDay(d);
  }

  _onSelectDay(e, day) {
    if (!this._isDisabled(day)) {
      let days = this.state.selectedDates;

      if (some(days, item => DateUtils.isSameDay(item, day))) {
        remove(days, item => DateUtils.isSameDay(item, day));
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
      Link.handleClickQuery(this.props.location && this.props.location.query, event);

      // this.props.booking.range = this.state.range;
      this.props.setOrderDates(this.state.selectedDates);
      this.props.setLastPage('booking3a');
    } else {
      event.preventDefault();
      // alert('Please select a date range.');
      this.props.showAlertPopup('Please select at least one day.');
    }
  }

}

const mapStateToProps = (state) => {
  return {
    location: state.router && state.router.location,
    order: state.order
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setOrderDates: (dates) => {
      return dispatch(setOrderDates(dates));
    },
    setLastPage: (page) => {
      return dispatch(setLastPage(page));
    },
    showAlertPopup: (message) => {
      return dispatch(showAlertPopup(message));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingDate);
