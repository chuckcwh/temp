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


class DocumentationOverallForm extends Component {

  renderRowsWith4Col = (items) => {
    return items.map(item => (
      <tr className={s.bodyRow}>
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

  render() {
    const {
      fields: {
        sleep,
        sleepEvidence,
        sleepIntervention,
        eat,
        eatEvidence,
        eatIntervention,
        incontinence,
        incontinenceEvidence,
        incontinenceIntervention,
        breathing,
        breathingEvidence,
        breathingIntervention,
        cognitive,
        cognitiveEvidence,
        cognitiveIntervention,
        fallRisk,
        fallRiskEvidence,
        fallRiskIntervention,
        skinBreak,
        skinBreakEvidence,
        skinBreakIntervention,
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
          fieldName="sleep"
          field={sleep}
          changeFieldValue={(field, onOff) => this.props.changeFieldValue(field, onOff)}
        />
      ),
      third: (
        <textarea className={s.textareaInput} id="sleepEvidence" name="sleepEvidence" {...sleepEvidence} placeholder="e.g. Patient complains unable to sleep due to pain." />
      ),
      forth: (
        <textarea className={s.textareaInput} id="sleepIntervention" name="sleepIntervention" {...sleepIntervention} placeholder="e.g. Asked to evaluate her pain score and assess if the medication has been appropriately taken."/>
    )}, {
      first: "Problems with eating and feeding:",
      firstSub: "How is the appetite? On NGT?",
      second: (
        <YesNoSwitch
          fieldName="eat"
          field={eat}
          changeFieldValue={(field, onOff) => this.props.changeFieldValue(field, onOff)}
        />
      ),
      third: (
        <textarea className={s.textareaInput} id="eatEvidence" name="eatEvidence" {...eatEvidence} placeholder="e.g. Patient's caregiver has feedback that the patient has been consuming lesser amount of food." />
      ),
      forth: (
        <textarea className={s.textareaInput} id="eatIntervention" name="eatIntervention" {...eatIntervention} placeholder="e.g. Asked to evaluate her pain score and assess if the medication has been appropriately taken."/>
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
        <textarea className={s.textareaInput} id="incontinenceEvidence" name="incontinenceEvidence" {...incontinenceEvidence} placeholder="e.g. Noted patient is on IDC. Patient complains of constipation occasionally." />
      ),
      forth: (
        <textarea className={s.textareaInput} id="incontinenceIntervention" name="incontinenceIntervention" {...incontinenceIntervention} placeholder="e.g. Caregiver noted to track the bowel frequency. Recommended to give fleet enema to the patient if patient NBO for 3 days."/>
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
        <textarea className={s.textareaInput} id="breathingEvidence" name="breathingEvidence" {...breathingEvidence} placeholder="e.g. Patient complains of breathlessness after walking a short distance. Patient noted to have heart failure." />
      ),
      forth: (
        <textarea className={s.textareaInput} id="breathingIntervention" name="breathingIntervention" {...breathingIntervention} placeholder="e.g. To ensure that there are sufficient rest areas at every few meters of the house. Advice that there should be someone always accompanying the patient when she goes out."/>
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
          fieldName="cognitive"
          field={cognitive}
          changeFieldValue={(field, onOff) => this.props.changeFieldValue(field, onOff)}
        />
      ),
      third: (
        <textarea className={s.textareaInput} id="cognitiveEvidence" name="cognitiveEvidence" {...cognitiveEvidence} placeholder="e.g. Patient has been noted to be confused at times." />
      ),
      forth: (
        <textarea className={s.textareaInput} id="cognitiveIntervention" name="cognitiveIntervention" {...cognitiveIntervention} />
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
        <textarea className={s.textareaInput} id="fallRiskEvidence" name="fallRiskEvidence" {...fallRiskEvidence} placeholder="e.g. Patient has unsteady gait" />
      ),
      forth: (
        <textarea className={s.textareaInput} id="fallRiskIntervention" name="fallRiskIntervention" {...fallRiskIntervention} />
    )}, {
      first: "Risk of Skin Breakdown:",
      firstSub: "Check Perineal for Pressure Ulcers",
      second: (
        <YesNoSwitch
          fieldName="skinBreak"
          field={skinBreak}
          changeFieldValue={(field, onOff) => this.props.changeFieldValue(field, onOff)}
        />
      ),
      third: (
        <textarea className={s.textareaInput} id="skinBreakEvidence" name="skinBreakEvidence" {...skinBreakEvidence} placeholder="e.g. Patient's bony areas are noted to be reddened" />
      ),
      forth: (
        <textarea className={s.textareaInput} id="skinBreakIntervention" name="skinBreakIntervention" {...skinBreakIntervention} />
    )}];

    return (
      <form className={s.documentationOverallForm} onSubmit={handleSubmit(this.props.onFormSubmit)}>
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
          <button className='btn btn-secondary' disabled={submitting} onClick={resetForm}>
            Clear Values
          </button>
          <button className='btn btn-primary' disabled={submitting || invalid}>
            Submit
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
    'sleep',
    'sleepEvidence',
    'sleepIntervention',
    'eat',
    'eatEvidence',
    'eatIntervention',
    'incontinence',
    'incontinenceEvidence',
    'incontinenceIntervention',
    'breathing',
    'breathingEvidence',
    'breathingIntervention',
    'cognitive',
    'cognitiveEvidence',
    'cognitiveIntervention',
    'fallRisk',
    'fallRiskEvidence',
    'fallRiskIntervention',
    'skinBreak',
    'skinBreakEvidence',
    'skinBreakIntervention',
  ],
  validate,
};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
  resetForm: () => dispatch(reset('documentationOverallForm')),
  changeFieldValue: (field, value) => dispatch(change('documentationOverallForm', field, value)),
});

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(DocumentationOverallForm);
