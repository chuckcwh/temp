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
// react-icons
import FaArrowCircleRight from 'react-icons/lib/fa/arrow-right';

class DocumentationBateForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      totalScore: null,
      interpretation: null,
    }
  }

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

  componentWillReceiveProps(nextProps) {
    const {
      size,
      depth,
      edges,
      undermining,
      tissueType,
      tissueAmt,
      exudateType,
      exudateAmt,
      color,
      tissueEdema,
      tissueInduration,
      granulationTissue,
      epithelialization,
    } = nextProps.fields;
    let sum;
    let interpretation;

    if (size.value && depth.value && edges.value && undermining.value && tissueType.value && tissueAmt.value && exudateType.value && exudateAmt.value && color.value && tissueEdema.value && tissueInduration.value && granulationTissue.value && epithelialization.value ) {
      sum = +size.value + +depth.value + +edges.value + +undermining.value + +tissueType.value + +tissueAmt.value + +exudateType.value + +exudateAmt.value + +color.value + +tissueEdema.value + +tissueInduration.value + +granulationTissue.value + +epithelialization.value;
      if (sum < 21) {
        interpretation = (<span className={s.green}>Minimal Severity</span>)
      } else if (sum < 31) {
        interpretation = (<span className={s.orange}>Mild Severity</span>)
      } else if (sum < 41) {
        interpretation = (<span className={s.orange}>Moderate Severity</span>)
      } else {
        interpretation = (<span className={s.red}>Extreme Severity</span>)
      }
    }

    return this.setState({
      totalScore: sum && `${sum} / 65`,
      interpretation,
    })
  }

  onFormSubmit = (values) => {
    console.log('onFormSubmit', values);

    const toNum = (items) => {
      items.map(item => {
        values[item] = values[item] && +values[item];
      })
    }
    toNum(['size', 'depth', 'edges', 'undermining', 'tissueType', 'tissueAmt', 'exudateType', 'exudateAmt', 'color', 'tissueEdema', 'tissueInduration', 'granulationTissue', 'epithelialization']);

    this.props.onFormSubmit(values);
  }

  render() {
    const {
      fields: {
        bateCount,
        // 1st sec
        site,
        anatomicOthers,
        woundType,
        woundOthers,
        shape,
        shapeOthers,
        // 2nd sec
        size,
        depth,
        edges,
        undermining,
        tissueType,
        tissueAmt,
        exudateType,
        exudateAmt,
        color,
        tissueEdema,
        tissueInduration,
        granulationTissue,
        epithelialization,
        // others
        objective,
        solution,
        dressing,
        outcome,
      },

      resetForm,
      invalid,
      handleSubmit,
      submitFailed,
      submitting,
    } = this.props;

    const { totalScore, interpretation } = this.state;
    const objectiveChoice = [{label: 'Normal Saline', value: 'Normal Saline'}, {label: 'Chlorhexidine', value: 'Chlorhexidine'}];
    const solutionChoice = [{label: 'Protecting granulation/ephithelialisation', value: 'Protecting granulation/ephithelialisation'}, {label: 'Manage bacterial burden', value: 'Manage bacterial burden'}];

    const firstSec = [{
      first: "Location: Anatomic site",
      second: (
        <Selections
          fieldName="site"
          field={site}
          items={[
            {value: "Sacrum & Coccyx", label: (<span>Sacrum & Coccyx</span>)},
            {value: "Lateral Ankle", label: (<span>Lateral Ankle</span>)},
            {value: "Trochanter", label: (<span>Trochanter</span>)},
            {value: "Medial Ankle", label: (<span>Medial Ankle</span>)},
            {value: "Ischial Tuberosity", label: (<span>Ischial Tuberosity</span>)},
            {value: "Heel", label: (<span>Heel</span>)},
            {value: "Others", label: (<span className={s.selectionWithComment}>Other site: <input type="text" {...anatomicOthers} disabled={site.value !== 'Others'} /></span>)},
          ]}
        />
    )}, {
      first: "Type of Wound",
      second: (
        <Selections
          fieldName="woundType"
          field={woundType}
          items={[
            {value: "Venous Ulcer", label: (<span>Venous Ulcer</span>)},
            {value: "Arterial Ulcer", label: (<span>Arterial Ulcer</span>)},
            {value: "Diabetic Foot Ulcer", label: (<span>Diabetic Foot Ulcer</span>)},
            {value: "Cellulitis", label: (<span>Cellulitis (Weeping)</span>)},
            {value: "Fungating Lesions", label: (<span>Fungating Lesions</span>)},
            {value: "Surgical Wound", label: (<span>Surgical Wound</span>)},
            {value: "Burn/Scalds", label: (<span>Burn/Scalds</span>)},
            {value: "Pressure Sore", label: (<span>Pressure Sore</span>)},
            {value: "Traumatic Wound", label: (<span>Traumatic Wound</span>)},
            {value: "Others", label: (<span className={s.selectionWithComment}>Others: <input type="text" {...woundOthers} disabled={woundType.value !== 'Others'} /></span>)},
          ]}
        />
    )}, {
      first: "Shape: Overall wound pattern; assess by observing perimeter and depth",
      second: (
        <Selections
          fieldName="shape"
          field={shape}
          items={[
            {value: "Irregular", label: (<span>Irregular</span>)},
            {value: "Linear or Elongated", label: (<span>Linear or Elongated</span>)},
            {value: "Round/Oval", label: (<span>Round/Oval</span>)},
            {value: "Bowl/Boat", label: (<span>Bowl/Boat</span>)},
            {value: "Square/Rectangle", label: (<span>Square/Rectangle</span>)},
            {value: "Butterfly", label: (<span>Butterfly</span>)},
            {value: "Others", label: (<span>Other shape: <input type="text" {...shapeOthers} disabled={shape.value !== 'Others'} /></span>)},
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
          fieldName="tissueType"
          field={tissueType}
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
          fieldName="tissueAmt"
          field={tissueAmt}
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
          fieldName="exudateAmt"
          field={exudateAmt}
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
          fieldName="color"
          field={color}
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
          fieldName="tissueEdema"
          field={tissueEdema}
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
          fieldName="tissueInduration"
          field={tissueInduration}
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
          fieldName="granulationTissue"
          field={granulationTissue}
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
          options={objectiveChoice}
          {...objective}
        />
    )}, {
      first: "Type of solution used",
      second: (
        <MultiSelect
          className={s.multiSelect}
          options={solutionChoice}
          {...solution}
        />
    )}, {
      first: "Type of dressing used",
      second: (
        <input className={s.textInput} type="text" {...dressing} />
    )}, {
      first: "Outcome and Evaluation",
      second: (
        <textarea className={s.textareaInput} id="outcome" name="outcome" {...outcome} />
    )}];


    return (
      <form className={s.documentationBateForm} onSubmit={handleSubmit(this.onFormSubmit)}>
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
    '_id',
    // 1st sec
    'site',
    'anatomicOthers',
    'woundType',
    'woundOthers',
    'shape',
    'shapeOthers',
    // 2nd sec
    'size',
    'depth',
    'edges',
    'undermining',
    'tissueType',
    'tissueAmt',
    'exudateType',
    'exudateAmt',
    'color',
    'tissueEdema',
    'tissueInduration',
    'granulationTissue',
    'epithelialization',
    // others
    'objective',
    'solution',
    'dressing',
    'outcome',
  ],
  validate,
}

const mapStateToProps = (state, ownProps) => {
  let initialValues;

  const valueToString = (items) => {
    items.map(item => {
      ownProps.initialValues[item] = ownProps.initialValues[item] && ownProps.initialValues[item].toString();
    })
  }
  if (Object.keys(ownProps.initialValues).length) {
    valueToString(['size', 'depth', 'edges', 'undermining', 'tissueType', 'tissueAmt', 'exudateType', 'exudateAmt', 'color', 'tissueEdema', 'tissueInduration', 'granulationTissue', 'epithelialization']);
    initialValues = ownProps.initialValues;
  }

  return { initialValues }
};

const mapDispatchToProps = (dispatch) => ({
  resetForm: () => dispatch(reset('documentationBateForm')),
});

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(DocumentationBateForm);
