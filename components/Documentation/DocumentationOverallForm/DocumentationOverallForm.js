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


class DocumentationOverallForm extends Component {

  onFormSubmit = (values) => {
    console.log('onFormSubmit', values);
  }

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

    return (
      <form className={s.documentationOverallForm} onSubmit={this.onFormSubmit}>
        <h2>Overall</h2>

        <p>Overall Assessment is an efficient and effective instrument for obtaining the information necessary to prevent health alterations in the older adult patient. Familiarity with these commonly-occurring disorders helps the nurse prevent unnecessary iatrogenesis and promote optimal function of the aging patient. Flagging conditions for further assessment allows the nurse to implement preventative and therapeutic interventions.</p>
        <p className={s.red}>It is compulsory that you complete this Overall Assessment</p>

        <table className={s.overallTable}>
          <thead>
            <tr className={s.headerRow}>
              <td></td>
              <td>Any Problems</td>
              <td>Evidence</td>
              <td>Interventions/Evaluation</td>
            </tr>
          </thead>
          <tbody>
            <tr className={s.bodyRow}>
              <td className={cx(s.questionColumn)}>
                <strong>Sleep Problem:</strong><br />
                How well do you sleep?
              </td>
              <td className={s.yesNoColumn}>
                <div>
                  <button
                    className={cx('btn', s.yesNoInput, s.yesChoice, !!sleep.value === true && s.yesCheck)}
                    onClick={e => {
                      e.preventDefault();
                      this.props.changeFieldValue('sleep', true);
                  }}>
                    Yes
                  </button>
                  <button
                    className={cx('btn', s.yesNoInput, s.noChoice, !!sleep.value === false && s.noCheck)}
                    onClick={e => {
                      e.preventDefault();
                      this.props.changeFieldValue('sleep', false);
                  }}>
                    No
                  </button>
                </div>
              </td>
              <td className={s.textareaColumn}>
                <textarea className={s.textareaInput} id="sleepEvidence" name="sleepEvidence" {...sleepEvidence} placeholder="e.g. Patient complains unable to sleep due to pain." />
              </td>
              <td className={s.textareaColumn}>
                <textarea className={s.textareaInput} id="sleepIntervention" name="sleepIntervention" {...sleepIntervention} placeholder="e.g. Asked to evaluate her pain score and assess if the medication has been appropriately taken."/>
              </td>
            </tr>

            <tr className={s.bodyRow}>
              <td className={cx(s.questionColumn)}>
                <strong>Problems with eating and feeding:</strong><br />
                How is the appetite? On NGT?
              </td>
              <td className={s.yesNoColumn}>
                <div>
                  <button
                    className={cx('btn', s.yesNoInput, s.yesChoice, !!eat.value === true && s.yesCheck)}
                    onClick={e => {
                      e.preventDefault();
                      this.props.changeFieldValue('eat', true);
                  }}>
                    Yes
                  </button>
                  <button
                    className={cx('btn', s.yesNoInput, s.noChoice, !!eat.value === false && s.noCheck)}
                    onClick={e => {
                      e.preventDefault();
                      this.props.changeFieldValue('eat', false);
                  }}>
                    No
                  </button>
                </div>
              </td>
              <td className={s.textareaColumn}>
                <textarea className={s.textareaInput} id="eatEvidence" name="eatEvidence" {...eatEvidence} placeholder="e.g. Patient's caregiver has feedback that the patient has been consuming lesser amount of food." />
              </td>
              <td className={s.textareaColumn}>
                <textarea className={s.textareaInput} id="eatIntervention" name="eatIntervention" {...eatIntervention} placeholder="e.g. Asked to evaluate her pain score and assess if the medication has been appropriately taken."/>
              </td>
            </tr>

            <tr className={s.bodyRow}>
              <td className={cx(s.questionColumn)}>
                <strong>Incontinence (Bowel & Urine):</strong><br />
                Bowel:<br />
                Constipation/ Incontinence/ Melena/ Normal/ Diarrhoea.<br />
                <br />
                Urination:<br />
                Normal/ Incontinence/ Unable to void/ Difficulty/ Pain on voiding Any Diapers or indwelling catheters?<br />
              </td>
              <td className={s.yesNoColumn}>
                <div>
                  <button
                    className={cx('btn', s.yesNoInput, s.yesChoice, !!incontinence.value === true && s.yesCheck)}
                    onClick={e => {
                      e.preventDefault();
                      this.props.changeFieldValue('incontinence', true);
                  }}>
                    Yes
                  </button>
                  <button
                    className={cx('btn', s.yesNoInput, s.noChoice, !!incontinence.value === false && s.noCheck)}
                    onClick={e => {
                      e.preventDefault();
                      this.props.changeFieldValue('incontinence', false);
                  }}>
                    No
                  </button>
                </div>
              </td>
              <td className={s.textareaColumn}>
                <textarea className={s.textareaInput} id="incontinenceEvidence" name="incontinenceEvidence" {...incontinenceEvidence} placeholder="e.g. Noted patient is on IDC. Patient complains of constipation occasionally." />
              </td>
              <td className={s.textareaColumn}>
                <textarea className={s.textareaInput} id="incontinenceIntervention" name="incontinenceIntervention" {...incontinenceIntervention} placeholder="e.g. Caregiver noted to track the bowel frequency. Recommended to give fleet enema to the patient if patient NBO for 3 days."/>
              </td>
            </tr>

            <tr className={s.bodyRow}>
              <td className={cx(s.questionColumn)}>
                <strong>breathing:</strong><br />
              </td>
              <td className={s.yesNoColumn}>
                <div>
                  <button
                    className={cx('btn', s.yesNoInput, s.yesChoice, !!breathing.value === true && s.yesCheck)}
                    onClick={e => {
                      e.preventDefault();
                      this.props.changeFieldValue('breathing', true);
                  }}>
                    Yes
                  </button>
                  <button
                    className={cx('btn', s.yesNoInput, s.noChoice, !!breathing.value === false && s.noCheck)}
                    onClick={e => {
                      e.preventDefault();
                      this.props.changeFieldValue('breathing', false);
                  }}>
                    No
                  </button>
                </div>
              </td>
              <td className={s.textareaColumn}>
                <textarea className={s.textareaInput} id="breathingEvidence" name="breathingEvidence" {...breathingEvidence} placeholder="e.g. Patient complains of breathlessness after walking a short distance. Patient noted to have heart failure." />
              </td>
              <td className={s.textareaColumn}>
                <textarea className={s.textareaInput} id="breathingIntervention" name="breathingIntervention" {...breathingIntervention} placeholder="e.g. To ensure that there are sufficient rest areas at every few meters of the house. Advice that there should be someone always accompanying the patient when she goes out."/>
              </td>
            </tr>

            <tr className={s.bodyRow}>
              <td className={cx(s.questionColumn)}>
                <strong>Cognitive Impaired:</strong><br />
                Orientation to Day/ Person/ Time/ Place.<br />
                <br />
                If there is suspect of confusion, MSE should be done.<br />
              </td>
              <td className={s.yesNoColumn}>
                <div>
                  <button
                    className={cx('btn', s.yesNoInput, s.yesChoice, !!cognitive.value === true && s.yesCheck)}
                    onClick={e => {
                      e.preventDefault();
                      this.props.changeFieldValue('cognitive', true);
                  }}>
                    Yes
                  </button>
                  <button
                    className={cx('btn', s.yesNoInput, s.noChoice, !!cognitive.value === false && s.noCheck)}
                    onClick={e => {
                      e.preventDefault();
                      this.props.changeFieldValue('cognitive', false);
                  }}>
                    No
                  </button>
                </div>
              </td>
              <td className={s.textareaColumn}>
                <textarea className={s.textareaInput} id="cognitiveEvidence" name="cognitiveEvidence" {...cognitiveEvidence} placeholder="e.g. Patient has been noted to be confused at times." />
              </td>
              <td className={s.textareaColumn}>
                <textarea className={s.textareaInput} id="cognitiveIntervention" name="cognitiveIntervention" {...cognitiveIntervention} />
              </td>
            </tr>

            <tr className={s.bodyRow}>
              <td className={cx(s.questionColumn)}>
                <strong>Evidence of Fall Risk:</strong><br />
                Level of Conscious.<br />
                Mobilising: Independent/ Require
              </td>
              <td className={s.yesNoColumn}>
                <div>
                  <button
                    className={cx('btn', s.yesNoInput, s.yesChoice, !!fallRisk.value === true && s.yesCheck)}
                    onClick={e => {
                      e.preventDefault();
                      this.props.changeFieldValue('fallRisk', true);
                  }}>
                    Yes
                  </button>
                  <button
                    className={cx('btn', s.yesNoInput, s.noChoice, !!fallRisk.value === false && s.noCheck)}
                    onClick={e => {
                      e.preventDefault();
                      this.props.changeFieldValue('fallRisk', false);
                  }}>
                    No
                  </button>
                </div>
              </td>
              <td className={s.textareaColumn}>
                <textarea className={s.textareaInput} id="fallRiskEvidence" name="fallRiskEvidence" {...fallRiskEvidence} placeholder="e.g. Patient has unsteady gait" />
              </td>
              <td className={s.textareaColumn}>
                <textarea className={s.textareaInput} id="fallRiskIntervention" name="fallRiskIntervention" {...fallRiskIntervention} />
              </td>
            </tr>

            <tr className={s.bodyRow}>
              <td className={cx(s.questionColumn)}>
                <strong>Risk of Skin Breakdown:</strong><br />
                Check Perineal for Pressure Ulcers
              </td>
              <td className={s.yesNoColumn}>
                <div>
                  <button
                    className={cx('btn', s.yesNoInput, s.yesChoice, !!skinBreak.value === true && s.yesCheck)}
                    onClick={e => {
                      e.preventDefault();
                      this.props.changeFieldValue('skinBreak', true);
                  }}>
                    Yes
                  </button>
                  <button
                    className={cx('btn', s.yesNoInput, s.noChoice, !!skinBreak.value === false && s.noCheck)}
                    onClick={e => {
                      e.preventDefault();
                      this.props.changeFieldValue('skinBreak', false);
                  }}>
                    No
                  </button>
                </div>
              </td>
              <td className={s.textareaColumn}>
                <textarea className={s.textareaInput} id="skinBreakEvidence" name="skinBreakEvidence" {...skinBreakEvidence} placeholder="e.g. Patient's bony areas are noted to be reddened" />
              </td>
              <td className={s.textareaColumn}>
                <textarea className={s.textareaInput} id="skinBreakIntervention" name="skinBreakIntervention" {...skinBreakIntervention} />
              </td>
            </tr>
          </tbody>
        </table>

        <div className={s.handleForm}>
          <button className='btn btn-primary' disabled={submitting || invalid}>
            Submit
          </button>
          <button className='btn btn-secondary' disabled={submitting} onClick={resetForm}>
            Clear Values
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
