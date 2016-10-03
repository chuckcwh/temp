import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import s from './DocumentationVitalSignsForm.css';
import Container from '../../Container';
import Link from '../../Link';
import Header from '../../Header';
import history from '../../../core/history';
import { getUserName, configToName } from '../../../core/util';
import { getSession, showConfirmPopup, fetchServices } from '../../../actions';
import ConfirmPopup from '../../ConfirmPopup';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { reduxForm, change, reset } from 'redux-form';
// react icons
import FaArrowsH from 'react-icons/lib/fa/arrows-h';


class DocumentationVitalSignsForm extends Component {

  onFormSubmit = (values) => {
    console.log('onFormSubmit', values);
  }

  render() {
    const {
      fields: {
        BPlow,
        BPhigh,
        BPaccess,
        BPcomment,
        BGmmol,
        BGmg,
        BGaccess,
        BGcomment,
        temp,
        tempAccess,
        tempComment,
        heartRate,
        heartRateAccess,
        heartRateComment,
        oxygen,
        oxygenAccess,
        oxygenComment,
        pain,
        painAccess,
        painComment,
      },

      resetForm,
      invalid,
      handleSubmit,
      submitFailed,
      submitting,
    } = this.props;

    return (
      <form className={s.documentationVitalSignsForm} onSubmit={this.onFormSubmit}>
        <h2>Vital Signs</h2>

        <div className={s.fieldSection}>
          <label className={s.fieldTitle}>Blood Pressure</label>
          <div className={s.fieldContent}>
            <div>
              <input className={cx(s.textInput, s.textInputShort)} type='text' {...BPlow} disabled={BPaccess.value} />/&nbsp;&nbsp;&nbsp;&nbsp;
              <input className={cx(s.textInput, s.textInputShort)} type='text' {...BPhigh} disabled={BPaccess.value} />(mmHG)
            </div>
            <div className={s.checkBoxInput}>
              <input
                type="checkbox"
                id="BPaccess"
                name="BPaccess"
                {...BPaccess}
                required
              />
              <label htmlFor="agree">
                <span></span>
                <span>
                  Unable to assess
                </span>
              </label>
            </div>
            <div className={s.textareaField}>
              <textarea className={s.textareaInput} id="BPcomment" name="BPcomment" {...BPcomment} />
              {BPcomment.touched && BPcomment.error && (<div className={s.formError}>{BPcomment.error}</div>)}
            </div>
          </div>
        </div>

        <div className={s.fieldSection}>
          <label className={s.fieldTitle}>Blood Glucose Level</label>
          <div className={s.fieldContent}>
            <div>
              <input
                className={cx(s.numberInput, s.textInputShort)}
                type='number'
                {...BGmmol}
                disabled={BGaccess.value}
                onChange={e => {
                  e.preventDefault();
                  const newValue = +e.target.value;
                  this.props.changeFieldValue('BGmmol', newValue);
                  this.props.changeFieldValue('BGmg', (newValue * 18).toFixed(1));
                }}
              />
                (mmol/L) &nbsp;&nbsp;<FaArrowsH />&nbsp;&nbsp;&nbsp;&nbsp;
              <input
                className={cx(s.numberInput, s.textInputShort)}
                type='text'
                {...BGmg}
                disabled={BGaccess.value}
                onChange={e => {
                  e.preventDefault();
                  const newValue = +e.target.value;
                  this.props.changeFieldValue('BGmg', newValue);
                  this.props.changeFieldValue('BGmmol', (newValue / 18).toFixed(1));
                }}
              />(mg/dl)
            </div>
            <div className={s.checkBoxInput}>
              <input
                type="checkbox"
                id="BGaccess"
                name="BGaccess"
                {...BGaccess}
                required
              />
              <label htmlFor="agree">
                <span></span>
                <span>
                  Unable to assess
                </span>
              </label>
            </div>
            <div className={s.textareaField}>
              <textarea className={s.textareaInput} id="BGcomment" name="BGcomment" {...BGcomment} />
              {BGcomment.touched && BGcomment.error && (<div className={s.formError}>{BGcomment.error}</div>)}
            </div>
          </div>
        </div>

        <div className={s.fieldSection}>
          <label className={s.fieldTitle}>Temperature</label>
          <div className={s.fieldContent}>
            <div>
              <input className={cx(s.textInput, s.textInputShort)} type='text' {...temp} disabled={tempAccess.value} />(&deg;C)
            </div>
            <div className={s.checkBoxInput}>
              <input
                type="checkbox"
                id="tempAccess"
                name="tempAccess"
                {...tempAccess}
                required
              />
              <label htmlFor="agree">
                <span></span>
                <span>
                  Unable to assess
                </span>
              </label>
            </div>
            <div className={s.textareaField}>
              <textarea className={s.textareaInput} id="tempComment" name="tempComment" {...tempComment} />
              {tempComment.touched && tempComment.error && (<div className={s.formError}>{tempComment.error}</div>)}
            </div>
          </div>
        </div>

        <div className={s.fieldSection}>
          <label className={s.fieldTitle}>Heart Rate</label>
          <div className={s.fieldContent}>
            <div>
              <input className={cx(s.textInput, s.textInputShort)} type='text' {...heartRate} disabled={heartRateAccess.value} />per minute
            </div>
            <div className={s.checkBoxInput}>
              <input
                type="checkbox"
                id="heartRateAccess"
                name="heartRateAccess"
                {...heartRateAccess}
                required
              />
              <label htmlFor="agree">
                <span></span>
                <span>
                  Unable to assess
                </span>
              </label>
            </div>
            <div className={s.textareaField}>
              <textarea className={s.textareaInput} id="heartRateComment" name="heartRateComment" {...heartRateComment} />
              {heartRateComment.touched && heartRateComment.error && (<div className={s.formError}>{heartRateComment.error}</div>)}
            </div>
          </div>
        </div>

        <div className={s.fieldSection}>
          <label className={s.fieldTitle}>Oxygen Saturation</label>
          <div className={s.fieldContent}>
            <div>
              <input className={cx(s.textInput, s.textInputShort)} type='text' {...oxygen} disabled={oxygenAccess.value} />
            </div>
            <div className={s.checkBoxInput}>
              <input
                type="checkbox"
                id="oxygenAccess"
                name="oxygenAccess"
                {...oxygenAccess}
                required
              />
              <label htmlFor="agree">
                <span></span>
                <span>
                  Unable to assess
                </span>
              </label>
            </div>
            <div className={s.textareaField}>
              <textarea className={s.textareaInput} id="oxygenComment" name="oxygenComment" {...oxygenComment} />
              {oxygenComment.touched && oxygenComment.error && (<div className={s.formError}>{oxygenComment.error}</div>)}
            </div>
          </div>
        </div>

        <div className={s.fieldSection}>
          <label className={s.fieldTitle}>Pain Score</label>
          <div className={s.fieldContent}>
            <div>
              <input className={cx(s.textInput, s.textInputShort)} type='text' {...pain} disabled={painAccess.value} />
            </div>
            <div className={s.checkBoxInput}>
              <input
                type="checkbox"
                id="painAccess"
                name="painAccess"
                {...painAccess}
                required
              />
              <label htmlFor="agree">
                <span></span>
                <span>
                  Unable to assess
                </span>
              </label>
            </div>
            <div className={s.textareaField}>
              <textarea className={s.textareaInput} id="painComment" name="painComment" {...painComment} />
              {painComment.touched && painComment.error && (<div className={s.formError}>{painComment.error}</div>)}
            </div>
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

DocumentationVitalSignsForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

const reduxFormConfig = {
  form: 'documentationVitalSignsForm',
  fields: [
    'BPlow',
    'BPhigh',
    'BPaccess',
    'BPcomment',
    'BGmmol',
    'BGmg',
    'BGaccess',
    'BGcomment',
    'temp',
    'tempAccess',
    'tempComment',
    'heartRate',
    'heartRateAccess',
    'heartRateComment',
    'oxygen',
    'oxygenAccess',
    'oxygenComment',
    'pain',
    'painAccess',
    'painComment',
  ],
  validate,
};

const mapStateToProps = (state) => ({
  initialValues: {
    BPaccess: true,
    BGaccess: true,
    tempAccess: true,
    heartRateAccess: true,
    oxygenAccess: true,
    painAccess: true,
  },
});

const mapDispatchToProps = (dispatch) => ({
  resetForm: () => dispatch(reset('documentationVitalSignsForm')),
  changeFieldValue: (field, value) => dispatch(change('documentationVitalSignsForm', field, value)),
});

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(DocumentationVitalSignsForm);
