import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import s from './DocumentationSummaryForm.css';
import Container from '../../Container';
import Link from '../../Link';
import Header from '../../Header';
import history from '../../../core/history';
import { getUserName, configToName } from '../../../core/util';
import { getSession, showConfirmPopup, fetchServices } from '../../../actions';
import ConfirmPopup from '../../ConfirmPopup';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { reduxForm, addArrayValue, reset, change } from 'redux-form';
import { YesNoSwitch } from '../DocumentationModules/DocumentationModules';


class DocumentationSummaryForm extends Component {

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

  render() {
    const {
      fields: {
        // nursing notes
        providerNote,
        recommendPolyclinic,
        remarks,
        // note to stakeholders
        caregiverNote,
        externalSupportNote,
      },

      resetForm,
      invalid,
      handleSubmit,
      submitFailed,
      submitting,
    } = this.props;

    const firstSec = [{
      first: "Nursing Notes",
      second: (<textarea className={s.textareaInput} type='text' {...providerNote} placeholder="Only provider can view this section. e.g. Wound not looking good. Must check again on next visit." />)
    }, {
      first: "Recommend to send to A&E/ GP/ Polyclinic?",
      second: (
        <YesNoSwitch
          fieldName='recommendPolyclinic'
          field={recommendPolyclinic}
          changeFieldValue={(field, onOff) => this.props.changeFieldValue(field, onOff)}
        />
      )
    }, {
      first: "Remarks",
      second: (<textarea className={s.textareaInput} type='text' {...remarks} placeholder="e.g. Check x-ray for correct placement of NGT." disabled={!recommendPolyclinic.value} />)
    }];

    const secondSec = [{
      first: "Notes to Caregiver",
      second: (<textarea className={s.textareaInput} type='text' {...caregiverNote} placeholder="e.g. Special care on wound area." />)
    }, {
      first: "Notes to External Support Groups (if any)",
      second: (<textarea className={s.textareaInput} type='text' {...externalSupportNote} placeholder="e.g. Patient exhibits risk of mental instability." />)
    }]

    return (
      <form className={s.documentationSummaryForm} onSubmit={handleSubmit(this.props.onFormSubmit)}>
        <h2>Provider Notes</h2>

        <div className={s.issueSetSection}>
          {this.renderIssueSet(firstSec)}
        </div>

        <h2>Notes To Stakeholders</h2>

        <div className={s.issueSetSection}>
          {this.renderIssueSet(secondSec)}
        </div>

        <div className={s.handleForm}>
          <button className='btn btn-secondary' disabled={submitting} onClick={resetForm}>
            Clear Values
          </button>
          <button
            className='btn btn-primary'
            disabled={submitting || invalid}>
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

DocumentationSummaryForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

const reduxFormConfig = {
  form: 'documentationSummaryForm',
  fields: [
    // nursing notes
    'providerNote',
    'recommendPolyclinic',
    'remarks',
    // note to stakeholders
    'caregiverNote',
    'externalSupportNote',
  ],
  validate,
}

const mapStateToProps = (state) => ({
  // initialValues: {
  //   recommendPolyclinic: true,
  // },
});

const mapDispatchToProps = (dispatch) => ({
  resetForm: () => dispatch(reset('documentationSummaryForm')),
  changeFieldValue: (field, value) => dispatch(change('documentationSummaryForm', field, value)),
});

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(DocumentationSummaryForm);
