import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import s from './DocumentationCatheterForm.css';
import Container from '../../Container';
import Link from '../../Link';
import Header from '../../Header';
import { getUserName, configToName } from '../../../core/util';
import { getSession, showConfirmPopup, fetchServices } from '../../../actions';
import ConfirmPopup from '../../ConfirmPopup';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { reduxForm, addArrayValue, reset, change } from 'redux-form';
import { YesNoSwitch, Selections } from '../DocumentationModules/DocumentationModules';
// react-icons
import FaArrowCircleRight from 'react-icons/lib/fa/arrow-right';


class DocumentationCatheterForm extends Component {

  renderRowsWith2Col = (items) => {
    return items.map((item, index) => (
      <tr key={index} className={s.bodyRow}>
        <td className={s.firstCol}>
          <strong>{item.first}</strong>
        </td>
        <td className={s.secondCol}>
          {item.second}
        </td>
      </tr>
  ))}

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

  renderYesNoSwitchWithComment = (fieldName, field) => (
    <span>
      <YesNoSwitch
        fieldName={fieldName}
        field={field}
        changeFieldValue={(field, onOff) => this.props.changeFieldValue(field, onOff)}
      />
      <div className={s.textContainerAfterSwitch}>
        <span className={s.title}>Comments:</span>
        <textarea className={cx(s.textareaInput, s.input)} type='text' {...this.props.fields[`${fieldName}Comments`]} />
      </div>
    </span>
  )

