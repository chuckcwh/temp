import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import moment from 'moment';
import { Grid, Row, Col } from 'react-flexbox-grid';
import s from './DashboardOngoingCases.css';
import Link from '../Link';
import DashboardDataTable from '../DashboardDataTable';
import DashboardTableButton from '../DashboardTableButton';
import { SESSION_VISIT_SUCCESS, visitSession } from '../../actions';
import { configToName, formatSessionAlias } from '../../core/util';
import history from '../../core/history';

class DashboardOngoingCases extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleVisit = (sessionId) => (e) => {
    e.preventDefault();
    this.props.visitSession({ sessionId });
  };

  handleDocumentation = (sessionId) => (e) => {
    e.preventDefault();
    history.push({ pathname: `/sessions/${sessionId}/documentation` })
  };

  render() {
    const { config, services, applications, applicationsFetching, sessions } = this.props;
    const filteredApplications = applications && Object.values(applications).filter(application =>
      application.status === 'accepted'
    );
    return (
      <div className={s.dashboardOngoingCases}>
        <Loader className="spinner" loaded={!applicationsFetching}>
          <div className={s.cases}>
          {filteredApplications && Object.values(filteredApplications).length > 0 &&
            <DashboardDataTable css={s}>
              <Grid fluid className={s.dashboardDataTable}>
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
                  filteredApplications && Object.values(filteredApplications).map(application => {
                    const sessionId = (application && application.session && application.session._id)
                      || (application && application.session);
                    const session = sessions && sessionId && sessions[sessionId];
                    return (
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
                                && services[session.service].classes[session.serviceClass]
                                && services[session.service].classes[session.serviceClass].duration}hrs)`}
                        </Col>
                        <Col xs={4}>Price</Col>
                        <Col xs={8} md={1}>{`$${parseFloat(application.price).toFixed(2)}`}</Col>
                        <Col xs={4}>Status</Col>
                        <Col xs={8} md={1}>
                          {configToName(config, 'sessionStatusesByValue', session.status)}
                        </Col>
                        <Col xs={4}>Action(s)</Col>
                        <Col xs={8} md={2}>
                          <DashboardTableButton to={`/applications/${application._id}`}>View</DashboardTableButton>
                          {session.status === 'pending-visit' &&
                            <DashboardTableButton onClick={this.handleVisit(session._id)}>Set Visited</DashboardTableButton>
                          }
                          {session.status === 'pending-documentation' &&
                            <DashboardTableButton onClick={this.handleDocumentation(session._id)}>Documentation</DashboardTableButton>
                          }
                        </Col>
                      </Row>
                    );
                  })
                }
              </Grid>
            </DashboardDataTable>
          }
          {!(filteredApplications && Object.values(filteredApplications).length) &&
            <p>No cases found.</p>
          }
          </div>
        </Loader>
      </div>
    );
  }

}

DashboardOngoingCases.propTypes = {
  config: React.PropTypes.object,
  services: React.PropTypes.object,
  servicesFetching: React.PropTypes.bool,
  applications: React.PropTypes.object,
  applicationsFetching: React.PropTypes.bool,
  sessions: React.PropTypes.object,

  visitSession: React.PropTypes.func,
};

const mapStateToProps = (state) => ({
  config: state.config.data,
  services: state.services.data,
  servicesFetching: state.services.isFetching,
  applications: state.user.data && state.user.data._id
    && state.applicationsByProvider[state.user.data._id]
    && state.applicationsByProvider[state.user.data._id].data,
  applicationsFetching: state.user.data && state.user.data._id
    && state.applicationsByProvider[state.user.data._id]
    && state.applicationsByProvider[state.user.data._id].isFetching,
  sessions: state.user.data && state.user.data._id
    && state.sessionsByUser[state.user.data._id]
    && state.sessionsByUser[state.user.data._id].data,
});

const mapDispatchToProps = (dispatch) => ({
  visitSession: (params) => dispatch(visitSession(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardOngoingCases);
