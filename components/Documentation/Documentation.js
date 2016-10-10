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
import { getSession, showAlertPopup, fetchServices, getSessionDocumentation, createSessionDocumentation, editSessionDocumentation } from '../../actions';
import ConfirmPopup from '../ConfirmPopup';
import { Grid, Row, Col } from 'react-flexbox-grid';
// sub-component - step 1
import DocumentationMedicalHistoryForm from './DocumentationMedicalHistoryForm/DocumentationMedicalHistoryForm';
import DocumentationOverallForm from './DocumentationOverallForm/DocumentationOverallForm';
import DocumentationVitalSignsForm from './DocumentationVitalSignsForm/DocumentationVitalSignsForm';
import DocumentationFRATForm from './DocumentationFRATForm/DocumentationFRATForm';
import DocumentationMSEForm from './DocumentationMSEForm/DocumentationMSEForm';
// sub-component - step 2
import DocumentationBateForm from './DocumentationBateForm/DocumentationBateForm';
import DocumentationNGTForm from './DocumentationNGTForm/DocumentationNGTForm';
import DocumentationCatheterForm from './DocumentationCatheterForm/DocumentationCatheterForm';
// sub-component - step 3
import DocumentationSummaryForm from './DocumentationSummaryForm/DocumentationSummaryForm';
// react-icons
import FaPlus from 'react-icons/lib/fa/plus';


const stepSectionsSchema = {
  "1": {
    icon: "1",
    text: 'Patient Assessment',
    forms: {
      'Med History': { name: 'Med History', isDefault: true, next: {step: "1", formName: "Overall" }},
      'Overall': { name: 'Overall', isDefault: true, next: {step: "1", formName: "Vital Signs" }},
      'Vital Signs': { name: 'Vital Signs', isDefault: true, next: {step: "1", formName: "more" }},
      'FRAT': { name: 'FRAT', isDefault: false, next: {step: "1", formName: "more" }},
      'MSE': { name: 'MSE', isDefault: false, next: {step: "1", formName: "more" }},
    }},
  "2": {
    icon: "2",
    text: 'Procedural Assessment',
    forms: {
      'Bate': { name: ['Bate'], isDefault: false, next: {step: "2", formName: "more" }},
      'NGT': { name: 'NGT', isDefault: false, next: {step: "2", formName: "more" }},
      'Catheter': { name: 'Catheter', isDefault: false, next: {step: "2", formName: "more" }},
    }},
  "3": {
    icon: "3",
    text: 'Summary of Findings',
    forms: {
      'Summary of Findings': { name: 'Summary of Findings', isDefault: true, next: {step: "4" }},
    }},
  "4": {
    icon: "4",
    text: 'Confirmation',
    forms: {
      'Confirmation': { name: 'Confirmation', isDefault: true }
    }}
};

class Documentation extends Component {

  constructor(props) {
    super(props);

    this.state = {
      step: "1",
      currentForm: 'Med History',
      stepSections: stepSectionsSchema,
      BateFormNum: stepSectionsSchema['2'].forms['Bate'].isDefault ? 1 : 0,
      wholeDocData: {}, // use obj because we need to check if the form data has been added by its key as formName
      docAlreadyCreated: false,
      formsAdded: {},
    }
  }

  componentDidMount() {
    const { sessionId } = this.props.params;
    const { fetchServices, getSession, getSessionDocumentation, showAlertPopup } = this.props;

    fetchServices();
    getSession({ sessionId });
    getSessionDocumentation({ sessionId }).then(res => {
      if (res.type === 'SESSION_DOCUMENTATION_GET_FAILURE') {
        showAlertPopup('Case Doc Get Failure');
      } else if (res.type === 'SESSION_DOCUMENTATION_GET_SUCCESS' && res.response.data) {
        showAlertPopup(<span>Doc already created!<br />You are going to edit the doc</span>);
        this.setState({ wholeDocData: res.response.data, docAlreadyCreated: true });
      }
    });
  }

  onStepChange = (newStep) => {
    const { step, stepSections } = this.state;
    if (step !== newStep) {
      const nextForm = Object.values(stepSections[newStep].forms).filter(i => i.isDefault)[0];
      this.setState({
        step: newStep,
        currentForm: nextForm && nextForm.name || 'more'
      })
    }
  }

