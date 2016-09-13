import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DayPicker, { DateUtils } from 'react-day-picker';
import some from 'lodash/some';
import remove from 'lodash/remove';
import cx from 'classnames';
import moment from 'moment';
import { getUserName } from '../../../core/util';
import { reduxForm } from 'redux-form';
import 'react-day-picker/lib/style.css';
import s from './PromocodeManageAddForm.css';
import { showDayPickerPopup, fetchServices, createPromo } from '../../../actions';
import DayPickerPopup from '../../DayPickerPopup';
import MultiSelect from '../../MultiSelect';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Loader from 'react-loader';


class PromocodeManageAddForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedDates: [],
    };
  }

  componentDidMount() {
    this.props.fetchServices();
  }

  onSelectDay = (e, day) => {
    if (!this.isDisabled(day)) {
      const days = this.state.selectedDates;

      if (some(days, item => DateUtils.isSameDay(item, day))) {
        remove(days, item => DateUtils.isSameDay(item, day));
      } else {
        days.push(day);
        days.sort((a, b) => a.getTime() - b.getTime());
      }

      this.setState({ selectedDates: days });
    }
  };

  isDisabled = (day) => {
    const d = DateUtils.clone(day);
    d.setDate(d.getDate() - 1);
    return DateUtils.isPastDay(d);
  };

  onSubmit = (values) => {
    console.log('values', values);
    return new Promise((resolve, reject) => [
      this.props.createPromo({
        code: values.code,
        services: values.services,
        name: values.name,
        description: values.description,
        date: {
          dateTimeStart: moment(values.startDate).format('YYYY-MM-DD'),
          dateTimeEnd: moment(values.endDate).format('YYYY-MM-DD'),
          voidDates: this.state.selectedDates
        }
        
        regions: values.regions,
        discountRate: values.discountRate,
        discountType: values.discountType,
      }).then((res) => {
        console.log('response', res);
      })
    ])
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
      servicesChoice,
      discountTypeChoice,
      showDayPickerPopup,
      user,

      invalid,
      handleSubmit,
      submitFailed,
      submitting,
    } = this.props;

    const { selectedDates } = this.state;

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
                      options={Object.values(servicesChoice).map(item => ({label: item.name, value: item._id}))}
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
                  <div className="text-center">
                    <DayPicker
                      numberOfMonths={1}
                      modifiers={{
                        selected: day => selectedDates
                          && some(selectedDates, item => DateUtils.isSameDay(item, day)),
                        disabled: this.isDisabled,
                      }}
                      onDayClick={this.onSelectDay}
                    />
                  </div>
                  <div className="text-center">
                    {selectedDates.length ? <h3>Selected Dates:</h3> : ""}
                    {
                      selectedDates && selectedDates.map((day) => (
                        <div key={day.getTime()}>{moment(day).format('DD MMM YYYY, dddd')}</div>
                      ))
                    }
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
                        <select className={s.discountTypeInput} id={discountType} name={discountType} {...discountType} value={discountType.value}>
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
  servicesChoice: React.PropTypes.object,
  fetchServices: React.PropTypes.func,
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
  const discountTypeChoice = ['SGD', '%'];

  return {
    initialValues: {
      discountType: discountTypeChoice[0],
    },
    regionChoice: config && config.regions,
    servicesChoice: state.services.data,
    discountTypeChoice,
    user,
}};

const mapDispatchToProps = (dispatch) => ({
  fetchServices: () => dispatch(fetchServices()),
  showDayPickerPopup: (value, source) => dispatch(showDayPickerPopup(value, source)),
  createPromo: (params) => dispatch(createPromo(params)),
});

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(PromocodeManageAddForm);
