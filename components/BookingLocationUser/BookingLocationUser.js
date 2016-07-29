import React, { Component } from 'react';
import { connect } from 'react-redux';
import linkState from 'react-link-state';
import classNames from 'classnames';
import moment from 'moment';
import Loader from 'react-loader';
import s from './BookingLocationUser.css';
import Container from '../Container';
import InlineForm from '../InlineForm';
import BookingLocationUserPatientForm from '../BookingLocationUserPatientForm';
import DayPickerPopup from '../DayPickerPopup';
import { fetchLanguages, fetchAddress, getPatients, createPatient, getPatient, getUser,
  editPatient, editClient, editEmail, editMobile, verifyMobile, setOrderBooker, setOrderLocation,
  setOrderPatient, setLastPage, showAlertPopup, showDayPickerPopup, showInlineForm } from '../../actions';
import history from '../../core/history';
import util from '../../core/util';

const imgPencil = require('../pencil.png');

class BookingLocationUser extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      savingPatient: false,

      patientId: props.order && props.order.patient && props.order.patient.id,
      additionalInfo: props.order && props.order.booker && props.order.booker.additionalInfo,
    };
  }

  componentDidMount() {
    !this.props.patients && this.getPatients(this.props.user);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.order && newProps.order.patient && newProps.order.patient.id && this.props.order
      && this.props.order.patient && this.props.order.patient.id
      && newProps.order.patient.id !== this.props.order.patient.id) {
      this.setState({ patientId: newProps.order.patient.id });
    }
  }

  onClickEdit = (entity) => (event) => {
    event.preventDefault();
    this.setState({ editing: true });

    switch (entity) {
      case 'userName':
        this.props.showInlineForm({
          name: 'userName',
          inputs: {
            fullName: {
              label: 'Name',
              type: 'text',
              initialValue: this.props.user && this.props.user.clients
                && this.props.user.clients[0] && this.props.user.clients[0].fullName,
            },
          },
          validate: (values) => {
            const errors = {};
            if (!values.fullName) {
              errors.fullName = 'Required';
            }
            return errors;
          },
          ok: this.onClickSave('userName'),
          cancel: () => { this.setState({ editing: false }); },
        });
        break;
      case 'userEmail':
        this.props.showInlineForm({
          name: 'userEmail',
          inputs: {
            email: {
              label: 'Email',
              type: 'text',
              initialValue: this.props.user.email,
            },
          },
          validate: (values) => {
            const errors = {};
            if (!values.email) {
              errors.email = 'Required';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
              errors.email = 'Invalid email address';
            }
            return errors;
          },
          ok: this.onClickSave('userEmail'),
          cancel: () => { this.setState({ editing: false }); },
        });
        break;
      case 'userMobile':
        this.props.showInlineForm({
          name: 'userMobile',
          inputs: {
            mobilePhone: {
              label: 'Mobile Number',
              type: 'text',
              initialValue: this.props.user.mobilePhone,
            },
          },
          validate: (values) => {
            const errors = {};
            if (!values.mobilePhone) {
              errors.mobilePhone = 'Required';
            } else if (!/^[8,9]{1}[0-9]{7}$/i.test(values.mobilePhone)) {
              errors.mobilePhone = 'Invalid mobile phone';
            }
            return errors;
          },
          ok: this.onClickSave('userMobile'),
          cancel: () => { this.setState({ editing: false }); },
        });
        break;
      case 'patientName':
        this.props.showInlineForm({
          name: 'patientName',
          inputs: {
            fullName: {
              label: 'Full Name',
              type: 'text',
              initialValue: this.props.patients && this.state.patientId
                && this.props.patients[this.state.patientId]
                && this.props.patients[this.state.patientId].fullName,
            },
          },
          validate: (values) => {
            const errors = {};
            if (!values.fullName) {
              errors.fullName = 'Required';
            }
            return errors;
          },
          ok: this.onClickSave('patientName'),
          cancel: () => { this.setState({ editing: false }); },
        });
        break;
      case 'patientLanguages':
        this.props.fetchLanguages().then(() => {
          if (this.props.languages) {
            this.props.showInlineForm({
              name: 'patientLanguages',
              inputs: {
                languages: {
                  label: 'Languages',
                  type: 'multiselect',
                  options: Object.values(this.props.languages).map((l) => ({ label: l.name, value: l.id })),
                  initialValue: this.props.patients && this.state.patientId
                    && this.props.patients[this.state.patientId]
                    && this.props.patients[this.state.patientId].languages.map(l => l.id).join(','),
                },
              },
              validate: (values) => {
                const errors = {};
                if (!values.languages) {
                  errors.languages = 'Required';
                }
                return errors;
              },
              ok: this.onClickSave('patientLanguages'),
              cancel: () => { this.setState({ editing: false }); },
            });
          }
        });
        break;
      case 'patientGender':
        this.props.showInlineForm({
          name: 'patientGender',
          inputs: {
            gender: {
              label: 'Gender',
              type: 'select',
              options: [{ label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }],
              initialValue: this.props.patients && this.state.patientId
                && this.props.patients[this.state.patientId]
                && this.props.patients[this.state.patientId].gender,
            },
          },
          validate: (values) => {
            const errors = {};
            if (!values.gender) {
              errors.gender = 'Required';
            }
            return errors;
          },
          ok: this.onClickSave('patientGender'),
          cancel: () => { this.setState({ editing: false }); },
        });
        break;
      case 'patientDob':
        this.props.showInlineForm({
          name: 'patientDob',
          inputs: {
            dob: {
              label: 'Date of Birth',
              type: 'date',
              initialValue: this.props.patients && this.state.patientId
                && this.props.patients[this.state.patientId]
                && this.props.patients[this.state.patientId].dob,
            },
          },
          validate: (values) => {
            const errors = {};
            if (!values.dob) {
              errors.dob = 'Required';
            } else if (!/^\d{4}[-]\d{2}[-]\d{2}$/i.test(values.dob)) {
              errors.dob = 'Invalid date of birth (e.g. YYYY-MM-DD)';
            }
            return errors;
          },
          ok: this.onClickSave('patientDob'),
          cancel: () => { this.setState({ editing: false }); },
        });
        break;
      case 'patientRace':
        this.props.showInlineForm({
          name: 'patientRace',
          inputs: {
            race: {
              label: 'Race',
              type: 'select',
              options: [
                { label: 'Chinese', value: 'Chinese' },
                { label: 'Malay', value: 'Malay' },
                { label: 'Indian', value: 'Indian' },
                { label: 'Eurasian', value: 'Eurasian' },
                { label: 'Others', value: 'Others' },
              ],
              initialValue: this.props.patients && this.state.patientId
                && this.props.patients[this.state.patientId]
                && this.props.patients[this.state.patientId].race,
            },
          },
          validate: (values) => {
            const errors = {};
            if (!values.race) {
              errors.race = 'Required';
            }
            return errors;
          },
          ok: this.onClickSave('patientRace'),
          cancel: () => { this.setState({ editing: false }); },
        });
        break;
      case 'patientReligion':
        this.props.showInlineForm({
          name: 'patientReligion',
          inputs: {
            religion: {
              label: 'Religion',
              type: 'select',
              options: [
                { label: 'Buddhist', value: 'Buddhist' },
                { label: 'Christian', value: 'Christian' },
                { label: 'Free Thinker', value: 'Free Thinker' },
                { label: 'Hinduism', value: 'Hinduism' },
                { label: 'Islam', value: 'Islam' },
                { label: 'Taoist', value: 'Taoist' },
                { label: 'Catholic', value: 'Catholic' },
                { label: 'Others', value: 'Others' },
              ],
              initialValue: this.props.patients && this.state.patientId
                && this.props.patients[this.state.patientId]
                && this.props.patients[this.state.patientId].religion,
            },
          },
          validate: (values) => {
            const errors = {};
            if (!values.religion) {
              errors.religion = 'Required';
            }
            return errors;
          },
          ok: this.onClickSave('patientReligion'),
          cancel: () => { this.setState({ editing: false }); },
        });
        break;
      case 'patientLocation':
        this.props.showInlineForm({
          name: 'patientLocation',
          inputs: {
            postalCode: {
              label: 'Postal Code',
              type: 'text',
              initialValue: this.props.patients && this.state.patientId
                && this.props.patients[this.state.patientId]
                && this.props.patients[this.state.patientId].addresses
                && this.props.patients[this.state.patientId].addresses[0]
                && this.props.patients[this.state.patientId].addresses[0].postalCode,
            },
            address: {
              label: 'Address',
              type: 'text',
              initialValue: this.props.patients && this.state.patientId
                && this.props.patients[this.state.patientId]
                && this.props.patients[this.state.patientId].addresses
                && this.props.patients[this.state.patientId].addresses[0]
                && this.props.patients[this.state.patientId].addresses[0].address,
            },
            unitNumber: {
              label: 'Unit Number',
              type: 'text',
              initialValue: this.props.patients && this.state.patientId
                && this.props.patients[this.state.patientId]
                && this.props.patients[this.state.patientId].addresses
                && this.props.patients[this.state.patientId].addresses[0]
                && this.props.patients[this.state.patientId].addresses[0].unitNumber,
            },
          },
          validate: (values) => {
            const errors = {};
            if (!values.postalCode) {
              errors.postalCode = 'Required';
            } else if (!/^[0-9]{6}$/i.test(values.postalCode)) {
              errors.postalCode = 'Invalid postal code (e.g. 123456)';
            }
            if (!values.address) {
              errors.address = 'Required';
            }
            return errors;
          },
          ok: this.onClickSave('patientLocation'),
          cancel: () => { this.setState({ editing: false }); },
        });
        break;
      default:
        break;
    }
  };

  onClickSave = (entity) => (values) => (
    new Promise((resolve, reject) => {
      switch (entity) {
        case 'userName':
          this.props.editClient({
            cid: this.props.client.id,
            fullName: values.fullName,
          }).then((res) => {
            if (res && res.response && res.response.status === 1) {
              this.props.getUser().then(() => {
                resolve();
                this.setState({ editing: false });
              });
            } else {
              reject({ _error: res.response.message });
            }
          }, (reason) => {
            reject({ _error: reason });
          });
          break;
        case 'userEmail':
          this.props.editEmail({
            email: values.email,
          }).then((res) => {
            if (res && res.response && res.response.status === 1) {
              this.props.getUser().then(() => {
                resolve();
                this.setState({ editing: false });
              });
            } else {
              reject({ _error: res.response.message });
            }
          }, (reason) => {
            reject({ _error: reason });
          });
          break;
        case 'userMobile':
          this.props.editMobile({
            mobilephone: values.mobilePhone,
          }).then((res) => {
            if (res && res.response && res.response.status === 1) {
              // do something here
            } else {
              reject({ _error: res.response.message });
            }
          }, (reason) => {
            reject({ _error: reason });
          });
          break;
        case 'patientName':
        case 'patientGender':
        case 'patientDob':
        case 'patientRace':
        case 'patientReligion':
          this.props.editPatient(Object.assign({
            pid: this.state.patientId,
          }, values)).then((res) => {
            if (res && res.response && res.response.status === 1) {
              this.props.getPatient({ pid: this.state.patientId }).then(() => {
                resolve();
                this.setState({ editing: false });
              });
            } else {
              reject({ _error: res.response.message });
            }
          }, (reason) => reject({ _error: reason }));
          break;
        case 'patientLanguages':
          this.props.editPatient({
            pid: this.state.patientId,
            languages: values.languages.split(','),
          }).then((res) => {
            if (res && res.response && res.response.status === 1) {
              this.props.getPatient({ pid: this.state.patientId }).then(() => {
                resolve();
                this.setState({ editing: false });
              });
            } else {
              reject({ _error: res.response.message });
            }
          }, (reason) => reject({ _error: reason }));
          break;
        case 'patientLocation':
          this.props.editPatient({
            pid: this.state.patientId,
            addresses: [Object.assign({
              id: this.props.patients && this.state.patientId
                && this.props.patients[this.state.patientId]
                && this.props.patients[this.state.patientId].addresses
                && this.props.patients[this.state.patientId].addresses[0]
                && this.props.patients[this.state.patientId].addresses[0].id,
            }, values)],
          }).then((res) => {
            if (res && res.response && res.response.status === 1) {
              this.props.getPatient({ pid: this.state.patientId }).then(() => {
                resolve();
                this.setState({ editing: false });
              });
            } else {
              reject({ _error: res.response.message });
            }
          }, (reason) => reject({ _error: reason }));
          break;
        default:
          break;
      }
    })
  );

  onClickAddPatient = () => {
    this.setState({ patientId: '' });
  };

  onChangePatient = (event) => {
    // console.log(event.target.value);
    this.setState({ patientId: event.target.value });
  };

  onSelectNewDob = (event, date) => {
    this.setState({ dob: date });
  };

  onClickSavePatient = (values) => (
    new Promise((resolve) => {
      this.setState({ savingPatient: true });
      this.props.createPatient({
        fullName: values.fullName,
        gender: values.gender,
        dob: values.dob,
        addresses: [{
          address: values.address,
          postalCode: values.postalCode,
          unitNumber: values.unitNumber,
        }],
      }).then((res) => {
        if (res.response && res.response.patient) {
          const patientId = res.response.patient.id;
          this.getPatients(this.props.user, () => {
            if (this.props.patients[patientId]) {
              this.setState({
                patientId,
                savingPatient: false,
                fullName: undefined,
                gender: undefined,
                dob: undefined,
                address: undefined,
                postalCode: undefined,
                unitNumber: undefined,
              });
            }
          });
        } else {
          // console.error('Failed to create patient.');
        }
      });
      resolve();
    })
  );

  onNext = (event) => {
    if (this.props.patients && this.state.patientId) {
      event.preventDefault();

      const location = history.getCurrentLocation();
      const booker = {
        additionalInfo: this.state.additionalInfo,
      };
      // console.log(booker);
      const orderLocation = {
        postalCode: this.props.patients[this.state.patientId].addresses[0].postalCode,
        address: this.props.patients[this.state.patientId].addresses[0].address,
        unitNumber: this.props.patients[this.state.patientId].addresses[0].unitNumber,
      };
      this.props.setOrderBooker(booker);
      this.props.setOrderLocation(orderLocation);
      this.props.setOrderPatient(this.props.patients[this.state.patientId]);
      util.isNextLastPage('booking2', this.props.lastPage) && this.props.setLastPage('booking2');

      history.push({ pathname: '/booking3a', query: location.query });
    } else {
      event.preventDefault();
      // alert('Please fill up all required fields.');
      this.props.showAlertPopup('Please fill up all required fields.');
    }
  };

  getPatients = (user, cb) => {
    cb = cb || (() => {});
    this.props.getPatients({
      cid: user.clients[0].id,
    }).then((res) => {
      if (res.response && res.response.status === 1) {
        cb();
        return;
      }
      // console.error('Failed to obtain patients data.');
    });
  };

  render() {
    let component,
      userDetails,
      patientDetails;
    if (this.state.editing && this.props.inlineForm
      && /^(userName|userEmail|userMobile)$/i.test(this.props.inlineForm.name)) {
      userDetails = <InlineForm />;
    } else {
      userDetails = (
        <div>
          <div className="TableRow">
            <div className="TableRowItem1">Name</div>
            <div className="TableRowItem3">
              {this.props.user && this.props.user.clients && this.props.user.clients[0]
                && this.props.user.clients[0].fullName}
              &nbsp;<a href="#" onClick={this.onClickEdit('userName')}><img src={imgPencil} alt="Edit" /></a>
            </div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Email</div>
            <div className="TableRowItem3">{this.props.user.email}
              &nbsp;<a href="#" onClick={this.onClickEdit('userEmail')}><img src={imgPencil} alt="Edit" /></a>
            </div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Mobile Number</div>
            <div className="TableRowItem3">{this.props.user.mobilePhone}</div>
          </div>
        </div>
      );
    }
    if (this.state.editing && this.props.inlineForm
      && /^(patientName|patientGender|patientLanguages|patientRace|patientReligion|patientLocation)$/i
      .test(this.props.inlineForm.name)) {
      patientDetails = <InlineForm fetchAddress={this.props.fetchAddress} />;
    } else if (this.props.inlineForm && /^(patientDob)$/i.test(this.props.inlineForm.name)) {
      patientDetails = (
        <div>
          <InlineForm fetchAddress={this.props.fetchAddress} showDayPickerPopup={this.props.showDayPickerPopup} />
          <DayPickerPopup title="Date of Birth" />
        </div>
      );
    } else if (this.props.patients && this.state.patientId) {
      patientDetails = (
        <div>
          <div className="TableRow">
            <div className="TableRowItem1">Full Name</div>
            <div className="TableRowItem3">{this.props.patients[this.state.patientId].fullName}
              &nbsp;<a href="#" onClick={this.onClickEdit('patientName')}><img src={imgPencil} alt="Edit" /></a>
            </div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Gender</div>
            <div className="TableRowItem3">{this.props.patients[this.state.patientId].gender}
              &nbsp;<a href="#" onClick={this.onClickEdit('patientGender')}><img src={imgPencil} alt="Edit" /></a>
            </div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Date of Birth</div>
            <div className="TableRowItem3">{moment(this.props.patients[this.state.patientId].dob).format('ll')}
              &nbsp;<a href="#" onClick={this.onClickEdit('patientDob')}><img src={imgPencil} alt="Edit" /></a>
            </div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Age</div>
            <div className="TableRowItem3">{moment().diff(moment(this.props.patients[this.state.patientId].dob), 'years')}</div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Language{this.props.patients[this.state.patientId].languages.length > 1 ? 's' : ''}</div>
            <div className="TableRowItem3">{
              this.props.patients[this.state.patientId].languages.map((language, index) => (
                (index > 0) ? (
                  <span key={language.id}>, {language.name}</span>
                ) : (
                  <span key={language.id}>{language.name}</span>
                )
              ))
            }
              &nbsp;<a href="#" onClick={this.onClickEdit('patientLanguages')}><img src={imgPencil} alt="Edit" /></a>
            </div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Race</div>
            <div className="TableRowItem3">{this.props.patients[this.state.patientId].race}
              &nbsp;<a href="#" onClick={this.onClickEdit('patientRace')}><img src={imgPencil} alt="Edit" /></a>
            </div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Religion</div>
            <div className="TableRowItem3">{this.props.patients[this.state.patientId].religion}
              &nbsp;<a href="#" onClick={this.onClickEdit('patientReligion')}><img src={imgPencil} alt="Edit" /></a>
            </div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Address</div>
            <div className="TableRowItem3">
              {this.props.patients && this.props.patients[this.state.patientId]
                && this.props.patients[this.state.patientId].addresses
                && this.props.patients[this.state.patientId].addresses[0]
                && this.props.patients[this.state.patientId].addresses[0].address}
              &nbsp;<a href="#" onClick={this.onClickEdit('patientLocation')}><img src={imgPencil} alt="Edit" /></a>
            </div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Unit Number</div>
            <div className="TableRowItem3">
              {this.props.patients && this.props.patients[this.state.patientId]
                && this.props.patients[this.state.patientId].addresses
                && this.props.patients[this.state.patientId].addresses[0]
                && this.props.patients[this.state.patientId].addresses[0].unitNumber}
            </div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Postal Code</div>
            <div className="TableRowItem3">
              {this.props.patients && this.props.patients[this.state.patientId]
                && this.props.patients[this.state.patientId].addresses
                && this.props.patients[this.state.patientId].addresses[0]
                && this.props.patients[this.state.patientId].addresses[0].postalCode}
            </div>
          </div>
        </div>
      );
    } else {
      // Add patient details
      patientDetails = (
        <div>
          <BookingLocationUserPatientForm
            showDayPickerPopup={this.props.showDayPickerPopup}
            showAlertPopup={this.props.showAlertPopup}
            fetchAddress={this.props.fetchAddress}
            user={this.props.user}
            onFilled={this.onClickSavePatient}
          />
          <DayPickerPopup title="Date of Birth" onDayClick={this.onSelectNewDob} />
        </div>
      );
    }
    component = (
      <div>
        <div className={s.bookingLocationUserBodyEditSection}>
          <div className={s.bookingLocationUserBodyEditSectionTitle}>
            <h3>Contact Person Details</h3>
            {/* <a href="#" className={this.state.editingUser ? 'hidden' : ''} onClick={this.onClickEdit('user')}><img src={imgPencil} /></a> */}
          </div>
          {userDetails}
        </div>
        <div className={s.bookingLocationUserBodyEditSection}>
          <div className={s.bookingLocationUserBodyAddPatient}>
            <button className="btn btn-primary" onClick={this.onClickAddPatient}>Add New Patient</button>
            <span>or</span>
          </div>
          <div className={s.bookingLocationUserBodySelectPatient}>
            <span>Select Existing Patient</span>
            <div className="select">
              <span></span>
              <select name="patientId" value={this.state.patientId} onChange={this.onChangePatient}>
                <option>Select Patient</option>
                {
                  this.props.patientIds && this.props.patientIds.map((index) => (
                    <option key={this.props.patients[index].id} value={index}>{this.props.patients[index].fullName}</option>
                  ))
                }
              </select>
            </div>
          </div>
        </div>
        <div className={s.bookingLocationUserBodyEditSection}>
          <div className={s.bookingLocationUserBodyEditSectionTitle}>
            <h3>Patient Details</h3>
          </div>
          <Loader className="spinner" loaded={!this.props.patientsFetching && !this.state.savingPatient}>
            {patientDetails}
          </Loader>
          <div style={{ marginTop: '40px' }}>
            <div>Additional Info:</div>
            <textarea
              onChange={(e) => { this.setState({ additionalInfo: e.target.value }) }}
              value={this.state.additionalInfo}
            />
          </div>
        </div>
        <div className={s.bookingLocationUserBodyEditSection}>
          <div className={classNames(!this.state.patientId ? 'hidden' : '')}>
            <a href="/booking3a" className="btn btn-primary" onClick={this.onNext}>NEXT</a>
          </div>
        </div>
      </div>
    );
    return (
      <div className={s.bookingLocationUser}>
        <Container>
          <div className={s.bookingLocationUserWrapper}>
            <div className={s.bookingLocationUserBody}>
              {component}
            </div>
            {this.props.children}
          </div>
        </Container>
      </div>
    );
  }

}

