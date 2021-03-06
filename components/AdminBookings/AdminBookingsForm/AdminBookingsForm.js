import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import s from './AdminBookingsForm.css';
import Container from '../../Container';
import { reduxForm, change } from 'redux-form';
import Header from '../../Header';
import history from '../../../core/history';
import { showDayPickerPopup, fetchServices, getUsers, getPatients, createBooking, fetchAddress, getBooking } from '../../../actions';
import DayPickerPopup from '../../DayPickerPopup';
import { Grid, Row, Col } from 'react-flexbox-grid';
import MultiSelect from '../../MultiSelect';
import some from 'lodash/some';
import remove from 'lodash/remove';


class AdminBookingsForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedDates: [],
    }
  }

  componentDidMount() {
    const { pageAction, bookingId } = this.props.params;
    const { fetchServices, getUsers, getBooking } = this.props;

    fetchServices();
    getUsers().then((res) => {
      if (res.type === 'USERS_SUCCESS') {
        this.setState({
          userList: res.response.data.length && res.response.data.filter(user => user.role === 'client').sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0) || []
        })
      }
    });

    if (pageAction === 'edit' && bookingId) {
      getBooking({ bookingId }).then(res => {
        // if (res.type === '')
      })
    }
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

      this.props.changeFieldValue('patientNameOrId', patient._id);
      this.props.changeFieldValue('patientGender', patient.gender);
      this.props.changeFieldValue('patientDOB', moment(patient.dob).format('YYYY-MM-DD'));
      this.props.changeFieldValue('postal', patient.address && patient.address.postal);
      this.props.changeFieldValue('unit', patient.address && patient.address.unit);
      this.props.changeFieldValue('addr', patient.address && patient.address.description);

      if (patient.address) {
        this.onPostalChange(patient.address.postal)
      }
    }
  }

  onPostalChange = (postal) => {
    if (/^[0-9]{6}$/i.test(postal)) {
      this.props.fetchAddress(postal).then((res) => {
        if (res.type === 'GEOCODE_SUCCESS') {
          this.props.changeFieldValue('lat', res.lat);
          this.props.changeFieldValue('lng', res.lng);
          this.props.changeFieldValue('region', res.region);
          this.props.changeFieldValue('neighborhood', res.neighborhood);

          this.setState({postalHint: "success"});
        } else {
          this.setState({postalHint: "failure"});
        }
      })
    }
  }

  onSelectDay = (e, day) => {
    if (!this.isDisabled(day)) {
      const days = this.state.selectedDates;

      if (some(days, item => DateUtils.isSameDay(item.date, day))) {
        remove(days, item => DateUtils.isSameDay(item.date, day));
      } else {
        days.push({date: day, time: this.props.timeChoice[0].value});
        days.sort((a, b) => a.date.getTime() - b.date.getTime());
      }

      this.setState({ selectedDates: days });
    }
  };

  isDisabled = (day) => {
    const d = DateUtils.clone(day);
    d.setDate(d.getDate() - 1);
    return DateUtils.isPastDay(d);
  };

  onSetSessionTime = (date, time) => {
    const { selectedDates } = this.state;
    const index = selectedDates.map(item => item.date).indexOf(date);

    selectedDates[index].time = time;
    this.setState({ selectedDates });
  }

  onSubmit = (values) => {
    const data = {
      sessions: this.state.selectedDates.map(session => ({
        service: values.service.split(':')[0],
        serviceClass: values.service.split(':')[1],
        address: {
          description: values.addr,
          unit: values.unit,
          postal: values.postal,
          lat: values.lat,
          lng: values.lng,
          region: values.region,
          neighborhood: values.neighborhood,
        },
        date: moment(session.date).format('YYYY-MM-DD'),
        timeSlot: session.time,
        additionalInfo: values.caseNote,
        patient: values.userClass === 'Registered User' ? values.patientNameOrId : undefined,
        client: values.userClass === 'Registered User' ? values.clientNameOrId : undefined,
      })),
    }

    if (values.userClass === 'Ad-hoc') {
      data.adhocClient = {
        name: values.clientNameOrId,          // for ad-hoc client it is always name
        email: values.clientEmail,
        contact: values.clientMobile,
      };
      data.adhocPatient = {
        name: values.patientNameOrId,         // for ad-hoc patient it is always name
        email: values.patientEmail,
        contact: values.patientMobile,
        dob: values.patientDOB,
        gender: values.patientGender,
        specialNotes: values.patientNote,
      };
    }

    console.log('data', data)
    this.props.createBooking(data);

    this.props.resetForm();
    this.setState({
      selectedDates: [],
      postalHint: "",
    });
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

    const { pageAction } = this.props.params;
    const { userList, patientList, patientListErr, selectedDates, postalHint } = this.state;
    const flattenServiceChoice = serviceChoice && Object.values(serviceChoice).reduce((result, service) => {
      Object.values(service.classes).map(serviceClass => {
        result.push({
          name: `${service.name} (${parseFloat(serviceClass.duration)} hr${parseFloat(service.duration) > 1 ? 's' : ''})`,
          value: `${service._id}:${serviceClass._id}`,
        })
      })
      return result;
    }, []) || [];

    return (
      <div className={s.adminBookingsForm}>
        <Header title={pageAction === "add" && "Add Booking" || "Edit Booking"} />
        <Container>
          <DayPickerPopup title='Date Picker' />

          <form onSubmit={handleSubmit(this.onSubmit)}>
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
                      <span onClick={() => this.props.showDayPickerPopup(patientDOB.value, 'adminBookingsForm')}>
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
                    <input type="text" className={s.textInput} {...postal} onBlur={() => this.onPostalChange(postal.value)} />
                    {postal.touched && postal.error && <div className={s.formError}>{postal.error}</div>}
                    {postalHint === 'success' && <div className={s.formSuccess}>Fetch geocode success.</div> ||
                      postalHint === 'failure' && <div className={s.formError}>Fetch geocode failure.</div>}
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
                  <p>Date / Time Required*</p>
                  <div className="text-center">
                    <DayPicker
                      numberOfMonths={1}
                      modifiers={{
                        selected: day => selectedDates
                          && some(selectedDates, item => DateUtils.isSameDay(item.date, day)),
                        disabled: this.isDisabled,
                      }}
                      onDayClick={this.onSelectDay}
                    />
                  </div>
                  <div className="text-center">
                    {selectedDates.length ? <h3>Selected Dates:</h3> : ""}
                    {
                      selectedDates && selectedDates.map((day) => (
                        <div key={day.date.getTime()}>
                          {moment(day.date).format('DD MMM YYYY, dddd')}&nbsp;&nbsp;
                          <div className={cx("select", null)}>
                            <span></span>
                            <select className={s.dateTimeInput} onChange={(e) => this.onSetSessionTime(day.date, e.target.value)}>
                              {timeChoice && timeChoice.map(item => (
                                <option key={timeChoice.indexOf(item)} value={item.value}>{item.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))
                    }
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
        </Container>
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

  return errors
}

AdminBookingsForm.propTypes = {
  serviceChoice: React.PropTypes.object,
  fetchServices: React.PropTypes.func,
};

const reduxFormConfig = {
  form: 'adminBookingsForm',
  fields: [
    'userClass',
    // client
    'clientNameOrId',   // name for ad-hoc, id for registered client
    'clientEmail',
    'clientMobile',
    // patient
    'patientNameOrId',  // name for ad-hoc, id for registered patient
    'patientGender',
    'patientDOB',
    'patientNote',
    // case
    'postal',
    'unit',
    'addr',
    'service',
    'caseNote',
    // case (hide)
    'lat',
    'lng',
    'region',
    'neighborhood',
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
  fetchAddress: (postal) => dispatch(fetchAddress(postal)),
  showDayPickerPopup: (value, source) => dispatch(showDayPickerPopup(value, source)),
  getUsers: () => dispatch(getUsers()),
  getPatients: (params) => dispatch(getPatients(params)),
  getBooking: (params) => dispatch(getBooking(params)),
  createBooking: (params) => dispatch(createBooking(params)),
  resetForm: () => dispatch(reset('adminBookingsForm')),
  changeFieldValue: (field, value) => dispatch(change('adminBookingsForm', field, value)),
});

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(AdminBookingsForm);
