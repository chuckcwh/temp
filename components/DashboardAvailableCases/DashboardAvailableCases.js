import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Loader from 'react-loader';
import moment from 'moment';
import s from './DashboardAvailableCases.css';
import Container from '../Container';
import DashboardDataTable from '../DashboardDataTable';
import DashboardTableButton from '../DashboardTableButton';
import { getSuggestedSessions } from '../../actions';

class DashboardAvailableCases extends Component {

  componentDidMount() {
    this.props.user
      && this.props.user._id
      && this.props.getSuggestedSessions({ providerId: this.props.user._id });
  }

  componentWillReceiveProps(newProps) {
    newProps.user
      && newProps.user._id
      && this.props.user !== newProps.user
      && newProps.getSuggestedSessions({ providerId: newProps.user._id });
  }

  render() {
    const { suggestedSessions, suggestedSessionsFetching } = this.props;
    const rowArr = [];
    suggestedSessions && Object.values(suggestedSessions).forEach((session) => {
      session.dates.forEach((date) => {
        const row = {};
        const currentDate = moment();
        const age = currentDate.diff(moment(session.patient.dob), 'years');
        row.id = date.id;
        row.sessionId = session.id;
        row.service = session.service.name;
        row.address = session.addresses[0].region;
        row.date = moment(date.dateTimeStart).format('ddd, DD MMM YYYY');
        row.estTime = date.estTime;
        row.patient = `${session.patient.fullName} (${age}, ${session.patient.gender})`;
        row.action = 'Accept';
        row.price = `$${date.price}`;
        row.notes = session.notes;
        rowArr.push(row);
      });
    });

    return (
      <div className={s.dashboardAvailableCases}>
        <Container>
          <Loader className="spinner" loaded={!this.props.suggestedSessionsFetching}>
            <div className={s.cases}>
              {suggestedSessions && Object.values(suggestedSessions).length > 0 &&
                <DashboardDataTable css={s}>
                  <Grid fluid className={s.dashboardDataTable}>
                    <Row className={s.lgHeader}>
                      <Col md={1}>ID</Col>
                      <Col md={2}>Date</Col>
                      <Col md={1}>Time</Col>
                      <Col md={2}>Service</Col>
                      <Col md={2}>Region</Col>
                      <Col md={1}>Price</Col>
                      <Col md={1}>Status</Col>
                      <Col md={2}>Action(s)</Col>
                    </Row>
                    {
                      suggestedSessions && Object.values(suggestedSessions).map(session => (
                        <Row className={s.sessionDetails} key={session._id}>
                          <Col xs={4}>ID</Col>
                          <Col xs={8} md={1}>{formatSessionAlias(session.alias)}</Col>
                          <Col xs={4}>Date</Col>
                          <Col xs={8} md={2}>{moment(session.date).format('ll')}</Col>
                          <Col xs={4}>Time</Col>
                          <Col xs={8} md={1}>
                            {configToName(config, 'timeSlotsByValue', session.timeSlot)}
                          </Col>
                          <Col xs={4}>Service</Col>
                          <Col xs={8} md={2}>
                            {`${services && services[session.service] && services[session.service].name} `
                              + `(${services && services[session.service] && services[session.service].classesHash
                                  && services[session.service].classesHash[session.serviceClassId]
                                  && services[session.service].classesHash[session.serviceClassId].duration}hrs)`}
                          </Col>
                          <Col xs={4}>Region</Col>
                          <Col xs={8} md={2}>{session.address && session.address.region}</Col>
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
              {!(suggestedSessions && Object.values(suggestedSessions).length) &&
                <p>No available cases found.</p>
              }
            </div>
          </Loader>
        </Container>
      </div>
    );
  }
}

DashboardAvailableCases.propTypes = {
  user: React.PropTypes.object,
  suggestedSessions: React.PropTypes.object,
  suggestedSessionsFetching: React.PropTypes.bool,

  getSuggestedSessions: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user.data,
  suggestedSessions: state.suggestedSessions.data,
  suggestedSessionsFetching: state.suggestedSessions.isFetching,
});

const mapDispatchToProps = (dispatch) => ({
  getSuggestedSessions: (params) => dispatch(getSuggestedSessions(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardAvailableCases);
