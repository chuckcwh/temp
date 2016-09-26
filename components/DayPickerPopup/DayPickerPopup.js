import React, { Component } from 'react';
import { connect } from 'react-redux';
import DayPicker, { DateUtils } from 'react-day-picker';
import moment from 'moment';
import 'react-day-picker/lib/style.css';
import s from './DayPickerPopup.css';
import Popup from '../Popup';
import { hideDayPickerPopup } from '../../actions';

const currentYear = (new Date()).getFullYear();
const defaultFromMonth = new Date(currentYear - 100, 0, 1, 0, 0);
const defaultToMonth = new Date(currentYear + 50, 0, 1, 0, 0);

const YearMonthForm = ({ date = new Date(), localeUtils, onChange, fromMonth, toMonth }) => {
  const months = localeUtils.getMonths();

  const years = [];
  for (let i = toMonth.getFullYear(); i >= fromMonth.getFullYear(); i--) {
    years.push(i);
  }

  const handleChange = (e) => {
    const { year, month } = e.target.form;
    onChange(new Date(year.value, month.value));
  };

  return (
    <form className="DayPicker-Caption">
      <select name="year" onChange={handleChange} value={date.getFullYear()}>
        {
          years.map((year, i) =>
            <option key={i} value={year}>
              {year}
            </option>
          )
        }
      </select>
      <select name="month" onChange={handleChange} value={date.getMonth()}>
        {
          months.map((month, i) =>
            <option key={i} value={i}>
              {month}
            </option>
          )
        }
      </select>
    </form>
  );
};

YearMonthForm.propTypes = {
  date: React.PropTypes.object,
  localeUtils: React.PropTypes.object,
  onChange: React.PropTypes.func.isRequired,
  fromMonth: React.PropTypes.object,
  toMonth: React.PropTypes.object,
};

class DayPickerPopup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      initialMonth: this.props.value && new Date(this.props.value) || new Date(),
    };
  }

  handleClickDay = (event, day, { disabled }) => {
    if (disabled) {
      return;
    }
    if (this.props.onDayClick) {
      this.props.onDayClick(event, DateUtils.clone(day));
    }
    this.props.hideDayPickerPopup(moment(DateUtils.clone(day)).format('YYYY-MM-DD'), this.props.source);
  };

  isDisabled = (day) => {
    if (this.props.fromMonth && this.props.toMonth) {
      return this.props.fromMonth > day || day > this.props.toMonth;
    } else if (this.props.fromMonth) {
      return this.props.fromMonth > day;
    } else if (this.props.toMonth) {
      return day > this.props.toMonth;
    }
  };

  closePopup = () => {
    this.props.hideDayPickerPopup(null, this.props.source);
  };

  render() {
    return (
      <div className={s.dayPickerPopup}>
        <Popup
          css={s}
          title={this.props.title}
          isOpen={this.props.visible}
          onCloseClicked={this.closePopup}
          onOverlayClicked={this.closePopup}
        >
          <div className="YearNavigation">
            <DayPicker
              initialMonth={this.state.initialMonth}
              fromMonth={this.props.fromMonth || defaultFromMonth}
              toMonth={this.props.toMonth || defaultToMonth}
              captionElement={
                <YearMonthForm
                  date={new Date(this.props.value)}
                  onChange={initialMonth => this.setState({ initialMonth })}
                  fromMonth={this.props.fromMonth || defaultFromMonth}
                  toMonth={this.props.toMonth || defaultToMonth}
                />
              }
              selectedDays={day => DateUtils.isSameDay(new Date(this.props.value), day)}
              disabledDays={this.isDisabled}
              onDayClick={this.handleClickDay}
            />
          </div>
        </Popup>
      </div>
    );
  }

}

DayPickerPopup.propTypes = {
  onDayClick: React.PropTypes.func,
  title: React.PropTypes.string,
  fromMonth: React.PropTypes.object,
  toMonth: React.PropTypes.object,

  visible: React.PropTypes.bool,
  value: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.object,
  ]),
  source: React.PropTypes.string,

  hideDayPickerPopup: React.PropTypes.func,
};

const mapStateToProps = (state) => ({
  visible: state.modal.daypicker.visible,
  value: state.modal.daypicker.value,
  source: state.modal.daypicker.source,
});

const mapDispatchToProps = (dispatch) => ({
  hideDayPickerPopup: (day, source) => dispatch(hideDayPickerPopup(day, source)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DayPickerPopup);
