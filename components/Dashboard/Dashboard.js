import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import classNames from 'classnames';
import moment from 'moment';
import s from './Dashboard.css';
import Container from '../Container';
import Link from '../Link';
import Header from '../Header';
import ServiceCard from '../ServiceCard';
import DashboardStatButton from '../DashboardStatButton';
import DashboardNextAppt from '../DashboardNextAppt';
import DashboardPendingConf from '../DashboardPendingConf';
import DashboardPendingPayment from '../DashboardPendingPayment';
import NurseAvailableCases from '../NurseAvailableCases';
import { fetchServices, getPatients, getSessions, setOrderService, setLastPage } from '../../actions';
import history from '../../core/history';
import { isClient, isProvider } from '../../core/util';
import shuffle from 'lodash/shuffle';

class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      panelChoice: undefined,
    }
  }

  componentDidMount() {
    this.props.fetchServices();
    this.props.user && isClient(this.props.user)
      && this.props.getSessions({
        client: this.props.user._id,
      });
  }

  componentWillReceiveProps(props) {
    if (props.user._id !== this.props.user._id) {
      props.user && isClient(props.user)
        && this.props.getSessions({
          client: props.user._id,
        });
    }
  }

  render() {
    const { user, patients, sessions } = this.props;
    let dashboardStats,
      dashboardBody;

    let tableContentBlob;
    const confirmedApptSessions = []; // next appointments
    const pendingConfirmationApptSessions = []; // pending appointments
    const pastApptSessions = []; // past appointments
    // var pendingPaymentAppointmentSession = [] // pending payment cases

    var earliestNewApptDate;
    var earliestNewAppt;

    // Table content data structure
    function createTableContentBlob(patients, cases) {
      if (!patients || !cases) return [];
      const tableContentBlob = [];
      let patientFound = false;
      patients && Object.values(patients).forEach((patient, index) => {
        cases && Object.values(sessions).forEach((cas) => {
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
    tableContentBlob = createTableContentBlob(patients, sessions);
    // console.log(tableContentBlob);

    // Create eventsArray to be supplied to calendar
    const eventsArray = [];
    let sessionAppointment;
    tableContentBlob.forEach((patientBlob) => {
      patientBlob && patientBlob.cases && patientBlob.cases.forEach((cas) => {
        if (cas.dates.length) {
          cas.dates.forEach((date) => {
            sessionAppointment = {
              caseId: cas.id,
              sessionId: date.id,
              casePrice: cas.price,
              price: date.pcode ? (date.price - (date.price * date.pdiscount / 100)).toFixed(2) : date.price,
              // service: this.props.services[cas.service],
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
        pastApptSessions.push(event);
      } else {
        if (moment(event.date, 'YYYY-MM-DD').isSameOrAfter(now, 'day')) {
          if (event.sessionStatus === "engaged" && event.isPaid) {
            if (event.stage === "Pending Visit") {
              confirmedApptSessions.push(event);
            }
          }
          if (event.sessionStatus === 'pendingConf' || event.sessionStatus === 'engaged') {
            if (!event.isPaid && event.caseStatus === 'Accepting Quotes') {
              pendingConfirmationApptSessions.push(event);
            }
          }
        } else if (moment(event.date, 'YYYY-MM-DD').isBefore(now, 'day')) {
          if (event.caseStatus === "Closed" || event.caseStatus === "Completed") {
            pastApptSessions.push(event);
          }
        }
      }
    });

    function getPendingPaymentCases(patients, cases) {
      if (!patients || !cases) return {};
      const pendingPaymentCases = {};
      Object.values(patients).forEach((patient) => {
        Object.values(sessions).forEach((cas) => {
          if (patient.id === cas.patient) {
            if (cas.status === "Closed" && !cas.isPaid) {
              if (!pendingPaymentCases[cas.patient]) {
                pendingPaymentCases[cas.patient] = {
                  patientFullName: patient.fullName,
                  cases: [cas]
                }
              } else {
                pendingPaymentCases[cas.patient].cases.push(cas);
              }
            }
          }
        });
      });
      return pendingPaymentCases;
    }
    const pendingPaymentCases = getPendingPaymentCases(patients, sessions);

    if (user) {
      if (isClient(user)) {
        const activeSessions = pendingConfirmationApptSessions.filter(function(session) {
          return session.sessionMode === "Active";
        });
        const totalPendingAmt = (function getTotalPendingAmt (patients) {
          let totalPendingAmt = 0;
          let discountedPrice;
          for (let patientId in patients) {
            patients[patientId] && patients[patientId].cases.forEach((cas) => {
              // if(cas.pcode) {
              //   discountedPrice = Number(cas.price) - (Number(cas.price) * ( Number(cas.pdiscount) / 100 ));
              //   totalPendingAmt += Number(discountedPrice);
              // } else {
                totalPendingAmt += Number(cas.price);
              // }
            });
          }
          return totalPendingAmt.toFixed(2);
        })(pendingPaymentCases);

        var pendingVisitAppts = confirmedApptSessions.filter(function(session) {
          return session.isPaid;
        });
        var allAppointments = pendingVisitAppts.concat(pastApptSessions);

        dashboardStats = (
          <div className={s.dashboardStatsWrapper}>
            <DashboardStatButton
              className="blah"
              color="blue"
              icon="bell"
              text="Next Appointment"
              stat={confirmedApptSessions.length}
              onClick={() => this.setState({
                panelChoice: 'Next Appointment'
              })}
            />
            <DashboardStatButton
              color="green"
              icon="hourglass"
              text="Pending Confirmation"
              stat={activeSessions.length}
              onClick={() => this.setState({
                panelChoice: 'Pending Confirmation'
              })}
            />
            <DashboardStatButton
              color="red"
              icon="coin"
              text="Pending Payment"
              stat={`$ ${totalPendingAmt}`}
              onClick={() => this.setState({
                panelChoice: 'Pending Payment'
              })}
            />
            <DashboardStatButton
              color="orange"
              icon="checklist"
              text="Appointments"
              stat={allAppointments.length}
              onClick={() => this.setState({
                panelChoice: 'Appointments'
              })}
            />
          </div>
        );
        const {panelChoice} = this.state;
        if (panelChoice === 'Pending Confirmation') {
          dashboardBody = (
            <div className={s.dashboardBody}>
              <DashboardPendingConf
                confirmedApptSessions={confirmedApptSessions}
              />
            </div>
          )
        } else if (panelChoice === 'Pending Payment') {
          dashboardBody = (
            <div className={s.dashboardBody}>
              <DashboardPendingPayment
                confirmedApptSessions={confirmedApptSessions}
              />
            </div>
          )
        } else if (panelChoice === 'Appointments') {
          dashboardBody = (
            <div className={s.dashboardBody}>
              <div className="dashboard-all-appointment">Appointment</div>
            </div>
          )
        } else {
          dashboardBody = (
            <div className={s.dashboardBody}>
              <DashboardNextAppt />
            </div>
          )
        }

      } else if (isProvider(user)) {
        dashboardStats = (
          <div className={s.dashboardStatsWrapper}>
            <DashboardStatButton
              color="blue"
              icon="bell"
              text="Available Cases"
              stat={'0'}
            />
            <DashboardStatButton
              color="orange"
              icon="hourglass"
              text="Ongoing Cases"
              stat={'0'}
            />
            <DashboardStatButton
              color="green"
              icon="checklist"
              text="Completed Cases"
              stat={'0'}
            />
            <DashboardStatButton
              color="red"
              icon="coin"
              text="Total Credits"
              stat={`$ ${0}`}
              to="/credits"
            />
          </div>
        );
        dashboardBody = (
          <NurseAvailableCases />
        );
      }
    }
    return (
      <div className={s.dashboard}>
        <Header title="Dashboard" />
        <Container>
          <div>
            {dashboardStats}
            {dashboardBody}
          </div>
        </Container>
      </div>
    );
  }

}

Dashboard.propTypes = {
  params: React.PropTypes.object,

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
  setOrderService: React.PropTypes.func,
  setLastPage: React.PropTypes.func,
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
  getSessions: (params) => dispatch(getSessions(params)),
  setOrderService: (service) => dispatch(setOrderService(service)),
  setLastPage: (page) => dispatch(setLastPage(page)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
