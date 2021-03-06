import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import s from './ProfileEditEmploymentFormSub.css';
import Container from '../../Container';
import Link from '../../Link';
import Header from '../../Header';
import history from '../../../core/history';
import util from '../../../core/util';
import { reduxForm } from 'redux-form';
import InlineForm from '../../MultiSelect';
import { showDayPickerPopup } from '../../../actions';
import DayPickerPopup from '../../DayPickerPopup';
import { Grid, Row, Col } from 'react-flexbox-grid';
// react-icons
import FaLock from 'react-icons/lib/fa/lock';


class ProfileEditEmploymentFormSub extends Component {

  onNext = (values) => {
    const { onNext, newForm, resetForm } = this.props;

    onNext(values);

    if (newForm) {
      resetForm();
    }
  };

  render() {
    const {
      fields: {
        experienceId,
        country,
        description,
        employer,
        endDate,
        position,
        startDate,
      },
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

        <form className={s.profileEditEmploymentFormSub} onSubmit={handleSubmit(this.onNext)}>
          <Grid fluid className={cx(s.employmentFormTable, newForm && s.newForm)}>
            <Row className={s.mainCat}>
              <Col xs={12} sm={7} className={s.mainCatFields}>
                <div className={s.mainCatContainer}>
                  <p>Employer / Company</p>
                  <input className={s.mainInput} type='text' {...employer}/>
                  {employer.touched && employer.error && <div className={s.formError}>{employer.error}</div>}
                </div>
              </Col>
              <Col xs={12} sm={5} className={s.mainCatFields}>
                <div className={s.mainCatContainer}>
                  <p>Position</p>
                  <input className={s.mainInput} type='text' {...position}/>
                  {position.touched && position.error && <div className={s.formError}>{position.error}</div>}
                </div>
              </Col>
              <Col xs={12} sm={4} className={s.mainCatFields}>
                <div className={s.mainCatContainer}>
                  <p>Start Date</p>
                  <div className={cx("DateInput", s.dateInputContainer)}>
                    <input className={s.dateInput} type="text" id="startDate" name="startDate" placeholder="MM/YYYY" {...startDate} />
                    <span onClick={() => this.props.showDayPickerPopup(startDate.value, {main: 'ProfileEditEmploymentFormSub', sub: experienceId.value, name: 'startDate'})}></span>
                  </div>
                  {startDate.touched && startDate.error && <div className={s.formError}>{startDate.error}</div>}
                </div>
              </Col>
              <Col xs={12} sm={4} className={s.mainCatFields}>
                <div className={s.mainCatContainer}>
                  <p>End Date</p>
                  <div className={cx("DateInput", s.dateInputContainer)}>
                    <input className={s.dateInput} type="text" id="endDate" name="endDate" placeholder="MM/YYYY" {...endDate} />
                    <span onClick={() => this.props.showDayPickerPopup(endDate.value, {main: 'ProfileEditEmploymentFormSub', sub: experienceId.value, name: 'endDate'})}></span>
                  </div>
                  {endDate.touched && endDate.error && <div className={s.formError}>{endDate.error}</div>}
                </div>
              </Col>
              <Col xs={12} sm={4} className={s.mainCatFields}>
                <div className={s.mainCatContainer}>
                  <p>Country</p>
                  <div className={cx("select", s.selectInput)}>
                    <span></span>
                    <select className={s.selectInputInner} id={country} name={country} {...country} value={country.value}>
                      <option value="">-- Select --</option>
                      {countryChoice && countryChoice.map(item => (
                        <option key={countryChoice.indexOf(item)} value={item.value}>{item.name}</option>
                      ))}
                    </select>
                  </div>
                  {country.touched && country.error && <div className={s.formError}>{country.error}</div>}
                </div>
              </Col>
              <Col xs={12} sm={12} className={s.mainCatFields}>
                <div className={s.mainCatContainer}>
                  <p>Area of Responsibilities</p>
                  <textarea className={s.textareaInput} id="description" name="description" placeholder="Job responsibilities, work accomplished etc." {...description} />
                  {description.touched && description.error && <div className={s.formError}>{description.error}</div>}
                </div>
              </Col>
            </Row>

            {newForm ? (
              <Row className={s.experienceFormHandle}>
                <button className={cx("btn", "btn-primary", s.formSubmit)} type="submit" disabled={invalid || submitting}>
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
              <Row className={s.experienceFormHandle}>
                <button className={cx("btn", "btn-primary", s.formSubmit)} type="submit" disabled={invalid || submitting}>
                  Save Changes
                </button>
                <button
                  className={cx("btn", "btn-primary", s.formSubmit)}
                  onClick={(e) => {
                    e.preventDefault();
                    this.props.onDelete(experienceId.value);
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
  const startDateFormat = moment(values.startDate, 'MM/YYYY').format();
  const endDateFormat = moment(values.endDate, 'MM/YYYY').format();
  if (!values.country) {
    errors.country = 'Required';
  }
  if (!values.employer) {
    errors.employer = 'Required';
  }
  if (!values.description) {
    errors.description = 'Required';
  }
  if (!values.startDate) {
    errors.startDate = 'Required';
  } else if (!/^\d{2}[/]\d{4}$/i.test(values.startDate)) {
    errors.startDate = 'Invalid start date (e.g. MM/YYYY)';
  }
  if (!values.position) {
    errors.position = 'Required';
  }
  if (values.endDate && !/^\d{2}[/]\d{4}$/i.test(values.endDate)) {
    errors.endDate = 'Invalid end date (e.g. MM/YYYY)';
  } else if (values.startDate && values.endDate && !moment(endDateFormat).isAfter(startDateFormat)) {
    errors.endDate = 'End Date before start date'
  }
  return errors
}

ProfileEditEmploymentFormSub.propTypes = {
  // user: PropTypes.object,
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

const reduxFormConfig = {
  form: 'ProfileEditEmploymentFormSub',
  fields: [
    'experienceId',
    'country',
    'description',
    'employer',
    'endDate',
    'position',
    'startDate',
  ],
  validate,
}

const mapStateToProps = (state) => ({
  // const user = state.user.data;
  countryChoice: state.config.data && state.config.data.countries,
});

const mapDispatchToProps = (dispatch) => ({
  showDayPickerPopup: (value, source) => dispatch(showDayPickerPopup(value, source)),
  resetForm: () => dispatch(reset('ProfileEditEmploymentFormSub')),
})

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(ProfileEditEmploymentFormSub);
