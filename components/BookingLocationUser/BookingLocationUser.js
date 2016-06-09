import React, { Component } from 'react';
import { connect } from 'react-redux';
import linkState from 'react-link-state';
import classNames from 'classnames';
import moment from 'moment';
import Loader from 'react-loader';
import './BookingLocationUser.scss';
import Container from '../Container';
import Link from '../Link';
import InlineForm from '../InlineForm';
import BookingLocationUserPatientForm from '../BookingLocationUserPatientForm';
import DayPickerPopup from '../DayPickerPopup';
import { fetchLanguages, fetchAddress, getPatients, createPatient, getPatient, getUser, editPatient, editClient, editEmail, editMobile, verifyMobile, setOrderBooker, setOrderLocation, setOrderPatient, setLastPage, showAlertPopup, showDayPickerPopup, showInlineForm } from '../../actions';
import Util from '../../core/Util';

class BookingLocationUser extends Component {

  constructor(props) {
    super(props);
    this.state = {
      savingPatient: false,

      patientId: undefined
    };
  }

  componentDidMount() {
    this._getPatients(this.props.user, () => {
      if (this.props.order && this.props.order.patient && this.props.order.patient.id && this.props.patients && this.props.patients[this.props.order.patient.id]) {
        this.setState({ patientId: this.props.order.patient.id });
      }
    });
  }