BookingLocationUser.propTypes = {
  children: React.PropTypes.node,

  languages: React.PropTypes.array,
  lastPage: React.PropTypes.string,
  order: React.PropTypes.object,
  user: React.PropTypes.object,
  client: React.PropTypes.object,
  patients: React.PropTypes.object,
  patientsFetching: React.PropTypes.bool,
  patientIds: React.PropTypes.array,
  inlineForm: React.PropTypes.object,
  form: React.PropTypes.object,

  fetchLanguages: React.PropTypes.func.isRequired,
  fetchAddress: React.PropTypes.func.isRequired,
  getPatients: React.PropTypes.func.isRequired,
  createPatient: React.PropTypes.func.isRequired,
  getPatient: React.PropTypes.func.isRequired,
  getUser: React.PropTypes.func.isRequired,
  editPatient: React.PropTypes.func.isRequired,
  editClient: React.PropTypes.func.isRequired,
  editEmail: React.PropTypes.func.isRequired,
  editMobile: React.PropTypes.func.isRequired,
  verifyMobile: React.PropTypes.func.isRequired,
  setOrderBooker: React.PropTypes.func.isRequired,
  setOrderLocation: React.PropTypes.func.isRequired,
  setOrderPatient: React.PropTypes.func.isRequired,
  setLastPage: React.PropTypes.func.isRequired,
  showDayPickerPopup: React.PropTypes.func.isRequired,
  showAlertPopup: React.PropTypes.func.isRequired,
  showInlineForm: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  languages: state.languages.data,
  lastPage: state.lastPage,
  order: state.order,
  user: state.user.data,
  client: state.user.data && state.user.data.clients && state.user.data.clients[0],
  patients: state.patients.data,
  patientsFetching: state.patients.isFetching,
  patientIds: state.patients.ids,
  inlineForm: state.inlineForm,
  form: state.form,
});

