import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import s from './DocumentationCatheterForm.css';
import Container from '../../Container';
import Link from '../../Link';
import Header from '../../Header';
import history from '../../../core/history';
import { getUserName, configToName } from '../../../core/util';
import { getSession, showConfirmPopup, fetchServices } from '../../../actions';
import ConfirmPopup from '../../ConfirmPopup';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { reduxForm, addArrayValue, reset, change } from 'redux-form';
import { YesNoSwitch, Selections } from '../DocumentationModules/DocumentationModules';


class DocumentationCatheterForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      interpretation: null,
    }
  }

  renderRowsWith2Col = (items) => {
    return items.map(item => (
      <tr className={s.bodyRow}>
        <td className={s.factorColumn}>
          <strong>{item.first}</strong>
        </td>
        <td className={s.fieldContent}>
          {item.second}
        </td>
      </tr>
  ))}

  renderIssueSet = (issues) => {
    return issues.map(issue => (
      <div key={issues.indexOf(issue)}>
        <label className={s.fieldTitle}><strong>{issue.first}</strong></label>
        <div className={s.fieldContent}>
          {issue.second}
        </div>
      </div>
    ))
  }

  renderYesNoSwitchWithComment = (fieldName) => (
    <span>
      <YesNoSwitch
        fieldName={fieldName}
        fieldInitValue={this.props.fields[fieldName].value}
        changeFieldValue={(field, onOff) => this.props.changeFieldValue(field, onOff)}
      />
      &nbsp;&nbsp;&nbsp;&nbsp;
      Comments:
      <textarea className={cx(s.textareaInput, s.textInputAfterSwitch)} type='text' {...this.props.fields[`${fieldName}Text`]} />
    </span>
  )

  onFormSubmit = (values) => {
    console.log('onFormSubmit', values);
  }


  render() {
    const {
      fields: {
        // catheter removal
        catheterType,
        catheterSize,
        patientFever,
        patientFeverText,
        ballon,
        ballonText,
        patientPain,
        patientPainText,
        bloodTrace,
        bloodTraceText,
        meatusAbnormal,
        meatusAbnormalText,
        catheterEncrustation,
        catheterEncrustationText,
        hematuriaUrine,
        hematuriaUrineText,
        badSmelling,
        badSmellingText,
        patientSentiment,
        patientSentimentText,
        // catheter insertion
        insertCatheterType,
        insertCatheterSize,
        insertPatientPain,
        insertBloodTrace,
        insertUrineDrainage,
        insertBalloonResist,
        insertLackOfMovement,
        // general
        familyEducation,
        reviewAcception,
        reviewImpact,
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
      first: "Type of catheter",
      second: (
        <Selections
          fieldName="catheterType"
          field={catheterType}
          items={[
            {value: "1", label: (<span>Plain latex</span>)},
            {value: "2", label: (<span>Silicon elastomer</span>)},
            {value: "3", label: (<span>Full silicon</span>)},
          ]}
        />
    )}, {
      first: "Size of catheter",
      second: (
        <Selections
          fieldName="catheterSize"
          field={catheterSize}
          items={[
            {value: "1", label: (<span>10</span>)},
            {value: "2", label: (<span>12</span>)},
            {value: "3", label: (<span>14</span>)},
            {value: "4", label: (<span>16</span>)},
            {value: "5", label: (<span>18</span>)},
          ]}
        />
    )}, {
      first: "Patient is having a fever",
      second: this.renderYesNoSwitchWithComment('patientFever'),
    }, {
      first: "Balloon cannot be emptied",
      second: this.renderYesNoSwitchWithComment('ballon'),
    }, {
      first: "Patient experiences pain",
      second: this.renderYesNoSwitchWithComment('patientPain'),
    }, {
      first: "Traces of blood observed",
      second: this.renderYesNoSwitchWithComment('bloodTrace'),
    }, {
      first: "Meatus or genital abnormalities observed, including discharge",
      second: this.renderYesNoSwitchWithComment('meatusAbnormal'),
    }, {
      first: "Encrustation at catheter tip",
      second: this.renderYesNoSwitchWithComment('catheterEncrustation'),
    }, {
      first: "Hematuria/cloudy/tea-looking urine observed",
      second: this.renderYesNoSwitchWithComment('hematuriaUrine'),
    }, {
      first: "Bad smelling observed",
      second: this.renderYesNoSwitchWithComment('badSmelling'),
    }, {
      first: "Patient has bad sentiments",
      second: this.renderYesNoSwitchWithComment('patientSentiment'),
    }];

    const secondSec = [{
      first: "Type of catheter",
      second: (
        <Selections
          fieldName="insertCatheterType"
          field={insertCatheterType}
          items={[
            {value: "1", label: (<span>Plain latex</span>)},
            {value: "2", label: (<span>Silicon elastomer</span>)},
            {value: "3", label: (<span>Full silicon</span>)},
          ]}
        />
    )}, {
      first: "Size of catheter",
      second: (
        <Selections
          fieldName="insertCatheterSize"
          field={insertCatheterSize}
          items={[
            {value: "1", label: (<span>10</span>)},
            {value: "2", label: (<span>12</span>)},
            {value: "3", label: (<span>14</span>)},
            {value: "4", label: (<span>16</span>)},
            {value: "5", label: (<span>18</span>)},
          ]}
        />
    )}, {
      first: "Patient complain of localised pain",
      second: this.renderYesNoSwitchWithComment('insertPatientPain'),
    }, {
      first: "Traces of blood observed",
      second: this.renderYesNoSwitchWithComment('insertBloodTrace'),
    }, {
      first: "Absence in urine drainage",
      second: this.renderYesNoSwitchWithComment('insertUrineDrainage'),
    }, {
      first: "Resistance to balloon inflation",
      second: this.renderYesNoSwitchWithComment('insertBalloonResist'),
    }, {
      first: "Lack of free movement of catheter once balloon inflated",
      second: this.renderYesNoSwitchWithComment('insertLackOfMovement'),
    }];

    const thirdSec = [{
      first: "Patient/ Family Education given?",
      second: (
        <YesNoSwitch
          fieldName='familyEducation'
          fieldInitValue={familyEducation.value}
          changeFieldValue={(field, onOff) => this.props.changeFieldValue(field, onOff)}
        />
      )
    }, {
      first: "Reviewed how the patient accepts the use of a catheter?",
      second: (
        <YesNoSwitch
          fieldName='reviewAcception'
          fieldInitValue={reviewAcception.value}
          changeFieldValue={(field, onOff) => this.props.changeFieldValue(field, onOff)}
        />
      )
    }, {
      first: "Reviewed the impact of the catheter on lifestyle and quality of life?",
      second: (
        <YesNoSwitch
          fieldName='reviewImpact'
          fieldInitValue={reviewImpact.value}
          changeFieldValue={(field, onOff) => this.props.changeFieldValue(field, onOff)}
        />
      )
    }];

    const forthSec = [{
      first: "Outcome and Evaluation",
      second: (<textarea className={s.textareaInput} type='text' {...outcome} />)
    }];

    return (
      <form className={s.documentationCatheterForm} onFormSubmit={this.onFormSubmit}>
        <h2>Catheter Removal</h2>

        <table className={s.overallTable}>
          <thead>
            <tr className={s.headerRow}>
              <td className={s.factorColumn}>Item</td>
              <td>Assessment</td>
            </tr>
          </thead>
          <tbody>
            {this.renderRowsWith2Col(firstSec)}
          </tbody>
        </table>

        <h2>Catheter Insertion</h2>

        <table className={s.overallTable}>
          <thead>
            <tr className={s.headerRow}>
              <td className={s.factorColumn}>Item</td>
              <td>Assessment</td>
            </tr>
          </thead>
          <tbody>
            {this.renderRowsWith2Col(secondSec)}
          </tbody>
        </table>

        <div className={s.fieldSection}>
          {this.renderIssueSet(thirdSec)}
        </div>

        <div className={s.statusSection}>
          <div className={s.statusField}>
            <div>
              Interpretation
              <div className={s.statusFieldTitle}>
                {interpretation || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        <div className={s.fieldSection}>
          {this.renderIssueSet(forthSec)}
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

DocumentationCatheterForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

const reduxFormConfig = {
  form: 'documentationCatheterForm',
  fields: [
    // catheter removal
    'catheterType',
    'catheterSize',
    'patientFever',
    'patientFeverText',
    'ballon',
    'ballonText',
    'patientPain',
    'patientPainText',
    'bloodTrace',
    'bloodTraceText',
    'meatusAbnormal',
    'meatusAbnormalText',
    'catheterEncrustation',
    'catheterEncrustationText',
    'hematuriaUrine',
    'hematuriaUrineText',
    'badSmelling',
    'badSmellingText',
    'patientSentiment',
    'patientSentimentText',
    // catheter insertion
    'insertCatheterType',
    'insertCatheterSize',
    'insertPatientPain',
    'insertBloodTrace',
    'insertUrineDrainage',
    'insertBalloonResist',
    'insertLackOfMovement',
    // general
    'familyEducation',
    'reviewAcception',
    'reviewImpact',
    'outcome',
  ],
  validate,
}

const mapStateToProps = (state) => ({
  // initialValues: {
  //   patientFever: true,
  // },
});

const mapDispatchToProps = (dispatch) => ({
  resetForm: () => dispatch(reset('documentationCatheterForm')),
  changeFieldValue: (field, value) => dispatch(change('documentationNGTForm', field, value)),
});

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(DocumentationCatheterForm);