  render() {
    var component, userDetails, patientDetails;
    if (this.props.inlineForm && /^(userName|userEmail|userMobile)$/i.test(this.props.inlineForm.name)) {
      userDetails = <InlineForm />;
    } else {
      userDetails = (
        <div>
          <div className="TableRow">
            <div className="TableRowItem1">Name</div>
            <div className="TableRowItem3">{this.props.user && this.props.user.clients && this.props.user.clients[0] && this.props.user.clients[0].fullName}
              &nbsp;<a href="#" onClick={this._onClickEdit.bind(this, 'userName')}><img src={require('../pencil.png')} /></a>
            </div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Email</div>
            <div className="TableRowItem3">{this.props.user.email}
              &nbsp;<a href="#" onClick={this._onClickEdit.bind(this, 'userEmail')}><img src={require('../pencil.png')} /></a>
            </div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Mobile Number</div>
            <div className="TableRowItem3">{this.props.user.mobilePhone}</div>
          </div>
        </div>
      );
    }
    if (this.props.inlineForm && /^(patientName|patientGender|patientDob|patientLanguages|patientRace|patientReligion|patientLocation)$/i.test(this.props.inlineForm.name)) {
      patientDetails = <InlineForm fetchAddress={this.props.fetchAddress} />;
    } else if (this.props.patients && this.state.patientId) {
      if (this.state.editingPatient) {
        patientDetails = (
          <div>
            <div>
              <input type="text" id="patient_firstName" name="patient_firstName" valueLink={linkState(this, 'patient_firstName')} placeholder="First Name*" maxLength="50" required />
              <input type="text" id="patient_lastName" name="patient_lastName" valueLink={linkState(this, 'patient_lastName')} placeholder="Last Name*" maxLength="50" required />
              <div className="DateInput">
                <input type="text" id="patient_dob" name="patient_dob" value={this.state.patient_dob_temp ? this.state.patient_dob_temp : (this.state.patient_dob ? moment(this.state.patient_dob).format('YYYY-MM-DD') : '')} onChange={this._onChangeDob.bind(this)} onBlur={this._onBlurDob.bind(this)} placeholder="Birth Date* (YYYY-MM-DD)" pattern="\d{4}[-]\d{2}[-]\d{2}" required />
                <span onClick={() => this.props.showDayPickerPopup(this.state.patient_dob)}></span>
                <DayPickerPopup title="Date of Birth" onDayClick={this._onSelectDob.bind(this)} />
              </div>
              <div>
                <div className="radio radio-inline">
                  <input type="radio" id="patient_gender_male" name="patient_gender" checked={this.state.patient_gender==='Male'} onChange={this._onSelectGender.bind(this, 'patient_gender')} value="Male" required />
                  <label htmlFor="patient_gender_male"><span><span></span></span><span>Male</span></label>
                </div>
                <div className="radio radio-inline">
                  <input type="radio" id="patient_gender_female" name="patient_gender" checked={this.state.patient_gender==='Female'} onChange={this._onSelectGender.bind(this, 'patient_gender')} value="Female" required />
                  <label htmlFor="patient_gender_female"><span><span></span></span><span>Female</span></label>
                </div>
              </div>
            </div>
            <div style={{marginTop: '40px'}}>
              <div>Additional Info:</div>
              <textarea name="additionalInfo" valueLink={linkState(this, 'additionalInfo')} placeholder="Please provide important notes about patient here." />
            </div>
          </div>
        );
      } else {
        patientDetails = (
          <div>
            <div className="TableRow">
              <div className="TableRowItem1">Full Name</div>
              <div className="TableRowItem3">{this.props.patients[this.state.patientId].fullName}
                &nbsp;<a href="#" onClick={this._onClickEdit.bind(this, 'patientName')}><img src={require('../pencil.png')} /></a>
              </div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Gender</div>
              <div className="TableRowItem3">{this.props.patients[this.state.patientId].gender}
                &nbsp;<a href="#" onClick={this._onClickEdit.bind(this, 'patientGender')}><img src={require('../pencil.png')} /></a>
              </div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Date of Birth</div>
              <div className="TableRowItem3">{moment(this.props.patients[this.state.patientId].dob).format('ll')}
                &nbsp;<a href="#" onClick={this._onClickEdit.bind(this, 'patientDob')}><img src={require('../pencil.png')} /></a>
              </div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Age</div>
              <div className="TableRowItem3">{moment().diff(moment(this.props.patients[this.state.patientId].dob), 'years')}</div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Language{this.props.patients[this.state.patientId].languages.length > 1 ? 's' : ''}</div>
              <div className="TableRowItem3">{
                this.props.patients[this.state.patientId].languages.map((language, index) => {
                  return (index > 0) ? (
                    <span key={language.id}>, {language.name}</span>
                  ) : (
                    <span key={language.id}>{language.name}</span>
                  );
                })
              }
                &nbsp;<a href="#" onClick={this._onClickEdit.bind(this, 'patientLanguages')}><img src={require('../pencil.png')} /></a>
              </div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Race</div>
              <div className="TableRowItem3">{this.props.patients[this.state.patientId].race}
                &nbsp;<a href="#" onClick={this._onClickEdit.bind(this, 'patientRace')}><img src={require('../pencil.png')} /></a>
              </div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Religion</div>
              <div className="TableRowItem3">{this.props.patients[this.state.patientId].religion}
                &nbsp;<a href="#" onClick={this._onClickEdit.bind(this, 'patientReligion')}><img src={require('../pencil.png')} /></a>
              </div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Address</div>
              <div className="TableRowItem3">{this.props.patients && this.props.patients[this.state.patientId] && this.props.patients[this.state.patientId].addresses && this.props.patients[this.state.patientId].addresses[0] && this.props.patients[this.state.patientId].addresses[0].address}
                &nbsp;<a href="#" onClick={this._onClickEdit.bind(this, 'patientLocation')}><img src={require('../pencil.png')} /></a>
              </div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Unit Number</div>
              <div className="TableRowItem3">{this.props.patients && this.props.patients[this.state.patientId] && this.props.patients[this.state.patientId].addresses && this.props.patients[this.state.patientId].addresses[0] && this.props.patients[this.state.patientId].addresses[0].unitNumber}</div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Postal Code</div>
              <div className="TableRowItem3">{this.props.patients && this.props.patients[this.state.patientId] && this.props.patients[this.state.patientId].addresses && this.props.patients[this.state.patientId].addresses[0] && this.props.patients[this.state.patientId].addresses[0].postalCode}</div>
            </div>
          </div>
        );
      }
    } else {
      // Add patient details
      patientDetails = (
        <div>
          <BookingLocationUserPatientForm
            showDayPickerPopup={this.props.showDayPickerPopup} 
            showAlertPopup={this.props.showAlertPopup}
            fetchAddress={this.props.fetchAddress}
            user={this.props.user}
            onFilled={this._onClickSavePatient.bind(this)}
          />
          <DayPickerPopup title="Date of Birth" onDayClick={this._onSelectNewDob.bind(this)} />
        </div>
      );
    }
    component = (
      <div>
        <div className="BookingLocationUserBodyEditSection">
          <div className="BookingLocationUserBodyEditSectionTitle">
            <h3>Contact Person Details</h3>
            {/*<a href="#" className={this.state.editingUser ? 'hidden' : ''} onClick={this._onClickEdit.bind(this, 'user')}><img src={require('../pencil.png')} /></a>*/}
          </div>
          {userDetails}
        </div>
        <div className="BookingLocationUserBodyEditSection">
          <div className="BookingLocationUserBodyAddPatient">
            <button className="btn btn-primary" onClick={this._onClickAddPatient.bind(this)}>Add New Patient</button>
            <span>or</span>
          </div>
          <div className="BookingLocationUserBodySelectPatient">
            <span>Select Existing Patient</span>
            <div className="select">
              <span></span>
              <select name="patientId" value={this.state.patientId} onChange={this._onChangePatient.bind(this)}>
                <option>Select Patient</option>
                {
                  this.props.patientIds && this.props.patientIds.map((index) => {
                    return <option key={this.props.patients[index].id} value={index}>{this.props.patients[index].fullName}</option>
                  })
                }
              </select>
            </div>
          </div>
        </div>
        <div className="BookingLocationUserBodyEditSection">
          <div className="BookingLocationUserBodyEditSectionTitle">
            <h3>Patient Details</h3>
          </div>
          <Loader className="spinner" loaded={(this.props.patients && !this.state.savingPatient) ? true : false}>
            {patientDetails}
          </Loader>
          <div style={{marginTop: '40px'}}>
            <div>Additional Info:</div>
            <textarea name="additionalInfo" valueLink={linkState(this, 'additionalInfo')} />
          </div>
        </div>
        <div className="BookingLocationUserBodyEditSection">
          <div className={classNames(!this.state.patientId ? 'hidden' : '')}>
            <a href="/booking3a" className="btn btn-primary" onClick={this._onNext.bind(this)}>NEXT</a>
          </div>
        </div>
      </div>
    );
    return (
      <div className="BookingLocationUser">
        <Container>
          <div className="BookingLocationUserWrapper">
            <div className="BookingLocationUserBody">
              {component}
            </div>
            {this.props.children}
          </div>
        </Container>
      </div>
    );
  }