const mapDispatchToProps = (dispatch) => ({
  fetchLanguages: () => dispatch(fetchLanguages()),
  fetchAddress: (postalCode) => dispatch(fetchAddress(postalCode)),
  getPatients: (params) => dispatch(getPatients(params)),
  createPatient: (patient) => dispatch(createPatient(patient)),
  getPatient: (params) => dispatch(getPatient(params)),
  getUser: () => dispatch(getUser()),
  editPatient: (params) => dispatch(editPatient(params)),
  editClient: (params) => dispatch(editClient(params)),
  editEmail: (params) => dispatch(editEmail(params)),
  editMobile: (params) => dispatch(editMobile(params)),
  verifyMobile: (params) => dispatch(verifyMobile(params)),
  setOrderBooker: (booker) => dispatch(setOrderBooker(booker)),
  setOrderLocation: (location) => dispatch(setOrderLocation(location)),
  setOrderPatient: (patient) => dispatch(setOrderPatient(patient)),
  setLastPage: (page) => dispatch(setLastPage(page)),
  showDayPickerPopup: (value, source) => dispatch(showDayPickerPopup(value, source)),
  showAlertPopup: (message) => dispatch(showAlertPopup(message)),
  showInlineForm: (params) => dispatch(showInlineForm(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookingLocationUser);
