import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import s from './ProfileEditEducationFormSub.css';
import Container from '../../Container';
import Link from '../../Link';
import Header from '../../Header';
import history from '../../../core/history';
import util from '../../../core/util';
import { reduxForm, reset } from 'redux-form';
import InlineForm from '../../MultiSelect';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { showDayPickerPopup } from '../../../actions';
import DayPickerPopup from '../../DayPickerPopup';
// react-icons
import FaLock from 'react-icons/lib/fa/lock';


class ProfileEditEducationFormSub extends Component {

  onNext = (values) => {
    this.props.onNext(values);
    this.props.resetForm();
  };

  render() {
    const {
      fields: {
        institute,
        typeOfCert,
        course,
        country,
        gradDate,
        educationId,
      },
      typeOfCertChoice,
      countryChoice,
      showDayPickerPopup,

      invalid,
      handleSubmit,
      submitFailed,
      submitting,
      newForm,
    } = this.props;

    return (
      <div>
        <DayPickerPopup title="Date Picker" />

        <form className={s.ProfileEditEducationFormSub} onSubmit={handleSubmit(this.onNext)}>
          <Grid fluid className={cx(s.educationFormTable, newForm && s.newForm)}>
            <Row className={s.mainCat}>
              <Col xs={12} sm={7} className={s.mainCatFields}>
                <div className={s.mainCatContainer}>
                  <p>Institute Name</p>
                  <input className={s.mainInput} type='text' {...institute}/>
                  {institute.touched && institute.error && <div className={s.formError}>{institute.error}</div>}
                </div>
              </Col>
              <Col xs={12} sm={5} className={s.mainCatFields}>
                <div className={s.mainCatContainer}>
                  <p>Type of Certification</p>
                  <div className={cx("select", s.selectInput)}>
                    <span></span>
                    <select className={s.mainCatMulti} id={typeOfCert} name={typeOfCert} {...typeOfCert} value={typeOfCert.value || ''}>
                      <option value="">- Select -</option>
                      {typeOfCertChoice && typeOfCertChoice.map(item => (
                        <option key={typeOfCertChoice.indexOf(item)} value={item.value}>{item.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={5} className={s.mainCatFields}>
                <div className={s.mainCatContainer}>
                  <p>Course / Specialisation</p>
                  <input className={s.mainInput} type='text' {...course}/>
                  {course.touched && course.error && <div className={s.formError}>{course.error}</div>}
                </div>
              </Col>
              <Col xs={12} sm={3} className={s.mainCatFields}>
                <div className={s.mainCatContainer}>
                  <p>Country</p>
                  <div className={cx("select", s.selectInput)}>
                    <span></span>
                    <select className={s.mainCatMulti} id={country} name={country} {...country} value={country.value || ''}>
                      <option value="">- Select -</option>
                      {countryChoice && countryChoice.map(item => (
                        <option key={countryChoice.indexOf(item)} value={item.value}>{item.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={4} className={s.mainCatFields}>
                <div className={s.mainCatContainer}>
                  <p>Year of Graduation</p>
                  <div className={cx("DateInput", s.dateInputContainer)}>
                    <input className={s.dateInput} type="text" id="gradDate" name="gradDate" placeholder="MM/YYYY" {...gradDate} />
                    <span onClick={() => {
                      this.props.showDayPickerPopup(
                        gradDate.value,
                        {main: 'ProfileEditEducationFormSub', sub: educationId.value}
                      )}}>
                    </span>
                  </div>
                </div>
              </Col>
            </Row>

            {newForm ? (
              <Row className={s.educationFormHandle}>
                <button className={cx("btn", "btn-primary", s.formSubmit)}>
                  Add New
                </button>
                <button
                  className={cx("btn", "btn-primary", s.formSubmit)}
                  onClick={(e) => {
                    e.preventDefault();
                    this.props.resetForm();
                  }}>
                  Clear
                </button>
              </Row>
            ) : (
              <Row className={s.educationFormHandle}>
                <button className={cx("btn", "btn-primary", s.formSubmit)}>Save Changes</button>
                <button
                  className={cx("btn", "btn-primary", s.formSubmit)}
                  onClick={(e) => {
                    e.preventDefault();
                    this.props.onDelete(educationId.value);
                  }}>
                  Delete
                </button>
              </Row>
            )}

          </Grid>

        </form>
      </div>
    );
  }

}

const validate = values => {
  const errors = {};
  if (!values.institute) {
    errors.institute = 'Required';
  }
  if (!values.typeOfCert) {
    errors.typeOfCert = 'Required';
  }
  if (!values.course) {
    errors.course = 'Required';
  }
  if (!values.country) {
    errors.country = 'Required';
  }
  if (!values.gradDate) {
    errors.gradDate = 'Required';
  }
  return errors
}

ProfileEditEducationFormSub.propTypes = {
  // user: PropTypes.object,
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

const reduxFormConfig = {
  form: 'ProfileEditEducationFormSub',
  fields: [
    'educationId',
    'institute',
    'typeOfCert',
    'course',
    'country',
    'gradDate',
  ],
  validate,
}

const mapStateToProps = (state) => ({
  // const user = state.user.data;
  typeOfCertChoice: state.config.data && state.config.data.qualifications,
  countryChoice: state.config.data && state.config.data.countries,
});

const mapDispatchToProps = (dispatch) => ({
  showDayPickerPopup: (value, source) => dispatch(showDayPickerPopup(value, source)),
  resetForm: () => dispatch(reset('ProfileEditEducationFormSub')),
});

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(ProfileEditEducationFormSub);
