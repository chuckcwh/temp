import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Loader from 'react-loader';
import moment from 'moment';
import s from './DashboardAvailableCases.css';
import Container from '../Container';
import DashboardDataTable from '../DashboardDataTable';
import DashboardTableButton from '../DashboardTableButton';
import { APPLICATION_CREATE_SUCCESS, fetchServices, getSuggestedSessions, createApplication, showConfirmPopup, showAlertPopup } from '../../actions';
import { isProvider, configToName, formatSessionAlias } from '../../core/util';

class DashboardAvailableCases extends Component {

  componentDidMount() {
    this.props.fetchServices();
    this.props.user
      && this.props.user._id
      && isProvider(this.props.user)
      && this.props.getSuggestedSessions({ providerId: this.props.user._id });
  }

  componentWillReceiveProps(newProps) {
    newProps.user
      && newProps.user._id
      && this.props.user !== newProps.user
      && isProvider(newProps.user)
      && newProps.getSuggestedSessions({ providerId: newProps.user._id });
  }

  handleAccept = (sessionId) => () => {
    if (this.props.user && this.props.user._id && isProvider(this.props.user)) {
      this.props.showConfirmPopup('Are you sure you want to accept case #'
        + `${formatSessionAlias(this.props.suggestedSessions[sessionId].alias)}?`,
        () => {
          this.props.createApplication({
            provider: this.props.user._id,
            session: sessionId,
          }).then(res => {
            if (res && res.type === APPLICATION_CREATE_SUCCESS) {
              this.props.showAlertPopup('You have successfully accepted case #'
                + `${formatSessionAlias(this.props.suggestedSessions[sessionId].alias)}.`);
              this.props.user
                && this.props.user._id
                && isProvider(this.props.user)
                && this.props.getSuggestedSessions({ providerId: this.props.user._id });
            }
          });
        }
      );
    }
  };

  render() {
    const { config, services, suggestedSessions, suggestedSessionsFetching } = this.props;
    return (
      <div className={s.dashboardAvailableCases}>
        <Container>
          <Loader className="spinner" loaded={!suggestedSessionsFetching}>
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
                              + `(${services && services[session.service] && services[session.service].classes
                                  && services[session.service].classes[session.serviceClass]
                                  && services[session.service].classes[session.serviceClass].duration}hrs)`}
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
                            <DashboardTableButton onClick={this.handleAccept(session._id)}>Accept</DashboardTableButton>
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
  config: React.PropTypes.object,
  user: React.PropTypes.object,
  services: React.PropTypes.object,
  servicesFetching: React.PropTypes.bool,
  suggestedSessions: React.PropTypes.object,
  suggestedSessionsFetching: React.PropTypes.bool,

  fetchServices: React.PropTypes.func.isRequired,
  getSuggestedSessions: React.PropTypes.func.isRequired,
  createApplication: React.PropTypes.func.isRequired,
  showConfirmPopup: React.PropTypes.func.isRequired,
  showAlertPopup: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  config: state.config.data,
  user: state.user.data,
  services: state.services.data,
  servicesFetching: state.services.isFetching,
  suggestedSessions: state.suggestedSessions.data,
  suggestedSessionsFetching: state.suggestedSessions.isFetching,
});

const mapDispatchToProps = (dispatch) => ({
  fetchServices: () => dispatch(fetchServices()),
  getSuggestedSessions: (params) => dispatch(getSuggestedSessions(params)),
  createApplication: (params) => dispatch(createApplication(params)),
  showConfirmPopup: (params, accept) => dispatch(showConfirmPopup(params, accept)),
  showAlertPopup: (params) => dispatch(showAlertPopup(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardAvailableCases);
