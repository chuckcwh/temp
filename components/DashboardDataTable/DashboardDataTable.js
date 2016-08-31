import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Grid, Row, Col } from 'react-flexbox-grid';
import moment from 'moment';
import s from './DashboardDataTable.css';
import Container from '../Container';
import DashboardTableButton from '../DashboardTableButton';


class DashboardDataTable extends Component {
  render() {
    const { user, cazes, confirmedApptSessions, tableData, dataActions } = this.props;
    const { name, cases } = tableData;

    const actionBtn = dataActions.map(item => (
      <DashboardTableButton>{item}</DashboardTableButton>
    ))

    return (
      <Grid fluid className={s.dashboardDataTable}>
        <p className={s.name}>{ name }</p>
        <Row className={s.lgHeader}>
          <Col md={2}>Case ID</Col>
          <Col md={2}>Follow up</Col>
          <Col md={2}>Date</Col>
          <Col md={2}>Time</Col>
          <Col md={1}>Service</Col>
          <Col md={1}>Price</Col>
          <Col md={1}>Status</Col>
          <Col md={1}>Action</Col>
        </Row>
        {
          cases.map(item => (
            <Row className={s.sessionDetails} key={item.caseId}>
              <Col xs={4}>Case ID</Col>
              <Col xs={8} md={2}>{item.caseId}</Col>
              <Col xs={4}>Follow up</Col>
              <Col xs={8} md={2}>{item.followUp}</Col>
              <Col xs={4}>Date</Col>
              <Col xs={8} md={2}>{item.date}</Col>
              <Col xs={4}>Time</Col>
              <Col xs={8} md={2}>{item.time}</Col>
              <Col xs={4}>Service</Col>
              <Col xs={8} md={1}>{item.service}</Col>
              <Col xs={4}>Price</Col>
              <Col xs={8} md={1}>{item.price}</Col>
              <Col xs={4}>Status</Col>
              <Col xs={8} md={1}>{item.status}</Col>
              <Col xs={4}>Action</Col>
              <Col xs={8} md={1}>{actionBtn}</Col>
            </Row>
          ))
        }
      </Grid>
    );
  }
}


DashboardDataTable.propTypes = {
  // confirmedApptSessions: React.PropTypes.array.isRequired,
  //
  // user: React.PropTypes.object,
  // services: React.PropTypes.object,
  // servicesFetching: React.PropTypes.bool,
  // servicesTree: React.PropTypes.array,
  // servicesTreeHash: React.PropTypes.object,
  // servicesSubtypesHash: React.PropTypes.object,
  // servicesSubtypesHashBySlug: React.PropTypes.object,
  // patients: React.PropTypes.object,
  // patientsFetching: React.PropTypes.bool,
  // patientIds: React.PropTypes.array,
  // cazes: React.PropTypes.object,
  // cazesFetching: React.PropTypes.bool,
  // cazeIds: React.PropTypes.array,
  //
  // fetchServices: React.PropTypes.func,
  // getPatients: React.PropTypes.func,
  // getCases: React.PropTypes.func,
};

export default connect()(DashboardDataTable);
