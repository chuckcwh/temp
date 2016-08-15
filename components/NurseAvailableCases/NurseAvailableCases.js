import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Loader from 'react-loader';
import s from './NurseAvailableCases.css';
import Container from '../Container';
import { getAvailableCases } from '../../actions';
import moment from 'moment';
import DashboardTableButton from '../DashboardTableButton';

class NurseAvailableCases extends Component {

  componentDidMount() {
    this.props.nurse
      && this.props.nurse.id
      && this.props.getAvailableCases({ nid: this.props.nurse.id });
  }

  render() {
    const { availCases, availCasesFetching } = this.props;
    const rowArr = [];
    availCases && Object.values(availCases).forEach((caze) => {
      caze.dates.forEach((date) => {
        const row = {};
        const currentDate = moment();
        const age = currentDate.diff(moment(caze.patient.dob), 'years');
        row.id = date.id;
        row.cazeId = caze.id;
        row.service = caze.service.name;
        row.address = caze.addresses[0].region;
        row.date = moment(date.dateTimeStart).format('ddd, DD MMM YYYY');
        row.estTime = date.estTime;
        row.patient = `${caze.patient.fullName} ( ${age}, ${caze.patient.gender})`;
        row.action = 'Accept';
        row.price = `$ ${date.price}`;
        row.notes = caze.notes;
        rowArr.push(row);
      });
    });

    return (
      <div className={s.nurseAvailableCases}>
        <Container>
          <Loader className="spinner" loaded={!availCasesFetching}>
            <center><h2><b>Available Cases</b></h2></center>
            <Grid fluid className={s.grid}>
              <Row className={s.lgHeader}>
                <Col md={2}>Date</Col>
                <Col md={3}>Service</Col>
                <Col md={2}>Patient</Col>
                <Col md={2}>Region</Col>
                <Col md={1}>Price</Col>
                <Col md={1}>Case ID</Col>
                <Col md={1}>Action</Col>
              </Row>
              {
                rowArr.map(row => (
                  <Row className={s.sessionDetails} key={row.id}>
                    <Col xs={4}>Date</Col>
                    <Col xs={8} md={2}>{row.date} ({row.estTime})</Col>
                    <Col xs={4}>Service</Col>
                    <Col xs={8} md={3}>{row.service}</Col>
                    <Col xs={4}>Patient</Col>
                    <Col xs={8} md={2}>{row.patient}</Col>
                    <Col xs={4}>Region</Col>
                    <Col xs={8} md={2}>{row.address}</Col>
                    <Col xs={4}>Price</Col>
                    <Col xs={8} md={1}>{row.price}</Col>
                    <Col xs={4}>Case ID</Col>
                    <Col xs={8} md={1}>{row.cazeId}</Col>
                    <Col xs={4}>Action</Col>
                    <Col xs={8} md={1}><DashboardTableButton>Accept</DashboardTableButton></Col>
                  </Row>
                ))
              }
            </Grid>
          </Loader>
        </Container>
      </div>
    );
  }
}

NurseAvailableCases.propTypes = {
  user: React.PropTypes.object,
  getAvailableCases: React.PropTypes.func.isRequired,
  availCasesFetching: React.PropTypes.bool,
  nurse: React.PropTypes.object,
  availCases: React.PropTypes.object,
};

const mapStateToProps = (state) => ({
  user: state.user.data,
  nurse: state.user.data && state.user.data.nurses && state.user.data.nurses.length && state.user.data.nurses[0],
  availCases: state.user.data && state.user.data.nurses && state.user.data.nurses.length
    && state.user.data.nurses[0] && state.user.data.nurses[0].id
    && state.cazesAvailToNurse[state.user.data.nurses[0].id]
    && state.cazesAvailToNurse[state.user.data.nurses[0].id].data,
  availCasesFetching: state.user.data && state.user.data.nurses && state.user.data.nurses.length
    && state.user.data.nurses[0] && state.user.data.nurses[0].id
    && state.cazesAvailToNurse[state.user.data.nurses[0].id]
    && state.cazesAvailToNurse[state.user.data.nurses[0].id].isFetching,
});

const mapDispatchToProps = (dispatch) => ({
  getAvailableCases: (params) => dispatch(getAvailableCases(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NurseAvailableCases);
