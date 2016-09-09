import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import s from './PromocodeManageAddForm.css';
import Container from '../../Container';
import Link from '../../Link';
import Header from '../../Header';
import history from '../../../core/history';
import { getUserName } from '../../../core/util';
import { isAdmin } from '../../../core/util';
import { reduxForm } from 'redux-form';
import { showDayPickerPopup } from '../../../actions';
import DayPickerPopup from '../../DayPickerPopup';
import MultiSelect from '../../MultiSelect';
import { Grid, Row, Col } from 'react-flexbox-grid';


class PromocodeManageAddForm extends Component {

  onSubmit = (values) => {
    console.log('values', values);
    // return new Promise((resolve, reject) => [
    //
    // ])
  };

  render() {
    const {
      fields: {
        startDate,
        endDate,
        services,
        regions,
        blackOutDays,
        discountRate,
        discountType,
        code,
        name,
        description,
      },
      regionChoice,
      showDayPickerPopup,
      user,

      invalid,
      handleSubmit,
      submitFailed,
      submitting,
    } = this.props;

    const servicesChoice = [{label: 'Stroke Rehabilitation', value: 'Stroke Rehabilitation'}, {label: 'Pain Relief Therapy', value: 'Pain Relief Therapy'}];
    const discountTypeChoice = ['SGD', '%'];

    return (
      <div>
        <DayPickerPopup title='Date Picker' />

        <form className={s.promocodeManageAddForm} onSubmit={handleSubmit(this.onSubmit)}>
          <Grid fluid>
            <Row className={s.mainCat}>
              <Col xs={12} md={6} className={s.mainCatCol}>
                <div className={s.mainCatContainer}>
                  <p>Valid Date</p>
                  <div className={s.inputField}>
                    <span>start&nbsp;&nbsp;&nbsp;</span>
                    <div className={cx("DateInput", s.dateInput)}>
                      <input className={s.dateInput} type="text" id="startDate" name="startDate" placeholder="YYYY-MM-DD" {...startDate} />
                      <span onClick={() => {
                          this.props.showDayPickerPopup(
                            startDate.value,
                            {main: 'promocodeManageAddForm', name: 'startDate'}
                          )}}>
                        </span>
                      </div>
                      {startDate.touched && startDate.error && <div className={s.formError}>{startDate.error}</div>}
                  </div>

                  <div className={s.inputField}>
                    <span>end&nbsp;&nbsp;&nbsp;</span>
                    <div className={cx("DateInput", s.dateInput)}>
                      <input className={s.dateInput} type="text" id="endDate" name="endDate" placeholder="YYYY-MM-DD" {...endDate} />
                      <span onClick={() => {
                        this.props.showDayPickerPopup(
                          endDate.value,
                          {main: 'promocodeManageAddForm', name: 'endDate'}
                        )}}>
                      </span>
                    </div>
                    {endDate.touched && endDate.error && <div className={s.formError}>{endDate.error}</div>}
                  </div>
                </div>

                <div className={s.mainCatContainer}>
                  <p>Services</p>
                  <div className={s.inputField}>
                    <MultiSelect
                      className={s.multiSelect}
                      options={servicesChoice}
                      {...services}
                    />
                    {services.touched && services.error && <div className={s.formError}>{services.error}</div>}
                  </div>
                </div>

                <div className={s.mainCatContainer}>
                  <p>Applied to Regions</p>
                  <MultiSelect
                    className={s.multiSelect}
                    options={regionChoice && regionChoice.map(item => ({label: item.name, value: item.value}))}
                    {...regions}
                  />
                  {regions.touched && regions.error && <div className={s.formError}>{regions.error}</div>}
                </div>

                <div className={s.mainCatContainer}>
                  <p>Black Out Days</p>
                  <div className="DateInput">
                    <input type="text" id="blackOutDays" name="blackOutDays" placeholder="DD-MM-YYYY" {...blackOutDays} />
                    <span onClick={() => this.props.showDayPickerPopup(blackOutDays.value, 'promocodeManageAddForm')}></span>
                  </div>
                  {blackOutDays.touched && blackOutDays.error && <div className={s.formError}>{blackOutDays.error}</div>}
                </div>
              </Col>

              <Col xs={12} md={6} className={s.mainCatCol}>
                <div className={s.mainCatContainer}>
                  <p>Discount Rate</p>
                  <div className={s.inputField}>
                    <div className={s.inlineField}>
                      <div className="DateInput">
                        <input type="text" {...discountRate} />
                      </div>
                      {discountRate.touched && discountRate.error && <div className={s.formError}>{discountRate.error}</div>}
                    </div>
                    <div className={s.inlineField}>
                      <div className={cx("select", s.dateInput)}>
                        <span></span>
                        <select className={s.discountTypeInput} id={discountType} name={discountType} {...discountType} value={discountType.value || 'SGD'}>
                          {discountTypeChoice && discountTypeChoice.map(item => (
                            <option key={discountTypeChoice.indexOf(item)} value={item}>{item}</option>
                          ))}
                        </select>
                      </div>
                      {discountType.touched && discountType.error && <div className={s.formError}>{discountType.error}</div>}
                    </div>
                  </div>
                </div>

                <div className={s.mainCatContainer}>
                  <p>Code</p>
                  <div className={s.inputField}>
                    <span>#&nbsp;&nbsp;&nbsp;</span>
                    <input type="text" className={s.textInput} {...code} />
                    {code.touched && code.error && <div className={s.formError}>{code.error}</div>}
                  </div>
                </div>

                <div className={s.mainCatContainer}>
                  <p>Name</p>
                  <div className={s.inputField}>
                    <input type="text" className={s.textInput} {...name} />
                    {name.touched && name.error && <div className={s.formError}>{name.error}</div>}
                  </div>
                </div>

                <div className={s.mainCatContainer}>
                  <p>Description</p>
                  <div className={s.inputField}>
                    <textarea className={s.descriptionInput} id="description" name="description" placeholder="Enter Address" {...description} />
                    {description.touched && description.error && <div className={s.formError}>{description.error}</div>}
                  </div>
                </div>
              </Col>
            </Row>
          </Grid>

          <div className={s.formSectionSubmit}>
            {submitFailed && invalid && <div className={s.formError}>You have one or more form field errors.</div>}
            <button className="btn btn-primary" type="submit" disabled={invalid || submitting}>Save Changes</button>
          </div>
        </form>
      </div>
    );
  }
}

const validate = values => {
  const errors = {};

  return errors
}


PromocodeManageAddForm.propTypes = {
  // onEnter: PropTypes.func,
  // onLeave: PropTypes.func,
};

const reduxFormConfig = {
  form: 'promocodeManageAddForm',
  fields: [
    'startDate',
    'endDate',
    'services',
    'regions',
    'blackOutDays',
    'discountRate',
    'discountType',
    'code',
    'name',
    'description',
  ],
  validate,
}

const mapStateToProps = (state) => {
  const user = state.user.data;
  const config = state.config.data;

  return {
    regionChoice: config && config.regions,
    user,
}};

const mapDispatchToProps = (dispatch) => ({
  showDayPickerPopup: (value, source) => dispatch(showDayPickerPopup(value, source)),
});

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(PromocodeManageAddForm);
