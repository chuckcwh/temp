import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import moment from 'moment';
import { Grid, Row, Col } from 'react-flexbox-grid';
import s from './DashboardOngoingCases.css';
import Link from '../Link';
import DashboardDataTable from '../DashboardDataTable';
import DashboardTableButton from '../DashboardTableButton';
import { fetchServices } from '../../actions';
import { configToName, formatSessionAlias } from '../../core/util';

class DashboardOngoingCases extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.fetchServices();
  }

  render() {
    const { config, services, sessions, sessionsFetching } = this.props;
    const filteredSessions = sessions && Object.values(sessions).filter(session => session.phase === 'pending-visit'
      || session.phase === 'pending-documentation');
    return (
      <div className={s.dashboardOngoingCases}>
        <Loader className="spinner" loaded={!sessionsFetching}>
          <div className={s.cases}>
          {filteredSessions && Object.values(filteredSessions).length > 0 &&
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
                  filteredSessions && Object.values(filteredSessions).map(session => (
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
                          + `(${services && services[session.service] && services[session.service].classesHash
                              && services[session.service].classesHash[session.serviceClassId]
                              && services[session.service].classesHash[session.serviceClassId].duration}hrs)`}
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
          }
          {!(filteredSessions && Object.values(filteredSessions).length) &&
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
  sessions: React.PropTypes.object,
  sessionsFetching: React.PropTypes.bool,

  fetchServices: React.PropTypes.func,
};

const mapStateToProps = (state) => ({
  config: state.config.data,
  services: state.services.data,
  servicesFetching: state.services.isFetching,
  sessions: state.user.data && state.user.data._id
    && state.sessionsByUser[state.user.data._id]
    && state.sessionsByUser[state.user.data._id].data,
  sessionsFetching: state.user.data && state.user.data._id
    && state.sessionsByUser[state.user.data._id]
    && state.sessionsByUser[state.user.data._id].isFetching,
});

const mapDispatchToProps = (dispatch) => ({
  fetchServices: () => dispatch(fetchServices()),
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardOngoingCases);
