import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import moment from 'moment';
import { Grid, Row, Col } from 'react-flexbox-grid';
import s from './DashboardAppointments.css';
import Link from '../Link';
import DashboardDataTable from '../DashboardDataTable';
import DashboardTableButton from '../DashboardTableButton';
import { fetchServices } from '../../actions';
import { configToName, formatSessionAlias } from '../../core/util';

class DashboardAppointments extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedFilter: '',
    };
  }

  componentDidMount() {
    this.props.fetchServices();
  }

  render() {
    const { config, services, patients, sessions, sessionsFetching, sessionsByPatient } = this.props;
    return (
      <div className={s.dashboardAppointments}>
        <Loader className="spinner" loaded={!this.props.sessionsFetching}>
          <Link className={s.dashboardInfoBtn} to="/booking1">Book Appointment</Link>
          <div className={s.cases}>
            <div className={s.casesFilter}>
              <span><strong>Status</strong></span>
              <div className="select">
                <span></span>
                <select onChange={(e) => this.setState({ selectedFilter: e.target.value })} value={this.state.selectedFilter || ''}>
                  <option value="">Show All</option>
                  <option value="pending-visit">Pending Visit</option>
                  <option value="completed">Completed</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>
          {
            sessionsByPatient && Object.keys(sessionsByPatient).map(patientId => {
              const patientName = patients && patients[patientId] && patients[patientId].name;
              const filteredSessions = sessionsByPatient[patientId].filter(session => {
                switch (this.state.selectedFilter) {
                  case 'pending-visit':
                    return session.phase === 'pending-visit';
                  case 'completed':
                    return session.status === 'completed';
                  case 'expired':
                    return session.status === 'expired';
                  default:
                    return (session.phase === 'pending-visit'
                      || session.status === 'completed'
                      || session.status === 'expired');
                }
              });
              if (filteredSessions.length === 0) {
                return;
              }
              return (
                <DashboardDataTable css={s} key={patientId}>
                  <Grid fluid className={s.dashboardDataTable}>
                    <p className={s.name}>{patientName}</p>
                    <Row className={s.lgHeader}>
                      <Col md={2}>ID</Col>
                      <Col md={2}>Date</Col>
                      <Col md={2}>Time</Col>
                      <Col md={2}>Service</Col>
                      <Col md={1}>Price</Col>
                      <Col md={1}>Status</Col>
                      <Col md={2}>Action(s)</Col>
                    </Row>
                    {
                      filteredSessions && filteredSessions.map(session => (
                        <Row className={s.sessionDetails} key={session._id}>
                          <Col xs={4}>ID</Col>
                          <Col xs={8} md={2}>{formatSessionAlias(session.alias)}</Col>
                          <Col xs={4}>Date</Col>
                          <Col xs={8} md={2}>{moment(session.date).format('ll')}</Col>
                          <Col xs={4}>Time</Col>
                          <Col xs={8} md={2}>
                            {configToName(config, 'timeSlotsByValue', session.timeSlot)}
                          </Col>
                          <Col xs={4}>Service</Col>
                          <Col xs={8} md={2}>
                            {`${services && services[session.service] && services[session.service].name} `
                              + `(${services && services[session.service] && services[session.service].classes
                                  && services[session.service].classes[session.serviceClassId]
                                  && services[session.service].classes[session.serviceClassId].duration}hrs)`}
                          </Col>
                          <Col xs={4}>Price</Col>
                          <Col xs={8} md={1}>{`$${parseFloat(session.price).toFixed(2)}`}</Col>
                          <Col xs={4}>Status</Col>
                          <Col xs={8} md={1}>
                            {configToName(config, 'sessionPhasesByValue', session.phase)}
                          </Col>
                          <Col xs={4}>Action(s)</Col>
                          <Col xs={8} md={2}>
                            <DashboardTableButton to={`/sessions/${session._id}`}>View</DashboardTableButton>
                            <DashboardTableButton>Cancel</DashboardTableButton>
                          </Col>
                        </Row>
                      ))
                    }
                  </Grid>
                </DashboardDataTable>
              );
            })
          }
          </div>
        </Loader>
      </div>
    );
  }

}

DashboardAppointments.propTypes = {
  config: React.PropTypes.object,
  services: React.PropTypes.object,
  servicesFetching: React.PropTypes.bool,
  patients: React.PropTypes.object,
  patientsFetching: React.PropTypes.bool,
  sessions: React.PropTypes.object,
  sessionsFetching: React.PropTypes.bool,
  sessionsByPatient: React.PropTypes.object,

  fetchServices: React.PropTypes.func,
  getPatients: React.PropTypes.func,
  getSessions: React.PropTypes.func,
};

const mapStateToProps = (state) => ({
  config: state.config.data,
  services: state.services.data,
  servicesFetching: state.services.isFetching,
  servicesTree: state.services.dashboardTree,
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
  sessionsByPatient: state.user.data && state.user.data._id
    && state.sessionsByUser[state.user.data._id]
    && state.sessionsByUser[state.user.data._id].dataByPatient,
});

const mapDispatchToProps = (dispatch) => ({
  fetchServices: () => dispatch(fetchServices()),
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardAppointments);
