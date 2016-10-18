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
      interpretation: "N/A",
    }
  }

  renderRowsWith2Col = (items, sub) => {
    const { speech } = this.props.fields;
    return items.map((item, index) => (
      <tr key={index} className={s.bodyRow}>
        <td className={s.firstCol}>
          <strong className={sub && s.firstSub}>{item.first}</strong>
        </td>
        <td className={cx(s.secondCol, sub && s.secondSub)}>
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
      followUp,
      family,
    } = nextProps.fields;
    let interpretation;

    if (followUp.value === 'false' && family.value === 'false') {
      interpretation = (<span className={s.red}>Do highlight that the family is strongly encouraged to bring the patient to see a doctor as soon as they can.</span>)
    } else if (followUp.value === 'false' && family.value === 'true') {
      interpretation = (<span className={s.orange}>Do highlight that they may consult a doctor to get proper advice.</span>)
    } else if (followUp.value === 'true' && family.value === 'false') {
      interpretation = (<span className={s.orange}>Encourage the family to explore more with the healthcare professionals on other possible solutions.</span>)
    } else if (followUp.value === 'true' && family.value === 'true') {
      interpretation = (<span className={s.green}>No actions needed. Ensure that all safety concerns are considered.</span>)
    } else {
      interpretation = "N/A";
    }

    return this.setState({ interpretation });
  }

  onFormSubmit = (values) => {
    console.log('onFormSubmit', values);

    const onReturnBoolean = (fields) => {
      fields.map(item => {
        values[item] = (values[item] === "true");
      })
    }
    onReturnBoolean(['suicide', 'harm', 'followUp', 'family']);

    this.props.onFormSubmit(values);
  }

  render() {
    const {
      fields: {
        // instructions
        appearance,
        psychomotor,
        attitude,
        suicide,
        harm,
        speech,
        rate,
        flow,
        intensity,
        clarity,
        liveliness,
        thoughtClarity,
        thoughtRelevance,
        thoughtContent,
        thoughtFlow,
        // cognition
        orientated,
        followUp,
        family,
        // outcome
        outcome,
      },

      resetForm,
      invalid,
      handleSubmit,
      submitFailed,
      submitting,
    } = this.props;

    const { interpretation } = this.state;

    const firstSec = [{
      first: "General Appearance",
      second: (
        <Selections
          fieldName="appearance"
          field={appearance}
          items={[
            {value: "Untidy", label: (<span>Untidy</span>)},
            {value: "Neat", label: (<span>Neat</span>)},
          ]}
        />
    )}, {
      first: "Psychomotor Behaviour",
      second: (
        <Selections
          fieldName="psychomotor"
          field={psychomotor}
          items={[
            {value: "Worked-Up", label: (<span>Worked-Up</span>)},
            {value: "At ease", label: (<span>At ease</span>)},
            {value: "Psychomotor Impairment", label: (<span>Psychomotor Impairment (Slowing of thought & physical movements)</span>)},
          ]}
        />
    )}, {
      first: "Attitude Towards Nurse During Encounter",
      second: (
        <Selections
          fieldName="attitude"
          field={attitude}
          items={[
            {value: "Withdrawn", label: (<span>Withdrawn</span>)},
            {value: "Suspicious", label: (<span>Suspicious</span>)},
            {value: "Hostile", label: (<span>Hostile</span>)},
            {value: "Evasive", label: (<span>Evasive</span>)},
            {value: "Negative", label: (<span>Negative</span>)},
            {value: "Open", label: (<span>Open</span>)},
          ]}
        />
    )}, {
      first: "Suicide Thoughts",
      second: (
        <Selections
          fieldName="suicide"
          field={suicide}
          items={[
            {value: "true", label: (<span>Yes</span>)},
            {value: "false", label: (<span>No</span>)},
          ]}
        />
    )}, {
      first: "Thought of Harming Others",
      second: (
        <Selections
          fieldName="harm"
          field={harm}
          items={[
            {value: "true", label: (<span>Yes</span>)},
            {value: "false", label: (<span>No</span>)},
          ]}
        />
    )}, {
      first: "Speech",
      second: (
        <Selections
          fieldName="speech"
          field={speech}
          items={[
            {value: "Clear & Ordinary", label: (<span>Clear & Ordinary</span>)},
            {value: "Abnormal", label: (<span className={s.selectionWithComment}>Abnormal, <span className={s.orange}>please specify</span></span>)},
          ]}
        />
    )}]

    const secondSec = [{
      first: "Rate",
      second: (
        <Selections
          fieldName="rate"
          field={rate}
          items={[
            {value: "Slow", label: (<span>Slow</span>)},
            {value: "Rapid", label: (<span>Rapid</span>)},
          ]}
        />
    )}, {
      first: "Flow",
      second: (
        <Selections
          fieldName="flow"
          field={flow}
          items={[
            {value: "Hesitant", label: (<span>Hesitant</span>)},
            {value: "Rambling", label: (<span>Rambling</span>)},
            {value: "Loud pauses", label: (<span>Loud pauses</span>)},
            {value: "Forgetful", label: (<span>Forgetful</span>)},
          ]}
        />
    )}, {
      first: "Intensity",
      second: (
        <Selections
          fieldName="intensity"
          field={intensity}
          items={[
            {value: "Loud", label: (<span>Loud</span>)},
            {value: "Soft", label: (<span>Soft</span>)},
            {value: "Inaudible", label: (<span>Inaudible</span>)},
            {value: "Slow", label: (<span>Slow</span>)},
          ]}
        />
    )}, {
      first: "Clarity",
      second: (
        <Selections
          fieldName="clarity"
          field={clarity}
          items={[
            {value: "Slurred", label: (<span>Slurred</span>)},
            {value: "Incoherent", label: (<span>Incoherent</span>)},
          ]}
        />
    )}, {
      first: "Liveliness",
      second: (
        <Selections
          fieldName="liveliness"
          field={liveliness}
          items={[
            {value: "Monotonous", label: (<span>Monotonous</span>)},
            {value: "Pressured", label: (<span>Pressured</span>)},
            {value: "Explosive", label: (<span>Explosive</span>)},
          ]}
        />
    )}]

    const thirdSec = [{
      first: "Thought Clarity",
      second: (
        <Selections
          fieldName="thoughtClarity"
          field={thoughtClarity}
          items={[
            {value: "Slow", label: (<span>Confused</span>)},
            {value: "Rapid", label: (<span>Incoherent</span>)},
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

    const forthSec = [{
      first: "Orientated to",
      second: (
        <Selections
          fieldName="orientated"
          field={orientated}
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
          fieldName="followUp"
          field={followUp}
          items={[
            {value: "true", label: (<span>Yes</span>)},
            {value: "false", label: (<span>No</span>)},
          ]}
        />
    )}, {
      first: "Is the family able to manage care for patient?",
      second: (
        <Selections
          fieldName="family"
          field={family}
          items={[
            {value: "true", label: (<span>Yes</span>)},
            {value: "false", label: (<span>No</span>)},
          ]}
        />
    )}];

    const fifthSec = [{
      first: "Outcome and Evaluation",
      second: (
        <textarea className={s.textareaInput} id="outcome" name="outcome" {...outcome}/>
    )}];

    return (
      <form className={s.documentationMSEForm} onSubmit={handleSubmit(this.onFormSubmit)}>
        <h2>Mental State Examination (MSE)</h2>

        <h3>Instructions</h3>
        <p>Before you begin, get the patient’s permission to ask some questions. This will help to avoid catastrophic reactions. Provide any hearing or visual aids that the patient needs. You will also need a watch, pencil and some paper.</p>

        <table className={s.issueSetTable}>
          <tbody>
            {this.renderRowsWith2Col(firstSec)}
            {speech.value === 'Abnormal' && this.renderRowsWith2Col(secondSec, true)}
            {this.renderRowsWith2Col(thirdSec)}
          </tbody>
        </table>

        <h2>Cognition</h2>

        <table className={s.issueSetTable}>
          <tbody>
            {this.renderRowsWith2Col(forthSec)}
          </tbody>
        </table>

        <div className={s.statusSection}>
          <div className={s.statusField}>
            <div>
              Suggested interpretation
              <div className={s.statusFieldTitle}>
                {interpretation}
              </div>
            </div>
          </div>
        </div>

        <div className={s.issueSetSection}>
          {this.renderIssueSet(fifthSec)}
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
    'attitude',
    'suicide',
    'harm',
    'speech',
    'rate',
    'flow',
    'intensity',
    'clarity',
    'liveliness',
    'thoughtClarity',
    'thoughtRelevance',
    'thoughtContent',
    'thoughtFlow',
    // cognition
    'orientated',
    'followUp',
    'family',
    // outcome
    'outcome',
  ],
  validate,
}

const mapStateToProps = (state, ownProps) => ({
  initialValues: Object.keys(ownProps.initialValues).length && {
    ...ownProps.initialValues,
    suicide: ownProps.initialValues.suicide.toString(),
    harm: ownProps.initialValues.harm.toString(),
    followUp: ownProps.initialValues.followUp.toString(),
    family: ownProps.initialValues.family.toString(),
  }
});

const mapDispatchToProps = (dispatch) => ({
  resetForm: () => dispatch(reset('documentationFRATForm')),
});

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(DocumentationMSEForm);
