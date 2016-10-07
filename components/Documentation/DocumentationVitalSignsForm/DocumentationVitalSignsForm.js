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

  renderIssueSet = (issues) => {
    return issues.map((issue, index) => (
      <div key={index} className={s.issue}>
        <label className={s.issueTitle}><strong>{issue.first}</strong></label>
        <div className={s.issueContent}>
          {issue.second}
        </div>
      </div>
    ))
  }

  renderAssessWithComment = (checkBoxName, commentName) => (
    <div>
      <div className={s.checkBoxInput}>
        <input type="checkbox" id={checkBoxName} name={checkBoxName} {...this.props.fields[checkBoxName]} />
        <label htmlFor={checkBoxName}><span></span><span>Unable to assess</span></label>
      </div>
      <div className={s.textareaField}>
        <textarea className={s.textareaInput} id={commentName} name={commentName} {...this.props.fields[commentName]} />
      </div>
    </div>
  )

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

    const firstSec = [{
      first: "Blood Pressure",
      second: (
        <div>
          <div>
            <input className={s.numberInput} type='number' {...BPlow} disabled={BPaccess.value} />/&nbsp;&nbsp;&nbsp;&nbsp;
            <input className={s.numberInput} type='number' {...BPhigh} disabled={BPaccess.value} />(mmHG)
          </div>
          {this.renderAssessWithComment('BPaccess', 'BPcomment')}
        </div>
    )}, {
      first: "Blood Glucose Level",
      second: (
        <div>
          <div>
            <input
              className={s.numberInput}
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
              className={s.numberInput}
              type='number'
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
          {this.renderAssessWithComment('BGaccess', 'BGcomment')}
        </div>
    )}, {
      first: "Temperature",
      second: (
        <div>
          <div>
            <input className={cx(s.textInput, s.textInputShort)} type='text' {...temp} disabled={tempAccess.value} />(&deg;C)
          </div>
          {this.renderAssessWithComment('tempAccess', 'tempComment')}
        </div>
    )}, {
      first: "Heart Rate",
      second: (
        <div>
          <div>
            <input className={cx(s.textInput, s.textInputShort)} type='text' {...heartRate} disabled={heartRateAccess.value} />per minute
          </div>
          {this.renderAssessWithComment('heartRateAccess', 'heartRateComment')}
        </div>
    )}, {
      first: "Oxygen Saturation",
      second: (
        <div>
          <div>
            <input className={cx(s.textInput, s.textInputShort)} type='text' {...oxygen} disabled={oxygenAccess.value} />
          </div>
          {this.renderAssessWithComment('oxygenAccess', 'oxygenComment')}
        </div>
    )}, {
      first: "Pain Score",
      second: (
        <div>
          <div>
            <input className={cx(s.textInput, s.textInputShort)} type='text' {...pain} disabled={painAccess.value} />
          </div>
          {this.renderAssessWithComment('painAccess', 'painComment')}
        </div>
    )}];

    return (
      <form className={s.documentationVitalSignsForm} onSubmit={handleSubmit(this.props.onFormSubmit)}>
        <h2>Vital Signs</h2>

        <div className={s.issueSetSection}>
          {this.renderIssueSet(firstSec)}
        </div>

        <div className={s.handleForm}>
          <button className='btn btn-secondary' disabled={submitting} onClick={resetForm}>
            Clear Values
          </button>
          <button className='btn btn-primary' disabled={submitting || invalid}>
            Submit
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
