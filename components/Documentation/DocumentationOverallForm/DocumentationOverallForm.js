import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import s from './DocumentationOverallForm.css';
import Container from '../../Container';
import Link from '../../Link';
import Header from '../../Header';
import history from '../../../core/history';
import { getUserName, configToName } from '../../../core/util';
import { getSession, showConfirmPopup, fetchServices } from '../../../actions';
import ConfirmPopup from '../../ConfirmPopup';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { reduxForm, change, reset } from 'redux-form';
import { YesNoSwitch } from '../DocumentationModules/DocumentationModules';
// react-icons
import FaArrowCircleRight from 'react-icons/lib/fa/arrow-right';


class DocumentationOverallForm extends Component {

  renderRowsWith4Col = (items) => {
    return items.map((item, index) => (
      <tr key={index} className={s.bodyRow}>
        <td className={s.firstCol}>
          <strong>{item.first}</strong>{item.firstSub && <br />}
          {item.firstSub}
        </td>
        <td className={s.secondCol}>
          {item.second}
        </td>
        <td className={s.thirdCol}>
          {item.third}
        </td>
        <td className={s.forthCol}>
          {item.forth}
        </td>
      </tr>
  ))}

  onFormSubmit = (values) => {
    console.log('onFormSubmit', values);

    const onCheckValue = (fields) => {
      fields.map(item => {
        if (!values[item]) {
          values[`${item}Evi`] = undefined;
          values[`${item}Int`] = undefined;
        }
      })
    }
    onCheckValue(['sleepDisorder', 'eatingFeeding', 'incontinence', 'breathing', 'confusion', 'fallRisk', 'skinBreakdown']);

    this.props.onFormSubmit(values);
  }

