import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import s from './DocumentationNGTForm.css';
import Container from '../../Container';
import Link from '../../Link';
import Header from '../../Header';
import history from '../../../core/history';
import { getUserName, configToName } from '../../../core/util';
import { getSession, showConfirmPopup, fetchServices } from '../../../actions';
import ConfirmPopup from '../../ConfirmPopup';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { reduxForm, addArrayValue, reset, change } from 'redux-form';
import MultiSelect from '../../MultiSelect';
import { YesNoSwitch, Selections } from '../DocumentationModules/DocumentationModules';


class DocumentationNGTForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      pHTestInterpretation: null,
    }
  }

  renderRowsWith2Col = (items) => {
    return items.map(item => (
      <tr className={s.bodyRow}>
        <td className={s.firstCol}>
          <strong>{item.first}</strong>{item.firstSub && <br />}
          {item.firstSub}
        </td>
        <td className={s.fieldContent}>
          {item.second}
        </td>
      </tr>
  ))}

  renderRowsWith4Col = (items) => {
    return items.map(item => (
      <tr className={s.bodyRow}>
        <td className={s.firstCol}>
          <strong>{item.first}</strong>
        </td>
        <td className={s.secondCol}>
          {item.second}
        </td>
        <td className={s.thirdCol}>
          {item.third}
        </td>
        <td className={s.forthCol}>
          {item.forth}
        </td>
      </tr>
  ))}

  renderIssueSet = (issues) => {
    return issues.map(issue => (
      <div key={issues.indexOf(issue)}>
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
        // NGT
        tubeType,
        boreSize,
        nostril,
        gastricVol,
        pHTesting,
        appearance,
        // NGT checklist
        coiling,
        tapeSecure,
        intersection,
        tubeDislodgement,
        familyEducation,
        // textarea
        eventWhenInsert,
        outcome,
      },

      resetForm,
      invalid,
      handleSubmit,
      submitFailed,
      submitting,
    } = this.props;

    const { pHTestInterpretation } = this.state;
    const tubeDislodgementChoice = [{label: 'Retching', value: 'Retching'}, {label: 'Agitated', value: 'Agitated'}];

    const firstSec = [{
      first: "Type of tube",
      second: (
        <Selections
          fieldName="tubeType"
          field={tubeType}
          items={[
            {value: "1", label: (<span>Polyvinylchloride</span>)},
            {value: "2", label: (<span>Polyurethane</span>)},
            {value: "3", label: (<span>Silicon</span>)},
            {value: "4", label: (<span>Freka Tube</span>)},
          ]}
        />
    )}, {
      first: "Size of bore",
      second: (
        <Selections
          fieldName="boreSize"
          field={boreSize}
          items={[
            {value: "1", label: (<span>12F</span>)},
            {value: "2", label: (<span>14F</span>)},
            {value: "3", label: (<span>16F</span>)},
            {value: "4", label: (<span>18F</span>)},
          ]}
        />
    )}, {
      first: "Nostril",
      second: (
        <Selections
          fieldName="nostril"
          field={nostril}
          items={[
            {value: "1", label: (<span>Left</span>)},
            {value: "2", label: (<span>Right</span>)},
          ]}
        />
    )}, {
      first: "Gastric Aspirate Volumes ",
      firstSub: "Observe for changes in gastric aspirate volumes & look at trends",
      second: (
        <input className={s.numberInput} type='number' {...gastricVol} />
    )}, {
      first: "pH Testing",
      firstSub: "***Patient receiving H2 receptor antagonist or with recent alkaline reflux from the intestine may have elevated gastric pH. Proton Pump Inhibitors and Histamine receptor blocking agents, such as Omeprazole and Famotidine, fail to decrease gastric pH to below 6.5 but tends to elevate gastric pH.",
      second: (
        <Selections
          fieldName="pHTesting"
          field={pHTesting}
          items={[
            {value: "1", label: (<span>&#60; 5 (gastric)</span>)},
            {value: "2", label: (<span>5 - 6 (Check visual characteristics of aspirates)</span>)},
            {value: "3", label: (<span>&#62; 6 (Intestinal or Respiratory)</span>)},
          ]}
        />
    )}, {
      first: "Appearance",
      second: (
        <Selections
          fieldName="appearance"
          field={appearance}
          items={[
            {value: "1", label: (<span>Gastric (Colourless (often with shreds of off-white to tan mucus or sediment), light yellow, brown, grassy green, curdled formula)</span>)},
            {value: "2", label: (<span>Intestinal (light to dark golden yellow)</span>)},
            {value: "3", label: (<span>Respiratory (pale (may consist of off white to tan sediment), straw coloured, watery)</span>)},
          ]}
        />
    )}];

    const secondSec = [{
      first: "Absence of coiling",
      second: (
        <YesNoSwitch
          fieldName='coiling'
          field={coiling}
          changeFieldValue={(field, onOff) => this.props.changeFieldValue(field, onOff)}
        />
    )}, {
      first: "Tape secured?",
      second: (
        <YesNoSwitch
          fieldName='tapeSecure'
          field={tapeSecure}
          changeFieldValue={(field, onOff) => this.props.changeFieldValue(field, onOff)}
        />
    )}, {
      first: "Intersection where the NGT enters the nostril marked?",
      second: (
        <YesNoSwitch
          fieldName='intersection'
          field={intersection}
          changeFieldValue={(field, onOff) => this.props.changeFieldValue(field, onOff)}
        />
    )}, {
      first: "High risk of tube dislodgement?",
      second: (
        <MultiSelect
          className={s.multiSelect}
          options={tubeDislodgementChoice}
          {...tubeDislodgement}
        />
    )}, {
      first: "Patient/family education given?",
      second: (
        <YesNoSwitch
          fieldName='familyEducation'
          field={familyEducation}
          changeFieldValue={(field, onOff) => this.props.changeFieldValue(field, onOff)}
        />
    )}];

    const thirdSec = [{
      first: "< 5",
      second: (<span className="s.colorGreen">Proceed to Feed</span>),
      third: (<span className="s.colorRed">Please re-check</span>),
      forth: (<span className="s.colorRed">Please re-check</span>),
    }, {
      first: "5 - 6",
      second: (<span className="s.colorGreen">Proceed to Feed</span>),
      third: (<span className="s.colorRed">Re-adjust tube and re-test</span>),
      forth: (<span>Check X-ray to confirm placement</span>),
    }, {
      first: "> 5",
      second: (<span>Check X-ray to confirm placement</span>),
      third: (<span className="s.colorRed">Re-adjust tube and re-test</span>),
      forth: (<span className="s.colorRed">Re-adjust tube and re-testRemove and re-insert tube</span>),
    }];

    const forthSec = [{
      first: "Were there any significant events when inserting the NGT (If applicable)?",
      second: (
        <textarea className={s.textareaInput} id="eventWhenInsert" name="eventWhenInsert" {...eventWhenInsert} />
      )
    }, {
      first: "Outcome and Evaluation",
      second: (
        <textarea className={s.textareaInput} id="outcome" name="outcome" {...outcome} />
      )
    }]

    return (
      <form className={s.documentationNGTForm} onSubmit={handleSubmit(this.props.onFormSubmit)}>
        <h2>Nasogastric Tube (NGT)</h2>

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

        <h2>NGT Checklist</h2>

        <div className={s.issueSetSection}>
          {this.renderIssueSet(secondSec)}
        </div>

        <div className={s.statusSection}>
          <div className={s.statusField}>
            <div>
              pH Test Interpretation
              <div className={s.statusFieldTitle}>
                {pHTestInterpretation || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        <table className={s.issueSetTable}>
          <thead>
            <tr className={s.headerRow}>
              <td className={s.firstCol}>pH/Appearance</td>
              <td>Gastric</td>
              <td>Intestinal</td>
              <td>Respiratory</td>
            </tr>
          </thead>
          <tbody>
            {this.renderRowsWith4Col(thirdSec)}
          </tbody>
        </table>

        <div className={s.issueSetSection}>
          {this.renderIssueSet(forthSec)}
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

DocumentationNGTForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

const reduxFormConfig = {
  form: 'documentationNGTForm',
  fields: [
    // NGT
    'tubeType',
    'boreSize',
    'nostril',
    'gastricVol',
    'pHTesting',
    'appearance',
    // NGT checklist
    'coiling',
    'tapeSecure',
    'intersection',
    'tubeDislodgement',
    'familyEducation',
    // textarea
    'eventWhenInsert',
    'outcome',
  ],
  validate,
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
  resetForm: () => dispatch(reset('documentationNGTForm')),
  changeFieldValue: (field, value) => dispatch(change('documentationNGTForm', field, value)),
});

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(DocumentationNGTForm);
