import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import s from './DocumentationMSEForm.css';
import Container from '../../Container';
import Link from '../../Link';
import Header from '../../Header';
import history from '../../../core/history';
import { getUserName, configToName } from '../../../core/util';
import { getSession, showConfirmPopup, fetchServices } from '../../../actions';
import ConfirmPopup from '../../ConfirmPopup';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { reduxForm, addArrayValue, reset } from 'redux-form';
import { Selections } from '../DocumentationModules/DocumentationModules';
// react-icons
import FaArrowCircleRight from 'react-icons/lib/fa/arrow-right';


class DocumentationMSEForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      suggestedInterpretation: null,
    }
  }

  renderRowsWith2Col = (items) => {
    return items.map((item, index) => (
      <tr key={index} className={s.bodyRow}>
        <td className={s.firstCol}>
          <strong>{item.first}</strong>
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

  render() {
    const {
      fields: {
        // instructions
        appearance,
        psychomotor,
        attitudeTwdNurse,
        suicide,
        thoughtHarming,
        speech,
        speechDes,
        thoughtClarity,
        thoughtRelevance,
        thoughtContent,
        thoughtFlow,
        // cognition
        cognitionOrientated,
        cognitionFollowup,
        cognitionFamilyCare,
        // outcome
        outcome,
      },

      resetForm,
      invalid,
      handleSubmit,
      submitFailed,
      submitting,
    } = this.props;

    const { suggestedInterpretation } = this.state;

    const firstSec = [{
      first: "General Appearance",
      second: (
        <Selections
          fieldName="appearance"
          field={appearance}
          items={[
            {value: "1", label: (<span>Untidy</span>)},
            {value: "2", label: (<span>Neat</span>)},
          ]}
        />
    )}, {
      first: "Psychomotor Behaviour",
      second: (
        <Selections
          fieldName="psychomotor"
          field={psychomotor}
          items={[
            {value: "1", label: (<span>Worked-Up</span>)},
            {value: "2", label: (<span>At ease</span>)},
            {value: "3", label: (<span>Psychomotor Impairment (Slowing of thought & physical movements)</span>)},
          ]}
        />
    )}, {
      first: "Attitude Towards Nurse During Encounter",
      second: (
        <Selections
          fieldName="attitudeTwdNurse"
          field={attitudeTwdNurse}
          items={[
            {value: "1", label: (<span>Withdrawn</span>)},
            {value: "2", label: (<span>Suspicious</span>)},
            {value: "3", label: (<span>Hostile</span>)},
            {value: "4", label: (<span>Evasive</span>)},
            {value: "5", label: (<span>Negative</span>)},
            {value: "5", label: (<span>Open</span>)},
          ]}
        />
    )}, {
      first: "Suicide Thoughts",
      second: (
        <Selections
          fieldName="suicide"
          field={suicide}
          items={[
            {value: "1", label: (<span>Yes</span>)},
            {value: "2", label: (<span>No</span>)},
          ]}
        />
    )}, {
      first: "Thought of Harming Others",
      second: (
        <Selections
          fieldName="thoughtHarming"
          field={thoughtHarming}
          items={[
            {value: "1", label: (<span>Yes</span>)},
            {value: "2", label: (<span>No</span>)},
          ]}
        />
    )}, {
      first: "Speech",
      second: (
        <Selections
          fieldName="speech"
          field={speech}
          items={[
            {value: "1", label: (<span>Clear & Ordinary</span>)},
            {value: "2", label: (<span className={s.selectionWithComment}>Abnormal, please specify:<input className={s.textInputWithSelection} type="text" {...speechDes} /></span>)},
          ]}
        />
    )}, {
      first: "Thought Clarity",
      second: (
        <Selections
          fieldName="thoughtClarity"
          field={thoughtClarity}
          items={[
            {value: "1", label: (<span>Confused</span>)},
            {value: "2", label: (<span>Incoherent</span>)},
            {value: "3", label: (<span>Vague</span>)},
            {value: "4", label: (<span>Coherent</span>)},
          ]}
        />
    )}, {
      first: "Thought Relevance",
      second: (
        <Selections
          fieldName="thoughtRelevance"
          field={thoughtRelevance}
          items={[
            {value: "1", label: (<span>Illogical</span>)},
            {value: "2", label: (<span>Logical</span>)},
            {value: "3", label: (<span>Vague</span>)},
            {value: "4", label: (<span>Coherent</span>)},
          ]}
        />
    )}, {
      first: "Thought Content",
      second: (
        <Selections
          fieldName="thoughtContent"
          field={thoughtContent}
          items={[
            {value: "1", label: (<span>Obsessions</span>)},
            {value: "2", label: (<span>Delusions</span>)},
            {value: "3", label: (<span>Ideas of reference (assumes events are being directed towards self)</span>)},
            {value: "4", label: (<span>Hallucinations</span>)},
            {value: "5", label: (<span>Consistent with reality</span>)},
          ]}
        />
    )}, {
      first: "Thought Flow",
      second: (
        <Selections
          fieldName="thoughtFlow"
          field={thoughtFlow}
          items={[
            {value: "1", label: (<span><strong>Blocking</strong> - a sudden interruption of thought or speech</span>)},
            {value: "2", label: (<span><strong>Mutism</strong> - refusal to speak</span>)},
            {value: "3", label: (<span><strong>Echolalia</strong> - meaningless repetition of the nurse’s words</span>)},
            {value: "4", label: (<span><strong>Neologisms</strong> - new words formed to express ideas</span>)},
            {value: "5", label: (<span><strong>Flight of ideas</strong> - skipping from one topic to another in fragmented, often rapid fashion.</span>)},
            {value: "6", label: (<span><strong>Perseveration</strong> - involuntary repetition of the answer to a previous question in response to a new question.</span>)},
            {value: "7", label: (<span><strong>Word salad</strong> - a mixture of words and phrases lacking comprehensive meaning or coherence.</span>)},
            {value: "8", label: (<span><strong>Pressure of speech</strong> - talking quickly and in such a way that interruption is difficult.</span>)},
            {value: "9", label: (<span><strong>Tangential speech</strong> - train of thought and response that misses the question asked/ person never gets to the point.</span>)},
            {value: "10", label: (<span><strong>Circumstantiality</strong> - being incidental and irrelevant in stating details</span>)},
            {value: "11", label: (<span><strong>Normal</strong></span>)},
          ]}
        />
    )}];

    const secondSec = [{
      first: "Orientated to",
      second: (
        <Selections
          fieldName="cognitionOrientated"
          field={cognitionOrientated}
          items={[
            {value: "1", label: (<span>Day</span>)},
            {value: "2", label: (<span>Person</span>)},
            {value: "3", label: (<span>Time</span>)},
            {value: "4", label: (<span>Place</span>)},
            {value: "5", label: (<span>None</span>)},
          ]}
        />
    )}, {
      first: "Is the patient following up with any health care professionals for the mental impairment?",
      second: (
        <Selections
          fieldName="cognitionFollowup"
          field={cognitionFollowup}
          items={[
            {value: "1", label: (<span>Yes</span>)},
            {value: "2", label: (<span>No</span>)},
          ]}
        />
    )}, {
      first: "Is the family able to manage care for patient?",
      second: (
        <Selections
          fieldName="cognitionFamilyCare"
          field={cognitionFamilyCare}
          items={[
            {value: "1", label: (<span>Yes</span>)},
            {value: "2", label: (<span>No</span>)},
          ]}
        />
    )}];

    const thirdSec = [{
      first: "Outcome and Evaluation",
      second: (
        <textarea className={s.textareaInput} id="outcome" name="outcome" {...outcome}/>
    )}];

    return (
      <form className={s.documentationMSEForm} onSubmit={handleSubmit(this.props.onFormSubmit)}>
        <h2>Mental State Examination (MSE)</h2>

        <h3>Instructions</h3>
        <p>Before you begin, get the patient’s permission to ask some questions. This will help to avoid catastrophic reactions. Provide any hearing or visual aids that the patient needs. You will also need a watch, pencil and some paper.</p>

        <table className={s.issueSetTable}>
          <tbody>
            {this.renderRowsWith2Col(firstSec)}
          </tbody>
        </table>

        <h2>Cognition</h2>

        <table className={s.issueSetTable}>
          <tbody>
            {this.renderRowsWith2Col(secondSec)}
          </tbody>
        </table>

        <div className={s.statusSection}>
          <div className={s.statusField}>
            <div>
              Suggested interpretation
              <div className={s.statusFieldTitle}>
                {suggestedInterpretation || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        <div className={s.issueSetSection}>
          {this.renderIssueSet(thirdSec)}
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

DocumentationMSEForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

const reduxFormConfig = {
  form: 'documentationFRATForm',
  fields: [
    // instructions
    'appearance',
    'psychomotor',
    'attitudeTwdNurse',
    'suicide',
    'thoughtHarming',
    'speech',
    'speechDes',
    'thoughtClarity',
    'thoughtRelevance',
    'thoughtContent',
    'thoughtFlow',
    // cognition
    'cognitionOrientated',
    'cognitionFollowup',
    'cognitionFamilyCare',
    // outcome
    'outcome',
  ],
  validate,
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
  resetForm: () => dispatch(reset('documentationFRATForm')),
});

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(DocumentationMSEForm);
