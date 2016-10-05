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


class DocumentationNGTForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      pHTestInterpretation: null,
    }
  }

  renderSelections = (choices) => {
    return Object.values(choices).map(choice => (
      <tr className={s.bodyRow} key={Object.values(choices).indexOf(choice)}>
        <td className={s.factorColumn}>
          <strong>{choice.title}</strong>{choice.subTitle && <br />}
          {choice.subTitle}
        </td>
        <td>
          {choice.items.map(item => (
            <div className={s.isActiveInput} key={choice.items.indexOf(item)}>
              <input type="radio" name={`${choice.name}_${item.value}`} id={`${choice.name}_${item.value}`} {...this.props.fields[choice.name]} value={item.value} checked={this.props.fields[choice.name].value === item.value} />
              <label htmlFor={`${choice.name}_${item.value}`}><span><span></span></span><span>{item.label}</span></label>
            </div>
          ))}
        </td>
      </tr>
    ))
  }

  renderRowsWith2Col = (questions) => {
    return questions.map(question => (
      <tr className={s.bodyRow}>
        <td className={s.factorColumn}>
          <strong>{question.title}</strong><br />
        </td>
        <td className={s.fieldContent}>
          {question.content}
        </td>
      </tr>
  ))}

  renderRowsWith4Col = (descriptions) => {
    return descriptions.map(des => (
      <tr className={s.bodyRow}>
        <td className={s.factorColumn}>
          <strong>{des.first}</strong><br />
        </td>
        <td className={s.fieldContent}>
          {des.second}
        </td>
        <td className={s.fieldContent}>
          {des.third}
        </td>
        <td className={s.fieldContent}>
          {des.forth}
        </td>
      </tr>
  ))}

  renderYesNoSwitch = (fieldValue) => (
    <div className={s.yesNoContainer}>
      <button
        className={cx('btn', s.yesNoInput, s.yesChoice, !!this.props.fields[fieldValue].value === true && s.yesCheck)}
        onClick={e => {
          e.preventDefault();
          this.props.changeFieldValue(fieldValue, true);
      }}>
        Yes
      </button>
      <button
        className={cx('btn', s.yesNoInput, s.noChoice, !!this.props.fields[fieldValue].value === false && s.noCheck)}
        onClick={e => {
          e.preventDefault();
          this.props.changeFieldValue(fieldValue, false);
      }}>
        No
      </button>
    </div>
  )

  renderIssues = (issues) => {
    return issues.map(issue => (
      <div key={issues.indexOf(issue)}>
        <label className={s.fieldTitle}><strong>{issue.first}</strong></label>
        <div className={s.fieldContent}>
          {issue.second}
        </div>
      </div>
    ))
  }

  onFormSubmit = (values) => {
    console.log('onFormSubmit', values);
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

    const firstChoices = [{
      title: 'Type of tube',
      name: 'tubeType',
      items: [
        {value: "1", label: (<span>Polyvinylchloride</span>)},
        {value: "2", label: (<span>Polyurethane</span>)},
        {value: "3", label: (<span>Silicon</span>)},
        {value: "4", label: (<span>Freka Tube</span>)},
      ]
    }, {
      title: 'Size of bore',
      name: 'boreSize',
      items: [
        {value: "1", label: (<span>12F</span>)},
        {value: "2", label: (<span>14F</span>)},
        {value: "3", label: (<span>16F</span>)},
        {value: "4", label: (<span>18F</span>)},
      ]
    }, {
      title: 'Nostril',
      name: 'nostril',
      items: [
        {value: "1", label: (<span>Left</span>)},
        {value: "2", label: (<span>Right</span>)},
      ]
    }];

    const secondChoices = [{
      title: 'pH Testing',
      subTitle: '***Patient receiving H2 receptor antagonist or with recent alkaline reflux from the intestine may have elevated gastric pH. Proton Pump Inhibitors and Histamine receptor blocking agents, such as Omeprazole and Famotidine, fail to decrease gastric pH to below 6.5 but tends to elevate gastric pH.',
      name: 'pHTesting',
      items: [
        {value: "1", label: (<span>&#60; 5 (gastric)</span>)},
        {value: "2", label: (<span>5 - 6 (Check visual characteristics of aspirates)</span>)},
        {value: "3", label: (<span>&#62; 6 (Intestinal or Respiratory)</span>)},
      ]
    }, {
      title: 'Appearance',
      name: 'appearance',
      items: [
        {value: "1", label: (<span>Gastric (Colourless (often with shreds of off-white to tan mucus or sediment), light yellow, brown, grassy green, curdled formula)</span>)},
        {value: "2", label: (<span>Intestinal (light to dark golden yellow)</span>)},
        {value: "3", label: (<span>Respiratory (pale (may consist of off white to tan sediment), straw coloured, watery)</span>)},
      ]
    }];

    const questions = [{
      title: "Gastric Aspirate Volumes",
      content: (<span>{this.renderYesNoSwitch('coiling')}</span>),
    }, {
      title: "Tape secured?",
      content: (<span>{this.renderYesNoSwitch('tapeSecure')}</span>),
    }, {
      title: "Intersection where the NGT enters the nostril marked?",
      content: (<span>{this.renderYesNoSwitch('intersection')}</span>),
    }, {
      title: "High risk of tube dislodgement?",
      content: (
        <MultiSelect
          className={s.multiSelect}
          options={tubeDislodgementChoice}
          {...tubeDislodgement}
        />
      ),
    }, {
      title: "Patient/family education given?",
      content: (<span>{this.renderYesNoSwitch('familyEducation')}</span>),
    }];

    const pHDescriptions = [{
      first: "< 5",
      second: (<span classname="s.colorGreen">Proceed to Feed</span>),
      third: (<span classname="s.colorRed">Please re-check</span>),
      forth: (<span classname="s.colorRed">Please re-check</span>),
    }, {
      first: "5 - 6",
      second: (<span classname="s.colorGreen">Proceed to Feed</span>),
      third: (<span classname="s.colorRed">Re-adjust tube and re-test</span>),
      forth: (<span>Check X-ray to confirm placement</span>),
    }, {
      first: "> 5",
      second: (<span>Check X-ray to confirm placement</span>),
      third: (<span classname="s.colorRed">Re-adjust tube and re-test</span>),
      forth: (<span classname="s.colorRed">Re-adjust tube and re-testRemove and re-insert tube</span>),
    }];

    const issues = [{
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
      <form className={s.documentationNGTForm} onFormSubmit={this.onFormSubmit}>
        <h2>Nasogastric Tube (NGT)</h2>

        <table className={s.overallTable}>
          <thead>
            <tr className={s.headerRow}>
              <td className={s.factorColumn}>Item</td>
              <td>Assessment</td>
            </tr>
          </thead>
          <tbody>
            {this.renderSelections(firstChoices)}

            <tr className={s.bodyRow}>
              <td className={s.factorColumn}>
                <strong>Gastric Aspirate Volumes</strong><br />
                Observe for changes in gastric aspirate volumes & look at trends
              </td>
              <td>
                <input className={s.numberInput} type='number' {...gastricVol} />
              </td>
            </tr>

            {this.renderSelections(secondChoices)}
          </tbody>
        </table>

        <h2>NGT Checklist</h2>

        <table className={s.overallTable}>
          <tbody>
            {this.renderRowsWith2Col(questions)}
          </tbody>
        </table>

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

        <table className={s.overallTable}>
          <thead>
            <tr className={s.headerRow}>
              <td className={s.factorColumn}>pH/Appearance</td>
              <td>Gastric</td>
              <td>Intestinal</td>
              <td>Respiratory</td>
            </tr>
          </thead>
          <tbody>
            {this.renderRowsWith4Col(pHDescriptions)}
          </tbody>
        </table>

        <div className={s.fieldSection}>
          {this.renderIssues(issues)}
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
