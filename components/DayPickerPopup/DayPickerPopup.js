import React, { Component } from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import './DayPickerPopup.scss';
import Popup from '../Popup';

const currentYear = (new Date()).getFullYear();
const fromMonth = new Date(currentYear - 100, 0, 1, 0, 0);
const toMonth = new Date();

function YearMonthForm({ date, localeUtils, onChange }) {

  const months = localeUtils.getMonths();

  const years = [];
  for (let i = toMonth.getFullYear(); i >= fromMonth.getFullYear(); i--) {
    years.push(i);
  }

  const handleChange = function(e) {
    const { year, month } = e.target.form;
    onChange(new Date(year.value, month.value));
  }

  return (
    <form className="DayPicker-Caption">
      <select name="year" onChange={ handleChange } value={ date.getFullYear() }>
        { years.map((year, i) =>
          <option key={ i } value={ year }>
            { year }
          </option>)
        }
      </select>
      <select name="month" onChange={ handleChange } value={ date.getMonth() }>
        { months.map((month, i) =>
          <option key={ i } value={ i }>
            { month }
          </option>)
        }
      </select>
    </form>
  )
}

export default class DayPickerPopup extends Component {

  static propTypes = {
    title: React.PropTypes.string,

    onDayClick: React.PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      initialMonth: toMonth
    };
  }

  render() {
    return (
      <div className="DayPickerPopup">
        <Popup ref={(c) => this._dayPickerPopup = c} title={this.props.title}>
          <div className="YearNavigation">
            <DayPicker
              initialMonth={ this.state.initialMonth }
              fromMonth={ fromMonth }
              toMonth={ toMonth }
              captionElement={
                <YearMonthForm onChange={ initialMonth => this.setState({ initialMonth }) } />
              }
              modifiers={this.props.value && Date.parse(this.props.value) !== NaN ? {
                selected: day => DateUtils.isSameDay(this.props.value, day),
                disabled: day => !DateUtils.isPastDay(day)
              } : {
                disabled: day => !DateUtils.isPastDay(day)
              }}
              onDayClick={this._onClickDay.bind(this)}
            />
          </div>
        </Popup>
      </div>
    );
  }

  _onClickDay(event, day) {
    if (this.props.onDayClick) {
      this.props.onDayClick(event, DateUtils.clone(day));
    }
    this._dayPickerPopup.hide();
  }

  show() {
    this._dayPickerPopup.show();
  }

}
