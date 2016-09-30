import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import s from './DocumentationMedicalHistoryForm.css';
import Container from '../../Container';
import Link from '../../Link';
import Header from '../../Header';
import history from '../../../core/history';
import { getUserName, configToName } from '../../../core/util';
import { getSession, showConfirmPopup, fetchServices } from '../../../actions';
import ConfirmPopup from '../../ConfirmPopup';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { reduxForm, reset } from 'redux-form';
// react-icons
import FaPlus from 'react-icons/lib/fa/plus';


class DocumentationMedicalHistoryForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      secondaryDiagnosisNum: 1,
      secondaryDiagnosis: [],
      medications: []
    }
  }

  componentDidMount() {

  }

  onFormSubmit = (values) => {
    console.log('onFormSubmit', values);
  }

  render() {
    const {
      fields: {
        mainDiagnosis,
        vision,
        hearing,
        mobility,
        healthHistory,
      },

      invalid,
      handleSubmit,
      submitFailed,
      submitting,
    } = this.props;

    const { secondaryDiagnosis, medications } = this.state;
    const mobilityChoice = [{name: 'Walking (Without Aid)', value: 'Walking (Without Aid)'}, {name: 'Walking (Require Aid)', value: 'Walking (Require Aid)'}, {name: 'Wheelchair', value: 'Wheelchair'}, {name: 'Bed Bound', value: 'Bed Bound'}];

    const medicationChoice = {
      route: [{name: 'ORAL', value: 'ORAL'}, {name: '(IV) INTRAVENOUSLY', value: '(IV) INTRAVENOUSLY'}],
      doseUnit: [{name: 'EA', value: 'EA'}, {name: 'VIAL', value: 'VIAL'}],
      cycle: [{name: 'H, HOURLY', value: 'H, HOURLY'}, {name: '2H, 2 HOURLY', value: '2H, 2 HOURLY'}],
      durationUnit: [{name: 'DAY', value: 'DAY'}, {name: 'WEEK', value: 'WEEK'}, {name: 'MONTH', value: 'MONTH'}],
    }

    return (
      <div className={s.documentationMedicalHistoryForm}>
        <h2>medical history form</h2>

        <div>
          <div className={s.fieldTitle}>Main Diagnosis*</div>
          <div className={s.fieldContent}>
            <input className={s.textInput} type='text' {...mainDiagnosis}/>
            {mainDiagnosis.touched && mainDiagnosis.error && (<div className={s.formError}>{mainDiagnosis.error}</div>)}
          </div>
        </div>

        <div>
          <div className={s.fieldTitle}>Secondary Diagnosis</div>
          <div className={s.fieldContent}>
            <input className={s.textInput} type='text' {...secondaryDiagnosis}/>
            <button><FaPlus /></button>
            {secondaryDiagnosis.touched && secondaryDiagnosis.error && (<div className={s.formError}>{secondaryDiagnosis.error}</div>)}
          </div>
        </div>

        <div>
          <div className={s.fieldTitle}>Vision</div>
          <div className={s.fieldContent}>
            <input className={s.textInput} type='text' {...vision}/>
            {vision.touched && vision.error && (<div className={s.formError}>{vision.error}</div>)}
          </div>
        </div>

        <div>
          <div className={s.fieldTitle}>Hearing</div>
          <div className={s.fieldContent}>
            <input className={s.textInput} type='text' {...hearing}/>
            {hearing.touched && hearing.error && (<div className={s.formError}>{hearing.error}</div>)}
          </div>
        </div>

        <div>
          <div className={s.fieldTitle}>Mobility/ADL</div>
          <div className={s.fieldContent}>
            <div className={cx("select", s.selectInput)}>
              <span></span>
              <select id={mobility} name={mobility} {...mobility}>
                {mobilityChoice && mobilityChoice.map(item => (
                  <option value={item.value}>{item.name}</option>
                ))}
              </select>
            </div>
            {mobility.touched && mobility.error && (<div className={s.formError}>{mobility.error}</div>)}
          </div>
        </div>

        <div>
          <div className={s.fieldTitle}>Health History</div>
          <div className={s.fieldContent}>
            <textarea className={s.textareaInput} id="healthHistory" name="healthHistory" {...healthHistory} />
            {healthHistory.touched && healthHistory.error && (<div className={s.formError}>{healthHistory.error}</div>)}
          </div>
        </div>

        <div>
          <div className={s.fieldTitle}>Allergy</div>
          <div className={s.fieldContent}>
            <input className={s.textInput} type='text' />
            <button><FaPlus /></button>
          </div>
        </div>

        <h3>Medications</h3>

        <table>
          <thead>
            <tr>
              <td>Route</td>
              <td>Medication</td>
              <td>Dose</td>
              <td>Unit</td>
              <td>Cycle</td>
              <td>Duration</td>
              <td>Unit</td>
              <td>Instructions (e.g. timing)</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className={cx("select", s.selectInput)}>
                  <span></span>
                  <select id="medicationRoute" name="medicationRoute" >
                    {medicationChoice.route && medicationChoice.route.map(item => (
                      <option value={item.value}>{item.name}</option>
                    ))}
                  </select>
                </div>
              </td>
              <td>
                <input className={s.textInput} type="text" />
              </td>
              <td>
                <input className={s.textInput} type="text" />
              </td>
              <td>
                <div className={cx("select", s.selectInput)}>
                  <span></span>
                  <select id={"medicationDoseUnit"} name={"medicationDoseUnit"} >
                    {medicationChoice.doseUnit && medicationChoice.doseUnit.map(item => (
                      <option value={item.value}>{item.name}</option>
                    ))}
                  </select>
                </div>
              </td>
              <td>
                <div className={cx("select", s.selectInput)}>
                  <span></span>
                  <select id={"medicationCycle"} name={"medicationCycle"} >
                    {medicationChoice.cycle && medicationChoice.cycle.map(item => (
                      <option value={item.value}>{item.name}</option>
                    ))}
                  </select>
                </div>
              </td>
              <td>
                <input className={s.textInput} type="text"  />
              </td>
              <td>
                <div className={cx("select", s.selectInput)}>
                  <span></span>
                  <select id={"medicationDurationUnit"} name={"medicationDurationUnit"} >
                    {medicationChoice.durationUnit && medicationChoice.durationUnit.map(item => (
                      <option value={item.value}>{item.name}</option>
                    ))}
                  </select>
                </div>
              </td>
              <td>
                <textarea className={s.textareaInput} id="medicationInstruction" name="medicationInstruction" placeholder="(e.g. timing)" />
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    );
  }
}

const validate = values => {
  const errors = {};

  return errors
}

DocumentationMedicalHistoryForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

const reduxFormConfig = {
  form: 'documentationMedicalHistoryForm',
  fields: [
    'mainDiagnosis',
    'vision',
    'hearing',
    'mobility',
    'healthHistory',
  ],
  validate,
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
  resetForm: () => dispatch(reset('documentationMedicalHistoryForm')),
});

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(DocumentationMedicalHistoryForm);