  render() {
    const {
      fields: {
        // catheter removal
        catTypeR,
        catSizeR,
        fever,
        feverComments,
        empty,
        emptyComments,
        painR,
        painRComments,
        bloodR,
        bloodRComments,
        discharge,
        dischargeComments,
        encrustation,
        encrustationComments,
        cloudy,
        cloudyComments,
        smell,
        smellComments,
        sentiments,
        sentitmentsComments,
        // catheter insertion
        catTypeI,
        catSizeI,
        painI,
        painIComments,
        bloodI,
        bloodIComments,
        drainage,
        drainageComments,
        inflation,
        inflationComments,
        movement,
        movementComments,
        // general
        education,
        accept,
        impact,
        outcome,
      },

      resetForm,
      invalid,
      handleSubmit,
      submitFailed,
      submitting,
    } = this.props;

    const firstSec = [{
      first: "Type of catheter",
      second: (
        <Selections
          fieldName="catTypeR"
          field={catTypeR}
          items={[
            {value: "Plain latex", label: (<span>Plain latex</span>)},
            {value: "Silicon elastomer", label: (<span>Silicon elastomer</span>)},
            {value: "Full silicon", label: (<span>Full silicon</span>)},
          ]}
        />
    )}, {
      first: "Size of catheter",
      second: (
        <Selections
          fieldName="catSizeR"
          field={catSizeR}
          items={[
            {value: "10", label: (<span>10</span>)},
            {value: "12", label: (<span>12</span>)},
            {value: "14", label: (<span>14</span>)},
            {value: "16", label: (<span>16</span>)},
            {value: "18", label: (<span>18</span>)},
          ]}
        />
    )}, {
      first: "Patient is having a fever",
      second: this.renderYesNoSwitchWithComment('fever', fever),
    }, {
      first: "Balloon cannot be emptied",
      second: this.renderYesNoSwitchWithComment('empty', empty),
    }, {
      first: "Patient experiences pain",
      second: this.renderYesNoSwitchWithComment('painR', painR),
    }, {
      first: "Traces of blood observed",
      second: this.renderYesNoSwitchWithComment('bloodR', bloodR),
    }, {
      first: "Meatus or genital abnormalities observed, including discharge",
      second: this.renderYesNoSwitchWithComment('discharge', discharge),
    }, {
      first: "Encrustation at catheter tip",
      second: this.renderYesNoSwitchWithComment('encrustation', encrustation),
    }, {
      first: "Hematuria/cloudy/tea-looking urine observed",
      second: this.renderYesNoSwitchWithComment('cloudy', cloudy),
    }, {
      first: "Bad smelling observed",
      second: this.renderYesNoSwitchWithComment('smell', smell),
    }, {
      first: "Patient has bad sentiments",
      second: this.renderYesNoSwitchWithComment('sentiments', sentiments),
    }];

    const secondSec = [{
      first: "Type of catheter",
      second: (
        <Selections
          fieldName="catTypeI"
          field={catTypeI}
          items={[
            {value: "Plain latex", label: (<span>Plain latex</span>)},
            {value: "Silicon elastomer", label: (<span>Silicon elastomer</span>)},
            {value: "Full silicon", label: (<span>Full silicon</span>)},
          ]}
        />
    )}, {
      first: "Size of catheter",
      second: (
        <Selections
          fieldName="catSizeI"
          field={catSizeI}
          items={[
            {value: "10", label: (<span>10</span>)},
            {value: "12", label: (<span>12</span>)},
            {value: "14", label: (<span>14</span>)},
            {value: "16", label: (<span>16</span>)},
            {value: "18", label: (<span>18</span>)},
          ]}
        />
    )}, {
      first: "Patient complain of localised pain",
      second: this.renderYesNoSwitchWithComment('painI', painI),
    }, {
      first: "Traces of blood observed",
      second: this.renderYesNoSwitchWithComment('bloodI', bloodI),
    }, {
      first: "Absence in urine drainage",
      second: this.renderYesNoSwitchWithComment('drainage', drainage),
    }, {
      first: "Resistance to balloon inflation",
      second: this.renderYesNoSwitchWithComment('inflation', inflation),
    }, {
      first: "Lack of free movement of catheter once balloon inflated",
      second: this.renderYesNoSwitchWithComment('movement', movement),
    }];

    const thirdSec = [{
      first: "Patient/ Family Education given?",
      second: (
        <YesNoSwitch
          fieldName='education'
          field={education}
          changeFieldValue={(field, onOff) => this.props.changeFieldValue(field, onOff)}
        />
      )
    }, {
      first: "Reviewed how the patient accepts the use of a catheter?",
      second: (
        <YesNoSwitch
          fieldName='accept'
          field={accept}
          changeFieldValue={(field, onOff) => this.props.changeFieldValue(field, onOff)}
        />
      )
    }, {
      first: "Reviewed the impact of the catheter on lifestyle and quality of life?",
      second: (
        <YesNoSwitch
          fieldName='impact'
          field={impact}
          changeFieldValue={(field, onOff) => this.props.changeFieldValue(field, onOff)}
        />
      )
    }];

    const forthSec = [{
      first: "Outcome and Evaluation",
      second: (<textarea className={s.textareaInput} type='text' {...outcome} />)
    }];

    return (
      <form className={s.documentationCatheterForm} onSubmit={handleSubmit(this.props.onFormSubmit)}>
        <h2>Catheter Removal</h2>

        <table className={s.issueSetTable}>
          <thead>
            <tr className={s.headerRow}>
              <td className={s.firstCol}>Item</td>
              <td>Assessment</td>
            </tr>
          </thead>
          <tbody>
            {this.renderRowsWith2Col(firstSec)}
          </tbody>
        </table>

        <h2>Catheter Insertion</h2>

        <table className={s.issueSetTable}>
          <thead>
            <tr className={s.headerRow}>
              <td className={s.firstCol}>Item</td>
              <td>Assessment</td>
            </tr>
          </thead>
          <tbody>
            {this.renderRowsWith2Col(secondSec)}
          </tbody>
        </table>

        <div className={s.issueSetSection}>
          {this.renderIssueSet(thirdSec)}
        </div>

        <div className={s.statusSection}>
          <div className={s.statusField}>
            <div>
              Interpretation
              <div className={s.statusFieldTitle}>
                {(!fever.value &&
                  !empty.value &&
                  !(painR.value || painI.value) &&
                  !(bloodR.value || bloodI.value) &&
                  !(discharge.value) &&
                  !(encrustation.value) &&
                  !(cloudy.value || smell.value || sentiments.value) &&
                  !(catTypeI.value) &&
                  !(drainage.value) &&
                  !(inflation.value)
                ) ? ('N/A') : (
                  <ul>
                    {fever.value && <li><b>Fever:</b> Please refer to a doctor if it has not been done so or antibiotics not prescribed.</li>}
                    {empty.value && <li><b>Balloon:</b> Push in another 1 ml of Water of Injection. Please refer to A&amp;E.</li>}
                    {(painR.value || painI.value) && <li><b>Pain:</b> Please monitor. Consider smaller sized catheter/repositioning/refer to a doctor.</li>}
                    {(bloodR.value || bloodI.value) && <li><b>Blood:</b> Please monitor. If blood persists, to refer to A&amp;E.</li>}
                    {discharge.value && <li><b>Discharge:</b> May consider a silicon catheter due to irritation by the catheter. May go away after awhile.</li>}
                    {encrustation.value && <li><b>Encrustation:</b> May consider washing meatus daily with soap and water. Strict compliance to cleaniless. If repeated encrustation, please refer to a doctor.</li>}
                    {(cloudy.value || smell.value || sentiments.value) && <li><b>UTI:</b> Teach correct catheter care/ discuss personal hygiene/ monitor/ refer to a doctor. </li>}
                    {catTypeI.value === 'Plain latex' && <li><b>Plain latex catheter:</b> Recommended to change in 2 weeks, subjected to catheter prior condition.</li>}
                    {catTypeI.value === 'Silicon elastomer' && <li><b>Silicon elastomer catheter:</b> Recommended to change in 4 weeks, subjected to catheter prior condition.</li>}
                    {catTypeI.value === 'Full silicon' && <li><b>Full silicon catheter:</b> Recommended to change in 3 months, subjected to catheter prior condition.</li>}
                    {drainage.value && <li><b>No Urine:</b> Wait a little, push gently down on the bladder or reposition patient. May consider flushing the catheter with a few cc&#39;s of NaCL 0.9%. If nothing else helps, replace catheter. </li>}
                    {inflation.value && <li><b>Resistance to inflation:</b> Advance further.</li>}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={s.issueSetSection}>
          {this.renderIssueSet(forthSec)}
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
    'catTypeR',
    'catSizeR',
    'fever',
    'feverComments',
    'empty',
    'emptyComments',
    'painR',
    'painRComments',
    'bloodR',
    'bloodRComments',
    'discharge',
    'dischargeComments',
    'encrustation',
    'encrustationComments',
    'cloudy',
    'cloudyComments',
    'smell',
    'smellComments',
    'sentiments',
    'sentitmentsComments',
    // catheter insertion
    'catTypeI',
    'catSizeI',
    'painI',
    'painIComments',
    'bloodI',
    'bloodIComments',
    'drainage',
    'drainageComments',
    'inflation',
    'inflationComments',
    'movement',
    'movementComments',
    // general
    'education',
    'accept',
    'impact',
    'outcome',
  ],
  validate,
}

const mapStateToProps = (state, ownProps) => ({
  initialValues: Object.keys(ownProps.initialValues).length ? ownProps.initialValues : {
    fever: false,
    empty: false,
    painR: false,
    bloodR: false,
    discharge: false,
    encrustation: false,
    cloudy: false,
    smell: false,
    sentiments: false,
    painI: false,
    bloodI: false,
    drainage: false,
    inflation: false,
    movement: false,
    education: false,
    accept: false,
    impact: false,
  }
});

const mapDispatchToProps = (dispatch) => ({
  resetForm: () => dispatch(reset('documentationCatheterForm')),
  changeFieldValue: (field, value) => dispatch(change('documentationCatheterForm', field, value)),
});

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(DocumentationCatheterForm);