  render() {
    const {
      fields: {
        sleepDisorder,
        sleepDisorderEvi,
        sleepDisorderInt,
        eatingFeeding,
        eatingFeedingEvi,
        eatingFeedingInt,
        incontinence,
        incontinenceEvi,
        incontinenceInt,
        breathing,
        breathingEvi,
        breathingInt,
        confusion,
        confusionEvi,
        confusionInt,
        fallRisk,
        fallRiskEvi,
        fallRiskInt,
        skinBreakdown,
        skinBreakdownEvi,
        skinBreakdownInt,
      },

      resetForm,
      invalid,
      handleSubmit,
      submitFailed,
      submitting,
    } = this.props;

    const firstSec = [{
      first: "Sleep Problem:",
      firstSub: "How well do you sleep?",
      second: (
        <YesNoSwitch
          fieldName="sleepDisorder"
          field={sleepDisorder}
          changeFieldValue={(field, onOff) => this.props.changeFieldValue(field, onOff)}
        />
      ),
      third: (
        <textarea className={s.textareaInput} id="sleepDisorderEvi" name="sleepDisorderEvi" {...sleepDisorderEvi} disabled={!sleepDisorder.value} placeholder="e.g. Patient complains unable to sleep due to pain." />
      ),
      forth: (
        <textarea className={s.textareaInput} id="sleepDisorderInt" name="sleepDisorderInt" {...sleepDisorderInt} disabled={!sleepDisorder.value} placeholder="e.g. Asked to evaluate her pain score and assess if the medication has been appropriately taken."/>
    )}, {
      first: "Problems with eating and feeding:",
      firstSub: "How is the appetite? On NGT?",
      second: (
        <YesNoSwitch
          fieldName="eatingFeeding"
          field={eatingFeeding}
          changeFieldValue={(field, onOff) => this.props.changeFieldValue(field, onOff)}
        />
      ),
      third: (
        <textarea className={s.textareaInput} id="eatingFeedingEvi" name="eatingFeedingEvi" {...eatingFeedingEvi} disabled={!eatingFeeding.value} placeholder="e.g. Patient's caregiver has feedback that the patient has been consuming lesser amount of food." />
      ),
      forth: (
        <textarea className={s.textareaInput} id="eatingFeedingInt" name="eatingFeedingInt" {...eatingFeedingInt} disabled={!eatingFeeding.value} placeholder="e.g. Asked to evaluate her pain score and assess if the medication has been appropriately taken."/>
    )}, {
      first: "Incontinence (Bowel & Urine):",
      firstSub: (
        <span>
          How is the appetite? On NGT?<br />
          Bowel:<br />
          Constipation/ Incontinence/ Melena/ Normal/ Diarrhoea.<br /><br />
          Urination:<br />
          Normal/ Incontinence/ Unable to void/ Difficulty/ Pain on voiding Any Diapers or indwelling catheters?
        </span>
      ),
      second: (
        <YesNoSwitch
          fieldName="incontinence"
          field={incontinence}
          changeFieldValue={(field, onOff) => this.props.changeFieldValue(field, onOff)}
        />
      ),
      third: (
        <textarea className={s.textareaInput} id="incontinenceEvi" name="incontinenceEvi" {...incontinenceEvi} disabled={!incontinence.value} placeholder="e.g. Noted patient is on IDC. Patient complains of constipation occasionally." />
      ),
      forth: (
        <textarea className={s.textareaInput} id="incontinenceInt" name="incontinenceInt" {...incontinenceInt} disabled={!incontinence.value} placeholder="e.g. Caregiver noted to track the bowel frequency. Recommended to give fleet enema to the patient if patient NBO for 3 days."/>
    )}, {
      first: "Breathing:",
      second: (
        <YesNoSwitch
          fieldName="breathing"
          field={breathing}
          changeFieldValue={(field, onOff) => this.props.changeFieldValue(field, onOff)}
        />
      ),
      third: (
        <textarea className={s.textareaInput} id="breathingEvi" name="breathingEvi" {...breathingEvi} disabled={!breathing.value} placeholder="e.g. Patient complains of breathlessness after walking a short distance. Patient noted to have heart failure." />
      ),
      forth: (
        <textarea className={s.textareaInput} id="breathingInt" name="breathingInt" {...breathingInt} disabled={!breathing.value} placeholder="e.g. To ensure that there are sufficient rest areas at every few meters of the house. Advice that there should be someone always accompanying the patient when she goes out."/>
    )}, {
      first: "Cognitive Impaired:",
      firstSub: (
        <span>
          Orientation to Day/ Person/ Time/ Place.<br /><br />
          If there is suspect of confusion, MSE should be done.<br />
        </span>
      ),
      second: (
        <YesNoSwitch
          fieldName="confusion"
          field={confusion}
          changeFieldValue={(field, onOff) => this.props.changeFieldValue(field, onOff)}
        />
      ),
      third: (
        <textarea className={s.textareaInput} id="confusionEvi" name="confusionEvi" {...confusionEvi} disabled={!confusion.value} placeholder="e.g. Patient has been noted to be confused at times." />
      ),
      forth: (
        <textarea className={s.textareaInput} id="confusionInt" name="confusionInt" {...confusionInt} disabled={!confusion.value} />
    )}, {
      first: "Evidence of Fall Risk:",
      firstSub: (
        <span>
          Level of Conscious.<br />
          Mobilising: Independent/ Require
        </span>
      ),
      second: (
        <YesNoSwitch
          fieldName="fallRisk"
          field={fallRisk}
          changeFieldValue={(field, onOff) => this.props.changeFieldValue(field, onOff)}
        />
      ),
      third: (
        <textarea className={s.textareaInput} id="fallRiskEvi" name="fallRiskEvi" {...fallRiskEvi} disabled={!fallRisk.value} placeholder="e.g. Patient has unsteady gait" />
      ),
      forth: (
        <textarea className={s.textareaInput} id="fallRiskInt" name="fallRiskInt" {...fallRiskInt} disabled={!fallRisk.value} />
    )}, {
      first: "Risk of Skin Breakdown:",
      firstSub: "Check Perineal for Pressure Ulcers",
      second: (
        <YesNoSwitch
          fieldName="skinBreakdown"
          field={skinBreakdown}
          changeFieldValue={(field, onOff) => this.props.changeFieldValue(field, onOff)}
        />
      ),
      third: (
        <textarea className={s.textareaInput} id="skinBreakdownEvi" name="skinBreakdownEvi" {...skinBreakdownEvi} disabled={!skinBreakdown.value} placeholder="e.g. Patient's bony areas are noted to be reddened" />
      ),
      forth: (
        <textarea className={s.textareaInput} id="skinBreakdownInt" name="skinBreakdownInt" {...skinBreakdownInt} disabled={!skinBreakdown.value} />
    )}];

    return (
      <form className={s.documentationOverallForm} onSubmit={handleSubmit(this.onFormSubmit)}>
        <h2>Overall</h2>

        <p>Overall Assessment is an efficient and effective instrument for obtaining the information necessary to prevent health alterations in the older adult patient. Familiarity with these commonly-occurring disorders helps the nurse prevent unnecessary iatrogenesis and promote optimal function of the aging patient. Flagging conditions for further assessment allows the nurse to implement preventative and therapeutic interventions.</p>
        <p className={s.red}>It is compulsory that you complete this Overall Assessment</p>

        <table className={s.issueSetTable}>
          <thead>
            <tr className={s.headerRow}>
              <td></td>
              <td>Any Problems</td>
              <td>Evidence</td>
              <td>Interventions/Evaluation</td>
            </tr>
          </thead>
          <tbody>
            {this.renderRowsWith4Col(firstSec)}
          </tbody>
        </table>

        <div className={s.handleForm}>
          {submitFailed && invalid && <div className={s.red}>You have one or more form field errors.</div>}
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

  if (values.sleepDisorder && (!values.sleepDisorderEvi || !values.sleepDisorderInt)) {
    errors.sleepDisorder = 'Required'
  }
  if (values.eatingFeeding && (!values.eatingFeedingEvi || !values.eatingFeedingInt)) {
    errors.eatingFeeding = 'Required'
  }
  if (values.incontinence && (!values.incontinenceEvi || !values.incontinenceInt)) {
    errors.incontinence = 'Required'
  }
  if (values.breathing && (!values.breathingEvi || !values.breathingInt)) {
    errors.breathing = 'Required'
  }
  if (values.confusion && (!values.confusionEvi || !values.confusionInt)) {
    errors.confusion = 'Required'
  }
  if (values.fallRisk && (!values.fallRiskEvi || !values.fallRiskInt)) {
    errors.fallRisk = 'Required'
  }
  if (values.skinBreakdown && (!values.skinBreakdownEvi || !values.skinBreakdownInt)) {
    errors.skinBreakdown = 'Required'
  }

  return errors
}

DocumentationOverallForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

const reduxFormConfig = {
  form: 'documentationOverallForm',
  fields: [
    'sleepDisorder',
    'sleepDisorderEvi',
    'sleepDisorderInt',
    'eatingFeeding',
    'eatingFeedingEvi',
    'eatingFeedingInt',
    'incontinence',
    'incontinenceEvi',
    'incontinenceInt',
    'breathing',
    'breathingEvi',
    'breathingInt',
    'confusion',
    'confusionEvi',
    'confusionInt',
    'fallRisk',
    'fallRiskEvi',
    'fallRiskInt',
    'skinBreakdown',
    'skinBreakdownEvi',
    'skinBreakdownInt',
  ],
  validate,
};

const mapStateToProps = (state, ownProps) => ({
  initialValues: Object.keys(ownProps.initialValues).length ? {...ownProps.initialValues} : {
    sleepDisorder: true,
    eatingFeeding: true,
    incontinence: true,
    breathing: true,
    confusion: false,
    fallRisk: false,
    skinBreakdown: false,
  },
});

const mapDispatchToProps = (dispatch) => ({
  resetForm: () => dispatch(reset('documentationOverallForm')),
  changeFieldValue: (field, value) => dispatch(change('documentationOverallForm', field, value)),
});

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(DocumentationOverallForm);
