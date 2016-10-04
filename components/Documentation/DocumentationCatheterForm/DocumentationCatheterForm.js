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
import { reduxForm, addArrayValue, reset } from 'redux-form';


class DocumentationCatheterForm extends Component {

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
        ooxx
      },

      resetForm,
      invalid,
      handleSubmit,
      submitFailed,
      submitting,
    } = this.props;

    return (
      <form className={s.DocumentationCatheterForm} onFormSubmit={this.onFormSubmit}>
        Catheter form
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
    'ooxx'
  ],
  validate,
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
  resetForm: () => dispatch(reset('documentationCatheterForm')),
});

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(DocumentationCatheterForm);
