import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import s from './DocumentationMSEForm.css';
import Container from '../../Container';
import Link from '../../Link';
import Header from '../../Header';
import history from '../../../core/history';
import { getUserName, configToName } from '../../../core/util';
import { getSession, showConfirmPopup, fetchServices } from '../../../actions';
import ConfirmPopup from '../../ConfirmPopup';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { reduxForm, addArrayValue, reset } from 'redux-form';


class DocumentationMSEForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
    }
  }

  onFormSubmit = (values) => {
    console.log('onFormSubmit', values);
  }


  render() {
    const {
      fields: {
        appearance,
        psychomotor,
        attitudeTwdNurse,
        suicide,
        thoughtHarming,
        speech,
        thoughtClarity,
        thoughtRelevance,
        thoughtContent,
        thoughtFlow,
        cognitionOrientated,
        cognitionFollowup,
        cognitionFamilyCare,
        outcome,
      },

      resetForm,
      invalid,
      handleSubmit,
      submitFailed,
      submitting,
    } = this.props;

    return (
      <form className={s.documentationMSEForm}>
        <h2>Mental State Examination (MSE)</h2>

        <h3>Instructions</h3>
        <p>Before you begin, get the patient’s permission to ask some questions. This will help to avoid catastrophic reactions. Provide any hearing or visual aids that the patient needs. You will also need a watch, pencil and some paper.</p>


      </form>
    );
  }
}

const validate = values => {
  const errors = {};

  return errors
}

DocumentationMSEForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

const reduxFormConfig = {
  form: 'documentationFRATForm',
  fields: [
    'appearance',
    'psychomotor',
    'attitudeTwdNurse',
    'suicide',
    'thoughtHarming',
    'speech',
    'thoughtClarity',
    'thoughtRelevance',
    'thoughtContent',
    'thoughtFlow',
    'cognitionOrientated',
    'cognitionFollowup',
    'cognitionFamilyCare',
    'outcome',
  ],
  validate,
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
resetForm: () => dispatch(reset('documentationFRATForm')),
});

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(DocumentationMSEForm);
