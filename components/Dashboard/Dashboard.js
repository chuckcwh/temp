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
import DashboardAppointments from '../DashboardAppointments';
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

    const stats = {
      nextAppt: 0,
      pendingConf: 0,
      pendingPayment: 0,
      others: 0,
    };
    sessions && Object.values(sessions).map(session => {
      switch (session.phase) {
        case 'awaiting-caregiver':
          stats.pendingConf++;
          break;
        case 'pending-payment':
          stats.pendingPayment += session.price;
          break;
        case 'pending-visit':
          stats.nextAppt++;
          break;
        default:
          stats.others++;
          break;
      }
    });

    if (user) {
      if (isClient(user)) {
        dashboardStats = (
          <div className={s.dashboardStatsWrapper}>
            <DashboardStatButton
              className="blah"
              color="blue"
              icon="bell"
              text="Next Appointment"
              stat={stats.nextAppt}
              onClick={() => this.setState({
                panelChoice: 'Next Appointment'
              })}
            />
            <DashboardStatButton
              color="green"
              icon="hourglass"
              text="Pending Confirmation"
              stat={stats.pendingConf}
              onClick={() => this.setState({
                panelChoice: 'Pending Confirmation'
              })}
            />
            <DashboardStatButton
              color="red"
              icon="coin"
              text="Pending Payment"
              stat={`$ ${parseFloat(stats.pendingPayment).toFixed(2)}`}
              onClick={() => this.setState({
                panelChoice: 'Pending Payment'
              })}
            />
            <DashboardStatButton
              color="orange"
              icon="checklist"
              text="Appointments"
              stat={stats.others}
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
              <DashboardPendingConf />
            </div>
          )
        } else if (panelChoice === 'Pending Payment') {
          dashboardBody = (
            <div className={s.dashboardBody}>
              <DashboardPendingPayment />
            </div>
          )
        } else if (panelChoice === 'Appointments') {
          dashboardBody = (
            <div className={s.dashboardBody}>
              <DashboardAppointments />
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
