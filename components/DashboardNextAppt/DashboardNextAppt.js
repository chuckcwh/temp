import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import DayPicker, { DateUtils } from 'react-day-picker';
import moment from 'moment';
import s from './DashboardNextAppt.css';
import 'react-day-picker/lib/style.css';
import Container from '../Container';
import Link from '../Link';
import Header from '../Header';
import ServiceCard from '../ServiceCard';
import DashboardStatButton from '../DashboardStatButton';
import DashboardTableButton from '../DashboardTableButton';
import { fetchServices, getPatients } from '../../actions';
import { configToName, formatSessionAlias } from '../../core/util';
import history from '../../core/history';

class DashboardNextAppt extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedDay: new Date(),
    };
  }

  componentDidMount() {
    this.props.fetchServices();
  }

  hasEvent = (sessions, day) => (sessions.length > 0
    && sessions.filter(session => DateUtils.isSameDay(new Date(session.date), day)).length > 0);

  renderDay = (sessions) => (day) => {
    if (this.hasEvent(sessions, day)) {
      return (
        <div className="DayPicker-Day-Wrapper">
          <span>{day.getDate()}</span>
          <div className="event"></div>
        </div>
      );
    }
    return (<span>{day.getDate()}</span>);
  }

  handleDayClick = (e, day) => {
    e.preventDefault();
    this.setState({
      selectedDay: day,
    });
  };

  formatDate = (date) => {
    return moment(date, 'YYYY-MM-DD').format('Do MMMM YYYY');
  };

  render() {
    const { config, services, user, sessions, sessionsFetching, patients } = this.props;
    const { selectedDay } = this.state;

    const confirmedSessions = sessions && Object.values(sessions).filter((session) => {
      return moment(session.date).isSameOrAfter(moment(), 'day')
        && (session.status === 'pending-visit' || session.status === 'pending-documentation')
        && session.isPaid;
    }) || [];

    let content;
    if (confirmedSessions.length) {
      // Determines earliest date of confirmed appointment
      const earliestSessionDate = confirmedSessions.reduce((a, b) => {
        if (a.date < b.date) {
          return a;
        } else if (a.date > b.date) {
          return b;
        } else {
          return a;
        }
      }).date;

      if (this.hasEvent(confirmedSessions, selectedDay)) {
        // Default multiple or single appointment today
        const filteredSessions = confirmedSessions.filter(session => DateUtils.isSameDay(new Date(session.date), selectedDay));
        content = (
          <div>
            {filteredSessions.map((session, index) => (
              <div className={s.dashboardNextApptInfoTable} key={session._id}>
                <h3>Appointment {index + 1}</h3>
                <div className={s.dashboardNextApptInfoTableRow}>
                  <div className={s.dashboardNextApptInfoTableCol}>
                    ID
                  </div>
                  <div className={s.dashboardNextApptInfoTableCol}>
                    {formatSessionAlias(session.alias)}
                  </div>
                </div>
                <div className={s.dashboardNextApptInfoTableRow}>
                  <div className={s.dashboardNextApptInfoTableCol}>
                    Date
                  </div>
                  <div className={s.dashboardNextApptInfoTableCol}>
                    {moment(session.date).format('ll')}
                  </div>
                </div>
                <div className={s.dashboardNextApptInfoTableRow}>
                  <div className={s.dashboardNextApptInfoTableCol}>
                    Time
                  </div>
                  <div className={s.dashboardNextApptInfoTableCol}>
                    {configToName(config, 'timeSlotsByValue', session.timeSlot)}
                  </div>
                </div>
                <div className={s.dashboardNextApptInfoTableRow}>
                  <div className={s.dashboardNextApptInfoTableCol}>
                    Service
                  </div>
                  <div className={s.dashboardNextApptInfoTableCol}>
                    {`${services && services[session.service] && services[session.service].name} `
                      + `(${services && services[session.service] && services[session.service].classes
                          && services[session.service].classes[session.serviceClass]
                          && services[session.service].classes[session.serviceClass].duration}hrs)`}
                  </div>
                </div>
                <div className={s.dashboardNextApptInfoTableRow}>
                  <div className={s.dashboardNextApptInfoTableCol}>
                    Patient
                  </div>
                  <div className={s.dashboardNextApptInfoTableCol}>
                    {patients && session.patient && patients[(session.patient && session.patient._id) || session.patient]
                      && patients[(session.patient && session.patient._id) || session.patient].name}
                  </div>
                </div>
                <div className={s.dashboardNextApptInfoTableRow}>
                  <div className={s.dashboardNextApptInfoTableCol}>
                    Location
                  </div>
                  <div className={s.dashboardNextApptInfoTableCol}>
                    {session.address.neighborhood}
                  </div>
                </div>
                {session.additionalInfo &&
                  <div className={s.dashboardNextApptInfoTableRow}>
                    <div className={s.dashboardNextApptInfoTableCol}>
                      Additional Info
                    </div>
                    <div className={s.dashboardNextApptInfoTableCol}>
                      {session.additionalInfo}
                    </div>
                  </div>
                }
                <div className={s.dashboardNextApptInfoTableRow}>
                  <div className={s.dashboardNextApptInfoTableCol}>
                    Caregiver
                  </div>
                  <div className={s.dashboardNextApptInfoTableCol}>
                    {session.provider && session.provider.name}
                  </div>
                </div>
                <div className={s.dashboardNextApptInfoTableRow}>
                  <div className={s.dashboardNextApptInfoTableCol}>
                  </div>
                  <div className={s.dashboardNextApptInfoTableCol}>
                    <DashboardTableButton to={`/sessions/${session._id}`}>View</DashboardTableButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      } else {
        // Obtains next earliest session
        content = (
          <div>
            <div className={s.dashboardNextApptInfoTitle}>No Appointments</div>
            <div className={s.dashboardNextApptInfoDesc}>
              <p>You do not have any appointment today.</p>
              <p>Your next appointment is on&nbsp;
                <a href="#" onClick={(e) => { this.handleDayClick(e, new Date(earliestSessionDate)); }}>
                  <span className={s.dashboardNextApptInfoDescHighlight}>{this.formatDate(earliestSessionDate)}</span>
                </a>
              .</p>
            </div>
          </div>
        );
      }
    } else {
      content = (
        <div>
          <div className={s.dashboardNextApptInfoTitle}>No Appointments</div>
          <div className={s.dashboardNextApptInfoDesc}>
            <p>You have no appointments. You may book an appointment here:</p>
            <Link
              className="btn btn-primary"
              to="/booking1"
            >Book now</Link>
          </div>
        </div>
      );
    }

    return (
      <div className={s.dashboardNextAppt}>
        <div className={s.dashboardNextApptCalendar}>
          <DayPicker
            selectedDays={day => DateUtils.isSameDay(selectedDay, day)}
            onDayClick={this.handleDayClick}
            renderDay={this.renderDay(confirmedSessions)}
          />
        </div>
        <div className={s.dashboardNextApptInfo}>
          <Loader className="spinner" loaded={!sessionsFetching}>
            {content}
          </Loader>
        </div>
      </div>
    );
  }

}

DashboardNextAppt.propTypes = {
  config: React.PropTypes.object,
  user: React.PropTypes.object,
  services: React.PropTypes.object,
  servicesFetching: React.PropTypes.bool,
  patients: React.PropTypes.object,
  patientsFetching: React.PropTypes.bool,
  sessions: React.PropTypes.object,
  sessionsFetching: React.PropTypes.bool,

  fetchServices: React.PropTypes.func,
  getPatients: React.PropTypes.func,
};

const mapStateToProps = (state) => ({
  config: state.config.data,
  user: state.user.data,
  services: state.services.data,
  servicesFetching: state.services.isFetching,
  patients: state.user.data && state.user.data._id
    && state.patientsByClient[state.user.data._id]
    && state.patientsByClient[state.user.data._id].data,
  patientsFetching: state.user.data && state.user.data._id
    && state.patientsByClient[state.user.data._id]
    && state.patientsByClient[state.user.data._id].isFetching,
  sessions: state.user.data && state.user.data._id
    && state.sessionsByUser[state.user.data._id]
    && state.sessionsByUser[state.user.data._id].data,
  sessionsFetching: state.user.data && state.user.data._id
    && state.sessionsByUser[state.user.data._id]
    && state.sessionsByUser[state.user.data._id].isFetching,
});

const mapDispatchToProps = (dispatch) => ({
  fetchServices: () => dispatch(fetchServices()),
  getPatients: (params) => dispatch(getPatients(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardNextAppt);
