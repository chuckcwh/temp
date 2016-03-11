import React, { Component } from 'react';
import DateRangePicker from 'react-daterange-picker';
import './BookingDate.scss';
import Link from '../Link';
import AlertPopup from '../AlertPopup';
import BookingActions from '../../actions/BookingActions';

export default class BookingDate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      range: this.props.booking && this.props.booking.range  // { start: Moment, end: Moment }
    };
  }

  render() {
    var minimumDate = new Date();
    minimumDate.setDate(minimumDate.getDate() + 3);
    return (
      <div className="BookingDate">
        <div className="text-center">
          <DateRangePicker numberOfCalendars={2} selectionType="range" singleDateRange={true} minimumDate={minimumDate} value={this.state.range} onSelect={this._handleSelect.bind(this)} />
        </div>
        <div className="text-center">
          <form id="BookingDateForm">
            <input className="btn-inline" type="text" id="startDate" name="startDate" value={this.state.range && this.state.range.start && this.state.range.start.format('ll')} required readOnly />
            <div className="BookingDateTo"><i>to</i></div>
            <input className="btn-inline" type="text" id="endDate" name="endDate" value={this.state.range && this.state.range.end && this.state.range.end.format('ll')} required readOnly />
          </form>
        </div>
        <p></p>
        <div className="text-center">
          <a href="/booking3b" className="btn btn-primary" onClick={this._onNext.bind(this)}>NEXT</a>
        </div>
        <AlertPopup ref={(c) => this._alertPopup = c}>
          Please select a date range.
        </AlertPopup>
      </div>
    );
  }

  _handleSelect(range) {
    this.setState({
      range: range
    });
  }

  _onNext(event) {
    var form = document.getElementById('BookingDateForm');
    if (form.checkValidity()) {
      Link.handleClick(event);

      // this.props.booking.range = this.state.range;
      BookingActions.setDates(this.state.range);
      BookingActions.setLast('booking3a');
    } else {
      event.preventDefault();
      // alert('Please select a date range.');
      this._alertPopup.show();
    }
  }

}