  _onClickEdit(entity, event) {
    event.preventDefault();

    switch (entity) {
      case 'userName':
        this.props.showInlineForm({
          name: 'userName',
          inputs: {
            fullName: {
              label: 'Name',
              type: 'text',
              initialValue: this.props.user && this.props.user.clients && this.props.user.clients[0] && this.props.user.clients[0].fullName
            }
          },
          validate: (values) => {
            const errors = {};
            if (!values.fullName) {
              errors.fullName = 'Required';
            }
            return errors;
          },
          ok: this._onClickSave.bind(this, 'userName')
        });
        break;
      case 'userEmail':
        this.props.showInlineForm({
          name: 'userEmail',
          inputs: {
            email: {
              label: 'Email',
              type: 'text',
              initialValue: this.props.user.email
            }
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
          ok: this._onClickSave.bind(this, 'userEmail')
        });
        break;
      case 'userMobile':
        this.props.showInlineForm({
          name: 'userMobile',
          inputs: {
            mobilePhone: {
              label: 'Mobile Number',
              type: 'text',
              initialValue: this.props.user.mobilePhone
            }
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
          ok: this._onClickSave.bind(this, 'userMobile')
        });
        break;
      case 'patientName':
        this.props.showInlineForm({
          name: 'patientName',
          inputs: {
            fullName: {
              label: 'Full Name',
              type: 'text',
              initialValue: this.props.patients && this.state.patientId && this.props.patients[this.state.patientId] && this.props.patients[this.state.patientId].fullName
            }
          },
          validate: (values) => {
            const errors = {};
            if (!values.fullName) {
              errors.fullName = 'Required';
            }
            return errors;
          },
          ok: this._onClickSave.bind(this, 'patientName')
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
                  options: Object.values(this.props.languages).map((l) => { return { label: l.name, value: l.id } }),
                  initialValue: this.props.patients && this.state.patientId && this.props.patients[this.state.patientId] && this.props.patients[this.state.patientId].languages.map(l => l.id).join(',')
                }
              },
              validate: (values) => {
                const errors = {};
                if (!values.languages) {
                  errors.languages = 'Required';
                }
                return errors;
              },
              ok: this._onClickSave.bind(this, 'patientLanguages')
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
              initialValue: this.props.patients && this.state.patientId && this.props.patients[this.state.patientId] && this.props.patients[this.state.patientId].gender
            }
          },
          validate: (values) => {
            const errors = {};
            if (!values.gender) {
              errors.gender = 'Required';
            }
            return errors;
          },
          ok: this._onClickSave.bind(this, 'patientGender')
        });
        break;
      case 'patientDob':
        this.props.showInlineForm({
          name: 'patientDob',
          inputs: {
            dob: {
              label: 'Date of Birth',
              type: 'text',
              initialValue: this.props.patients && this.state.patientId && this.props.patients[this.state.patientId] && this.props.patients[this.state.patientId].dob
            }
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
          ok: this._onClickSave.bind(this, 'patientDob')
        });
        break;
      case 'patientRace':
        this.props.showInlineForm({
          name: 'patientRace',
          inputs: {
            race: {
              label: 'Race',
              type: 'select',
              options: [{ label: 'Chinese', value: 'Chinese' }, { label: 'Malay', value: 'Malay' }, { label: 'Indian', value: 'Indian' }, { label: 'Eurasian', value: 'Eurasian' }, { label: 'Others', value: 'Others' }],
              initialValue: this.props.patients && this.state.patientId && this.props.patients[this.state.patientId] && this.props.patients[this.state.patientId].race
            }
          },
          validate: (values) => {
            const errors = {};
            if (!values.race) {
              errors.race = 'Required';
            }
            return errors;
          },
          ok: this._onClickSave.bind(this, 'patientRace')
        });
        break;
      case 'patientReligion':
        this.props.showInlineForm({
          name: 'patientReligion',
          inputs: {
            religion: {
              label: 'Religion',
              type: 'select',
              options: [{ label: 'Buddhist', value: 'Buddhist' }, { label: 'Christian', value: 'Christian' }, { label: 'Free Thinker', value: 'Free Thinker' }, { label: 'Hinduism', value: 'Hinduism' }, { label: 'Islam', value: 'Islam' }, { label: 'Taoist', value: 'Taoist' }, { label: 'Catholic', value: 'Catholic' }, { label: 'Others', value: 'Others' }],
              initialValue: this.props.patients && this.state.patientId && this.props.patients[this.state.patientId] && this.props.patients[this.state.patientId].religion
            }
          },
          validate: (values) => {
            const errors = {};
            if (!values.religion) {
              errors.religion = 'Required';
            }
            return errors;
          },
          ok: this._onClickSave.bind(this, 'patientReligion')
        });
        break;
      case 'patientLocation':
        this.props.showInlineForm({
          name: 'patientLocation',
          inputs: {
            postalCode: {
              label: 'Postal Code',
              type: 'text',
              initialValue: this.props.patients && this.state.patientId && this.props.patients[this.state.patientId] && this.props.patients[this.state.patientId].addresses && this.props.patients[this.state.patientId].addresses[0] && this.props.patients[this.state.patientId].addresses[0].postalCode
            },
            address: {
              label: 'Address',
              type: 'text',
              initialValue: this.props.patients && this.state.patientId && this.props.patients[this.state.patientId] && this.props.patients[this.state.patientId].addresses && this.props.patients[this.state.patientId].addresses[0] && this.props.patients[this.state.patientId].addresses[0].address
            },
            unitNumber: {
              label: 'Unit Number',
              type: 'text',
              initialValue: this.props.patients && this.state.patientId && this.props.patients[this.state.patientId] && this.props.patients[this.state.patientId].addresses && this.props.patients[this.state.patientId].addresses[0] && this.props.patients[this.state.patientId].addresses[0].unitNumber
            }
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
          ok: this._onClickSave.bind(this, 'patientLocation')
        });
        break;
    }
  }

