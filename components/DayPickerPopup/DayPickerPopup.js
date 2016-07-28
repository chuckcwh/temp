import React, { Component } from 'react';
import { connect } from 'react-redux';
import DayPicker, { DateUtils } from 'react-day-picker';
import moment from 'moment';
import 'react-day-picker/lib/style.css';
import s from './DayPickerPopup.css';
import Popup from '../Popup';
import { hideDayPickerPopup } from '../../actions';

const currentYear = (new Date()).getFullYear();
const fromMonth = new Date(currentYear - 100, 0, 1, 0, 0);
const toMonth = new Date();

function YearMonthForm({ date, localeUtils, onChange }) {
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
}

YearMonthForm.propTypes = {
  date: React.PropTypes.object,
  localeUtils: React.PropTypes.object,
  onChange: React.PropTypes.func.isRequired,
};

class DayPickerPopup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      initialMonth: toMonth,
    };
  }

  onClickDay = (event, day) => {
    if (this.props.onDayClick) {
      this.props.onDayClick(event, DateUtils.clone(day));
    }
    this.props.hideDayPickerPopup(moment(DateUtils.clone(day)).format('YYYY-MM-DD'), this.props.source);
  };

  closePopup = () => {
    this.props.hideDayPickerPopup();
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
              fromMonth={fromMonth}
              toMonth={toMonth}
              captionElement={
                <YearMonthForm onChange={initialMonth => this.setState({ initialMonth })} />
              }
              modifiers={this.props.value && !isNaN(Date.parse(this.props.value)) ? {
                selected: day => DateUtils.isSameDay(new Date(this.props.value), day),
                disabled: day => !DateUtils.isPastDay(day),
              } : {
                disabled: day => !DateUtils.isPastDay(day),
              }}
              onDayClick={this.onClickDay}
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

  visible: React.PropTypes.bool,
  value: React.PropTypes.string,
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
