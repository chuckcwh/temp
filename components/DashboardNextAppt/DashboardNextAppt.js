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
    const { user, cazes } = this.props;
    const { selectedDay } = this.state;
    const pastSessions = [];
    const confirmedSessions = [];
    const pendingSessions = [];

    let tableContentBlob;
    const confirmedAppointmentSession = []; // next appointments
    const pendingConfirmationAppointmentSession = []; // pending appointments
    const pastAppointmentSession = []; // past appointments
    // var pendingPaymentAppointmentSession = [] // pending payment cases

    var earliestNewAppointmentDate;
    var earliestNewAppointment;

    // Table content data structure
    function createTableContentBlob(patients, cases) {
      if (!patients || !cases) return [];
      const tableContentBlob = [];
      let patientFound = false;
      Object.values(patients).forEach((patient, index) => {
        Object.values(cazes).forEach((cas) => {
          if (patient.id === cas.patient) {
            tableContentBlob.forEach((patientBlob) => {
              if (patientBlob.patientId === patient.id) {
                patientFound = true;
                patientBlob.cases.push(cas);
              }
            });
            if (!patientFound) {
              tableContentBlob.push({
                patientId: patient.id,
                patient: patient,
                cases: [cas]
              });
            }
            patientFound = false;
          }
        });
      });
      return tableContentBlob;
    }
    tableContentBlob = createTableContentBlob(this.props.patients, this.props.cazes);
    // console.log(tableContentBlob);

    // Create eventsArray to be supplied to calendar
    const eventsArray = [];
    let sessionAppointment;
    tableContentBlob.forEach((patientBlob) => {
      patientBlob.cases.forEach((cas) => {
        if (cas.dates.length) {
          cas.dates.forEach((date) => {
            sessionAppointment = {
              caseId: cas.id,
              sessionId: date.id,
              casePrice: cas.price,
              price: date.pcode ? (date.price - (date.price * date.pdiscount / 100)).toFixed(2) : date.price,
              // service: this.props.allServices[cas.service],
              date: date.dateTimeStart.substr(0, 10),
              time: date.dateTimeStart.substr(11),
              estTime: date.estTime,
              caseNotes: cas.notes,
              patientId: patientBlob.patient.id,
              patientFullName: patientBlob.patient.fullName,
              patientColor: patientBlob.patient.colorCode,
              isPaid: cas.isPaid,
              location: cas.addresses.length ? cas.addresses[0].address : 'N/A',
              engagedId: '',
              sessionStatus: 'pendingConf',
              sessionMode: date.status, // Temp -> Cancelled or Active
              caseStatus: cas.status, // Accepting Quotes, Closed, Completed, Expired
              stage: '', // If session appointment has not been accepted yet, stage is empty string
              nurseId: ''
            };
            if (cas.quotes.length) { // Quote gets removed when session gets deleted
              cas.quotes.forEach((quote) => {
                if (quote.dateObjId === date.id) {
                  sessionAppointment.sessionStatus = 'engaged';
                  // Pending visit, pending documentation, pending review, completed
                  sessionAppointment.stage = quote.casesEngaged[0].status;
                  sessionAppointment.engagedId = quote.casesEngaged[0].id;
                  sessionAppointment.nurseId = quote.nurse;
                }
              });
            }
            eventsArray.push(sessionAppointment);
          });
        }
      });
    });
    // console.log(eventsArray);

    // Sorts appointment into dashboard tab category according to type
    eventsArray.forEach((event) => {
      var now = moment();
      if (event.caseStatus === 'Expired') {
        pastAppointmentSession.push(event);
      } else {
        if (moment(event.date, 'YYYY-MM-DD').isSameOrAfter(now, 'day')) {
          if (event.sessionStatus === "engaged" && event.isPaid) {
            if (event.stage === "Pending Visit") {
              confirmedAppointmentSession.push(event);
            }
          }
          if (event.sessionStatus === 'pendingConf' || event.sessionStatus === 'engaged') {
            if (!event.isPaid && event.caseStatus === 'Accepting Quotes') {
              pendingConfirmationAppointmentSession.push(event);
            }
          }
        } else if (moment(event.date, 'YYYY-MM-DD').isBefore(now, 'day')) {
          if (event.caseStatus === "Closed" || event.caseStatus === "Completed") {
            pastAppointmentSession.push(event);
          }
        }
      }
    });

    let content;
    if (confirmedAppointmentSession.length) {
      // Determines earliest date of confirmed appointment
      earliestNewAppointmentDate = confirmedAppointmentSession.reduce((a, b) => {
        if (a.date < b.date) {
          return a;
        } else if (a.date > b.date) {
          return b;
        } else {
          return a;
        }
      }).date;
      // Obtains all appointments that have the same date as earliest date
      earliestNewAppointment = confirmedAppointmentSession.filter((event) => {
        return moment(event.date, 'YYYY-MM-DD').isSame(earliestNewAppointmentDate,'day')
      });
      // Default no appointment today
      if (!moment(earliestNewAppointment[0].date,'YYYY-MM-DD').isSame(moment(), 'day')) {
        content = (
          <div>
            <div className={s.dashboardNextApptInfoTitle}>No Appointment</div>
            <div className={s.dashboardNextApptInfoDesc}>
              <p>You do not have any appointment today.</p>
              <p>Your next appointment is on&nbsp;
                <span className={s.dashboardNextApptInfoDescHighlight}>{this.formatDate(earliestNewAppointmentDate)}</span>
              .</p>
            </div>
          </div>
        );
      // Default multiple or single appointment today
      } else {
        earliestNewAppointment.forEach((event) => {
          // $('.dashboard-next-appointment-info').append(createAppointmentTable(event.caseId, event.price, event.service, event.date, event.time, event.estTime, event.caseNotes, event.patientFullName, event.engagedId, event.location, event.sessionId, event.isPaid, event.nurseId));
        });
      }
    } else if (!confirmedAppointmentSession.length) {
      content = (
        <div>
          <div className={s.dashboardNextApptInfoTitle}>No Appointment</div>
          <div className={s.dashboardNextApptInfoDesc}>
            <p>You have no appointment. Please book an appointment here:</p>
            <Link
              className="btn-primary"
              to="/booking1"
            >Book a Case</Link>
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
  params: React.PropTypes.object,

  user: React.PropTypes.object,
  allServices: React.PropTypes.object,
  allServicesFetching: React.PropTypes.bool,
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
  allServices: state.allServices.data,
  allServicesFetching: state.allServices.isFetching,
  servicesTree: state.allServices.dashboardTree,
  servicesTreeHash: state.allServices.dashboardTreeHash,
  servicesSubtypesHash: state.allServices.subTypesHash,
  servicesSubtypesHashBySlug: state.allServices.subTypesHashBySlug,
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
