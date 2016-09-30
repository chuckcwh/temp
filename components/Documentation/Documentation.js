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
// react-icons
import FaPlus from 'react-icons/lib/fa/plus';


class Documentation extends Component {

  constructor(props) {
    super(props);

    this.state = {
      step: "1",
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

    const stepSections = {
      "1": {
        icon: "1",
        text: 'Patient Assessment',
        forms: [
          { name: 'Med History', isDefault: true },
          { name: 'Overall', isDefault: true },
          { name: 'Vital Signs', isDefault: true },
          { name: 'FRAT', isDefault: false },
          { name: 'MSE', isDefault: false },
        ]},
      "2": {
        icon: "2",
        text: 'Procedural Assessment',
        forms: [
          { name: 'Bate', isDefault: false },
          { name: 'NGT', isDefault: false },
          { name: 'Urinary Catheter', isDefault: false },
        ]},
      "3": {
        icon: "3",
        text: 'Summary of Findings',
        forms: [
          { name: 'Nursing Notes', isDefault: true }
        ]},
      "4": {
        icon: 4,
        text: 'Confirmation',
        forms: [
          { name: 'Confirmation', isDefault: true }
        ]}
    };

    console.log('currentform', currentForm);

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

          <div className={s.docBasic}>
            <div className={s.docBasicTitle}>
              Provider Documentation - Step {step} of 4
            </div>

            <div className={s.stepSection}>
              {Object.values(stepSections).map(item => (
                <div
                  className={cx(s.stepSectionUnit, step === item.icon && s.stepSectionUnitActive)}
                  onClick={() => this.setState({step: item.icon})}
                  key={Object.values(stepSections).indexOf(item)}
                >
                  <div>{item.icon}</div>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            <div className={s.stepSectionCategory}>
              <div className={s.stepSectionCategoryContainer}>
                {stepSections[step].forms.filter(item => item.isDefault).map(form => (
                  <div
                    key={stepSections[step].forms.indexOf(form)}
                    className={cx(s.stepSectionCategoryUnit, currentForm === form.name && s.stepSectionCategoryUnitActive)}
                    onClick={() => this.setState({currentForm: form.name})}>
                    {form.name}
                  </div>
                ))}
                {stepSections[step].forms.filter(item => !item.isDefault).length > 0 && (
                  <div
                    className={s.stepSectionCategoryUnit}
                    onClick={() => this.setState({currentForm: 'more'})}>
                    <FaPlus />Add More..
                    </div>
                  )}
              </div>
            </div>

            <div className={s.formContent}>
              {step === "1" && currentForm === 'Med History' ? (<DocumentationMedicalHistoryForm onFormSubmit={(e) => console.log('medical history submit', e.value)}/>)
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
