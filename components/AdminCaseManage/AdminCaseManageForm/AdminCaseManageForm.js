import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import s from './AdminCaseManageForm.css';
import { reduxForm, change } from 'redux-form';
import Header from '../../Header';
import history from '../../../core/history';
import { showDayPickerPopup, fetchServices, getUsers, getPatients, createBooking } from '../../../actions';
import DayPickerPopup from '../../DayPickerPopup';
import { Grid, Row, Col } from 'react-flexbox-grid';
import MultiSelect from '../../MultiSelect';
import some from 'lodash/some';
import remove from 'lodash/remove';


class AdminCaseManageForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedDates: [],
    }
  }

  componentDidMount() {
    this.props.fetchServices();
    this.props.getUsers().then((res) => {
      if (res.type === 'USERS_SUCCESS') {
        this.setState({
          userList: res.response.data.length && res.response.data.filter(user => user.role === 'client').sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0) || []
        })
      }
    });
  }

  onSetUserClass = (e) => {
    e.preventDefault();

    const userClass = e.target.value;

    this.props.resetForm();
    this.props.changeFieldValue('userClass', userClass);
  }

  onSetRegUser = (e) => {
    e.preventDefault();

    const userId = e.target.value;

    this.setState({ patientList: [] });
    if (userId) {
      const user = this.state.userList.find(item => item._id === userId);
      this.props.changeFieldValue('clientNameOrId', user._id);
      this.props.changeFieldValue('clientEmail', user.email);
      this.props.changeFieldValue('clientMobile', user.contact);

      this.props.getPatients({ userId }).then((res) => {
        if (res.type === 'PATIENTS_SUCCESS' && res.response.data.length) {
          this.setState({
            patientList: res.response.data,
            patientListErr: false
          })
        } else {
          this.setState({
            patientListErr: true
          })
        }
      })
    }
  };

  onSetRegUserPatient = (e) => {
    e.preventDefault();

    const patientId = e.target.value;

    if (patientId) {
      const patient = this.state.patientList.find(item => item._id === patientId);
      console.log('patient', patient);
      this.props.changeFieldValue('patientNameOrId', patient._id);
      this.props.changeFieldValue('patientGender', patient.gender);
      this.props.changeFieldValue('patientDOB', moment(patient.dob).format('YYYY-MM-DD'));
      this.props.changeFieldValue('postal', patient.address && patient.address.postal);
      this.props.changeFieldValue('unit', patient.address && patient.address.unit);
      this.props.changeFieldValue('addr', patient.address && patient.address.description);
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

  onSubmit = (values) => {
    console.log('values', values);
    const data = {
      service: values.service && values.service.split(':')[0],
      serviceClassId: values.service && values.service.split(':')[1],
      timeSlot: values.time,
      date: this.state.selectedDates[0],   // backend only accept 1 date now
      additionalInfo: this.state.caseNote,

    }

    if (values.userClass === 'Ad-hoc') {
      data['adhocClient'] = {
        name: values.clientNameOrId,
        email: values.clientEmail,
        contact: values.clientMobile
      }
    }
    console.log('data', data)

    this.props.createBooking(data);
  };

  render() {
    const {
      fields: {
        userClass,
        // client
        clientNameOrId,
        clientEmail,
        clientMobile,
        // patient
        patientNameOrId,
        patientGender,
        patientDOB,
        patientNote,
        // case
        postal,
        unit,
        addr,
        service,
        time,
        caseNote,
      },
      userClassChoice,
      genderChoice,
      serviceChoice,
      timeChoice,
      showDayPickerPopup,

      invalid,
      handleSubmit,
      submitFailed,
      submitting,
    } = this.props;

    const { userList, patientList, patientListErr, selectedDates } = this.state;
    const flattenServiceChoice = serviceChoice && Object.values(serviceChoice).reduce((result, service) => {
      service.classes.map(serviceClass => {
        result.push({
          name: `${service.name} (${parseFloat(serviceClass.duration)} hr${parseFloat(service.duration) > 1 ? 's' : ''})`,
          value: `${service._id}:${serviceClass.duration}`,
        })
      })
      return result;
    }, []) || [];

    return (
      <div>
        <DayPickerPopup title='Date Picker' />

        <form className={s.adminCaseManageForm} onSubmit={handleSubmit(this.onSubmit)}>
          <Grid fluid>

            {/* user type */}
            <Row className={s.mainUser}>
              <Col xs={12} md={12}>
                <span>User Type*&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <div className={cx("select", s.userType)}>
                  <span></span>
                  <select className={s.discountTypeInput} id={userClass} name={userClass} {...userClass} onChange={this.onSetUserClass}>
                    {userClassChoice && userClassChoice.map(item => (
                      <option key={userClassChoice.indexOf(item)} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                </div>
                {userClass.touched && userClass.error && <div className={s.formError}>{userClass.error}</div>}
              </Col>
            </Row>

            {/* client info */}
            <Row className={s.mainCat}>
              <Col xs={12} md={6} className={s.mainCatCol}>
                {userClass.value === 'Registered User' && userList ? (
                  <div className={s.mainCatContainer}>
                    <p>Client Name*</p>
                    <div className={s.inputField}>
                      <div className={cx("select", s.selectInput)}>
                        <span></span>
                        <select id={clientNameOrId} name={clientNameOrId} {...clientNameOrId} onChange={this.onSetRegUser}>
                          <option value="">-- SELECT --</option>
                          {userList.map(item => (
                            <option key={userList.indexOf(item)} value={item._id}>{item.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {patientListErr && <div className={s.formError}>This client has no patient</div> || clientNameOrId.touched && clientNameOrId.error && <div className={s.formError}>{clientNameOrId.error}</div>}
                  </div>
                ) : (
                  <div className={s.mainCatContainer}>
                    <p>Client Name*</p>
                    <div className={s.inputField}>
                      <input type="text" className={s.textInput} {...clientNameOrId} />
                      {clientNameOrId.touched && clientNameOrId.error && <div className={s.formError}>{clientNameOrId.error}</div>}
                    </div>
                  </div>
                )}

                <div className={s.mainCatContainer}>
                  <p>Client Email*</p>
                  <div className={s.inputField}>
                    <input type="text" className={s.textInput} {...clientEmail} disabled={userClass.value === 'Registered User'}/>
                    {clientEmail.touched && clientEmail.error && <div className={s.formError}>{clientEmail.error}</div>}
                  </div>
                </div>

              </Col>
              <Col xs={12} md={6} className={s.mainCatCol}>
                <div className={s.mainCatContainer}>
                  <p>Client Mobile*</p>
                  <div className={s.inputField}>
                    <input type="text" className={s.textInput} {...clientMobile} disabled={userClass.value === 'Registered User'}/>
                    {clientMobile.touched && clientMobile.error && <div className={s.formError}>{clientMobile.error}</div>}
                  </div>
                </div>
              </Col>
            </Row>

            {/* patient info */}
            <Row className={s.mainCat}>
              <Col xs={12} md={6} className={s.mainCatCol}>
                <div className={s.mainCatContainer}>
                  <p>Patient Name*</p>
                  <div className={s.inputField}>
                    {userClass.value === 'Registered User' ? (
                      <div className={cx("select", s.selectInput)}>
                        <span></span>
                        <select id={patientNameOrId} name={patientNameOrId} {...patientNameOrId} onChange={this.onSetRegUserPatient} disabled={!userClass.value === 'Registered User' || !clientNameOrId.value || !patientList}>
                          <option value="">-- SELECT --</option>
                          {patientList && patientList.map(item => (
                            <option key={patientList.indexOf(item)} value={item._id}>{item.name}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <input type="text" className={s.textInput} {...patientNameOrId} />
                    )}
                  </div>
                  {patientNameOrId.touched && patientNameOrId.error && <div className={s.formError}>{patientNameOrId.error}</div>}
                </div>

                <div className={s.mainCatContainer}>
                  <p>Patient Gender*</p>
                  <div className={s.inputField}>
                    <div className={cx("select", s.selectInput)}>
                      <span></span>
                      <select id={patientGender} name={patientGender} {...patientGender} value={patientGender.value} disabled={userClass.value === 'Registered User'}>
                        <option value="">-- Select --</option>
                        {genderChoice && genderChoice.map(item => (
                          <option key={genderChoice.indexOf(item)} value={item.value}>{item.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

              </Col>

              <Col xs={12} md={6} className={s.mainCatCol}>
                <div className={s.mainCatContainer}>
                  <p>Patient DOB*</p>
                  <div className={s.inputField}>
                    <div className={cx("DateInput", s.dateInput)}>
                      <input className={s.dateInput} type="text" id="patientDOB" name="patientDOB" placeholder="YYYY-MM-DD" {...patientDOB} disabled={userClass.value === 'Registered User'}/>
                      <span onClick={() => this.props.showDayPickerPopup(patientDOB.value, 'adminCaseManageForm')}>
                        </span>
                      </div>
                      {patientDOB.touched && patientDOB.error && <div className={s.formError}>{patientDOB.error}</div>}
                  </div>
                </div>

                <div className={s.mainCatContainer}>
                  <p>Patient Note</p>
                  <div className={s.inputField}>
                    <textarea className={s.fullWidthInput} id="addr" name="addr" {...patientNote} />
                    {patientNote.touched && patientNote.error && <div className={s.formError}>{patientNote.error}</div>}
                  </div>
                </div>
              </Col>
            </Row>

            {/* case detail */}
            <Row className={s.mainCat}>
              <Col xs={12} md={6} className={s.mainCatCol}>
                <div className={s.mainCatContainer}>
                  <p>Postal Code*</p>
                  <div className={s.inputField}>
                    <input type="text" className={s.textInput} {...postal} />
                    {postal.touched && postal.error && <div className={s.formError}>{postal.error}</div>}
                  </div>
                </div>

                <div className={s.mainCatContainer}>
                  <p>Unit Number*</p>
                  <div className={s.inputField}>
                    <input type="text" className={s.textInput} {...unit} />
                    {unit.touched && unit.error && <div className={s.formError}>{unit.error}</div>}
                  </div>
                </div>

                <div className={s.mainCatContainer}>
                  <p>Address*</p>
                  <div className={s.inputField}>
                    <textarea className={s.fullWidthInput} id="addr" name="addr" placeholder="Enter patient address" {...addr} />
                    {addr.touched && addr.error && <div className={s.formError}>{addr.error}</div>}
                  </div>
                </div>

                <div className={s.mainCatContainer}>
                  <p>Case Note</p>
                  <div className={s.inputField}>
                    <textarea className={s.fullWidthInput} id="caseNote" name="caseNote" {...caseNote} />
                    {caseNote.touched && caseNote.error && <div className={s.formError}>{caseNote.error}</div>}
                  </div>
                </div>
              </Col>

              <Col xs={12} md={6} className={s.mainCatCol}>
                <div className={s.mainCatContainer}>
                  <p>Service Required*</p>
                  <div className={s.inputField}>
                    <div className={cx("select", s.selectInput)}>
                      <span></span>
                      <select id={service} name={service} {...service} value={service.value}>
                        <option value="">-- Select --</option>
                        {flattenServiceChoice && flattenServiceChoice.map(item => (
                          <option key={flattenServiceChoice.indexOf(item)} value={item.value}>{item.name}</option>
                        ))}
                      </select>
                    </div>
                    {service.touched && service.error && <div className={s.formError}>{service.error}</div>}
                  </div>
                </div>

                <div className={s.mainCatContainer}>
                  <p>Date Required*</p>
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
                </div>

                <div className={s.mainCatContainer}>
                  <p>Time Required*</p>
                  <div className={s.inlineField}>
                    {timeChoice.map(item => (
                      <div>
                        <input type="radio" name='time' id={`time_${item.value}`} {...time} value={item.value} checked={time.value === `${item.value}`} />
                        <label htmlFor={`time_${item.value}`}><span><span></span></span><span>{item.label}</span></label>
                      </div>
                    ))}
                    {time.touched && time.error && <div className={s.formError}>{time.error}</div>}
                  </div>
                </div>
              </Col>
            </Row>

          </Grid>

          <div className={s.formSectionSubmit}>
            {submitFailed && invalid && <div className={s.formError}>You have one or more form field errors.</div>}
            <button className="btn btn-primary" type="submit" disabled={invalid || submitting || !selectedDates.length}>Save Changes</button>
          </div>
        </form>
      </div>
    );
  }
}

const validate = values => {
  const errors = {};

  if (!values.clientNameOrId) {
    errors.clientNameOrId = 'Required';
  }

  if (values.userClass === 'Ad-hoc' && !values.clientEmail) {
    errors.clientEmail = 'Required';
  }

  if (values.userClass === 'Ad-hoc' && !values.clientMobile) {
    errors.clientMobile = 'Required';
  }

  if (!values.patientNameOrId) {
    errors.patientNameOrId = 'Required';
  }

  if (values.userClass === 'Ad-hoc' && !values.patientGender) {
    errors.patientGender = 'Required';
  }

  if (values.userClass === 'Ad-hoc' && !values.patientDOB) {
    errors.patientDOB = 'Required';
  }

  if (!values.postal) {
    errors.postal = 'Required';
  } else if (!/^[0-9]{6}$/i.test(values.postal)) {
    errors.postal = 'Invalid postal code (e.g. 123456)';
  }

  if (!values.unit) {
    errors.unit = 'Required';
  }

  if (!values.addr) {
    errors.addr = 'Required';
  }

  if (!values.service) {
    errors.service = 'Required';
  }

  if (!values.time) {
    errors.time = 'Required';
  }

  return errors
}

AdminCaseManageForm.propTypes = {
  serviceChoice: React.PropTypes.object,
  fetchServices: React.PropTypes.func,
};

const reduxFormConfig = {
  form: 'adminCaseManageForm',
  fields: [
    'userClass',
    // client
    'clientNameOrId',
    'clientEmail',
    'clientMobile',
    // patient
    'patientNameOrId',
    'patientGender',
    'patientDOB',
    'patientNote',
    // case
    'postal',
    'unit',
    'addr',
    'service',
    'time',
    'caseNote',
  ],
  validate,
}

const mapStateToProps = (state) => {
  const user = state.user.data;
  const userClassChoice = [{label: 'Ad-hoc', value: 'Ad-hoc'}, {label: 'Registered User', value: 'Registered User'}];
  const timeChoice = [{label: 'Morning', value: 'morning'}, {label: 'Afternoon', value: 'afternoon'}, {label: 'Evening', value: 'evening'}];

  return {
    initialValues: {
      userClass: userClassChoice[0].value,
    },
    genderChoice: state.config.data && state.config.data.genders,
    serviceChoice: state.services.data,
    userClassChoice,
    timeChoice,
    user,
  }
};

const mapDispatchToProps = (dispatch) => ({
  fetchServices: () => dispatch(fetchServices()),
  showDayPickerPopup: (value, source) => dispatch(showDayPickerPopup(value, source)),
  getUsers: () => dispatch(getUsers()),
  getPatients: (params) => dispatch(getPatients(params)),
  createBooking: (params) => dispatch(createBooking(params)),
  resetForm: () => dispatch(reset('adminCaseManageForm')),
  changeFieldValue: (field, value) => dispatch(change('adminCaseManageForm', field, value)),
});

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(AdminCaseManageForm);
