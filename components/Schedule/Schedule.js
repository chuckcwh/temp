import React, { Component } from 'react';
import s from './Schedule.css';
import { USER_SCHEDULES_UPDATE_FAILURE,
  getUserSchedules, updateUserSchedules, showAlertPopup } from '../../actions';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import DayPicker, { DateUtils } from 'react-day-picker';
import some from 'lodash/some';
import remove from 'lodash/remove';
import cx from 'classnames';
import 'react-day-picker/lib/style.css';
import moment from 'moment';
import Link from '../Link';
import Container from '../Container';
import Header from '../Header';

class Schedule extends Component {

  constructor(props) {
    super(props);
    this.state = {
      morning: false,
      afternoon: false,
      evening: false,

      selectedDates: [],
    };
  }

  componentDidMount() {
    if (this.props.user && this.props.user._id) {
      this.props.getUserSchedules({
        userId: this.props.user._id,
      });
    }
  }

  handleSelectTimeslot = (timeslot) => (e) => {
    this.setState({ [timeslot]: e.target.checked });
  };

  onSelectDay = (e, day) => {
    const days = this.state.selectedDates;

    if (some(days, item => DateUtils.isSameDay(item, day))) {
      remove(days, item => DateUtils.isSameDay(item, day));
    } else {
      days.push(day);
      days.sort((a, b) => a.getTime() - b.getTime());
    }

    this.setState({ selectedDates: days });
  };

  renderDay = (day) => {
    const { user } = this.props;
    const date = moment(day).format('YYYY-MM-DD');
    if (user.schedulesByDateSlot && user.schedulesByDateSlot[date]) {
      return (
        <div className="DayPicker-Day-Wrapper">
          <span>{day.getDate()}</span>
          {this.props.config.timeSlots.map(timeSlot => {
            if (user.schedulesByDateSlot[date][timeSlot.value]) {
              return <div className={timeSlot.value} key={timeSlot.value}></div>;
            }
            return;
          })}
        </div>
      );
    }
    return (<span>{day.getDate()}</span>);
  };

  onSubmitDates = () => {
    if (this.props.user) {
      const data = [];
      this.state.selectedDates.map(date => {
        const day = moment(date).format('YYYY-MM-DD');
        this.props.config.timeSlots.map(timeSlot => {
          if ((!this.props.user.schedulesByDateSlot[day] || !this.props.user.schedulesByDateSlot[day][timeSlot.value])
              && this.state[timeSlot.value]) {
            data.push({
              dateTimeStart: day,
              timeSlot: timeSlot.value,
            });
          } else if (this.props.user.schedulesByDateSlot[day][timeSlot.value] && !this.state[timeSlot.value]) {
            data.push({
              _id: this.props.user.schedulesByDateSlot[day][timeSlot.value]._id,
              remove: true,
            });
          }
        });
      });
      this.props.updateUserSchedules({
        userId: this.props.user._id,
        data: data,
      }).then((res) => {
        if (res && res.type === USER_SCHEDULES_UPDATE_FAILURE) {
          this.props.showAlertPopup('Sorry, there was a system error.')
        }
        this.setState({ selectedDates: [] });
      });
    }
  };

  render() {
    const { user } = this.props;
    return (
      <div className={s.schedule}>
        <Header title="Schedule" />
        <Container>
          <div className={s.scheduleWrapper}>
            <div className={s.scheduleDayPicker}>
              <DayPicker
                renderDay={this.renderDay}
                modifiers={{
                  selected: day => this.state.selectedDates
                    && some(this.state.selectedDates, item => DateUtils.isSameDay(item, day)),
                }}
                onDayClick={this.onSelectDay}
              />
            </div>
            <div className={s.scheduleLegend}>
              <div className={cx(s.scheduleLegendTimeslot, s.scheduleLegendTimeslotMorning)}>
                <input
                  className={s.rememberMeCheckbox}
                  type="checkbox"
                  id="morning"
                  value={this.state.morning}
                  onChange={this.handleSelectTimeslot('morning')}
                />
                <label className={s.rememberMeCheckboxLabel} htmlFor="morning">
                  <span></span><span>Morning</span>
                </label>
              </div>
              <div className={cx(s.scheduleLegendTimeslot, s.scheduleLegendTimeslotAfternoon)}>
                <input
                  className={s.rememberMeCheckbox}
                  type="checkbox"
                  id="afternoon"
                  value={this.state.afternoon}
                  onChange={this.handleSelectTimeslot('afternoon')}
                />
                <label className={s.rememberMeCheckboxLabel} htmlFor="afternoon">
                  <span></span><span>Afternoon</span>
                </label>
              </div>
              <div className={cx(s.scheduleLegendTimeslot, s.scheduleLegendTimeslotEvening)}>
                <input
                  className={s.rememberMeCheckbox}
                  type="checkbox"
                  id="evening"
                  value={this.state.evening}
                  onChange={this.handleSelectTimeslot('evening')}
                />
                <label className={s.rememberMeCheckboxLabel} htmlFor="evening">
                  <span></span><span>Evening</span>
                </label>
              </div>
            </div>
            <div className={s.scheduleFooter}>
              <button type="submit" className="btn btn-primary btn-small" onClick={this.onSubmitDates}
                disabled={this.state.selectedDates.length === 0}>Set</button>
            </div>
          </div>
        </Container>
      </div>
    );
  }
}


Schedule.propTypes = {
  config: React.PropTypes.object,
  user: React.PropTypes.object,

  getUserSchedules: React.PropTypes.func.isRequired,
  updateUserSchedules: React.PropTypes.func.isRequired,
  showAlertPopup: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  config: state.config.data,
  user: state.user.data,
});

const mapDispatchToProps = (dispatch) => ({
  getUserSchedules: (params) => dispatch(getUserSchedules(params)),
  updateUserSchedules: (params) => dispatch(updateUserSchedules(params)),
  showAlertPopup: (message) => dispatch(showAlertPopup(message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Schedule);