  _onClickSave(entity, values, dispatch) {
    return new Promise((resolve, reject) => {
      switch (entity) {
        case 'userName':
          this.props.editClient({
            cid: this.props.client.id,
            fullName: values.fullName
          }).then((res) => {
            if (res && res.response && res.response.status === 1) {
              this.props.getUser().then(() => resolve());
            } else {
              reject({ _error: res.response.message });
            }
          }, (reason) => {
            reject({ _error: reason });
          });
          break;
        case 'userEmail':
          this.props.editEmail({
            email: values.email
          }).then((res) => {
            if (res && res.response && res.response.status === 1) {
              this.props.getUser().then(() => resolve())
            } else {
              reject({ _error: res.response.message });
            }
          }, (reason) => {
            reject({ _error: reason });
          });
          break;
        case 'userMobile':
          this.props.editMobile({
            mobilephone: values.mobilePhone
          }).then((res) => {
            if (res && res.response && res.response.status === 1) {
              
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
            pid: this.state.patientId
          }, values)).then((res) => {
            if (res && res.response && res.response.status === 1) {
              this.props.getPatient({ pid: this.state.patientId }).then(() => resolve());
            } else {
              reject({ _error: res.response.message });
            }
          }, (reason) => reject({ _error: reason }));
          break;
        case 'patientLanguages':
          this.props.editPatient({
            pid: this.state.patientId,
            languages: values.languages.split(',')
          }).then((res) => {
            if (res && res.response && res.response.status === 1) {
              this.props.getPatient({ pid: this.state.patientId }).then(() => resolve());
            } else {
              reject({ _error: res.response.message });
            }
          }, (reason) => reject({ _error: reason }));
          break;
        case 'patientLocation':
          this.props.editPatient({
            pid: this.state.patientId,
            addresses: [Object.assign({
              id: this.props.patients && this.state.patientId && this.props.patients[this.state.patientId] && this.props.patients[this.state.patientId].addresses && this.props.patients[this.state.patientId].addresses[0] && this.props.patients[this.state.patientId].addresses[0].id
            }, values)]
          }).then((res) => {
            if (res && res.response && res.response.status === 1) {
              this.props.getPatient({ pid: this.state.patientId }).then(() => resolve());
            } else {
              reject({ _error: res.response.message });
            }
          }, (reason) => reject({ _error: reason }));
          break;
        default:
          break;
      }
    });
  }

