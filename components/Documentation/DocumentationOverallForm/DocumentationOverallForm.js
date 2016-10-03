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
      <form className={s.documentationOverallForm} onSubmit={this.props.onFormSubmit}>
        <h2>Overall</h2>

        <p>Overall Assessment is an efficient and effective instrument for obtaining the information necessary to prevent health alterations in the older adult patient. Familiarity with these commonly-occurring disorders helps the nurse prevent unnecessary iatrogenesis and promote optimal function of the aging patient. Flagging conditions for further assessment allows the nurse to implement preventative and therapeutic interventions.</p>
        <p className={s.red}>It is compulsory that you complete this Overall Assessment</p>

        <table >
          <thead>
            <tr className={s.headerRow}>
              <td></td>
              <td>Any Problems</td>
              <td>Evidence</td>
              <td>Interventions/Evaluation</td>
            </tr>
          </thead>
          <tbody>
            <tr>
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
