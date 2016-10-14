import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import moment from 'moment';
import { Grid, Row, Col } from 'react-flexbox-grid';
import s from './DashboardPendingPayment.css';
import Link from '../Link';
import DashboardDataTable from '../DashboardDataTable';
import DashboardTableButton from '../DashboardTableButton';
import { fetchServices, setPostStatus } from '../../actions';
import { configToName, formatSessionAlias, removeByKey } from '../../core/util';
import history from '../../core/history';

class DashboardPendingPayment extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: {},
    };
  }

  componentDidMount() {
    this.props.fetchServices();
  }

  handlePay = (sessionId) => (e) => {
    e.preventDefault();
    const location = history.getCurrentLocation();
    history.push({ pathname: '/booking-confirmation', query: {
      ...location.query,
      sessions: sessionId,
    } });

    this.props.setPostStatus('confirmation');
  };

  handlePaySelected = (e) => {
    e.preventDefault();
    const location = history.getCurrentLocation();
    history.push({ pathname: '/booking-confirmation', query: {
      ...location.query,
      sessions: Object.keys(this.state.selected).join(),
    } });

    this.props.setPostStatus('confirmation');
  };

  render() {
    const { config, services, patients, sessions, sessionsFetching, sessionsByPatient } = this.props;
    return (
      <div className={s.dashboardPendingPayment}>

        <Loader className="spinner" loaded={!sessionsFetching}>
          <Link className={s.dashboardInfoBtn} to="/booking1">Book Appointment</Link>
          {Object.keys(this.state.selected).length > 0 &&
            <a href="#" className={s.dashboardInfoBtn} onClick={this.handlePaySelected}>Pay Selected</a>
          }
          <div className={s.cases}>
          {
            sessionsByPatient && Object.keys(sessionsByPatient).map(patientId => {
              const patientName = patients && patients[patientId] && patients[patientId].name;
              const filteredSessions = sessionsByPatient[patientId].filter(session => session.status === 'pending-payment');
              if (filteredSessions.length === 0) {
                return <div>
                  <h3>{patientName}</h3>
                  <p>No appointments found.</p>
                </div>;
              }
              return (
                <DashboardDataTable css={s} key={patientId}>
                  <Grid fluid className={s.dashboardDataTable}>
                    <p className={s.name}>{patientName}</p>
                    <Row className={s.lgHeader}>
                      <Col md={1}>Select</Col>
                      <Col md={1}>ID</Col>
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
                          <Col xs={4}>Select</Col>
                          <Col xs={8} md={1}>
                            {session.status === 'pending-payment' &&
                              <input
                                type="checkbox"
                                checked={!!this.state.selected[session._id]}
                                onChange={() => {
                                  if (this.state.selected[session._id]) {
                                    this.setState({
                                      selected: removeByKey(this.state.selected, session._id),
                                    })
                                  } else {
                                    this.setState({
                                      selected: {
                                        ...this.state.selected,
                                        [session._id]: true,
                                      }
                                    })
                                  }
                                }}
                              />
                            }
                            <label><span></span></label>
                          </Col>
                          <Col xs={4}>ID</Col>
                          <Col xs={8} md={1}>{formatSessionAlias(session.alias)}</Col>
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
                                  && services[session.service].classes[session.serviceClass]
                                  && services[session.service].classes[session.serviceClass].duration}hrs)`}
                          </Col>
                          <Col xs={4}>Price</Col>
                          <Col xs={8} md={1}>{`$${parseFloat(session.price).toFixed(2)}`}</Col>
                          <Col xs={4}>Status</Col>
                          <Col xs={8} md={1}>
                            {configToName(config, 'sessionStatusesByValue', session.status)}
                          </Col>
                          <Col xs={4}>Action(s)</Col>
                          <Col xs={8} md={2}>
                            <DashboardTableButton to={`/sessions/${session._id}`}>View</DashboardTableButton>
                            <DashboardTableButton onClick={this.props.onCancelSession(session._id)}>Cancel</DashboardTableButton>
                            <DashboardTableButton onClick={this.handlePay(session._id)} color="orange">Pay</DashboardTableButton>
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

DashboardPendingPayment.propTypes = {
  onCancelSession: React.PropTypes.func,

  config: React.PropTypes.object,
  services: React.PropTypes.object,
  servicesFetching: React.PropTypes.bool,
  patients: React.PropTypes.object,
  patientsFetching: React.PropTypes.bool,
  patientIds: React.PropTypes.array,

  fetchServices: React.PropTypes.func,
  setPostStatus: React.PropTypes.func,
};

const mapStateToProps = (state) => ({
  config: state.config.data,
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
  sessionsByPatient: state.user.data && state.user.data._id
    && state.sessionsByUser[state.user.data._id]
    && state.sessionsByUser[state.user.data._id].dataByPatient,
});

const mapDispatchToProps = (dispatch) => ({
  fetchServices: () => dispatch(fetchServices()),
  setPostStatus: (params) => dispatch(setPostStatus(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPendingPayment);
