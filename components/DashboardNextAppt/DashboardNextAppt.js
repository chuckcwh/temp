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
import { fetchServices, getPatients, getCases } from '../../actions';
import history from '../../core/history';
import util from '../../core/util';
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
    this.props.user && this.props.getPatients({
      cid: this.props.user.clients[0].id,
    });
    this.props.user && this.props.getCases({
      cid: this.props.user.clients[0].id,
    });
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
    const { user, cazes, confirmedApptSessions } = this.props;
    const { selectedDay } = this.state;
    const pastSessions = [];
    const confirmedSessions = [];
    const pendingSessions = [];

    let earliestNewApptDate;
    let earliestNewAppt;

    let content;
    if (confirmedApptSessions.length) {
      // Determines earliest date of confirmed appointment
      earliestNewApptDate = confirmedApptSessions.reduce((a, b) => {
        if (a.date < b.date) {
          return a;
        } else if (a.date > b.date) {
          return b;
        } else {
          return a;
        }
      }).date;
      // Obtains all appointments that have the same date as earliest date
      earliestNewAppt = confirmedApptSessions.filter((event) => {
        return moment(event.date, 'YYYY-MM-DD').isSame(earliestNewApptDate,'day')
      });
      // Default no appointment today
      if (!moment(earliestNewAppt[0].date,'YYYY-MM-DD').isSame(moment(), 'day')) {
        content = (
          <div>
            <div className={s.dashboardNextApptInfoTitle}>No Appointment</div>
            <div className={s.dashboardNextApptInfoDesc}>
              <p>You do not have any appointment today.</p>
              <p>Your next appointment is on&nbsp;
                <span className={s.dashboardNextApptInfoDescHighlight}>{this.formatDate(earliestNewApptDate)}</span>
              .</p>
            </div>
          </div>
        );
      // Default multiple or single appointment today
      } else {
        earliestNewAppt.forEach((event) => {
          // $('.dashboard-next-appointment-info').append(createAppointmentTable(event.caseId, event.price, event.service, event.date, event.time, event.estTime, event.caseNotes, event.patientFullName, event.engagedId, event.location, event.sessionId, event.isPaid, event.nurseId));
        });
      }
    } else if (!confirmedApptSessions.length) {
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
          <Loader className="spinner" loaded={!this.props.cazesFetching}>
            {content}
          </Loader>
        </div>
      </div>
    );
  }

}

DashboardNextAppt.propTypes = {
  confirmedApptSessions: React.PropTypes.array.isRequired,

  user: React.PropTypes.object,
  services: React.PropTypes.object,
  servicesFetching: React.PropTypes.bool,
  servicesTree: React.PropTypes.array,
  servicesTreeHash: React.PropTypes.object,
  servicesSubtypesHash: React.PropTypes.object,
  servicesSubtypesHashBySlug: React.PropTypes.object,
  patients: React.PropTypes.object,
  patientsFetching: React.PropTypes.bool,
  patientIds: React.PropTypes.array,
  cazes: React.PropTypes.object,
  cazesFetching: React.PropTypes.bool,
  cazeIds: React.PropTypes.array,

  fetchServices: React.PropTypes.func,
  getPatients: React.PropTypes.func,
  getCases: React.PropTypes.func,
};

const mapStateToProps = (state) => ({
  user: state.user.data,
  cazesByClient: (clientId) => {
    return state.cazesByClient[clientId] && state.cazesByClient[clientId].data;
  },
  services: state.services.data,
  servicesFetching: state.services.isFetching,
  servicesTree: state.services.dashboardTree,
  servicesTreeHash: state.services.dashboardTreeHash,
  servicesSubtypesHash: state.services.subTypesHash,
  servicesSubtypesHashBySlug: state.services.subTypesHashBySlug,
  patients: state.user.data && state.user.data.clients && state.user.data.clients.length
    && state.user.data.clients[0] && state.user.data.clients[0].id
    && state.patientsByClient[state.user.data.clients[0].id]
    && state.patientsByClient[state.user.data.clients[0].id].data,
  patientsFetching: state.user.data && state.user.data.clients && state.user.data.clients.length
    && state.user.data.clients[0] && state.user.data.clients[0].id
    && state.patientsByClient[state.user.data.clients[0].id]
    && state.patientsByClient[state.user.data.clients[0].id].isFetching,
  patientIds: state.user.data && state.user.data.clients && state.user.data.clients.length
    && state.user.data.clients[0] && state.user.data.clients[0].id
    && state.patientsByClient[state.user.data.clients[0].id]
    && state.patientsByClient[state.user.data.clients[0].id].ids,
  cazes: state.user.data && state.user.data.clients && state.user.data.clients.length
    && state.user.data.clients[0] && state.user.data.clients[0].id
    && state.cazesByClient[state.user.data.clients[0].id]
    && state.cazesByClient[state.user.data.clients[0].id].data,
  cazesFetching: state.user.data && state.user.data.clients && state.user.data.clients.length
    && state.user.data.clients[0] && state.user.data.clients[0].id
    && state.cazesByClient[state.user.data.clients[0].id]
    && state.cazesByClient[state.user.data.clients[0].id].isFetching,
  cazeIds: state.user.data && state.user.data.clients && state.user.data.clients.length
    && state.user.data.clients[0] && state.user.data.clients[0].id
    && state.cazesByClient[state.user.data.clients[0].id]
    && state.cazesByClient[state.user.data.clients[0].id].ids,
});

const mapDispatchToProps = (dispatch) => ({
  fetchServices: () => dispatch(fetchServices()),
  getPatients: (params) => dispatch(getPatients(params)),
  getCases: (params) => dispatch(getCases(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardNextAppt);
