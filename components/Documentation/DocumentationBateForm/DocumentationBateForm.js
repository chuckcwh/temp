import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import s from './DocumentationBateForm.css';
import Container from '../../Container';
import Link from '../../Link';
import Header from '../../Header';
import history from '../../../core/history';
import { getUserName, configToName } from '../../../core/util';
import { getSession, showConfirmPopup, fetchServices } from '../../../actions';
import ConfirmPopup from '../../ConfirmPopup';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { reduxForm, addArrayValue, reset } from 'redux-form';
import MultiSelect from '../../MultiSelect';
import { Selections } from '../DocumentationModules/DocumentationModules';
// image
import wound_status from '../../../assets/images/wound_status.png';


class DocumentationBateForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      totalScore: null,
      interpretation: null,
    }
  }

  renderRowsWith2Col = (items) => {
    return items.map(item => (
      <tr className={s.bodyRow}>
        <td className={s.firstCol}>
          <strong>{item.first}</strong>
        </td>
        <td className={s.secondCol}>
          {item.second}
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
        // 1st sec
        woundSite,
        woundSiteText,
        woundType,
        woundTypeText,
        woundShape,
        woundShapeText,
        // 2nd sec
        size,
        depth,
        edges,
        undermining,
        necroticType,
        necroticAmount,
        exudateType,
        exudateAmount,
        skinColor,
        peripheralEdema,
        peripheralInduration,
        granulation,
        epithelialization,
        treatmentObj,
        solutionType,
        dressingType,
        outcome,
      },

      resetForm,
      invalid,
      handleSubmit,
      submitFailed,
      submitting,
    } = this.props;

    const { totalScore, interpretation } = this.state;
    const solutionTypeChoice = [{label: 'Protecting granulation/ephithelialisation', value: 'Protecting granulation/ephithelialisation'}, {label: 'Manage bacterial burden', value: 'Manage bacterial burden'}];
    const treatmentObjChoice = [{label: 'Normal Saline', value: 'Normal Saline'}, {label: 'Chlorhexidine', value: 'Chlorhexidine'}];

    const firstSec = [{
      first: "Location: Anatomic site",
      second: (
        <Selections
          fieldName="woundSite"
          field={woundSite}
          items={[
            {value: "1", label: (<span>Sacrum & Coccyx</span>)},
            {value: "2", label: (<span>Lateral Ankle</span>)},
            {value: "3", label: (<span>Trochanter</span>)},
            {value: "4", label: (<span>Medial Ankle</span>)},
            {value: "5", label: (<span>Ischial Tuberosity</span>)},
            {value: "6", label: (<span>Heel</span>)},
            {value: "7", label: (<span>Other site: <input type="text" {...woundSiteText} disabled={woundSite.value !== '7'} /></span>)},
          ]}
        />
    )}, {
      first: "Type of Wound",
      second: (
        <Selections
          fieldName="woundType"
          field={woundType}
          items={[
            {value: "1", label: (<span>Venous Ulcer</span>)},
            {value: "2", label: (<span>Arterial Ulcer</span>)},
            {value: "3", label: (<span>Diabetic Foot Ulcer</span>)},
            {value: "4", label: (<span>Cellulitis (Weeping)</span>)},
            {value: "5", label: (<span>Fungating Lesions</span>)},
            {value: "6", label: (<span>Surgical Wound</span>)},
            {value: "7", label: (<span>Burn/Scalds</span>)},
            {value: "8", label: (<span>Pressure Sore</span>)},
            {value: "9", label: (<span>Traumatic Wound</span>)},
            {value: "10", label: (<span>Others: <input type="text" {...woundTypeText} disabled={woundType.value !== '10'} /></span>)},
          ]}
        />
    )}, {
      first: "Shape: Overall wound pattern; assess by observing perimeter and depth",
      second: (
        <Selections
          fieldName="woundShape"
          field={woundShape}
          items={[
            {value: "1", label: (<span>Irregular</span>)},
            {value: "2", label: (<span>Linear or Elongated</span>)},
            {value: "3", label: (<span>Round/Oval</span>)},
            {value: "4", label: (<span>Bowl/Boat</span>)},
            {value: "5", label: (<span>Square/Rectangle</span>)},
            {value: "6", label: (<span>Butterfly</span>)},
            {value: "7", label: (<span>Other shape: <input type="text" {...woundShapeText} disabled={woundShape.value !== '7'} /></span>)},
          ]}
        />
    )}]

    const secondSec = [{
      first: "Size",
      second: (
        <Selections
          fieldName="size"
          field={size}
          items={[
            {value: "1", label: (<span>Length x width &#60; 4 sq cm</span>)},
            {value: "2", label: (<span>Length x width 4 - 16 sq cm</span>)},
            {value: "3", label: (<span>Length x width 16.1 - 36 sq cm</span>)},
            {value: "4", label: (<span>Length x width 36.1 - 80 sq cm</span>)},
            {value: "5", label: (<span>Length x width &#62; 80 sq cm</span>)},
          ]}
        />
    )}, {
      first: "Depth",
      second: (
        <Selections
          fieldName="depth"
          field={depth}
          items={[
            {value: "1", label: (<span>Non-blanchable erythema on intact skin</span>)},
            {value: "2", label: (<span>Partial thickness skin loss involving epidermis &/or dermis</span>)},
            {value: "3", label: (<span>Full thickness skin loss involving damage or necrosis of subcutaneous tissue; may extend down to but not through underlying fascia; &/or mixed partial & full thickness &/or tissue layers obscured by granulation tissue</span>)},
            {value: "4", label: (<span>Obscured by necrosis</span>)},
            {value: "5", label: (<span>Full thickness skin loss with extensive destruction, tissue necrosis or damage to muscle, bone or supporting structures</span>)},
          ]}
        />
    )}, {
      first: "Edges",
      second: (
        <Selections
          fieldName="edges"
          field={edges}
          items={[
            {value: "1", label: (<span>Indistinct, diffuse, none clearly visible</span>)},
            {value: "2", label: (<span>Distinct, outline clearly visible, attached, even with wound base</span>)},
            {value: "3", label: (<span>Well-defined, not attached to wound base</span>)},
            {value: "4", label: (<span>Well-defined, not attached to base, rolled under, thickened</span>)},
            {value: "5", label: (<span>Well-defined, fibrotic, scarred or hyperkeratotic</span>)},
          ]}
        />
    )}, {
      first: "Undermining",
      second: (
        <Selections
          fieldName="undermining"
          field={undermining}
          items={[
            {value: "1", label: (<span>None present</span>)},
            {value: "2", label: (<span>Undermining &#60; 2 cm in any area</span>)},
            {value: "3", label: (<span>Undermining 2 - 4 cm involving &#60; 50% wound margins</span>)},
            {value: "4", label: (<span>Undermining 2-4 cm involving &#62; 50% wound margins</span>)},
            {value: "5", label: (<span>Undermining &#62; 4 cm or Tunneling in any area</span>)},
          ]}
        />
    )}, {
      first: "Necrotic Tissue Type",
      second: (
        <Selections
          fieldName="necroticType"
          field={necroticType}
          items={[
            {value: "1", label: (<span>None visible</span>)},
            {value: "2", label: (<span>White/ Grey non-viable tissue &/or non-adherent yellow slough</span>)},
            {value: "3", label: (<span>Loosely adherent yellow slough</span>)},
            {value: "4", label: (<span>Adherent, soft, black eschar</span>)},
            {value: "5", label: (<span>Firmly adherent, hard, black eschar</span>)},
          ]}
        />
    )}, {
      first: "Necrotic Tissue Amount",
      second: (
        <Selections
          fieldName="necroticAmount"
          field={necroticAmount}
          items={[
            {value: "1", label: (<span>None visible</span>)},
            {value: "2", label: (<span>&#60; 25% of wound bed covered</span>)},
            {value: "3", label: (<span>25% to 50% of wound covered</span>)},
            {value: "4", label: (<span>&#60; 50% and &#62; 75% of wound covered</span>)},
            {value: "5", label: (<span>75% to 100% of wound covered</span>)},
          ]}
        />
    )}, {
      first: "Exudate Type",
      second: (
        <Selections
          fieldName="exudateType"
          field={exudateType}
          items={[
            {value: "1", label: (<span>None</span>)},
            {value: "2", label: (<span>Bloody</span>)},
            {value: "3", label: (<span>Serosanguineous: thin, watery, pale red/pink</span>)},
            {value: "4", label: (<span>Serous: thin, watery, clear</span>)},
            {value: "5", label: (<span>Purulent: thin or thick, opaque, tan/yellow, with or without odor</span>)},
          ]}
        />
    )}, {
      first: "Exudate Amount",
      second: (
        <Selections
          fieldName="exudateAmount"
          field={exudateAmount}
          items={[
            {value: "1", label: (<span>None, dry wound</span>)},
            {value: "2", label: (<span>Scant, wound moist but no observable exudate</span>)},
            {value: "3", label: (<span>Small</span>)},
            {value: "4", label: (<span>Moderate</span>)},
            {value: "5", label: (<span>Large</span>)},
          ]}
        />
    )}, {
      first: "Skin Color Surrounding Wound",
      second: (
        <Selections
          fieldName="skinColor"
          field={skinColor}
          items={[
            {value: "1", label: (<span>Pink or normal for ethnic group</span>)},
            {value: "2", label: (<span>Bright red &/or blanches to touch</span>)},
            {value: "3", label: (<span>White or grey pallor or hypopigmented</span>)},
            {value: "4", label: (<span>Dark red or purple &/or non-blanchable</span>)},
            {value: "5", label: (<span>Black or hyperpigmented</span>)},
          ]}
        />
    )}, {
      first: "Peripheral Tissue Edema",
      second: (
        <Selections
          fieldName="peripheralEdema"
          field={peripheralEdema}
          items={[
            {value: "1", label: (<span>No swelling or edema</span>)},
            {value: "2", label: (<span>Non-pitting edema extends &#60; 4 cm around wound</span>)},
            {value: "3", label: (<span>Non-pitting edema extends &#62; 4 cm around wound</span>)},
            {value: "4", label: (<span>Dark red or purple &/or non-blanchable</span>)},
            {value: "5", label: (<span>Black or hyperpigmented</span>)},
          ]}
        />
    )}, {
      first: "Peripheral Tissue Induration",
      second: (
        <Selections
          fieldName="peripheralInduration"
          field={peripheralInduration}
          items={[
            {value: "1", label: (<span>None present</span>)},
            {value: "2", label: (<span>Induration, &#60; 2 cm around wound</span>)},
            {value: "3", label: (<span>Induration 2 - 4 cm extending &#60; 50% around wound</span>)},
            {value: "4", label: (<span>Induration 2 - 4 cm extending &#62; 50% around wound</span>)},
            {value: "5", label: (<span>Induration &#62; 4 cm in any area around wound</span>)},
          ]}
        />
    )}, {
      first: "Granulation Tissue",
      second: (
        <Selections
          fieldName="granulation"
          field={granulation}
          items={[
            {value: "1", label: (<span>Skin intact or partial thickness wound</span>)},
            {value: "2", label: (<span>Bright, beefy red; 75% to 100% of wound filled &/or tissue overgrowth</span>)},
            {value: "3", label: (<span>Bright, beefy red; &#60; 75% & &#62; 25% of wound filled</span>)},
            {value: "4", label: (<span>Pink, &/or dull, dusky red &/or fills &#60; 25% of wound</span>)},
            {value: "5", label: (<span>No granulation tissue present</span>)},
          ]}
        />
    )}, {
      first: "Epithelialization",
      second: (
        <Selections
          fieldName="epithelialization"
          field={epithelialization}
          items={[
            {value: "1", label: (<span>100% wound covered, surface intact</span>)},
            {value: "2", label: (<span>75% to &#60; 100% wound covered &/or epithelial tissue extends &#62; 0.5cm into wound bed</span>)},
            {value: "3", label: (<span>50% to &#60; 75% wound covered &/or epithelial tissue extends to &#60; 0.5cm into wound bed</span>)},
            {value: "4", label: (<span>25% to &#60; 50% wound covered</span>)},
            {value: "5", label: (<span>&#60; 25% wound covered</span>)},
          ]}
        />
    )}];

    const thirdSec = [{
      first: "Treatment Objectives",
      second: (
        <MultiSelect
          className={s.multiSelect}
          options={treatmentObjChoice}
          {...treatmentObj}
        />
    )}, {
      first: "Type of solution used",
      second: (
        <MultiSelect
          className={s.multiSelect}
          options={solutionTypeChoice}
          {...solutionType}
        />
    )}, {
      first: "Type of dressing used",
      second: (
        <input className={s.textInput} type="text" {...dressingType} />
    )}, {
      first: "Outcome and Evaluation",
      second: (
        <textarea className={s.textareaInput} id="outcome" name="outcome" {...outcome} />
    )}];


    return (
      <form className={s.documentationBateForm} onSubmit={handleSubmit(this.props.onFormSubmit)}>
        <h2>Bate Jensen Wound Assessment & Intervention</h2>

        <table className={s.issueSetTable}>
          <tbody>
            {this.renderRowsWith2Col(firstSec)}
          </tbody>
        </table>

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

        <div className={s.statusSection}>
          <div>
            <div className={s.statusField}>
              <div>
                Total Score
                <div className={s.statusFieldTitle}>
                  {totalScore || 'N/A'}
                </div>
              </div>
            </div>
            <div className={s.statusField}>
              <div>
                Score Interpretation
                <div className={s.statusFieldTitle}>
                  {interpretation || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <img className={s.woundStatus} src={wound_status} />

        <div className={s.issueSetSection}>
          {this.renderIssueSet(thirdSec)}
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

DocumentationBateForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

const reduxFormConfig = {
  form: 'documentationBateForm',
  fields: [
    // 1st sec
    'woundSite',
    'woundSiteText',
    'woundType',
    'woundTypeText',
    'woundShape',
    'woundShapeText',
    // 2nd sec
    'size',
    'depth',
    'edges',
    'undermining',
    'necroticType',
    'necroticAmount',
    'exudateType',
    'exudateAmount',
    'skinColor',
    'peripheralEdema',
    'peripheralInduration',
    'granulation',
    'epithelialization',
    'treatmentObj',
    'solutionType',
    'dressingType',
    'outcome',
  ],
  validate,
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
  resetForm: () => dispatch(reset('documentationBateForm')),
});

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(DocumentationBateForm);
