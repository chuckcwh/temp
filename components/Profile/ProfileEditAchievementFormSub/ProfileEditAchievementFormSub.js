import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import s from './ProfileEditAchievementFormSub.css';
import Container from '../../Container';
import Link from '../../Link';
import Header from '../../Header';
import history from '../../../core/history';
import util from '../../../core/util';
import { reduxForm, reset } from 'redux-form';
import InlineForm from '../../MultiSelect';
import { showDayPickerPopup } from '../../../actions';
import DayPickerPopup from '../../DayPickerPopup';
import { Grid, Row, Col } from 'react-flexbox-grid';
// react-icons
import FaLock from 'react-icons/lib/fa/lock';


class ProfileEditAchievementFormSub extends Component {

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
        achievementId,
        title,
        organization,
        dateObtained,
        description,
      },
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

        <form className={s.profileEditAchievementFormSub} onSubmit={handleSubmit(this.onNext)}>
          <Grid fluid className={cx(s.employmentFormTable, newForm && s.newForm)}>
            <Row className={s.mainCat}>
              <Col xs={12} sm={7} className={s.mainCatFields}>
                <div className={s.mainCatContainer}>
                  <p>Achievement Title</p>
                  <input className={s.mainInput} type='text' {...title}/>
                  {title.touched && title.error && <div className={s.formError}>{title.error}</div>}
                </div>
              </Col>
              <Col xs={12} sm={5} className={s.mainCatFields}>
                <div className={s.mainCatContainer}>
                  <p>Date Obtained</p>
                  <div className={cx("DateInput", s.dateInputContainer)}>
                    <input className={s.dateInput} type="text" id="dateObtained" name="dateObtained" placeholder="MM/YYYY" {...dateObtained} />
                    <span onClick={() => this.props.showDayPickerPopup(dateObtained.value, {main: 'ProfileEditAchievementFormSub', sub: achievementId.value})}></span>
                  </div>
                  {dateObtained.touched && dateObtained.error && <div className={s.formError}>{dateObtained.error}</div>}
                </div>
              </Col>
              <Col xs={12} sm={12} className={s.mainCatFields}>
                <div className={s.mainCatContainer}>
                  <p>Organization</p>
                  <input className={s.mainInput} type='text' {...organization}/>
                  {organization.touched && organization.error && <div className={s.formError}>{organization.error}</div>}
                </div>
              </Col>
              <Col xs={12} sm={12} className={s.mainCatFields}>
                <div className={s.mainCatContainer}>
                  <p>Short Description</p>
                  <textarea className={s.textareaInput} id="description" name="description" placeholder="Job responsibilities, work accomplished etc." {...description} />
                  {description.touched && description.error && <div className={s.formError}>{description.error}</div>}
                </div>
              </Col>
            </Row>

            {newForm ? (
              <Row className={s.achievementFormHandle}>
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
              <Row className={s.achievementFormHandle}>
                <button className={cx("btn", "btn-primary", s.formSubmit)} type="submit" disabled={invalid || submitting}>
                  Save Changes
                </button>
                <button
                  className={cx("btn", "btn-primary", s.formSubmit)}
                  onClick={(e) => {
                    e.preventDefault();
                    this.props.onDelete(achievementId.value);
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
  if (!values.title) {
    errors.title = 'Required';
  }
  if (!values.organization) {
    errors.organization = 'Required';
  }
  if (!values.dateObtained) {
    errors.dateObtained = 'Required';
  } else if (!/^\d{2}[/]\d{4}$/i.test(values.dateObtained)) {
    errors.dateObtained = 'Invalid obtained date (e.g. MM/YYYY)';
  }
  if (!values.description) {
    errors.description = 'Required';
  }
  return errors
}

ProfileEditAchievementFormSub.propTypes = {
  // user: PropTypes.object,
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

const reduxFormConfig = {
  form: 'ProfileEditAchievementFormSub',
  fields: [
    'achievementId',
    'title',
    'organization',
    'dateObtained',
    'description',
  ],
  validate,
}

const mapStateToProps = (state) => {
  // const user = state.user.data;
};

const mapDispatchToProps = (dispatch) => ({
  showDayPickerPopup: (value, source) => dispatch(showDayPickerPopup(value, source)),
  resetForm: () => dispatch(reset('ProfileEditAchievementFormSub')),
})

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(ProfileEditAchievementFormSub);
