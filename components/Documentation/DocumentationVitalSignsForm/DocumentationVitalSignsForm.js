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
import FaArrowCircleRight from 'react-icons/lib/fa/arrow-right';


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

  onFormSubmit = (values) => {
    console.log('onFormSubmit', values);

    if (values['bpAccess']) {
      values['bpMin'] = undefined;
      values['bpMax'] = undefined;
    }
    const onCheckValue = (fields) => {
      fields.map(item => {
        if (values[`${item}Access`]) {
          values[item] = undefined;
        }
      })
    }
    onCheckValue(['glucose', 'temp', 'heart', 'oxygen', 'pain']);

    this.props.onFormSubmit(values);
  }

  render() {
    const {
      fields: {
        bpMin,
        bpMax,
        bpAccess,
        bpComments,
        glucose,
        glucoseMg,
        glucoseAccess,
        glucoseComments,
        temp,
        tempAccess,
        tempComments,
        heart,
        heartAccess,
        heartComments,
        oxygen,
        oxygenAccess,
        oxygenComments,
        pain,
        painAccess,
        painComments,
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
            <input className={s.numberInput} type='number' {...bpMin} disabled={bpAccess.value} />/&nbsp;&nbsp;&nbsp;&nbsp;
            <input className={s.numberInput} type='number' {...bpMax} disabled={bpAccess.value} />(mmHG)
          </div>
          {this.renderAssessWithComment('bpAccess', 'bpComments')}
        </div>
    )}, {
      first: "Blood Glucose Level",
      second: (
        <div>
          <div>
            <input
              className={s.numberInput}
              type='number'
              {...glucose}
              disabled={glucoseAccess.value}
              onChange={e => {
                e.preventDefault();
                const newValue = +e.target.value;
                this.props.changeFieldValue('glucose', newValue);
                this.props.changeFieldValue('glucoseMg', (newValue * 18).toFixed(1));
              }}
            />
              (mmol/L) &nbsp;&nbsp;<FaArrowsH />&nbsp;&nbsp;&nbsp;&nbsp;
            <input
              className={s.numberInput}
              type='number'
              {...glucoseMg}
              disabled={glucoseAccess.value}
              onChange={e => {
                e.preventDefault();
                const newValue = +e.target.value;
                this.props.changeFieldValue('glucoseMg', newValue);
                this.props.changeFieldValue('glucose', (newValue / 18).toFixed(1));
              }}
            />(mg/dl)
          </div>
          {this.renderAssessWithComment('glucoseAccess', 'glucoseComments')}
        </div>
    )}, {
      first: "Temperature",
      second: (
        <div>
          <div>
            <input className={cx(s.textInput, s.textInputShort)} type='text' {...temp} disabled={tempAccess.value} />(&deg;C)
          </div>
          {this.renderAssessWithComment('tempAccess', 'tempComments')}
        </div>
    )}, {
      first: "Heart Rate",
      second: (
        <div>
          <div>
            <input className={cx(s.textInput, s.textInputShort)} type='text' {...heart} disabled={heartAccess.value} />per minute
          </div>
          {this.renderAssessWithComment('heartAccess', 'heartComment')}
        </div>
    )}, {
      first: "Oxygen Saturation",
      second: (
        <div>
          <div>
            <input className={cx(s.textInput, s.textInputShort)} type='text' {...oxygen} disabled={oxygenAccess.value} />
          </div>
          {this.renderAssessWithComment('oxygenAccess', 'oxygenComments')}
        </div>
    )}, {
      first: "Pain Score",
      second: (
        <div>
          <div>
            <input className={cx(s.textInput, s.textInputShort)} type='text' {...pain} disabled={painAccess.value} />
          </div>
          {this.renderAssessWithComment('painAccess', 'painComments')}
        </div>
    )}];

    return (
      <form className={s.documentationVitalSignsForm} onSubmit={handleSubmit(this.onFormSubmit)}>
        <h2>Vital Signs</h2>

        <div className={s.issueSetSection}>
          {this.renderIssueSet(firstSec)}
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
    'bpMin',
    'bpMax',
    'bpAccess',
    'bpComments',
    'glucose',
    'glucoseMg',
    'glucoseAccess',
    'glucoseComments',
    'temp',
    'tempAccess',
    'tempComments',
    'heart',
    'heartAccess',
    'heartComments',
    'oxygen',
    'oxygenAccess',
    'oxygenComments',
    'pain',
    'painAccess',
    'painComments',
  ],
  validate,
};

const mapStateToProps = (state, ownProps) => ({
  initialValues: Object.keys(ownProps.initialValues).length ? {
    ...ownProps.initialValues,
    glucoseMg: ownProps.initialValues.glucose && (ownProps.initialValues.glucose * 18).toFixed(1),
    bpAccess: !ownProps.initialValues.bpMin && !ownProps.initialValues.bpMax,
    glucoseAccess: !ownProps.initialValues.glucose,
    tempAccess: !ownProps.initialValues.temp,
    heartAccess: !ownProps.initialValues.heart,
    oxygenAccess: !ownProps.initialValues.oxygen,
    painAccess: !ownProps.initialValues.pain,
  } : {
    bpAccess: true,
    glucoseAccess: true,
    tempAccess: true,
    heartAccess: true,
    oxygenAccess: true,
    painAccess: true,
  },
});

const mapDispatchToProps = (dispatch) => ({
  resetForm: () => dispatch(reset('documentationVitalSignsForm')),
  changeFieldValue: (field, value) => dispatch(change('documentationVitalSignsForm', field, value)),
});

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(DocumentationVitalSignsForm);