  _onClickAddPatient(event) {
    this.setState({
      patientId: ''
    });
  }

  _onChangePatient(event) {
    // console.log(event.target.value);
    var patient = this.props.patients[event.target.value];
    this.setState({
      patientId: event.target.value
    });
  }

  _onSelectDob(event, date) {
    this.setState({
      patient_dob: date
    });
  }

  _onChangeDob(event) {
    this.setState({
      patient_dob_temp: event.target.value
    });
  }

  _onBlurDob(event) {
    // validate date (especially for manual keyboard input)
    var d = moment(event.target.value, 'YYYY-MM-DD');
    var valid = d.isValid() && d.isBefore(new Date(), 'day');
    this.setState({
      patient_dob: valid ? d.toDate() : '',
      patient_dob_temp: undefined
    });
  }

  _onSelectNewDob(event, date) {
    this.setState({
      dob: date
    });
  }

  _onSelectGender(entity, event) {
    var obj = {};
    obj[entity] = event.target.value;
    this.setState(obj);
  }

  _onClickSavePatient(values) {
    return new Promise((resolve) => {
      this.setState({
        savingPatient: true
      });
      this.props.createPatient({
        fullName: values.fullName,
        gender: values.gender,
        dob: values.dob,
        addresses: [{
          address: values.address,
          postalCode: values.postalCode,
          unitNumber: values.unitNumber
        }]
      }).then((res) => {
        if (res.response && res.response.patient) {
          var patientId = res.response.patient.id;
          this._getPatients(this.props.user, () => {
            if (this.props.patients[patientId]) {
              this.setState({
                patientId: patientId,
                savingPatient: false,
                fullName: undefined,
                gender: undefined,
                dob: undefined,
                address: undefined,
                postalCode: undefined,
                unitNumber: undefined
              });
            }
          });
        } else {
          console.error('Failed to create patient.');
        }
      });
      resolve();
    });
  }

