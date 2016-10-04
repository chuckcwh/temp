import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import s from './DocumentationFRATForm.css';
import Container from '../../Container';
import Link from '../../Link';
import Header from '../../Header';
import history from '../../../core/history';
import { getUserName, configToName } from '../../../core/util';
import { getSession, showConfirmPopup, fetchServices } from '../../../actions';
import ConfirmPopup from '../../ConfirmPopup';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { reduxForm, addArrayValue, reset } from 'redux-form';


class DocumentationFRATForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      riskScore: null,
      fallRiskStatus: null,
    }
  }

  onFormSubmit = (values) => {
    console.log('onFormSubmit', values);
  }

  render() {
    const {
      fields: {
        recentFall,
        medication,
        psychological,
        cognitive,
        mobility,
        dizziness,
        intervention,
      },

      resetForm,
      invalid,
      handleSubmit,
      submitFailed,
      submitting,
    } = this.props;

    const { riskScore, fallRiskStatus } = this.state;

    return (
      <form className={s.documentationFRATForm} onSubmit={this.onFormSubmit}>
        <h2>Fall Risk Assessment Tool (FRAT)</h2>

        <table className={s.overallTable}>
          <thead>
            <tr className={s.headerRow}>
              <td className={s.factorColumn}>Risk Factor</td>
              <td>Level</td>
            </tr>
          </thead>
          <tbody>
            <tr className={s.bodyRow}>
              <td className={s.factorColumn}>
                <strong>Recent Falls:</strong>
              </td>
              <td>
                <div className={s.isActiveInput}>
                  <input type="radio" name='recentFall_1' id='recentFall_1' {...recentFall} value={"1"} checked={recentFall.value === "1"} />
                  <label htmlFor='recentFall_1'><span><span></span></span><span>None in last months</span></label>
                </div>

                <div className={s.isActiveInput}>
                  <input type="radio" name='recentFall_2' id='recentFall_2' {...recentFall} value={"2"} checked={recentFall.value === "2"} />
                  <label htmlFor='recentFall_2'><span><span></span></span><span>One or more between 3 & 12 months ago</span></label>
                </div>

                <div className={s.isActiveInput}>
                  <input type="radio" name='recentFall_3' id='recentFall_3' {...recentFall} value={"3"} checked={recentFall.value === "3"} />
                  <label htmlFor='recentFall_3'><span><span></span></span><span>One or more in last 3 months</span></label>
                </div>

                <div className={s.isActiveInput}>
                  <input type="radio" name='recentFall_4' id='recentFall_4' {...recentFall} value={"4"} checked={recentFall.value === "4"} />
                  <label htmlFor='recentFall_4'><span><span></span></span><span>One or more in last 3 months whilst resident</span></label>
                </div>
              </td>
            </tr>

            <tr className={s.bodyRow}>
              <td className={s.factorColumn}>
                <strong>Medications:</strong><br />
                (Sedatives, Anti-Depressants, Anti-Parkinson&#39;s, Diuretics, Anti-hypertensives, Hypnotics)
              </td>
              <td>
                <div className={s.isActiveInput}>
                  <input type="radio" name='medication_1' id='medication_1' {...medication} value={"1"} checked={medication.value === "1"} />
                  <label htmlFor='medication_1'><span><span></span></span><span>Not taking any of these</span></label>
                </div>

                <div className={s.isActiveInput}>
                  <input type="radio" name='medication_2' id='medication_2' {...medication} value={"2"} checked={medication.value === "2"} />
                  <label htmlFor='medication_2'><span><span></span></span><span>Taking 1</span></label>
                </div>

                <div className={s.isActiveInput}>
                  <input type="radio" name='medication_3' id='medication_3' {...medication} value={"3"} checked={medication.value === "3"} />
                  <label htmlFor='medication_3'><span><span></span></span><span>Taking 2</span></label>
                </div>

                <div className={s.isActiveInput}>
                  <input type="radio" name='medication_4' id='medication_4' {...medication} value={"4"} checked={medication.value === "4"} />
                  <label htmlFor='medication_4'><span><span></span></span><span>Taking more than 2</span></label>
                </div>
              </td>
            </tr>

            <tr className={s.bodyRow}>
              <td className={s.factorColumn}>
                <strong>Psychological:</strong><br />
                (Anxiety, Depression, ↓ Cooperation, ↓ Insight or ↓ Judgement)
              </td>
              <td>
                <div className={s.isActiveInput}>
                  <input type="radio" name='psychological_1' id='psychological_1' {...psychological} value={"1"} checked={psychological.value === "1"} />
                  <label htmlFor='psychological_1'><span><span></span></span><span>Does not appear to have any of these</span></label>
                </div>

                <div className={s.isActiveInput}>
                  <input type="radio" name='psychological_2' id='psychological_2' {...psychological} value={"2"} checked={psychological.value === "2"} />
                  <label htmlFor='psychological_2'><span><span></span></span><span>Appears mildly affected by one or more</span></label>
                </div>

                <div className={s.isActiveInput}>
                  <input type="radio" name='psychological_3' id='psychological_3' {...psychological} value={"3"} checked={psychological.value === "3"} />
                  <label htmlFor='psychological_3'><span><span></span></span><span>Appears moderately affected by one or more</span></label>
                </div>

                <div className={s.isActiveInput}>
                  <input type="radio" name='psychological_4' id='psychological_4' {...psychological} value={"4"} checked={psychological.value === "4"} />
                  <label htmlFor='psychological_4'><span><span></span></span><span>Appears severely affeced by one or more</span></label>
                </div>
              </td>
            </tr>

            <tr className={s.bodyRow}>
              <td className={s.factorColumn}>
                <strong>Medications:</strong><br />
                (Sedatives, Anti-Depressants, Anti-Parkinson&#39;s, Diuretics, Anti-hypertensives, Hypnotics)
              </td>
              <td>
                <div className={s.isActiveInput}>
                  <input type="radio" name='cognitive_1' id='cognitive_1' {...cognitive} value={"1"} checked={cognitive.value === "1"} />
                  <label htmlFor='cognitive_1'><span><span></span></span><span>Intact</span></label>
                </div>

                <div className={s.isActiveInput}>
                  <input type="radio" name='cognitive_2' id='cognitive_2' {...cognitive} value={"2"} checked={cognitive.value === "2"} />
                  <label htmlFor='cognitive_2'><span><span></span></span><span>Mildly impaired</span></label>
                </div>

                <div className={s.isActiveInput}>
                  <input type="radio" name='cognitive_3' id='cognitive_3' {...cognitive} value={"3"} checked={cognitive.value === "3"} />
                  <label htmlFor='cognitive_3'><span><span></span></span><span>Moderately impaired</span></label>
                </div>

                <div className={s.isActiveInput}>
                  <input type="radio" name='cognitive_4' id='cognitive_4' {...cognitive} value={"4"} checked={cognitive.value === "4"} />
                  <label htmlFor='cognitive_4'><span><span></span></span><span>Severely impaired</span></label>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <table className={s.overallTable}>
          <thead>
            <tr className={s.headerRow}>
              <td className={s.factorColumn}>Automatic High Risk Status</td>
            </tr>
          </thead>
          <tbody>
            <tr className={s.bodyRow}>
              <td className={s.factorColumn}>
                <input
                  type="checkbox"
                  id="mobility"
                  name="mobility"
                  {...mobility}
                  required
                />
              <label htmlFor="mobility">
                  <span></span>
                  <span>
                    Recent change in functional status and/or medications affecting safe mobility (or anticipated)
                  </span>
                </label>
              </td>
            </tr>

            <tr className={s.bodyRow}>
              <td className={s.factorColumn}>
                <input
                  type="checkbox"
                  id="dizziness"
                  name="dizziness"
                  {...dizziness}
                  required
                />
                <label htmlFor="dizziness">
                  <span></span>
                  <span>
                    Dizziness/ Postural hypotension
                  </span>
                </label>
              </td>
            </tr>
          </tbody>
        </table>

        <div className={s.statusSection}>
          <div>
            <div className={s.statusField}>
              <div>
                Risk Score
                <div className={s.statusFieldTitle}>{riskScore || 'N/A'}</div>
              </div>
            </div>

            <div className={s.statusField}>
              <div>
                Fall Risk Status
                <div className={s.statusFieldTitle}>{fallRiskStatus || 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>

        <table className={s.overallTable}>
          <thead>
            <tr className={s.headerRow}>
              <td className={s.factorColumn}>Risk Factor Checklist</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            <tr className={s.bodyRow}>
              <td className={s.factorColumn}><strong>Vision</strong></td>
              <td>Reports/ Observed difficulty seeing - objects/ signs/ finding way around</td>
            </tr>

            <tr className={s.bodyRow}>
              <td className={s.factorColumn}><strong>Mobility</strong></td>
              <td>Mobility status unknown or appears unsafe/ impulsive/ forgets gait aid</td>
            </tr>

            <tr className={s.bodyRow}>
              <td className={s.factorColumn}><strong>Transfers</strong></td>
              <td>Transfer status unknown or appears unsafe ie. Over-reaches, impulsive</td>
            </tr>

            <tr className={s.bodyRow}>
              <td className={s.factorColumn}><strong>Behaviours</strong></td>
              <td>Observed or reported agitation, confusion, disorientation<br />
                Difficulty following instructions or non-compliant (observed or known)</td>
            </tr>

            <tr className={s.bodyRow}>
              <td className={s.factorColumn}><strong>ADLs</strong></td>
              <td>Observed risk-taking behaviours, or reported from referrer/ previous facility<br />
                Observed unsafe use of equipment<br />
                Unsafe footwear/ inappropriate clothing</td>
            </tr>

            <tr className={s.bodyRow}>
              <td className={s.factorColumn}><strong>Environment</strong></td>
              <td>Difficulties with orientation to environment ie. Areas between bed/ bathroom/ dining room</td>
            </tr>

            <tr className={s.bodyRow}>
              <td className={s.factorColumn}><strong>Nutrition</strong></td>
              <td>Underweight/ low appetite</td>
            </tr>

            <tr className={s.bodyRow}>
              <td className={s.factorColumn}><strong>Continence</strong></td>
              <td>Reported or known urgency/ nocturia/ accidents</td>
            </tr>
          </tbody>
        </table>

        <div className={s.fieldSection}>
          <label className={s.fieldTitle}><strong>Interventions</strong></label>
          <div className={s.fieldContent}>
            <textarea className={s.textareaInput} id="intervention" name="intervention" {...intervention} placeholder="Example: Recommended home modification for night lights & ensure clear pathway to toilet." />
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
    'recentFall',
    'medication',
    'psychological',
    'cognitive',
    'mobility',
    'dizziness',
    'intervention',
  ],
  validate,
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
  resetForm: () => dispatch(reset('documentationFRATForm')),
});

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(DocumentationFRATForm);
