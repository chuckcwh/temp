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
// react-icons
import FaArrowCircleRight from 'react-icons/lib/fa/arrow-right';


class DocumentationNGTForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      interpretation: null,
    }
  }

  renderRowsWith2Col = (items) => {
    return items.map((item, index) => (
      <tr key={index} className={s.bodyRow}>
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
    return items.map((item, index) => (
      <tr key={index} className={s.bodyRow}>
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
    return issues.map((issue, index) => (
      <div key={index}>
        <label className={s.issueTitle}><strong>{issue.first}</strong></label>
        <div className={s.issueContent}>
          {issue.second}
        </div>
      </div>
    ))
  }

  componentWillReceiveProps(nextProps) {
    const {
      ph,
      appearance,
      volume,
    } = nextProps.fields;
    let interpretation;

    if (ph.value === '<5' && appearance.value === 'Gastric') {
      interpretation = (<span className={s.green}>Proceed to Feed</span>)
    } else if (ph.value === '5-6' && appearance.value === 'Gastric') {
      interpretation = (<span className={s.green}>Proceed to Feed</span>)
    } else if (ph.value === '>6' && appearance.value === 'Gastric') {
      interpretation = (<span>Check X-ray to confirm placement</span>)
    } else if (ph.value === '<5' && appearance.value === 'Intestinal') {
      interpretation = (<span className={s.red}>Please Re-check</span>)
    } else if (ph.value === '5-6' && appearance.value === 'Intestinal') {
      interpretation = (<span className={s.red}>Re-adjust tube and Re-test</span>)
    } else if (ph.value === '>6' && appearance.value === 'Intestinal') {
      interpretation = (<span className={s.red}>Re-adjust tube and Re-test</span>)
    } else if (ph.value === '<5' && appearance.value === 'Respiratory') {
      interpretation = (<span className={s.red}>Please Re-check</span>)
    } else if (ph.value === '5-6' && appearance.value === 'Respiratory') {
      interpretation = (<span>Check X-ray to confirm placement</span>)
    } else if (ph.value === '>6' && appearance.value === 'Respiratory') {
      interpretation = (<span className={s.red}>Remove and re-insert tube</span>)
    } else {
      interpretation = "N/A";
    }

    if (volume.value === 0) {
      interpretation = (<span>Reposition Patient for 10-15 mins/ Check X-ray to confirm placement</span>)
    }

    return this.setState({ interpretation });
  }

  render() {
    const {
      fields: {
        // NGT
        tubeType,
        tubeSize,
        nostril,
        volume,
        ph,
        appearance,
        // NGT checklist
        coiling,
        taped,
        marked,
        dislodgement,
        education,
        // textarea
        event,
        outcome,
      },

      resetForm,
      invalid,
      handleSubmit,
      submitFailed,
      submitting,
    } = this.props;

    const { interpretation } = this.state;
    const dislodgementChoice = [{label: 'Retching', value: 'Retching'}, {label: 'Agitated', value: 'Agitated'}];

    const firstSec = [{
      first: "Type of tube",
      second: (
        <Selections
          fieldName="tubeType"
          field={tubeType}
          items={[
            {value: "Polyvinylchloride", label: (<span>Polyvinylchloride</span>)},
            {value: "Polyurethane", label: (<span>Polyurethane</span>)},
            {value: "Silicon", label: (<span>Silicon</span>)},
            {value: "Freka Tube", label: (<span>Freka Tube</span>)},
          ]}
        />
    )}, {
      first: "Size of bore",
      second: (
        <Selections
          fieldName="tubeSize"
          field={tubeSize}
          items={[
            {value: "12F", label: (<span>12F</span>)},
            {value: "14F", label: (<span>14F</span>)},
            {value: "16F", label: (<span>16F</span>)},
            {value: "18F", label: (<span>18F</span>)},
          ]}
        />
    )}, {
      first: "Nostril",
      second: (
        <Selections
          fieldName="nostril"
          field={nostril}
          items={[
            {value: "Left", label: (<span>Left</span>)},
            {value: "Right", label: (<span>Right</span>)},
          ]}
        />
    )}, {
      first: "Gastric Aspirate Volumes ",
      firstSub: "Observe for changes in gastric aspirate volumes & look at trends",
      second: (
        <div>
          <input className={s.numberInput} type='number' {...volume} /> /mls
        </div>
    )}, {
      first: "pH Testing",
      firstSub: "***Patient receiving H2 receptor antagonist or with recent alkaline reflux from the intestine may have elevated gastric pH. Proton Pump Inhibitors and Histamine receptor blocking agents, such as Omeprazole and Famotidine, fail to decrease gastric pH to below 6.5 but tends to elevate gastric pH.",
      second: (
        <Selections
          fieldName="ph"
          field={ph}
          items={[
            {value: "<5", label: (<span>&#60; 5 (gastric)</span>)},
            {value: "5-6", label: (<span>5 - 6 (Check visual characteristics of aspirates)</span>)},
            {value: ">6", label: (<span>&#62; 6 (Intestinal or Respiratory)</span>)},
          ]}
        />
    )}, {
      first: "Appearance",
      second: (
        <Selections
          fieldName="appearance"
          field={appearance}
          items={[
            {value: "Gastric", label: (<span>Gastric (Colourless (often with shreds of off-white to tan mucus or sediment), light yellow, brown, grassy green, curdled formula)</span>)},
            {value: "Intestinal", label: (<span>Intestinal (light to dark golden yellow)</span>)},
            {value: "Respiratory", label: (<span>Respiratory (pale (may consist of off white to tan sediment), straw coloured, watery)</span>)},
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
          fieldName='taped'
          field={taped}
          changeFieldValue={(field, onOff) => this.props.changeFieldValue(field, onOff)}
        />
    )}, {
      first: "Intersection where the NGT enters the nostril marked?",
      second: (
        <YesNoSwitch
          fieldName='marked'
          field={marked}
          changeFieldValue={(field, onOff) => this.props.changeFieldValue(field, onOff)}
        />
    )}, {
      first: "High risk of tube dislodgement?",
      second: (
        <MultiSelect
          className={s.multiSelect}
          options={dislodgementChoice}
          {...dislodgement}
        />
    )}, {
      first: "Patient/family education given?",
      second: (
        <YesNoSwitch
          fieldName='education'
          field={education}
          changeFieldValue={(field, onOff) => this.props.changeFieldValue(field, onOff)}
        />
    )}];

    const thirdSec = [{
      first: "< 5",
      second: (<span className={s.green}>Proceed to Feed</span>),
      third: (<span className={s.red}>Please re-check</span>),
      forth: (<span className={s.red}>Please re-check</span>),
    }, {
      first: "5 - 6",
      second: (<span className={s.green}>Proceed to Feed</span>),
      third: (<span className={s.red}>Re-adjust tube and re-test</span>),
      forth: (<span>Check X-ray to confirm placement</span>),
    }, {
      first: "> 5",
      second: (<span>Check X-ray to confirm placement</span>),
      third: (<span className={s.red}>Re-adjust tube and re-test</span>),
      forth: (<span className={s.red}>Re-adjust tube and re-testRemove and re-insert tube</span>),
    }];

    const forthSec = [{
      first: "Were there any significant events when inserting the NGT (If applicable)?",
      second: (
        <textarea className={s.textareaInput} id="event" name="event" {...event} placeholder="Eg." />
      )
    }, {
      first: "Outcome and Evaluation",
      second: (
        <textarea className={s.textareaInput} id="outcome" name="outcome" {...outcome} placeholder="Eg." />
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
                {interpretation || 'N/A'}
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
    'tubeSize',
    'nostril',
    'volume',
    'ph',
    'appearance',
    // NGT checklist
    'coiling',
    'taped',
    'marked',
    'dislodgement',
    'education',
    // textarea
    'event',
    'outcome',
  ],
  validate,
}

const mapStateToProps = (state, ownProps) => ({
  // initialValues: Object.keys(ownProps.initialValues).length && {
  //   ...ownProps.initialValues,
  //   dislodgement: ownProps.initialValues.dislodgement,
  // }
});

const mapDispatchToProps = (dispatch) => ({
  resetForm: () => dispatch(reset('documentationNGTForm')),
  changeFieldValue: (field, value) => dispatch(change('documentationNGTForm', field, value)),
});

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(DocumentationNGTForm);
