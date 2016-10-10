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
// sub component
import DocumentationMedicalHistoryFormMedication from '../DocumentationMedicalHistoryFormMedication/DocumentationMedicalHistoryFormMedication';
// react-icons
import FaPlus from 'react-icons/lib/fa/plus';
import FaArrowCircleRight from 'react-icons/lib/fa/arrow-right';

class DocumentationMedicalHistoryForm extends Component {

  componentDidMount() {
    const { medications } =this.props.fields;
    this.props.fields.secondaryDiagnosis.addField();
    this.props.fields.allergy.addField();
    medications.addField();
  }

  renderMultiTextField = (field) => (
    <div className={s.multiTextContainer}>
      {field.map((item, index) => (
        <input key={index} className={s.textInput} type='text' {...item}/>
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

  render() {
    const {
      fields: {
        mainDiagnosis,
        secondaryDiagnosis,
        vision,
        hearing,
        mobility,
        healthHistory,
        allergy,
        medications,
      },

      resetForm,
      invalid,
      handleSubmit,
      submitFailed,
      submitting,
    } = this.props;

    const mobilityChoice = [{name: 'Walking (Without Aid)', value: 'Walking (Without Aid)'}, {name: 'Walking (Require Aid)', value: 'Walking (Require Aid)'}, {name: 'Wheelchair', value: 'Wheelchair'}, {name: 'Bed Bound', value: 'Bed Bound'}];

    const firstSec = [{
      first: "Main Diagnosis",
      second: (<input className={s.textInput} type='text' {...mainDiagnosis}/>),
    }, {
      first: "Secondary Diagnosis",
      second: this.renderMultiTextField(secondaryDiagnosis),
    }, {
      first: "Vision",
      second: (<input className={s.textInput} type='text' {...vision}/>),
    }, {
      first: "Hearing",
      second: (<input className={s.textInput} type='text' {...hearing}/>),
    }, {
      first: "Mobility/ADL",
      second: (
        <div className={cx("select", s.selectInput)}>
          <span></span>
          <select id="mobility" name="mobility" value={mobilityChoice[0]} {...mobility}>
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
      <form className={s.documentationMedicalHistoryForm} onSubmit={handleSubmit(this.props.onFormSubmit)}>
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
    'secondaryDiagnosis[]',
    'vision',
    'hearing',
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

});

const mapDispatchToProps = (dispatch) => ({
  resetForm: () => dispatch(reset('documentationMedicalHistoryForm')),
  addValue: addArrayValue,
});

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(DocumentationMedicalHistoryForm);
