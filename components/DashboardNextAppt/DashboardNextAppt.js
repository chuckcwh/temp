import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
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
import { fetchServices, getPatients } from '../../actions';
import history from '../../core/history';
import shuffle from 'lodash/shuffle';

class DashboardNextAppt extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedDay: null,
    };
  }

  componentDidMount() {
    this.props.fetchServices();
  }

  handleDayClick = (event, day, { selected }) => {
    this.setState({
      selectedDay: selected ? null : day,
    });
  };

  formatDate = (date) => {
    return moment(date, 'YYYY-MM-DD').format('Do MMMM YYYY');
  };

  render() {
    const { user, sessions, sessionsFetching } = this.props;
    const { selectedDay } = this.state;

    const confirmedSessions = sessions && Object.values(sessions).filter((session) => {
      return moment(session.date).isSameOrAfter(moment(), 'day')
        && session.status === 'engaged'
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

      if (moment(earliestSessionDate).isSame(moment(), 'day')) {
        // Default multiple or single appointment today
        // earliestNewAppt.forEach((event) => {
          // $('.dashboard-next-appointment-info').append(createAppointmentTable(event.caseId, event.price, event.service, event.date, event.time, event.estTime, event.caseNotes, event.patientFullName, event.engagedId, event.location, event.sessionId, event.isPaid, event.nurseId));
        // });
      } else {
        // Obtains next earliest session
        content = (
          <div>
            <div className={s.dashboardNextApptInfoTitle}>No Appointment</div>
            <div className={s.dashboardNextApptInfoDesc}>
              <p>You do not have any appointment today.</p>
              <p>Your next appointment is on&nbsp;
                <span className={s.dashboardNextApptInfoDescHighlight}>{this.formatDate(earliestSessionDate)}</span>
              .</p>
            </div>
          </div>
        );
      }
    } else {
      content = (
        <div>
          <div className={s.dashboardNextApptInfoTitle}>No Appointment</div>
          <div className={s.dashboardNextApptInfoDesc}>
            <p>You have no appointment. You may book an appointment here:</p>
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
  user: React.PropTypes.object,
  services: React.PropTypes.object,
  servicesFetching: React.PropTypes.bool,
  servicesTree: React.PropTypes.array,
  servicesTreeHash: React.PropTypes.object,
  servicesSubtypesHash: React.PropTypes.object,
  servicesSubtypesHashBySlug: React.PropTypes.object,
  patients: React.PropTypes.object,
  patientsFetching: React.PropTypes.bool,
  sessions: React.PropTypes.object,
  sessionsFetching: React.PropTypes.bool,

  fetchServices: React.PropTypes.func,
  getPatients: React.PropTypes.func,
};

const mapStateToProps = (state) => ({
  user: state.user.data,
  services: state.services.data,
  servicesFetching: state.services.isFetching,
  servicesTree: state.services.dashboardTree,
  servicesTreeHash: state.services.dashboardTreeHash,
  servicesSubtypesHash: state.services.subTypesHash,
  servicesSubtypesHashBySlug: state.services.subTypesHashBySlug,
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
