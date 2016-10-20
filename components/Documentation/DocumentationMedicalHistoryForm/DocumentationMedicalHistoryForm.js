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
import { getSession, showConfirmPopup, fetchServices, createDocumentation } from '../../../actions';
import ConfirmPopup from '../../ConfirmPopup';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { reduxForm, addArrayValue, reset } from 'redux-form';
import { Selections } from '../DocumentationModules/DocumentationModules';
// sub component
import DocumentationMedicalHistoryFormMedication from '../DocumentationMedicalHistoryFormMedication/DocumentationMedicalHistoryFormMedication';
// react-icons
import FaPlus from 'react-icons/lib/fa/plus';
import FaMinus from 'react-icons/lib/fa/minus';
import FaArrowCircleRight from 'react-icons/lib/fa/arrow-right';

class DocumentationMedicalHistoryForm extends Component {

  componentDidMount() {
    const { secDiagnosis, allergy, medications } = this.props.fields;
    secDiagnosis.addField();
    allergy.addField();
    medications.addField();
  }

  renderMultiTextField = (field) => (
    <div className={s.multiTextContainer}>
      {field.map((item, index) => (
        <div key={index} className={s.textInputBody}>
          <input type='text' className={s.textInput} {...item}/>
          <button
            className={cx('btn btn-primary', s.multiTextFieldBtn)}
            onClick={e => {
              e.preventDefault();
              field.removeField(index);
          }}>
            <FaMinus />
          </button>
        </div>
      ))}
      <button
        className={cx('btn btn-primary', s.multiTextFieldBtn)}
        onClick={e => {
          e.preventDefault();
          field.addField();
      }}>
        <FaPlus />
      </button>
    </div>
  )

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

  onFormSubmit = (values) => {
    // console.log('onFormSubmit', values);

    if (values.vision !== 'others') {
      values['visionOthers'] = undefined;
    }
    if (values.hearing !== 'others') {
      values['hearingOthers'] = undefined;
    }

    values['secDiagnosis'] = values['secDiagnosis'].filter(item => !!item);
    values['allergy'] = values['allergy'].filter(item => !!item);
    values['medications'] = values['medications'].filter(item => Object.values(item).filter(i => !!i).length);
    this.props.onFormSubmit(values);
  }

  render() {
    const {
      fields: {
        mainDiagnosis,
        secDiagnosis,
        vision,
        visionOthers,
        hearing,
        hearingOthers,
        mobility,
        healthHistory,
        allergy,
        medications,
      },
      mobilityChoice,

      resetForm,
      invalid,
      handleSubmit,
      submitFailed,
      submitting,
    } = this.props;

    const firstSec = [{
      first: "Main Diagnosis",
      second: (<input className={s.textInput} type='text' {...mainDiagnosis}/>),
    }, {
      first: "Secondary Diagnosis",
      second: this.renderMultiTextField(secDiagnosis),
    }, {
      first: "Vision",
      second: (
        <Selections
          fieldName="vision"
          field={vision}
          items={[
            {value: "normal", label: (<span>Normal</span>)},
            {value: "need visual aids", label: (<span>Need visual aids</span>)},
            {value: "others", label: (<span>Others:<input className={s.textInputWithSelection} type="text" {...visionOthers} disabled={vision.value !== 'others'} /></span>)},
          ]}
        />
    )}, {
      first: "Hearing",
      second: (
        <Selections
          fieldName="hearing"
          field={hearing}
          items={[
            {value: "normal", label: (<span>Normal</span>)},
            {value: "need hearing aids", label: (<span>Need hearing aids</span>)},
            {value: "others", label: (<span>Others:<input className={s.textInputWithSelection} type="text" {...hearingOthers} disabled={hearing.value !== 'others'} /></span>)},
          ]}
        />
    )}, {
      first: "Mobility/ADL",
      second: (
        <div className={cx("select", s.selectInput)}>
          <span></span>
          <select id="mobility" name="mobility" {...mobility}>
            <option value="">-- SELECT --</option>
            {mobilityChoice && mobilityChoice.map((item, index) => (
              <option key={index} value={item.value}>{item.name}</option>
            ))}
          </select>
        </div>
    )}, {
      first: "Health History",
      second: (<textarea className={s.textareaInput} id="healthHistory" name="healthHistory" {...healthHistory} />),
    }, {
      first: "Allergy",
      second: this.renderMultiTextField(allergy),
    }]

    return (
      <form className={s.documentationMedicalHistoryForm} onSubmit={handleSubmit(this.onFormSubmit)}>
        <h2>Medical History</h2>

        <div className={s.issueSetSection}>
          {this.renderIssueSet(firstSec)}
        </div>

        <h2>Medications</h2>

        <table >
          <thead className={s.headerRow}>
            <tr>
              <th></th>
              <th>Route</th>
              <th>Medication</th>
              <th>Dose</th>
              <th>Unit</th>
              <th>Cycle</th>
              <th>Duration</th>
              <th>Unit</th>
              <th>Instructions</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {medications.map((med, index) => (
              <DocumentationMedicalHistoryFormMedication
                key={index}
                medIndex={index}
                removeField={e => {
                  e.preventDefault();
                  if (medications.length === 1) {
                    medications.addField({index: medications.length + 1});
                  }
                  medications.removeField(index);
                }}
                {...med}
              />
            ))}
          </tbody>
        </table>

        <div className={s.addMedicationRow}>
          <button
            className={cx('btn btn-primary', s.multiTextFieldBtn)}
            onClick={e => {
              e.preventDefault();
              medications.addField({index: medications.length + 1});
            }}>
            <FaPlus /> Add Row
          </button>
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
    'secDiagnosis[]',
    'vision',
    'visionOthers',
    'hearing',
    'hearingOthers',
    'mobility',
    'healthHistory',
    'allergy[]',
    'medications[].route',
    'medications[].medication',
    'medications[].dose',
    'medications[].doseUnit',
    'medications[].cycle',
    'medications[].duration',
    'medications[].durationUnit',
    'medications[].instructions',
  ],
  validate,
}

const mapStateToProps = (state) => ({
  mobilityChoice: state.config.data && state.config.data.mobilities,
});

const mapDispatchToProps = (dispatch) => ({
  resetForm: () => dispatch(reset('documentationMedicalHistoryForm')),
  addValue: addArrayValue,
});

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(DocumentationMedicalHistoryForm);
