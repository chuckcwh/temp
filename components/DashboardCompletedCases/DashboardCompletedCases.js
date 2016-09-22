import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import moment from 'moment';
import { Grid, Row, Col } from 'react-flexbox-grid';
import s from './DashboardCompletedCases.css';
import Link from '../Link';
import DashboardDataTable from '../DashboardDataTable';
import DashboardTableButton from '../DashboardTableButton';
import { fetchServices } from '../../actions';
import { configToName, formatSessionAlias } from '../../core/util';

class DashboardCompletedCases extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.fetchServices();
  }

  render() {
    const { config, services, applications, applicationsFetching } = this.props;
    const filteredApplications = applications && Object.values(applications).filter(application => application.status === 'completed');
    return (
      <div className={s.dashboardCompletedCases}>
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
                  filteredApplications && Object.values(filteredApplications).map(session => (
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
                      <Col xs={8} md={1}>{`$${parseFloat(application.price).toFixed(2)}`}</Col>
                      <Col xs={4}>Status</Col>
                      <Col xs={8} md={1}>
                        {configToName(config, 'applicationStatusesByValue', application.status)}
                      </Col>
                      <Col xs={4}>Action(s)</Col>
                      <Col xs={8} md={2}>
                        <DashboardTableButton to={`/applications/${session._id}`}>View</DashboardTableButton>
                        <DashboardTableButton>Cancel</DashboardTableButton>
                      </Col>
                    </Row>
                  ))
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

DashboardCompletedCases.propTypes = {
  config: React.PropTypes.object,
  services: React.PropTypes.object,
  servicesFetching: React.PropTypes.bool,
  applications: React.PropTypes.object,
  applicationsFetching: React.PropTypes.bool,

  fetchServices: React.PropTypes.func,
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
});

const mapDispatchToProps = (dispatch) => ({
  fetchServices: () => dispatch(fetchServices()),
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardCompletedCases);