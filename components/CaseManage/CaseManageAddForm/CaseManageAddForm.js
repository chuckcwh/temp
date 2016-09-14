import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import s from './CaseManageAddForm.css';
import { reduxForm } from 'redux-form';
import Header from '../../Header';
import history from '../../../core/history';
import { showDayPickerPopup, fetchServices, getUserList, getPatients } from '../../../actions';
import DayPickerPopup from '../../DayPickerPopup';
import { Grid, Row, Col } from 'react-flexbox-grid';
import MultiSelect from '../../MultiSelect';
import some from 'lodash/some';
import remove from 'lodash/remove';


class CaseManageAddForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedDates: [],
    }
  }

  componentDidMount() {
    this.props.fetchServices();
    this.props.getUserList().then((res) => {
      if (res.type === 'USER_LIST_SUCCESS') {
        this.setState({
          userList: res.response.data.length && res.response.data.filter(user => user.role === 'client') || []
        })

        
        clientName,
        clientEmail,
        clientMobile,
      }
    });
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

  onGetPatients = (e) => {
    e.preventDefault();

    const userId = e.target.value;
    this.props.getPatients({ userId }).then((res) => {
      if (res.type === 'PATIENTS_SUCCESS' && res.response.data.length) {
        this.setState({
          patientList: res.response.data || []
        })
      }
    })

  };

  onSubmit = (values) => {
    console.log('values', values);
    // return new Promise((resolve, reject) => [
    //   this.props.createPromo({
    //     code: values.code,
    //     services: values.services,
    //     name: values.name,
    //     description: values.description,
    //     date: {
    //       dateTimeStart: moment(values.startDate).format('YYYY-MM-DD'),
    //       dateTimeEnd: moment(values.endDate).format('YYYY-MM-DD'),
    //       voidDates: this.state.selectedDates
    //     },
    //
    //     regions: values.regions,
    //     discountRate: values.discountRate,
    //     discountType: values.discountType,
    //   }).then((res) => {
    //     console.log('response', res);
    //   })
    // ])
  };

  render() {
    const {
      fields: {
        userClass,
        // ad-hoc
        name,
        email,
        mobile,
        // registered user
        clientName,
        clientEmail,
        clientMobile,
        // patient
        patientName,
        patientGender,
        patientDOB,
        patientNote,
        patientPostal,
        patientUnit,
        patientAddr,
        // case
        services,
        dates,
        time,
        caseNote,
      },
      userClassChoice,
      genderChoice,
      servicesChoice,
      timeChoice,
      showDayPickerPopup,

      invalid,
      handleSubmit,
      submitFailed,
      submitting,
    } = this.props;

    const { userList, patientList, selectedDates } = this.state;
    const flattenServicesChoice = servicesChoice && Object.values(servicesChoice).reduce((result, service) => {
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

        <form className={s.caseManageAddForm} onSubmit={handleSubmit(this.onSubmit)}>
          <Grid fluid>

            {/* user type */}
            <Row className={s.mainUser}>
              <Col xs={12} md={12}>
                <span>User Type&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <div className={cx("select", s.userType)}>
                  <span></span>
                  <select className={s.discountTypeInput} id={userClass} name={userClass} {...userClass}>
                    {userClassChoice && userClassChoice.map(item => (
                      <option key={userClassChoice.indexOf(item)} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
                {userClass.touched && userClass.error && <div className={s.formError}>{userClass.error}</div>}
              </Col>
            </Row>

            {/* client info */}
            <Row className={s.mainCat}>
              <Col xs={12} md={6} className={s.mainCatCol}>
                {userClass.value === 'Ad-hoc' && (
                  <div className={s.mainCatContainer}>
                    <p>Client Name</p>
                    <div className={s.inputField}>
                      <input type="text" className={s.textInput} {...name} />
                      {name.touched && name.error && <div className={s.formError}>{name.error}</div>}
                    </div>
                  </div>
                )}
                {userClass.value === 'Registered User' && userList && (
                  <div className={s.mainCatContainer}>
                    <p>Client Name</p>
                    <div className={cx("select", s.dateInput)}>
                      <span></span>
                      <select className={s.discountTypeInput} id={clientName} name={clientName} {...clientName} onChange={this.onGetPatients} value={clientName.value}>
                        {userList.map(item => (
                          <option key={userList.indexOf(item)} value={item._id}>{item.name}</option>
                        ))}
                      </select>
                    </div>
                    {clientName.touched && clientName.error && <div className={s.formError}>{clientName.error}</div>}
                  </div>
                )}

                <div className={s.mainCatContainer}>
                  <p>Client Email</p>
                  <div className={s.inputField}>
                    <input type="text" className={s.textInput} {...email} />
                    {email.touched && email.error && <div className={s.formError}>{email.error}</div>}
                  </div>
                </div>

              </Col>
              <Col xs={12} md={6} className={s.mainCatCol}>
                <div className={s.mainCatContainer}>
                  <p>Client Mobile</p>
                  <div className={s.inputField}>
                    <input type="text" className={s.textInput} {...mobile} />
                    {mobile.touched && mobile.error && <div className={s.formError}>{mobile.error}</div>}
                  </div>
                </div>
              </Col>
            </Row>

            {/* patient info */}
            <Row className={s.mainCat}>
              <Col xs={12} md={6} className={s.mainCatCol}>
                <div className={s.mainCatContainer}>
                  <p>Patient Name</p>
                  <div className={s.inputField}>
                    <input type="text" className={s.textInput} {...patientName} />
                    {patientName.touched && patientName.error && <div className={s.formError}>{patientName.error}</div>}
                  </div>
                </div>

                <div className={s.mainCatContainer}>
                  <p>Patient Gender</p>
                  <div className={s.inputField}>
                    <div className={cx("select", s.selectInput)}>
                      <span></span>
                      <select id={patientGender} name={patientGender} {...patientGender} value={patientGender.value}>
                        <option value="">-- Select --</option>
                        {genderChoice && genderChoice.map(item => (
                          <option key={genderChoice.indexOf(item)} value={item.value}>{item.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className={s.mainCatContainer}>
                  <p>Patient DOB</p>
                  <div className={s.inputField}>
                    <div className={cx("DateInput", s.dateInput)}>
                      <input className={s.dateInput} type="text" id="patientDOB" name="patientDOB" placeholder="YYYY-MM-DD" {...patientDOB} />
                      <span onClick={() => this.props.showDayPickerPopup(patientDOB.value, 'caseManageAddForm')}>
                        </span>
                      </div>
                      {patientDOB.touched && patientDOB.error && <div className={s.formError}>{patientDOB.error}</div>}
                  </div>
                </div>

                {/*
                {patientList ? (
                  <div className={s.mainCatContainer}>
                    <p>Patient</p>
                    <div className={cx("select", s.dateInput)}>
                      <span></span>
                      <select className={s.discountTypeInput} id={patientName} name={patientName} {...patientName}>
                        <option value="">-- SELECT --</option>
                        {patientList.map(item => (
                          <option key={patientList.indexOf(item)} value={item._id}>{item.name}</option>
                        ))}
                      </select>
                    </div>
                    {patientName.touched && patientName.error && <div className={s.formError}>{patientName.error}</div>}
                  </div>
                ) : (
                  <div className={s.mainCatContainer}>
                    <p>This user has no patients.</p>
                  </div>
                )}
                */}

                <div className={s.mainCatContainer}>
                  <p>Patient postal Code</p>
                  <div className={s.inputField}>
                    <input type="text" className={s.textInput} {...patientPostal} />
                    {patientPostal.touched && patientPostal.error && <div className={s.formError}>{patientPostal.error}</div>}
                  </div>
                </div>
              </Col>

              <Col xs={12} md={6} className={s.mainCatCol}>
                <div className={s.mainCatContainer}>
                  <p>Patient unit Number</p>
                  <div className={s.inputField}>
                    <input type="text" className={s.textInput} {...patientUnit} />
                    {patientUnit.touched && patientUnit.error && <div className={s.formError}>{patientUnit.error}</div>}
                  </div>
                </div>

                <div className={s.mainCatContainer}>
                  <p>Patient address</p>
                  <div className={s.inputField}>
                    <textarea className={s.fullWidthInput} id="patientAddr" name="patientAddr" placeholder="Enter patient address" {...patientAddr} />
                    {patientAddr.touched && patientAddr.error && <div className={s.formError}>{patientAddr.error}</div>}
                  </div>
                </div>

                <div className={s.mainCatContainer}>
                  <p>Patient Note</p>
                  <div className={s.inputField}>
                    <textarea className={s.fullWidthInput} id="patientAddr" name="patientAddr" {...patientNote} />
                    {patientNote.touched && patientNote.error && <div className={s.formError}>{patientNote.error}</div>}
                  </div>
                </div>
              </Col>
            </Row>

            {/* case detail */}
            <Row className={s.mainCat}>
              <Col xs={12} md={6} className={s.mainCatCol}>
                <div className={s.mainCatContainer}>
                  <p>Services Required</p>
                  <div className={s.inputField}>
                    <div className={cx("select", s.selectInput)}>
                      <span></span>
                      <select id={patientGender} name={patientGender} {...patientGender} value={patientGender.value}>
                        <option value="">-- Select --</option>
                        {flattenServicesChoice && flattenServicesChoice.map(item => (
                          <option key={flattenServicesChoice.indexOf(item)} value={item.value}>{item.name}</option>
                        ))}
                      </select>
                    </div>
                    {services.touched && services.error && <div className={s.formError}>{services.error}</div>}
                  </div>
                </div>

                <div className={s.mainCatContainer}>
                  <p>Time Required</p>
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

                <div className={s.mainCatContainer}>
                  <p>Case Note</p>
                  <div className={s.inputField}>
                    <textarea className={s.fullWidthInput} id="patientAddr" name="patientAddr" {...caseNote} />
                    {caseNote.touched && caseNote.error && <div className={s.formError}>{caseNote.error}</div>}
                  </div>
                </div>
              </Col>
              <Col xs={12} md={6} className={s.mainCatCol}>
                <div className={s.mainCatContainer}>
                  <p>Date Required</p>
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
                  {dates.touched && dates.error && <div className={s.formError}>{dates.error}</div>}
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

CaseManageAddForm.propTypes = {
  servicesChoice: React.PropTypes.object,
  fetchServices: React.PropTypes.func,
};

const reduxFormConfig = {
  form: 'caseManageAddForm',
  fields: [
    'userClass',
    // ad-hoc
    'name',
    'email',
    'mobile',
    // registered user
    'clientName',
    'clientEmail',
    'clientMobile',
    // patient
    'patientName',
    'patientGender',
    'patientDOB',
    'patientNote',
    'patientPostal',
    'patientUnit',
    'patientAddr',
    // case
    'services',
    'dates',
    'time',
    'caseNote',
  ],
  validate,
}

const mapStateToProps = (state) => {
  const user = state.user.data;
  const userClassChoice = ['Ad-hoc', 'Registered User'];
  const timeChoice = [{label: 'Morning', value: 'morning'}, {label: 'Afternoon', value: 'afternoon'}, {label: 'Evening', value: 'evening'}];

  return {
    initialValues: {
      userClass: userClassChoice[0],
    },
    genderChoice: state.config.data && state.config.data.genders,
    servicesChoice: state.services.data,
    userClassChoice,
    timeChoice,
    user,
  }
};

const mapDispatchToProps = (dispatch) => ({
  fetchServices: () => dispatch(fetchServices()),
  showDayPickerPopup: (value, source) => dispatch(showDayPickerPopup(value, source)),
  getUserList: () => dispatch(getUserList()),
  getPatients: (params) => dispatch(getPatients(params)),
});

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(CaseManageAddForm);