  getSubMenu = () => {
    const { step, currentForm, stepSections } = this.state;
    const subMenu = Object.values(stepSections[step].forms).filter(item => item.isDefault || this.state.formsAdded[item.name]);

    return subMenu && subMenu.map((form, index) => {
      if (Array.isArray(form.name)) {
        return form.name.map((item, subIndex) => (
          <div
            key={subIndex}
            className={cx(
              s.stepSectionCategoryUnit,
              currentForm === item && s.stepSectionCategoryUnitActive)}
            onClick={() => this.setState({currentForm: item})}
          >
            {item}
          </div>
        ))
      } else {
        return (
          <div
            key={index}
            className={cx(
              s.stepSectionCategoryUnit,
              (currentForm === form.name
                || (stepSections[step].forms[currentForm] === undefined && Object.values(stepSections[step].forms).length === 1))
                && s.stepSectionCategoryUnitActive)}
            onClick={() => this.setState({currentForm: form.name})}
          >
            {form.name}
          </div>
        )
      }
    })
  }

  onFormAdded = (formName) => {
    const { formsAdded } = this.state;
    formsAdded[formName] = true;
    this.setState({ formsAdded });
  }

  onMultiFormsAdded = (page, formName, formNum) => {
    const { stepSections } = this.state;

    if (!stepSections[page].forms[formName].isDefault) {
      stepSections[page].forms[formName].isDefault = true;
    } else {
      stepSections[page].forms[formName].name.push(`${formName} (${formNum + 1})`);
    }
    this.setState({
      stepSections,
      [`${formName}FormNum`]: formNum + 1
    });
  }

  saveFormAndNext = (formName, values) => {
    console.log(formName, values);
    const { wholeDocData, step, currentForm, stepSections } = this.state;
    wholeDocData[formName] = values;

    this.setState({ wholeDocData });

    if (stepSections[step].forms[currentForm].next) {
      this.setState({
        step: stepSections[step].forms[currentForm].next['step'],
        currentForm: stepSections[step].forms[currentForm].next['formName'],
      })
    }

    // console.log('wholeDocData', this.state.wholeDocData);
    window.scrollTo(0, 0);
  }

  onSubmitFormAsWhole = () => {
    console.log('submit form!', this.state.wholeDocData);
    const { createSessionDocumentation, editSessionDocumentation } = this.props;
    if (this.state.docAlreadyCreated) {
      editSessionDocumentation({
        ...this.state.wholeDocData,
        sessionId: this.props.params.sessionId
      }).then(res => {
        if (res.type === 'SESSION_DOCUMENTATION_EDIT_SUCCESS') {
          showAlertPopup('Edit Case Successful!');
        } else {
          showAlertPopup('Edit failed! Please check your forms.');
        }
      });
    } else {
      createSessionDocumentation({
        ...this.state.wholeDocData,
        sessionId: this.props.params.sessionId
      }).then(res => {
        if (res.type === 'SESSION_DOCUMENTATION_CREATE_SUCCESS') {
          showAlertPopup('Create Case Successful!');
        } else {
          showAlertPopup('Created failed! Please check your forms.');
        }
      });
    }
  }

