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


class DocumentationMSEForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      suggestedInterpretation: null,
    }
  }

  onFormSubmit = (values) => {
    console.log('onFormSubmit', values);
  }


  render() {
    const {
      fields: {
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
        cognitionOrientated,
        cognitionFollowup,
        cognitionFamilyCare,
        outcome,
      },

      resetForm,
      invalid,
      handleSubmit,
      submitFailed,
      submitting,
    } = this.props;

    const { suggestedInterpretation } = this.state;

    const choices = {
      thoughtFlow: [
        {value: "1", label: (<span>Blocking - a sudden interruption of thought or speech</span>)},
        {value: "2", label: (<span>Mutism - refusal to speak</span>)},
        {value: "3", label: (<span>Echolalia - meaningless repetition of the nurse’s words</span>)},
        {value: "4", label: (<span>Neologisms - new words formed to express ideas</span>)},
        {value: "5", label: (<span>Flight of ideas - skipping from one topic to another in fragmented, often rapid fashion.</span>)},
        {value: "6", label: (<span>Perseveration - involuntary repetition of the answer to a previous question in response to a new question.</span>)},
        {value: "7", label: (<span>Word salad - a mixture of words and phrases lacking comprehensive meaning or coherence.</span>)},
        {value: "8", label: (<span>Pressure of speech - talking quickly and in such a way that interruption is difficult.</span>)},
        {value: "9", label: (<span>Tangential speech - train of thought and response that misses the question asked/ person never gets to the point.</span>)},
        {value: "10", label: (<span>Circumstantiality - being incidental and irrelevant in stating details</span>)},
        {value: "11", label: (<span>Normal</span>)},
      ],
      cognitionOrientated: [
        {value: "1", label: (<span>Day</span>)},
        {value: "2", label: (<span>Person</span>)},
        {value: "3", label: (<span>Time</span>)},
        {value: "4", label: (<span>Place</span>)},
        {value: "5", label: (<span>None</span>)},
      ],
      cognitionFollowup: [
        {value: "1", label: (<span>Yes</span>)},
        {value: "2", label: (<span>No</span>)},
      ],
      cognitionFamilyCare: [
        {value: "1", label: (<span>Yes</span>)},
        {value: "2", label: (<span>No</span>)},
      ],
    };

    return (
      <form className={s.documentationMSEForm}>
        <h2>Mental State Examination (MSE)</h2>

        <h3>Instructions</h3>
        <p>Before you begin, get the patient’s permission to ask some questions. This will help to avoid catastrophic reactions. Provide any hearing or visual aids that the patient needs. You will also need a watch, pencil and some paper.</p>

        <table className={s.overallTable}>
          <tbody>
            <tr className={s.bodyRow}>
              <td className={s.factorColumn}>
                <strong>General Appearance:</strong>
              </td>
              <td>
                <div className={s.isActiveInput}>
                  <input type="radio" name='appearance_1' id='appearance_1' {...appearance} value={"1"} checked={appearance.value === "1"} />
                  <label htmlFor='recentFall_1'><span><span></span></span><span>Untidy</span></label>
                </div>

                <div className={s.isActiveInput}>
                  <input type="radio" name='appearance_2' id='appearance_2' {...appearance} value={"2"} checked={appearance.value === "2"} />
                  <label htmlFor='appearance_2'><span><span></span></span><span>Neat</span></label>
                </div>
              </td>
            </tr>

            <tr className={s.bodyRow}>
              <td className={s.factorColumn}>
                <strong>Psychomotor Behaviour:</strong>
              </td>
              <td>
                <div className={s.isActiveInput}>
                  <input type="radio" name='psychomotor_1' id='psychomotor_1' {...psychomotor} value={"1"} checked={psychomotor.value === "1"} />
                  <label htmlFor='psychomotor_1'><span><span></span></span><span>Worked-Up</span></label>
                </div>

                <div className={s.isActiveInput}>
                  <input type="radio" name='psychomotor_2' id='psychomotor_2' {...psychomotor} value={"2"} checked={psychomotor.value === "2"} />
                  <label htmlFor='psychomotor_2'><span><span></span></span><span>At ease</span></label>
                </div>

                <div className={s.isActiveInput}>
                  <input type="radio" name='psychomotor_3' id='psychomotor_3' {...psychomotor} value={"3"} checked={psychomotor.value === "3"} />
                  <label htmlFor='psychomotor_3'><span><span></span></span><span>Psychomotor Impairment (Slowing of thought & physical movements)</span></label>
                </div>
              </td>
            </tr>

            <tr className={s.bodyRow}>
              <td className={s.factorColumn}>
                <strong>Attitude Towards Nurse During Encounter:</strong>
              </td>
              <td>
                <div className={s.isActiveInput}>
                  <input type="radio" name='attitudeTwdNurse_1' id='attitudeTwdNurse_1' {...attitudeTwdNurse} value={"1"} checked={attitudeTwdNurse.value === "1"} />
                  <label htmlFor='attitudeTwdNurse_1'><span><span></span></span><span>Withdrawn</span></label>
                </div>

                <div className={s.isActiveInput}>
                  <input type="radio" name='attitudeTwdNurse_2' id='attitudeTwdNurse_2' {...attitudeTwdNurse} value={"2"} checked={attitudeTwdNurse.value === "2"} />
                  <label htmlFor='psychomotor_2'><span><span></span></span><span>Suspicious</span></label>
                </div>

                <div className={s.isActiveInput}>
                  <input type="radio" name='attitudeTwdNurse_3' id='attitudeTwdNurse_3' {...attitudeTwdNurse} value={"3"} checked={attitudeTwdNurse.value === "3"} />
                  <label htmlFor='attitudeTwdNurse_3'><span><span></span></span><span>Hostile</span></label>
                </div>

                <div className={s.isActiveInput}>
                  <input type="radio" name='attitudeTwdNurse_4' id='attitudeTwdNurse_4' {...attitudeTwdNurse} value={"4"} checked={attitudeTwdNurse.value === "4"} />
                  <label htmlFor='attitudeTwdNurse_4'><span><span></span></span><span>Evasive</span></label>
                </div>

                <div className={s.isActiveInput}>
                  <input type="radio" name='attitudeTwdNurse_5' id='attitudeTwdNurse_5' {...attitudeTwdNurse} value={"5"} checked={attitudeTwdNurse.value === "5"} />
                  <label htmlFor='psychomotor_5'><span><span></span></span><span>Negative</span></label>
                </div>

                <div className={s.isActiveInput}>
                  <input type="radio" name='attitudeTwdNurse_6' id='attitudeTwdNurse_6' {...attitudeTwdNurse} value={"6"} checked={attitudeTwdNurse.value === "6"} />
                  <label htmlFor='attitudeTwdNurse_6'><span><span></span></span><span>Open</span></label>
                </div>
              </td>
            </tr>

            <tr className={s.bodyRow}>
              <td className={s.factorColumn}>
                <strong>Suicide Thoughts:</strong>
              </td>
              <td>
                <div className={s.isActiveInput}>
                  <input type="radio" name='suicide_1' id='suicide_1' {...suicide} value={"1"} checked={suicide.value === "1"} />
                  <label htmlFor='suicide_1'><span><span></span></span><span>Yes</span></label>
                </div>

                <div className={s.isActiveInput}>
                  <input type="radio" name='suicide_2' id='suicide_2' {...suicide} value={"2"} checked={suicide.value === "2"} />
                  <label htmlFor='suicide_2'><span><span></span></span><span>No</span></label>
                </div>
              </td>
            </tr>

            <tr className={s.bodyRow}>
              <td className={s.factorColumn}>
                <strong>Thought of Harming Others:</strong>
              </td>
              <td>
                <div className={s.isActiveInput}>
                  <input type="radio" name='thoughtHarming_1' id='thoughtHarming_1' {...thoughtHarming} value={"1"} checked={thoughtHarming.value === "1"} />
                  <label htmlFor='thoughtHarming_1'><span><span></span></span><span>Yes</span></label>
                </div>

                <div className={s.isActiveInput}>
                  <input type="radio" name='thoughtHarming_2' id='thoughtHarming_2' {...suicide} value={"2"} checked={thoughtHarming.value === "2"} />
                  <label htmlFor='thoughtHarming_2'><span><span></span></span><span>No</span></label>
                </div>
              </td>
            </tr>

            <tr className={s.bodyRow}>
              <td className={s.factorColumn}>
                <strong>Speech:</strong>
              </td>
              <td>
                <div className={s.isActiveInput}>
                  <input type="radio" name='speech_1' id='speech_1' {...speech} value={"1"} checked={speech.value === "1"} />
                  <label htmlFor='speech_1'><span><span></span></span><span>Clear & Ordinary</span></label>
                </div>

                <div className={s.isActiveInput}>
                  <input type="radio" name='speech_2' id='speech_2' {...speech} value={"2"} checked={speech.value === "2"} />
                  <label htmlFor='speech_2'><span><span></span></span><span>Abnormal, please specify:</span></label>
                </div>

                <div className={s.isActiveInput}>
                  <input className={s.textInput} type="text" {...speechDes} />
                </div>
              </td>
            </tr>

            <tr className={s.bodyRow}>
              <td className={s.factorColumn}>
                <strong>Thought Clarity:</strong>
              </td>
              <td>
                <div className={s.isActiveInput}>
                  <input type="radio" name='thoughtClarity_1' id='thoughtClarity_1' {...thoughtClarity} value={"1"} checked={thoughtClarity.value === "1"} />
                  <label htmlFor='thoughtClarity_1'><span><span></span></span><span>Confused</span></label>
                </div>

                <div className={s.isActiveInput}>
                  <input type="radio" name='thoughtClarity_2' id='thoughtClarity_2' {...thoughtClarity} value={"2"} checked={thoughtClarity.value === "2"} />
                  <label htmlFor='thoughtClarity_2'><span><span></span></span><span>Incoherent</span></label>
                </div>

                <div className={s.isActiveInput}>
                  <input type="radio" name='thoughtClarity_3' id='thoughtClarity_3' {...thoughtClarity} value={"3"} checked={thoughtClarity.value === "3"} />
                  <label htmlFor='thoughtClarity_3'><span><span></span></span><span>Vague</span></label>
                </div>

                <div className={s.isActiveInput}>
                  <input type="radio" name='thoughtClarity_4' id='thoughtClarity_4' {...thoughtClarity} value={"4"} checked={thoughtClarity.value === "4"} />
                  <label htmlFor='thoughtClarity_4'><span><span></span></span><span>Coherent</span></label>
                </div>
              </td>
            </tr>

            <tr className={s.bodyRow}>
              <td className={s.factorColumn}>
                <strong>Thought Relevance:</strong>
              </td>
              <td>
                <div className={s.isActiveInput}>
                  <input type="radio" name='thoughtRelevance_1' id='thoughtRelevance_1' {...thoughtRelevance} value={"1"} checked={thoughtRelevance.value === "1"} />
                  <label htmlFor='thoughtRelevance_1'><span><span></span></span><span>Illogical</span></label>
                </div>

                <div className={s.isActiveInput}>
                  <input type="radio" name='thoughtRelevance_2' id='thoughtRelevance_2' {...thoughtRelevance} value={"2"} checked={thoughtRelevance.value === "2"} />
                  <label htmlFor='thoughtRelevance_2'><span><span></span></span><span>Logical</span></label>
                </div>
              </td>
            </tr>

            <tr className={s.bodyRow}>
              <td className={s.factorColumn}>
                <strong>Thought Content:</strong>
              </td>
              <td>
                <div className={s.isActiveInput}>
                  <input type="radio" name='thoughtContent_1' id='thoughtContent_1' {...thoughtContent} value={"1"} checked={thoughtContent.value === "1"} />
                  <label htmlFor='thoughtContent_1'><span><span></span></span><span>Obsessions</span></label>
                </div>

                <div className={s.isActiveInput}>
                  <input type="radio" name='thoughtContent_2' id='thoughtContent_2' {...thoughtContent} value={"2"} checked={thoughtContent.value === "2"} />
                  <label htmlFor='thoughtContent_2'><span><span></span></span><span>Delusions</span></label>
                </div>

                <div className={s.isActiveInput}>
                  <input type="radio" name='thoughtContent_3' id='thoughtContent_3' {...thoughtContent} value={"3"} checked={thoughtContent.value === "3"} />
                  <label htmlFor='thoughtContent_3'><span><span></span></span><span>Obsessions</span></label>
                </div>

                <div className={s.isActiveInput}>
                  <input type="radio" name='thoughtContent_4' id='thoughtContent_4' {...thoughtContent} value={"4"} checked={thoughtContent.value === "4"} />
                  <label htmlFor='thoughtContent_4'><span><span></span></span><span>Delusions</span></label>
                </div>

                <div className={s.isActiveInput}>
                  <input type="radio" name='thoughtContent_5' id='thoughtContent_5' {...thoughtContent} value={"5"} checked={thoughtContent.value === "5"} />
                  <label htmlFor='thoughtContent_5'><span><span></span></span><span>Obsessions</span></label>
                </div>
              </td>
            </tr>

            <tr className={s.bodyRow}>
              <td className={s.factorColumn}>
                <strong>Thought Flow:</strong>
              </td>
              <td>
                {choices.thoughtFlow.map(item => (
                  <div className={s.isActiveInput} key={choices.thoughtFlow.indexOf(item)}>
                    <input type="radio" name={`thoughtFlow_${item.value}`} id={`thoughtFlow_${item.value}`} {...thoughtFlow} value={item.value} checked={thoughtFlow.value === item.value} />
                    <label htmlFor={`thoughtFlow_${item.value}`}><span><span></span></span><span>{item.label}</span></label>
                  </div>
                ))}
              </td>
            </tr>
          </tbody>
        </table>


        <h2>Cognition</h2>

        <table className={s.overallTable}>
          <tbody>
            <tr className={s.bodyRow}>
              <td className={s.factorColumn}>
                <strong>Orientated to:</strong>
              </td>
              <td>
                {choices.cognitionOrientated.map(item => (
                  <div className={s.isActiveInput} key={choices.cognitionOrientated.indexOf(item)}>
                    <input type="radio" name={`cognitionOrientated_${item.value}`} id={`cognitionOrientated_${item.value}`} {...cognitionOrientated} value={item.value} checked={cognitionOrientated.value === item.value} />
                    <label htmlFor={`cognitionOrientated_${item.value}`}><span><span></span></span><span>{item.label}</span></label>
                  </div>
                ))}
              </td>
            </tr>

            <tr className={s.bodyRow}>
              <td className={s.factorColumn}>
                <strong>Orientated to:</strong>
              </td>
              <td>
                {choices.cognitionFollowup.map(item => (
                  <div className={s.isActiveInput} key={choices.cognitionFollowup.indexOf(item)}>
                    <input type="radio" name={`cognitionFollowup_${item.value}`} id={`cognitionFollowup_${item.value}`} {...cognitionFollowup} value={item.value} checked={cognitionFollowup.value === item.value} />
                    <label htmlFor={`cognitionFollowup_${item.value}`}><span><span></span></span><span>{item.label}</span></label>
                  </div>
                ))}
              </td>
            </tr>

            <tr className={s.bodyRow}>
              <td className={s.factorColumn}>
                <strong>Orientated to:</strong>
              </td>
              <td>
                {choices.cognitionFamilyCare.map(item => (
                  <div className={s.isActiveInput} key={choices.cognitionFamilyCare.indexOf(item)}>
                    <input type="radio" name={`cognitionFamilyCare_${item.value}`} id={`cognitionFamilyCare_${item.value}`} {...cognitionFamilyCare} value={item.value} checked={cognitionFamilyCare.value === item.value} />
                    <label htmlFor={`cognitionFamilyCare_${item.value}`}><span><span></span></span><span>{item.label}</span></label>
                  </div>
                ))}
              </td>
            </tr>
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

        <div className={s.fieldSection}>
          <label className={s.fieldTitle}><strong>Outcome and Evaluation:</strong></label>
          <div className={s.fieldContent}>
            <textarea className={s.textareaInput} id="outcome" name="outcome" {...outcome}/>
          </div>
        </div>

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
    'cognitionOrientated',
    'cognitionFollowup',
    'cognitionFamilyCare',
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
