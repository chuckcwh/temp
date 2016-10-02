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
import { reduxForm, addArrayValue, reset } from 'redux-form';
// sub component
import DocumentationMedicalHistoryFormMedication from '../DocumentationMedicalHistoryFormMedication/DocumentationMedicalHistoryFormMedication';
// react-icons
import FaPlus from 'react-icons/lib/fa/plus';


class DocumentationMedicalHistoryForm extends Component {

  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {
    this.props.fields.secondaryDiagnosis.addField();
    this.props.fields.allergy.addField();
    this.props.fields.medications.addField();
  }

  onFormSubmit = (values) => {
    console.log('onFormSubmit', values);
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

    return (
      <form className={s.documentationMedicalHistoryForm} onSubmit={this.props.onFormSubmit}>
        <h2>medical history form</h2>

        <div>
          <label className={s.fieldTitle}>Main Diagnosis*</label>
          <div className={s.fieldContent}>
            <input className={s.textInput} type='text' {...mainDiagnosis}/>
            {mainDiagnosis.touched && mainDiagnosis.error && (<div className={s.formError}>{mainDiagnosis.error}</div>)}
          </div>
        </div>

        <div>
          <label className={s.fieldTitle}>Secondary Diagnosis</label>
          <div className={cx(s.fieldContent, s.multiTextField)}>
            {secondaryDiagnosis.map((item, index) => (
              <input key={index} className={s.textInput} type='text' {...item}/>
            ))}
            <button
              className={cx('btn btn-primary', s.multiTextFieldBtn)}
              onClick={e => {
                e.preventDefault();
                secondaryDiagnosis.addField();
            }}>
              <FaPlus />
            </button>
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
          <div className={cx(s.fieldContent, s.textareaField)}>
            <textarea className={s.textareaInput} id="healthHistory" name="healthHistory" {...healthHistory} />
            {healthHistory.touched && healthHistory.error && (<div className={s.formError}>{healthHistory.error}</div>)}
          </div>
        </div>

        <div>
          <div className={s.fieldTitle}>Allergy</div>
          <div className={cx(s.fieldContent, s.multiTextField)}>
            {allergy.map((item, index) => (
              <input key={index} className={s.textInput} type='text' {...item}/>
            ))}
            <button
              className={cx('btn btn-primary', s.multiTextFieldBtn)}
              onClick={e => {
                e.preventDefault();
                allergy.addField();
            }}>
              <FaPlus />
            </button>
          </div>
        </div>

        <DocumentationMedicalHistoryFormMedication medications={medications} />

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
    'medications[].instruction',
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