  render() {
    const { sessionId } = this.props.params;
    const { config, session, services } = this.props;
    const { step, BateFormNum, currentForm, stepSections, wholeDocData, formsAdded } = this.state;

    const title = () => {
      const serviceName = session.service && Object.keys(services).length > 0 && services[session.service].name;
      const serviceClassName = session.serviceClass && Object.keys(services).length > 0 && services[session.service].classes[session.serviceClass].duration;
      return serviceName ? `${serviceName} (${serviceClassName} hr${parseFloat(serviceClassName) > 1 ? 's' : ''})` : '';
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
                      <li><span className={s.basicInfoTitle}>Service:</span>{title()}</li>
                      <li><span className={s.basicInfoTitle}>Date:</span>{moment(session.date).format('YYYY-MM-DD')}</li>
                      <li><span className={s.basicInfoTitle}>Time:</span>{configToName(config, 'timeSlotsByValue', session.timeSlot)}</li>
                    </ul>
                  </Col>
                  <Col xs={12} md={6}>
                    <h3>Patient</h3>
                    <ul>
                      <li><span className={s.basicInfoTitle}>Name:</span>{session.patient && session.patient.name}</li>
                      <li><span className={s.basicInfoTitle}>Age:</span>{session.patient && moment().diff(session.patient.dob, 'years') ? moment().diff(session.patient.dob, 'years') : 0}</li>
                      <li><span className={s.basicInfoTitle}>Gender:</span>{session.patient && configToName(config, 'gendersByValue', session.patient.gender)}</li>
                      <li><span className={s.basicInfoTitle}>Note:</span>{session.patient && session.patient.specialNotes}</li>
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
              {Object.values(stepSections).map((item, index) => (
                <div
                  className={cx(s.stepSectionUnit, step === item.icon && s.stepSectionUnitActive)}
                  onClick={() => this.onStepChange(item.icon)}
                  key={index}
                >
                  <div>{item.icon}</div>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            <div className={s.stepSectionCategory}>
              <div className={s.stepSectionCategoryContainer}>
                {this.getSubMenu()}

                {Object.values(stepSections[step].forms).filter(item => !item.isDefault).length > 0 && (
                  <div
                    className={cx(s.stepSectionCategoryUnit, (currentForm === 'more' || stepSections[step].forms[currentForm] === undefined) && s.stepSectionCategoryUnitActive)}
                    onClick={() => this.setState({currentForm: 'more'})}>
                    <FaPlus />Add More..
                  </div>
                )}
              </div>
            </div>

            <div className={s.formContent}>
              {step === "1" && currentForm === 'Med History' ? (<DocumentationMedicalHistoryForm initialValues={{...wholeDocData.medHistForm}} onFormSubmit={values => this.saveFormAndNext('medHistForm', values)} />)
                : step === "1" && currentForm === 'Overall' ? (<DocumentationOverallForm initialValues={{...wholeDocData.overallForm}} onFormSubmit={values => this.saveFormAndNext('overallForm', values)} />)
                : step === "1" && currentForm === 'Vital Signs' ? (<DocumentationVitalSignsForm initialValues={{...wholeDocData.vitalSignsForm}} onFormSubmit={values => this.saveFormAndNext('vitalSignsForm', values)} />)
                : step === "1" && currentForm === 'FRAT' ? (<DocumentationFRATForm initialValues={{...wholeDocData.fratForm}} onFormSubmit={values => this.saveFormAndNext('fratForm', values)} />)
                : step === "1" && currentForm === 'MSE' ? (<DocumentationMSEForm initialValues={{...wholeDocData.mseForm}} onFormSubmit={values => this.saveFormAndNext('mseForm', values)} />)
                : step === "1" ? (
                  <div>
                    <h2>Add More</h2>
                    <div>
                      <h3>Fall Risk Assessment Tool (FRAT)</h3>
                      <p>The Fall Risk Assessment Tool (FRAT) is a 4-item falls-risk screening tool for sub-acute and residential care: The first step in falls prevention. The FRAT has three sections: Part 1 - falls risk status; Part 2 – risk factor checklist; and Part 3 – action plan. The complete tool (including instructions for use) is a complete falls risk assessment tool. However, Part 1 can be used as a falls risk screen.</p>
                      <div className={s.rightAligned}>
                        <button
                          className="btn btn-primary"
                          onClick={e => this.onFormAdded('FRAT')}
                          disabled={stepSections["1"].forms['FRAT'].isDefault || this.state.FRAT}>
                          {stepSections["1"].forms['FRAT'].isDefault || this.state.FRAT ? "Form Added" : (<div><FaPlus />Add Form</div>)}
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3>Mental State Examination (MSE)</h3>
                      <p>The mental state examination (MSE) is a brief 30-point questionnaire test that is used to screen for cognitive impairment. It is commonly used to screen for dementia. It is also used to estimate the severity of cognitive impairment and to follow the course of cognitive changes in an individual over time. </p>
                      <div className={s.rightAligned}>
                        <button
                          className="btn btn-primary"
                          onClick={e => this.onFormAdded('MSE')}
                          disabled={stepSections["1"].forms['MSE'].isDefault || this.state.MSE}>
                          {stepSections["1"].forms['MSE'].isDefault || this.state.MSE ? "Form Added" : (<div><FaPlus />Add Form</div>)}
                        </button>
                      </div>
                    </div>
                  </div>
                )

                : step === "2" && currentForm.indexOf('Bate') !== -1 ? (<DocumentationBateForm formKey={parseInt(currentForm) || 1} initialValues={{...wholeDocData.bateForms}} onFormSubmit={values => this.saveFormAndNext(`bateForms`, values)} />)
                : step === "2" && currentForm === 'NGT' ? (<DocumentationNGTForm initialValues={{...wholeDocData.ngtForm}} onFormSubmit={values => this.saveFormAndNext('ngtForm', values)} />)
                : step === "2" && currentForm === 'Catheter' ? (<DocumentationCatheterForm initialValues={{...wholeDocData.catheterForm}} onFormSubmit={values => this.saveFormAndNext('catheterForm', values)} />)
                : step === "2" ? (
                  <div>
                    <h2>Add More</h2>
                    <div>
                      <h3>Bate Jensen Wound Form (Bate)</h3>
                      <p>Bate Jensen documentation form is a tool used to assess a wound’s status. The HIGHER the total score, the more severe the wound status. It is used to monitor the status of the wound.</p>
                      <div className={s.rightAligned}>
                        <button
                          className="btn btn-primary"
                          onClick={() => this.onMultiFormsAdded(2, 'Bate', BateFormNum)}
                        >
                          {stepSections["2"].forms['Bate'].isDefault || this.state.Bate ? "Form Added" : (<div><FaPlus />Add Form</div>)}
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3>Nasogastric Tube (NGT)</h3>
                      <p>Nasogastric tube documentation form is a tool used to assess and evaluate the outcome of the procedure done in accordance to international best practices guidelines.</p>
                      <div className={s.rightAligned}>
                        <button
                          className="btn btn-primary"
                          onClick={() => this.onFormAdded('NGT')}
                          disabled={stepSections["2"].forms['NGT'].isDefault || this.state.NGT}>
                          {stepSections["2"].forms['NGT'].isDefault || this.state.NGT ? "Form Added" : (<div><FaPlus />Add Form</div>)}
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3>Urinary Catheter</h3>
                      <p>Urinary Catheter documentation form is a tool used to assess and evaluate the outcome of the procedure done in accordance to international best practices guidelines.</p>
                      <div className={s.rightAligned}>
                        <button
                          className="btn btn-primary"
                          onClick={() => this.onFormAdded('Catheter')}
                          disabled={stepSections["2"].forms['Catheter'].isDefault || this.state.formsAdded.Catheter}>
                          {stepSections["2"].forms['Catheter'].isDefault || this.state.formsAdded.Catheter ? "Form Added" : (<div><FaPlus />Add Form</div>)}
                        </button>
                      </div>
                    </div>
                  </div>
                )
                : step === "3" ? (<DocumentationSummaryForm initialValues={{...wholeDocData.summaryForm}} onFormSubmit={values => this.saveFormAndNext('summaryForm', values)} />)
                : step === "4" ? (
                  <div>
                    <h2>Confirmation</h2>

                    <div>
                      <p>You have reached the end of the documentation.</p>
                      <p>Are you sure you have filled up all the documents accurately?</p>
                      <p>Please do another round of checking befor submitting the documents.</p>
                      <p>Thank you for taking the time out to complete the documentation.</p>
                    </div>

                    <div className={s.handleForm}>
                      <button
                        className='btn btn-secondary'
                        onClick={() => this.onStepChange("3")}>
                        Back
                      </button>
                      <button
                        className='btn btn-primary'
                        onClick={() => this.onSubmitFormAsWhole()}>
                        Submit
                      </button>
                    </div>
                  </div>
                )
                : null}
            </div>
          </div>
        </Container>
      </div>
    );
  }
}

Documentation.propTypes = {
  showAlertPopup: React.PropTypes.func.isRequired,
  getSession: React.PropTypes.func.isRequired,
  fetchServices: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  config: state.config.data,
  session: state.session.data,
  services: state.services.data,
});

const mapDispatchToProps = (dispatch) => ({
  fetchServices: () => dispatch(fetchServices()),
  showAlertPopup: (message) => dispatch(showAlertPopup(message)),
  getSession: (params) => dispatch(getSession(params)),
  getSessionDocumentation: (params) => dispatch(getSessionDocumentation(params)),
  createSessionDocumentation: (params) => dispatch(createSessionDocumentation(params)),
  editSessionDocumentation: (params) => dispatch(editSessionDocumentation(params)),
  // getDocumentation: (params) => dispatch(getDocumentation(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Documentation);
