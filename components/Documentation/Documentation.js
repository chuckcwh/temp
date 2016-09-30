import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import s from './Documentation.css';
import Container from '../Container';
import Link from '../Link';
import Header from '../Header';
import history from '../../core/history';
import { getUserName, configToName } from '../../core/util';
import { getSession, showConfirmPopup, fetchServices } from '../../actions';
import ConfirmPopup from '../ConfirmPopup';
import { Grid, Row, Col } from 'react-flexbox-grid';
// sub-component
import DocumentationMedicalHistoryForm from './DocumentationMedicalHistoryForm/DocumentationMedicalHistoryForm';
import DocumentationOverall from './DocumentationOverall/DocumentationOverall';
import DocumentationVitalSigns from './DocumentationVitalSigns/DocumentationVitalSigns';
// import { formList } from './variables.js';


class Documentation extends Component {

  constructor(props) {
    super(props);

    this.state = {
      step: 1,
      currentForm: 'Med History',
    }
  }

  componentDidMount() {
    const { sessionId } = this.props.params;
    const { fetchServices, getSession } = this.props;

    fetchServices();
    getSession({ sessionId });
  }


  render() {
    const { sessionId } = this.props.params;
    const { session, services } = this.props;
    const { step, currentForm } = this.state;

    const title = () => {
      const serviceName = session.service && Object.keys(services).length > 0 && services[session.service].name;
      const serviceClassName = session.serviceClass && Object.keys(services).length > 0 && services[session.service].classes[session.serviceClass].duration;
      return serviceName ? `${serviceName} (${serviceClassName} hr${parseFloat(serviceClassName) > 1 ? 's' : ''}) - ${moment(session.date).format('YYYY-MM-DD')}` : '';
    }

    return (
      <div className={s.documentation}>
        <Header title={`Case Documentation`} />
        <Container>
          <ConfirmPopup />

          <div>
            <h2>{title()}</h2>
            <div className={s.patientSection}>

              <Grid fluid>
                <Row className={s.basicInfo}>
                  <Col xs={12} md={6}>
                    <h3>Case</h3>
                    <ul>
                      <li><span>Date:</span></li>
                      <li><span>Time:</span></li>
                    </ul>
                  </Col>
                  <Col xs={12} md={6}>
                    <h3>Patient</h3>
                    <ul>
                      <li><span>Name:</span></li>
                      <li><span>NRIC:</span></li>
                      <li><span>Age:</span></li>
                      <li><span>Allergies:</span></li>
                    </ul>
                  </Col>
                </Row>
              </Grid>
            </div>
          </div>

          <div>
            <div>Provider Documentation - Step {step} of 4</div>
            <div className={s.stepSection}>
              <div className={s.stepSectionUnit}>
                <div>1</div>
                <p>Patient Assessment</p>
              </div>
              <div className={s.stepSectionUnit}>
                <div>2</div>
                <p>Procedural Assessment</p>
              </div>
              <div className={s.stepSectionUnit}>
                <div>3</div>
                <p>Summary of Findings</p>
              </div>
              <div className={s.stepSectionUnit}>
                <div>4</div>
                <p>Confirmation</p>
              </div>
            </div>

            <div>
              <div className={s.formLink} onClick={() => this.setState({currentForm: 'Med History'})}>Med History</div>
              <div className={s.formLink} onClick={() => this.setState({currentForm: 'Overall'})}>Overall</div>
              <div className={s.formLink} onClick={() => this.setState({currentForm: 'Vital Signs'})}>Vital Signs</div>
              {currentForm === 'Med History' ? (<DocumentationMedicalHistoryForm />)
                : currentForm === 'Overall' ? (<DocumentationOverall />)
                : currentForm === 'Vital Signs' ? (<DocumentationVitalSigns />)
                : null}
            </div>
          </div>
        </Container>
      </div>
    );
  }
}

Documentation.propTypes = {
  getSession: React.PropTypes.func.isRequired,
  fetchServices: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  session: state.session.data,
  services: state.services.data,
});

const mapDispatchToProps = (dispatch) => ({
  fetchServices: () => dispatch(fetchServices()),
  getSession: (params) => dispatch(getSession(params)),
  // getDocumentation: (params) => dispatch(getDocumentation(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Documentation);
