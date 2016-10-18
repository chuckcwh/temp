import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import s from './DocumentationFRATForm.css';
import Container from '../../Container';
import Link from '../../Link';
import Header from '../../Header';
import { getUserName, configToName } from '../../../core/util';
import { getSession, showConfirmPopup, fetchServices } from '../../../actions';
import ConfirmPopup from '../../ConfirmPopup';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { reduxForm, addArrayValue, reset } from 'redux-form';
import { Selections } from '../DocumentationModules/DocumentationModules';
// react-icons
import FaArrowCircleRight from 'react-icons/lib/fa/arrow-right';


class DocumentationFRATForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      riskScore: null,
      fallRiskStatus: null,
    }
  }

  renderRowsWith1Col = (items) => {
    return items.map((item, index) => (
      <tr key={index} className={s.bodyRow}>
        <td className={s.col}>
          {item.first}
        </td>
      </tr>
  ))}

  renderRowsWith2Col = (items) => {
    return items.map((item, index) => (
      <tr key={index} className={s.bodyRow}>
        <td className={s.firstCol}>
          <strong>{item.first}</strong>{item.firstSub && <br />}
          {item.firstSub}
        </td>
        <td className={s.secondCol}>
          {item.second}
        </td>
      </tr>
  ))}

  renderIssueSet = (issues) => {
    return issues.map((issue, index) => (
      <div key={index}>
        <label className={s.issueTitle}><strong>{issue.first}</strong></label>
        <div className={s.issueContent}>
          {issue.second}
        </div>
      </div>
    ))
  }

  componentWillReceiveProps(nextProps) {
    const {
      recentFalls,
      medications,
      psychological,
      cognitiveStatus,
      recentChanges,
      dizziness,
      interventions
    } = nextProps.fields;
    let sum;
    let fallRiskStatus;

    if (recentFalls.value && medications.value && psychological.value && cognitiveStatus.value) {
      sum = +recentFalls.value + +medications.value + +psychological.value + +cognitiveStatus.value;
      if (sum < 12) {
        fallRiskStatus = (<span className={s.green}>Low</span>)
      } else if (sum < 16) {
        fallRiskStatus = (<span className={s.orange}>Medium</span>)
      } else {
        fallRiskStatus = (<span className={s.red}>High</span>)
      }
    }
    if (recentChanges.value || dizziness.value) {
      fallRiskStatus = (<span className={s.red}>High</span>)
    }

    return this.setState({
      riskScore: sum && `${sum} / 20`,
      fallRiskStatus,
    })
  }

  onFormSubmit = (values) => {
    console.log('onFormSubmit', values);

    values['recentFalls'] = +values.recentFalls;
    values['medications'] = +values.medications;
    values['psychological'] = +values.psychological;
    values['cognitiveStatus'] = +values.cognitiveStatus;
    values['score'] = this.state.riskScore;
    values['status'] = this.state.fallRiskStatus;

    this.props.onFormSubmit(values);
  }

  render() {
    const {
      fields: {
        recentFalls,
        medications,
        psychological,
        cognitiveStatus,
        recentChanges,
        dizziness,
        interventions,
      },

      resetForm,
      invalid,
      handleSubmit,
      submitFailed,
      submitting,
    } = this.props;

    const { riskScore, fallRiskStatus } = this.state;

    const firstSec = [{
      first: "Recent Falls",
      second: (
        <Selections
          fieldName="recentFalls"
          field={recentFalls}
          items={[
            {value: "2", label: (<span>None in last months</span>)},
            {value: "4", label: (<span>One or more between 3 & 12 months ago</span>)},
            {value: "6", label: (<span>One or more in last 3 months</span>)},
            {value: "8", label: (<span>One or more in last 3 months whilst resident</span>)},
          ]}
        />
    )}, {
      first: "Medications",
      firstSub: "(Sedatives, Anti-Depressants, Anti-Parkinson&#39;s, Diuretics, Anti-hypertensives, Hypnotics)",
      second: (
        <Selections
          fieldName="medications"
          field={medications}
          items={[
            {value: "1", label: (<span>Not taking any of these</span>)},
            {value: "2", label: (<span>Taking 1</span>)},
            {value: "3", label: (<span>Taking 2</span>)},
            {value: "4", label: (<span>Taking more than 2</span>)},
          ]}
        />
    )}, {
      first: "Psychological",
      firstSub: "(Anxiety, Depression, ↓ Cooperation, ↓ Insight or ↓ Judgement)",
      second: (
        <Selections
          fieldName="psychological"
          field={psychological}
          items={[
            {value: "1", label: (<span>Does not appear to have any of these</span>)},
            {value: "2", label: (<span>Appears mildly affected by one or more</span>)},
            {value: "3", label: (<span>Appears moderately affected by one or more</span>)},
            {value: "4", label: (<span>Appears severely affeced by one or more</span>)},
          ]}
        />
    )}, {
      first: "Cognitive Status",
      second: (
        <Selections
          fieldName="cognitiveStatus"
          field={cognitiveStatus}
          items={[
            {value: "1", label: (<span>Intact</span>)},
            {value: "2", label: (<span>Mildly impaired</span>)},
            {value: "3", label: (<span>Moderately impaired</span>)},
            {value: "4", label: (<span>Severely impaired</span>)},
          ]}
        />
    )}];

    const secondSec = [{
      first: (
        <div>
          <input
            type="checkbox"
            id="recentChanges"
            name="recentChanges"
            {...recentChanges}
          />
          <label htmlFor="recentChanges"><span></span><span>Recent change in functional status and/or medications affecting safe mobility (or anticipated)</span></label>
        </div>
    )}, {
      first: (
        <div>
          <input
            type="checkbox"
            id="dizziness"
            name="dizziness"
            {...dizziness}
          />
          <label htmlFor="dizziness"><span></span><span>Dizziness/ Postural hypotension</span></label>
        </div>
    )}];

    const thirdSec = [{
      first: 'Vision',
      second: 'Reports/ Observed difficulty seeing - objects/ signs/ finding way around',
    }, {
      first: 'Mobility',
      second: 'Mobility status unknown or appears unsafe/ impulsive/ forgets gait aid',
    }, {
      first: 'Transfers',
      second: 'Transfer status unknown or appears unsafe ie. Over-reaches, impulsive',
    }, {
      first: 'Behaviours',
      second: (
        <span>Observed or reported agitation, confusion, disorientation<br />
        Difficulty following instructions or non-compliant (observed or known)</span>
    )}, {
      first: 'ADLs',
      second: (
        <span>Observed risk-taking behaviours, or reported from referrer/ previous facility<br />
        Observed unsafe use of equipment<br />
        Unsafe footwear/ inappropriate clothing</span>
    )}, {
      first: 'Environment',
      second: 'Difficulties with orientation to environment ie. Areas between bed/ bathroom/ dining room',
    }, {
      first: 'Nutrition',
      second: 'Underweight/ low appetite',
    }, {
      first: 'Continence',
      second: 'Reported or known urgency/ nocturia/ accidents',
    }];

    const forthSec = [{
      first: 'Interventions',
      second: (
        <textarea className={s.textareaInput} id="interventions" name="interventions" {...interventions} placeholder="Example: Recommended home modification for night lights & ensure clear pathway to toilet." />
    )}]

    return (
      <form className={s.documentationFRATForm} onSubmit={handleSubmit(this.onFormSubmit)}>
        <h2>Fall Risk Assessment Tool (FRAT)</h2>

        <table className={s.issueSetTable}>
          <thead>
            <tr className={s.headerRow}>
              <td className={s.firstCol}>Risk Factor</td>
              <td>Level</td>
            </tr>
          </thead>
          <tbody>
            {this.renderRowsWith2Col(firstSec)}
          </tbody>
        </table>

        <table className={s.issueSetTable}>
          <thead>
            <tr className={s.headerRow}>
              <td className={s.firstCol}>Automatic High Risk Status</td>
            </tr>
          </thead>
          <tbody>
            {this.renderRowsWith1Col(secondSec)}
          </tbody>
        </table>

        <div className={s.statusSection}>
          <div>
            <div className={s.statusField}>
              <div>
                Risk Score
                <div className={s.statusFieldTitle}>
                  {riskScore || 'N/A'}
                </div>
              </div>
            </div>

            <div className={s.statusField}>
              <div>
                Fall Risk Status
                <div className={s.statusFieldTitle}>
                  {fallRiskStatus || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <table className={s.issueSetTable}>
          <thead>
            <tr className={s.headerRow}>
              <td className={s.firstCol}>Risk Factor Checklist</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {this.renderRowsWith2Col(thirdSec)}
          </tbody>
        </table>

        <div className={s.issueSetSection}>
          {this.renderIssueSet(forthSec)}
        </div>

        <div className={s.handleForm}>
          <button className='btn btn-secondary' disabled={submitting} onClick={resetForm}>
            Clear Values
          </button>
          <button className='btn btn-primary' disabled={submitting || invalid}>
            Save and Next <FaArrowCircleRight />
          </button>
        </div>
      </form>
    );
  }
}

const validate = values => {
  const errors = {};

  return errors
}

DocumentationFRATForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

const reduxFormConfig = {
  form: 'documentationFRATForm',
  fields: [
    'recentFalls',
    'medications',
    'psychological',
    'cognitiveStatus',
    'recentChanges',
    'dizziness',
    'interventions',
  ],
  validate,
}

const mapStateToProps = (state, ownProps) => ({
  initialValues: Object.keys(ownProps.initialValues).length && {
    ...ownProps.initialValues,
    recentFalls: ownProps.initialValues.recentFalls.toString(),
    medications: ownProps.initialValues.medications.toString(),
    psychological: ownProps.initialValues.psychological.toString(),
    cognitiveStatus: ownProps.initialValues.cognitiveStatus.toString(),
  }
});

const mapDispatchToProps = (dispatch) => ({
  resetForm: () => dispatch(reset('documentationFRATForm')),
});

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(DocumentationFRATForm);
