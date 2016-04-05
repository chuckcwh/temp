import React, { Component } from 'react';
import linkState from 'react-link-state';
import request from 'superagent';
import classNames from 'classNames';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Loader from 'react-loader';
import './BookingLocationUser.scss';
import Container from '../Container';
import Link from '../Link';
import AlertPopup from '../AlertPopup';
import BookingActions from '../../actions/BookingActions';
import Util from '../../core/Util';

export default class BookingLocationUser extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editingUser: false,
      editingPatient: false,
      editingAddress: false,
      savingPatient: false,

      patients: undefined,
      patientId: undefined
    };
  }

  componentDidMount() {
    this._getPatients(this.props.user, (patients) => {
      if (this.props.patient) {
        patients.forEach((patient, index) => {
          if (patient.id === this.props.patient.id) {
            this.setState({
              patientId: index,
              patients: patients
            });
          }
        });
      } else {
        this.setState({
          patients: patients
        });
      }
    });
  }

  componentWillUnmount() {
    this.serverRequest && this.serverRequest.abort();
  }

  render() {
    var component, userDetails, patientDetails;
    if (this.state.editingUser) {
      userDetails = (
        <div>
          <form ref={(c) => this._userDetailsForm = c}>
            <div className="TableRow">
              <div className="TableRowItem1">First Name</div>
              <div className="TableRowItem3">
                <input type="text" id="first_name" name="first_name" valueLink={linkState(this, 'first_name')} placeholder="First Name*" maxLength="50" required />
              </div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Last Name</div>
              <div className="TableRowItem3">
                <input type="text" id="last_name" name="last_name" valueLink={linkState(this, 'last_name')} placeholder="Last Name*" maxLength="50" required />
              </div>
            </div>
            {/*
            <div className="TableRow">
              <div className="TableRowItem1">Email</div>
              <div className="TableRowItem3">
                <input type="email" id="email" name="email" value={this.props.user.email} placeholder="Email*" maxLength="50" required />
              </div>
            </div>
            */}
            <div className="TableRow">
              <div className="TableRowItem1">Mobile Number</div>
              <div className="TableRowItem3">
                <input type="text" id="mobilePhone" name="mobilePhone" valueLink={linkState(this, 'mobilePhone')} placeholder="Mobile Number*" maxLength="8" required />
              </div>
            </div>
            <div>
              <a href="#" className="btn btn-primary" onClick={this._onClickSave.bind(this, 'user')}>Save</a>
              <a href="#" className="btn btn-primary" onClick={this._onClickStopEdit.bind(this, 'user')}>Cancel</a>
            </div>
          </form>
        </div>
      );
    } else {
      userDetails = (
        <div>
          <div className="TableRow">
            <div className="TableRowItem1">First Name</div>
            <div className="TableRowItem3">{this.props.user.first_name}</div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Last Name</div>
            <div className="TableRowItem3">{this.props.user.last_name}</div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Email</div>
            <div className="TableRowItem3">{this.props.user.email}</div>
          </div>
          <div className="TableRow">
            <div className="TableRowItem1">Mobile Number</div>
            <div className="TableRowItem3">{this.props.user.mobilePhone}</div>
          </div>
        </div>
      );
    }
    if (this.state.patients && this.state.patientId) {
      if (this.state.editingPatient) {
        patientDetails = (
          <div>
            <div>
              <input type="text" id="patient_firstName" name="patient_firstName" valueLink={linkState(this, 'patient_firstName')} placeholder="First Name*" maxLength="50" required />
              <input type="text" id="patient_lastName" name="patient_lastName" valueLink={linkState(this, 'patient_lastName')} placeholder="Last Name*" maxLength="50" required />
              <DatePicker selected={this.state.patient_dob} maxDate={moment()} dateFormat="YYYY-MM-DD" showYearDropdown onChange={this._onSelectDob.bind(this)} placeholderText="Date of Birth* (Y-M-D)" />
              <input type="text" value={this.state.patient_dob} required style={{'display':'none'}} />
              <div className="radio radio-inline">
                <input type="radio" id="patient_gender_male" name="patient_gender" checked={this.state.patient_gender==='Male'} onChange={this._onSelectGender.bind(this, 'patient_gender')} value="Male" required />
                <label htmlFor="patient_gender_male"><span><span></span></span><span>Male</span></label>
              </div>
              <div className="radio radio-inline">
                <input type="radio" id="patient_gender_female" name="patient_gender" checked={this.state.patient_gender==='Female'} onChange={this._onSelectGender.bind(this, 'patient_gender')} value="Female" required />
                <label htmlFor="patient_gender_female"><span><span></span></span><span>Female</span></label>
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
              <div className="TableRowItem3">{this.state.patients[this.state.patientId].fullName}</div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Gender</div>
              <div className="TableRowItem3">{this.state.patients[this.state.patientId].gender}</div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Date of Birth</div>
              <div className="TableRowItem3">{moment(this.state.patients[this.state.patientId].dob).format('ll')}</div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Age</div>
              <div className="TableRowItem3">{moment().diff(moment(this.state.patients[this.state.patientId].dob), 'years')}</div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Language{this.state.patients[this.state.patientId].languages.length > 1 ? 's' : ''}</div>
              <div className="TableRowItem3">{
                this.state.patients[this.state.patientId].languages.map((language, index) => {
                  return (index > 0) ? (
                    <span key={language.id}>, {language.name}</span>
                  ) : (
                    <span key={language.id}>{language.name}</span>
                  );
                })
              }</div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Race</div>
              <div className="TableRowItem3">{this.state.patients[this.state.patientId].race}</div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Religion</div>
              <div className="TableRowItem3">{this.state.patients[this.state.patientId].religion}</div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Address</div>
              <div className="TableRowItem3">{this.state.patients[this.state.patientId].addresses[0].address}</div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Unit Number</div>
              <div className="TableRowItem3">{this.state.patients[this.state.patientId].addresses[0].unitNumber}</div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Postal Code</div>
              <div className="TableRowItem3">{this.state.patients[this.state.patientId].addresses[0].postalCode}</div>
            </div>
          </div>
        );
      }
    } else {
      // Add patient details
      patientDetails = (
        <form ref={(c) => this._patientDetailsForm = c}>
          <div>
            <input type="text" id="fullName" name="fullName" valueLink={linkState(this, 'fullName')} placeholder="Full Name*" maxLength="50" required />
            <DatePicker selected={this.state.dob} maxDate={moment()} dateFormat="YYYY-MM-DD" showYearDropdown onChange={this._onSelectNewDob.bind(this)} placeholderText="Date of Birth* (Y-M-D)" />
            <div className="radio radio-inline">
              <input type="radio" id="gender_male" name="gender" checked={this.state.gender==='Male'} onChange={this._onSelectGender.bind(this, 'gender')} value="Male" required />
              <label htmlFor="gender_male"><span><span></span></span><span>Male</span></label>
            </div>
            <div className="radio radio-inline">
              <input type="radio" id="gender_female" name="gender" checked={this.state.gender==='Female'} onChange={this._onSelectGender.bind(this, 'gender')} value="Female" required />
              <label htmlFor="gender_female"><span><span></span></span><span>Female</span></label>
            </div>
          </div>
          <div>
            <div style={{marginTop: '40px'}}>Patient Location / Address</div>
            <div className="PatientAddress">
              <div className="PatientAddressLeft inline">
                <input type="text" id="postalCode" name="postalCode" value={this.state.postalCode} onChange={this._onChangePostalCode.bind(this)} placeholder="Enter Postal Code*" required />
                <input type="text" id="unitNumber" name="unitNumber" valueLink={linkState(this, 'unitNumber')} placeholder="Enter Unit Number" />
              </div>
              <div className="PatientAddressRight inline">
                <textarea id="address" name="address" valueLink={linkState(this, 'address')} placeholder="Enter Address*" required />
              </div>
            </div>
            <p className="small">This information will only be used to contact you regarding your booking.</p>
          </div>
          <button className="btn btn-primary" onClick={this._onClickSavePatient.bind(this)}>Save Patient</button>
        </form>
      );
    }
    component = (
      <div>
        <div className="BookingLocationUserBodyEditSection">
          <div className="BookingLocationUserBodyEditSectionTitle">
            <h3>Contact Person Details</h3>
            <a href="#" className={this.state.editingUser ? 'hidden' : ''} onClick={this._onClickEdit.bind(this, 'user')}><img src={require('../pencil.png')} /></a>
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
                  this.state.patients && this.state.patients.map((patient, index) => {
                    return <option key={patient.id} value={index}>{patient.fullName}</option>
                  })
                }
              </select>
            </div>
          </div>
        </div>
        <div className="BookingLocationUserBodyEditSection">
          <div className="BookingLocationUserBodyEditSectionTitle">
            <h3>Patient Details</h3>
            {/*<a href="#" className={this.state.editingPatient || !this.state.patientId ? 'hidden' : ''} onClick={this._onClickEdit.bind(this, 'patient')}><img src={require('../pencil.png')} /></a>*/}
          </div>
          <Loader className="spinner" loaded={(this.state.patients && !this.state.savingPatient) ? true : false}>
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
        <AlertPopup ref={(c) => this._alertPopup = c} />
      </div>
    );
  }

  _onClickEdit(entity, event) {
    event.preventDefault();

    switch (entity) {
      case 'user':
        this.setState({
          first_name: this.props.user.first_name,
          last_name: this.props.user.last_name,
          mobilePhone: this.props.user.mobilePhone,

          editingUser: true
        });
        break;
      case 'patient':
        this.setState({editingPatient: true});
        break;
      case 'address':
        this.setState({editingAddress: true});
        break;
    }
  }

  _onClickStopEdit(entity, event) {
    event.preventDefault();

    switch (entity) {
      case 'user':
        this.setState({editingUser: false});
        break;
      case 'patient':
        this.setState({editingPatient: false});
        break;
      case 'address':
        this.setState({editingAddress: false});
        break;
    }
  }

  _onClickSave(entity, event) {
    event.preventDefault();

    switch (entity) {
      case 'user':
        if (this._userDetailsForm.checkValidity()) {
          this.setState({editingUser: false});
        }
        break;
      case 'patient':
        this.setState({editingPatient: false});
        break;
      case 'address':
        this.setState({editingAddress: false});
        break;
    }
  }

  _onClickAddPatient(event) {
    this.setState({
      patientId: ''
    });
  }

  _onChangePatient(event) {
    // console.log(event.target.value);
    var patient = this.state.patients[event.target.value];
    this.setState({
      patientId: event.target.value
    });
  }

  _onSelectDob(date) {
    this.setState({
      patient_dob: date
    });
  }

  _onSelectNewDob(date) {
    this.setState({
      dob: date
    });
  }

  _onSelectGender(entity, event) {
    var obj = {};
    obj[entity] = event.target.value;
    this.setState(obj);
  }

  _onChangePostalCode(event) {
    var that = this;
    var postalCodeInput = event.target;
    this.setState({
      postalCode: postalCodeInput.value
    });
    if (postalCodeInput.value.length === 6) {
      // console.log(postalCodeInput.value);
      try {
        // postalCodeInput.disabled = true;
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode( {
          'address': postalCodeInput.value,
          'region': 'SG'
        }, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            var position = results[0].geometry.location;
            geocoder.geocode({
              latLng: position
            }, function(responses) {
              if (responses && responses.length > 0) {
                that.setState({
                  address: responses[0].formatted_address
                });
                // postalCodeInput.disabled = false;
              } else {
                // postalCodeInput.disabled = false;
                console.error('Invalid postal code.');
              }
            });
          } else {
            // postalCodeInput.disabled = false;
            console.error('Invalid postal code.');
          }
        });
      } catch(e) {
        // postalCodeInput.disabled = false;
        console.error('Unable to find your address.');
      }
    }
  }

  _onClickSavePatient(event) {
    if (this._patientDetailsForm.checkValidity()) {
      event.preventDefault();
      this.setState({
        savingPatient: true
      });
      this.serverRequest = request
        .post(Util.host + '/api/createPatient')
        .auth(this.props.user.id, this.props.user.token)
        .send({
          fullName: this.state.fullName,
          gender: this.state.gender,
          dob: this.state.dob.format('YYYY-MM-DD'),
          addresses: [{
            address: this.state.address,
            postalCode: this.state.postalCode,
            unitNumber: this.state.unitNumber
          }]
        })
        .end((err, res) => {
          if (err) {
            return console.error(Util.host + '/api/createPatient', err.toString());
          }
          // console.log(res.body);
          if (res.body && res.body.patient) {
            var patientId = res.body.patient.id;
            this._getPatients(this.props.user, () => {
              var selectPatient;
              this.state.patients.forEach((patient, index) => {
                if (patient.id === patientId) {
                  this.setState({
                    patientId: index,
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
            });
          } else {
            console.error('Failed to create patient.');
          }
        });
    } else {
      event.preventDefault();
      // alert('Please fill up all required fields.');
      this._alertPopup.show('Please fill up all required fields.');
    }
  }

  _onNext(event) {
    if (this.state.patientId) {
      Link.handleClick(event);

      var booker =  {
        additionalInfo: this.state.additionalInfo
      };
      // console.log(booker);
      var location = {
        postalCode: this.state.patients[this.state.patientId].addresses[0].postalCode,
        address: this.state.patients[this.state.patientId].addresses[0].address,
        unitNumber: this.state.patients[this.state.patientId].addresses[0].unitNumber
      };
      BookingActions.setBooker(booker);
      BookingActions.setLocation(location);
      BookingActions.setPatient(this.state.patients[this.state.patientId]);
      BookingActions.setLast('booking2');
    } else {
      event.preventDefault();
      // alert('Please fill up all required fields.');
      this._alertPopup.show('Please fill up all required fields.');
    }
  }

  _getPatients(user, cb) {
    cb = cb || () => {};
    this.serverRequest = request
      .get(Util.host + '/api/getPatients')
      .query({
        cid: user.clients[0].id
      })
      .auth(user.id, user.token)
      .end((err, res) => {
        if (err) {
          return console.error(Util.host + '/api/getPatients', err.toString());
        }
        if (res.body && res.body.status === 1) {
          console.log(res.body);
          // BookingActions.setUser(user);
          this.setState({
            patients: res.body.patients
          });
          return cb(res.body.patients);
        } else {
          console.error('Failed to obtain patients data.');
        }
      });
  }

}