  _onNext(event) {
    if (this.props.patients && this.state.patientId) {
      Link.handleClickQuery(this.props.location && this.props.location.query, event);

      var booker =  {
        additionalInfo: this.state.additionalInfo
      };
      // console.log(booker);
      var location = {
        postalCode: this.props.patients[this.state.patientId].addresses[0].postalCode,
        address: this.props.patients[this.state.patientId].addresses[0].address,
        unitNumber: this.props.patients[this.state.patientId].addresses[0].unitNumber
      };
      this.props.setOrderBooker(booker);
      this.props.setOrderLocation(location);
      this.props.setOrderPatient(this.props.patients[this.state.patientId]);
      Util.isNextLastPage('booking2', this.props.lastPage) && this.props.setLastPage('booking2');
    } else {
      event.preventDefault();
      // alert('Please fill up all required fields.');
      this._alertPopup.show('Please fill up all required fields.');
    }
  }

  _getPatients(user, cb) {
    cb = cb || () => {};
    this.props.getPatients({
      cid: user.clients[0].id
    }).then((res) => {
      if (res.response && res.response.status === 1) {
        return cb();
      } else {
        console.error('Failed to obtain patients data.');
      }
    });
  }

}

const mapStateToProps = (state) => {
  return {
    location: state.router && state.router.location,
    languages: state.languages.data,
    lastPage: state.lastPage,
    order: state.order,
    user: state.user.data,
    client: state.user.data && state.user.data.clients && state.user.data.clients[0],
    patients: state.patients.data,
    patientIds: state.patients.ids,
    inlineForm: state.inlineForm
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchLanguages: () => {
      return dispatch(fetchLanguages());
    },
    fetchAddress: (postalCode) => {
      return dispatch(fetchAddress(postalCode));
    },
    getPatients: (params) => {
      return dispatch(getPatients(params));
    },
    createPatient: (patient) => {
      return dispatch(createPatient(patient));
    },
    getPatient: (params) => {
      return dispatch(getPatient(params));
    },
    getUser: () => {
      return dispatch(getUser());
    },
    editPatient: (params) => {
      return dispatch(editPatient(params));
    },
    editClient: (params) => {
      return dispatch(editClient(params));
    },
    editEmail: (params) => {
      return dispatch(editEmail(params));
    },
    editMobile: (params) => {
      return dispatch(editMobile(params));
    },
    verifyMobile: (params) => {
      return dispatch(verifyMobile(params));
    },
    setOrderBooker: (booker) => {
      return dispatch(setOrderBooker(booker));
    },
    setOrderLocation: (location) => {
      return dispatch(setOrderLocation(location));
    },
    setOrderPatient: (patient) => {
      return dispatch(setOrderPatient(patient));
    },
    setLastPage: (page) => {
      return dispatch(setLastPage(page));
    },
    showDayPickerPopup: (value, source) => {
      return dispatch(showDayPickerPopup(value, source));
    },
    showAlertPopup: (message) => {
      return dispatch(showAlertPopup(message));
    },
    showInlineForm: (params) => {
      return dispatch(showInlineForm(params));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingLocationUser);
