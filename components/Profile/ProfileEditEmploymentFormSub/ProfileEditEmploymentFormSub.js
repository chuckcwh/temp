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

  render() {
    const {
      fields: {
        country,
        description,
        employer,
        endDate,
        position,
        startDate,
      },
      invalid,
      handleSubmit,
      submitFailed,
      submitting,
      showDayPickerPopup,
    } = this.props;

    const countryChoice = ['Singapore', 'India', 'Malaysia', 'Indonesia', 'China'];

    return (
      <div className={s.profileEditEmploymentFormSub}>
        <DayPickerPopup title="Year of Graduation" />

        <Grid fluid className={s.employmentFormTable}>
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
                  <span onClick={() => this.props.showDayPickerPopup(startDate.value, 'ProfileEditEmploymentFormSub')}></span>
                </div>
              </div>
            </Col>
            <Col xs={12} sm={4} className={s.mainCatFields}>
              <div className={s.mainCatContainer}>
                <p>End Date</p>
                <div className={cx("DateInput", s.dateInputContainer)}>
                  <input className={s.dateInput} type="text" id="endDate" name="endDate" placeholder="MM/YYYY" {...endDate} />
                  <span onClick={() => this.props.showDayPickerPopup(endDate.value, 'ProfileEditEmploymentFormSub')}></span>
                </div>
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
                      <option key={countryChoice.indexOf(item)} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
              </div>
            </Col>
            <Col xs={12} sm={12} className={s.mainCatFields}>
              <div className={s.mainCatContainer}>
                <p>Area of Responsibilities</p>
                <textarea className={s.textareaInput} id="description" name="description" placeholder="Job responsibilities, work accomplished etc." {...description} />
                {description.touched && description.error && <div className={s.bookingLocationFormError}>{description.error}</div>}
              </div>
            </Col>
          </Row>

          <Row className={s.educationFormHandle}>
            <button className={cx("btn", "btn-primary", s.formSubmit)}>Save Changes</button>
            <button className={cx("btn", "btn-primary", s.formSubmit)}>Delete</button>
          </Row>
        </Grid>

      </div>
    );
  }

}

const validate = values => {
  const errors = {};
  // if (!values.withdrawAmt) {
  //   errors.withdrawAmt = 'Required';
  // } else if (!/\d+/i.test(values.withdrawAmt)) {
  //   errors.withdrawAmt = 'Invalid withdraw amount';
  // }
}

ProfileEditEmploymentFormSub.propTypes = {
  user: PropTypes.object,
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

const reduxFormConfig = {
  form: 'ProfileEditEmploymentFormSub',
  fields: [
    'country',
    'description',
    'employer',
    'endDate',
    'position',
    'startDate',
  ],
  validate,
}

const mapStateToProps = (state) => {
  // const user = state.user.data;
};

const mapDispatchToProps = (dispatch) => ({
  showDayPickerPopup: (value, source) => dispatch(showDayPickerPopup(value, source)),
})

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(ProfileEditEmploymentFormSub);
