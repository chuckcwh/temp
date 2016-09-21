import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DayPicker, { DateUtils } from 'react-day-picker';
import some from 'lodash/some';
import remove from 'lodash/remove';
import cx from 'classnames';
import moment from 'moment';
import { reduxForm } from 'redux-form';
import 'react-day-picker/lib/style.css';
import s from './PromocodeManageForm.css';
import { showDayPickerPopup, fetchServices, createPromo, getPromo, editPromo, deletePromo } from '../../../actions';
import DayPickerPopup from '../../DayPickerPopup';
import MultiSelect from '../../MultiSelect';
import { Grid, Row, Col } from 'react-flexbox-grid';


class PromocodeManageForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedDates: [],
    };
  }

  componentDidMount() {
    const { fetchServices, edit, promoId, getPromo } = this.props;
    fetchServices();

    if (edit) {
      getPromo({ promoId }).then(res => {
        if (res.type === 'PROMO_FAILURE') {
          // this.redirect('promocode-manage');   //TODO: page redirect while invalid promoId
        } else if (res.type === 'PROMO_SUCCESS') {
          this.setState({selectedDates: res.response.data.voidDates.map(item => new Date(item))})
        }
      });
    }
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

  onDeletePromo = (e) => {
    e.preventDefault();
    console.log('delete', this.props.fields._id.value);
    this.props.deletePromo({promoId: this.props.fields._id.value});
  }

  onSubmit = (values) => {
    const serviceReturn = values.services && values.services.split(',').map(service => {
      const q = service.split(':');
      return {id: q[0], classId: q[1]}
    })

    const regionReturn = values.regions && values.regions.split(',');

    return new Promise((resolve, reject) => [
      this.props.createPromo({
        code: values.code,
        services: serviceReturn || [],
        name: values.name,
        description: values.description,
        dateTimeStart: values.dateTimeStart,
        dateTimeEnd: values.dateTimeEnd,
        voidDates: this.state.selectedDates || [],
        regions: regionReturn || [],
        discountRate: +(values.discountRate),
        discountType: values.discountType,
      }).then((res) => {
        if (res.type === 'CREATE_PROMO_SUCCESS') {
          this.props.resetForm();
        }
      })
    ])
  };

  render() {
    const {
      fields: {
        dateTimeStart,
        dateTimeEnd,
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
      servicesFetching,
      discountTypeChoice,
      showDayPickerPopup,
      edit,

      invalid,
      handleSubmit,
      submitFailed,
      submitting,
    } = this.props;

    const { selectedDates } = this.state;
    const flattenServicesChoice = servicesChoice && Object.values(servicesChoice).reduce((result, service) => {
      service.classes.map(serviceClass => {
        result.push({
          label: `${service.name} (${parseFloat(serviceClass.duration)} hr${parseFloat(service.duration) > 1 ? 's' : ''})`,
          value: `${service._id}:${serviceClass._id}`,
        })
      })
      return result;
    }, []) || [];
    console.log('selectedDates', selectedDates);

    return (
      <div>
        <DayPickerPopup title='Date Picker' />

        <form className={s.promocodeManageForm} onSubmit={handleSubmit(this.onSubmit)}>
          <Grid fluid>
            <Row className={s.mainCat}>

              <Col xs={12} md={6} className={s.mainCatCol}>
                <div className={s.mainCatContainer}>
                  <p>Code*</p>
                  <div className={s.inputField}>
                    <span>#&nbsp;&nbsp;&nbsp;</span>
                    <input type="text" className={s.textInput} {...code} />
                    {code.touched && code.error && <div className={s.formError}>{code.error}</div>}
                  </div>
                </div>

                <div className={s.mainCatContainer}>
                  <p>Name*</p>
                  <div className={s.inputField}>
                    <input type="text" className={s.textInput} {...name} />
                    {name.touched && name.error && <div className={s.formError}>{name.error}</div>}
                  </div>
                </div>

                <div className={s.mainCatContainer}>
                  <p>Valid Date*</p>
                  <div className={s.inputField}>
                    <span>start*&nbsp;&nbsp;&nbsp;</span>
                    <div className={cx("DateInput", s.dateInput)}>
                      <input className={s.dateInput} type="text" id="dateTimeStart" name="dateTimeStart" placeholder="YYYY-MM-DD" {...dateTimeStart} value={dateTimeStart.value && moment(dateTimeStart.value).format('YYYY-MM-DD')}/>
                      <span onClick={() => {
                          this.props.showDayPickerPopup(
                            dateTimeStart.value,
                            {main: 'promocodeManageForm', name: 'dateTimeStart'}
                          )}}>
                        </span>
                      </div>
                      {dateTimeStart.touched && dateTimeStart.error && <div className={s.formError}>{dateTimeStart.error}</div>}
                  </div>

                  <div className={s.inputField}>
                    <span>end*&nbsp;&nbsp;&nbsp;</span>
                    <div className={cx("DateInput", s.dateInput)}>
                      <input className={s.dateInput} type="text" id="dateTimeEnd" name="dateTimeEnd" placeholder="YYYY-MM-DD" {...dateTimeEnd} value={dateTimeEnd.value && moment(dateTimeEnd.value).format('YYYY-MM-DD')}/>
                      <span onClick={() => {
                        this.props.showDayPickerPopup(
                          dateTimeEnd.value,
                          {main: 'promocodeManageForm', name: 'dateTimeEnd'}
                        )}}>
                      </span>
                    </div>
                    {dateTimeEnd.touched && dateTimeEnd.error && <div className={s.formError}>{dateTimeEnd.error}</div>}
                  </div>
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
                  <p>Discount Rate*</p>
                  <div className={s.inputField}>
                    <div className={s.inlineField}>
                      <div className="DateInput">
                        <input type="text" {...discountRate} />
                      </div>

                    </div>
                    <div className={s.inlineField}>
                      <div className={cx("select", s.dateInput)}>
                        <span></span>
                        <select className={s.discountTypeInput} id={discountType} name={discountType} {...discountType}>
                          {discountTypeChoice && discountTypeChoice.map(item => (
                            <option key={discountTypeChoice.indexOf(item)} value={item.value}>{item.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {discountRate.touched && discountRate.error && <div className={s.formError}>{discountRate.error}</div>}
                  </div>
                </div>

                <div className={s.mainCatContainer}>
                  <p>Services (apply to all if not specified)</p>
                  <div className={s.inputField}>
                    <MultiSelect
                      className={s.multiSelect}
                      options={flattenServicesChoice}
                      {...services}
                    />
                    {services.touched && services.error && <div className={s.formError}>{services.error}</div>}
                  </div>
                </div>

                <div className={s.mainCatContainer}>
                  <p>Applied to Regions (apply to all if not specified)</p>
                  <MultiSelect
                    className={s.multiSelect}
                    options={regionChoice && regionChoice.map(item => ({label: item.name, value: item.value}))}
                    {...regions}
                  />
                  {regions.touched && regions.error && <div className={s.formError}>{regions.error}</div>}
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

          {edit ? (
            <div className={s.formSectionSubmit}>
              {submitFailed && invalid && <div className={s.formError}>You have one or more form field errors.</div>}
              <button className="btn btn-primary">Set Expired</button>&nbsp;&nbsp;
              <button className="btn btn-primary" disabled={invalid || submitting}>Update</button>&nbsp;&nbsp;
              <button className="btn btn-secondary" onClick={this.onDeletePromo}>Delete</button>
            </div>
          ) : (
            <div className={s.formSectionSubmit}>
              {submitFailed && invalid && <div className={s.formError}>You have one or more form field errors.</div>}
              <button className="btn btn-primary" type="submit" disabled={invalid || submitting}>Save Changes</button>
            </div>
          )}
        </form>
      </div>
    );
  }
}

const validate = values => {
  const errors = {};

  if (!values.dateTimeStart) {
    errors.dateTimeStart = 'Required';
  } else if (!/^\d{4}[-]\d{2}[-]\d{2}$/i.test(values.dateTimeStart)) {
    errors.dateTimeStart = 'Invalid date (e.g. YYYY-MM-DD)';
  }

  if (!values.dateTimeEnd) {
    errors.dateTimeEnd = 'Required';
  } else if (!/^\d{4}[-]\d{2}[-]\d{2}$/i.test(values.dateTimeEnd)) {
    errors.dateTimeEnd = 'Invalid date (e.g. YYYY-MM-DD)';
  } else if (moment(values.dateTimeStart).isAfter(values.dateTimeEnd, 'day')) {
    errors.dateTimeEnd = 'End date must be later';
  }

  if (!values.discountRate) {
    errors.discountRate = 'Required';
  } else if (!+(values.discountRate)) {
    errors.discountRate = 'Must be a (float) number'
  }

  if (!values.code) {
    errors.code = 'Required';
  }

  if (!values.name) {
    errors.name = 'Required';
  }

  return errors
}


PromocodeManageForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,

  servicesChoice: React.PropTypes.object,
  servicesFetching: React.PropTypes.bool,
  fetchServices: React.PropTypes.func,

  resetForm: React.PropTypes.func,
  createPromo: React.PropTypes.func,
};

const reduxFormConfig = {
  form: 'promocodeManageForm',
  fields: [
    '_id',    // for edit use
    'dateTimeStart',
    'dateTimeEnd',
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
  const discountTypeChoice = [{value: 'sgd', name: 'SGD'}, {value: '%', name: '%'}];

  return {
    initialValues: {
      discountType: discountTypeChoice[0].value,
    },
    regionChoice: config && config.regions,
    servicesChoice: state.services.data,
    servicesFetching: state.services.isFetching,
    discountTypeChoice,
}};

const mapDispatchToProps = (dispatch) => ({
  fetchServices: () => dispatch(fetchServices()),
  showDayPickerPopup: (value, source) => dispatch(showDayPickerPopup(value, source)),
  createPromo: (params) => dispatch(createPromo(params)),
  resetForm: () => dispatch(reset('promocodeManageForm')),
  getPromo: (params) => dispatch(getPromo(params)),
  editPromo: (params) => dispatch(editPromo(params)),
  deletePromo: (params) => dispatch(deletePromo(params)),
});

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(PromocodeManageForm);
