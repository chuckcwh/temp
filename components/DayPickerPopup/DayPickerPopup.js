import React, { Component } from 'react';
import { connect } from 'react-redux';
import DayPicker, { DateUtils } from 'react-day-picker';
import moment from 'moment';
import './DayPickerPopup.scss';
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

class DayPickerPopup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      initialMonth: toMonth
    };
  }

  render() {
    return (
      <div className="DayPickerPopup">
        <Popup title={this.props.title} isOpen={this.props.visible} onCloseClicked={this._closePopup.bind(this)} onOverlayClicked={this._closePopup.bind(this)}>
          <div className="YearNavigation">
            <DayPicker
              initialMonth={ this.state.initialMonth }
              fromMonth={ fromMonth }
              toMonth={ toMonth }
              captionElement={
                <YearMonthForm onChange={ initialMonth => this.setState({ initialMonth }) } />
              }
              modifiers={this.props.value && Date.parse(this.props.value) !== NaN ? {
                selected: day => DateUtils.isSameDay(new Date(this.props.value), day),
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

  _closePopup() {
    this.props.hideDayPickerPopup();
  }

  _onClickDay(event, day) {
    if (this.props.onDayClick) {
      this.props.onDayClick(event, DateUtils.clone(day));
    }
    this.props.hideDayPickerPopup(moment(DateUtils.clone(day)).format('YYYY-MM-DD'), this.props.source);
  }

}

DayPickerPopup.propTypes = {
  onDayClick: React.PropTypes.func,
  title: React.PropTypes.string
};

const mapStateToProps = (state) => {
  return {
    visible: state.modal.daypicker.visible,
    value: state.modal.daypicker.value,
    source: state.modal.daypicker.source
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    hideDayPickerPopup: (day, source) => {
      return dispatch(hideDayPickerPopup(day, source));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DayPickerPopup);
