import React, { Component } from 'react';
import { connect } from 'react-redux';
import linkState from 'react-link-state';
import classNames from 'classnames';
import moment from 'moment';
import Loader from 'react-loader';
import './BookingLocationUser.scss';
import Container from '../Container';
import Link from '../Link';
import DayPickerPopup from '../DayPickerPopup';
import { getPatients, createPatient, setOrderBooker, setOrderLocation, setOrderPatient, setLastPage, showAlertPopup, showDayPickerPopup } from '../../actions';
import Util from '../../core/Util';

class BookingLocationUser extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editingUser: false,
      editingPatient: false,
      editingAddress: false,
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
    if (this.state.editingUser) {
      userDetails = (
        <div>
          <form ref={(c) => this._userDetailsForm = c}>
            <div className="TableRow">
              <div className="TableRowItem1">Name</div>
              <div className="TableRowItem3">
                <input type="text" id="fullName" name="fullName" valueLink={linkState(this, 'fullName')} placeholder="Name*" maxLength="50" required />
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
            <div className="TableRowItem1">Name</div>
            <div className="TableRowItem3">{this.props.user.fullName}</div>
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
    if (this.props.patients && this.state.patientId) {
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
              <div className="TableRowItem3">{this.props.patients[this.state.patientId].fullName}</div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Gender</div>
              <div className="TableRowItem3">{this.props.patients[this.state.patientId].gender}</div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Date of Birth</div>
              <div className="TableRowItem3">{moment(this.props.patients[this.state.patientId].dob).format('ll')}</div>
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
              }</div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Race</div>
              <div className="TableRowItem3">{this.props.patients[this.state.patientId].race}</div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Religion</div>
              <div className="TableRowItem3">{this.props.patients[this.state.patientId].religion}</div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Address</div>
              <div className="TableRowItem3">{this.props.patients[this.state.patientId].addresses[0].address}</div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Unit Number</div>
              <div className="TableRowItem3">{this.props.patients[this.state.patientId].addresses[0].unitNumber}</div>
            </div>
            <div className="TableRow">
              <div className="TableRowItem1">Postal Code</div>
              <div className="TableRowItem3">{this.props.patients[this.state.patientId].addresses[0].postalCode}</div>
            </div>
          </div>
        );
      }
    } else {
      // Add patient details
      patientDetails = (
        <div>
          <form ref={(c) => this._patientDetailsForm = c} onSubmit={this._onClickSavePatient.bind(this)}>
            <div>
              <div>
                <input className="RememberMeCheckbox" type="checkbox" id="isPatient" name="isPatient" onChange={this._onCheckedPatient.bind(this)} />
                <label className="RememberMeCheckboxLabel" htmlFor="isPatient">
                  <span></span><span>Are you the patient?</span>
                </label>
              </div>
              <input type="text" id="fullName" name="fullName" valueLink={linkState(this, 'fullName')} placeholder="Full Name*" maxLength="50" required />
              <div className="DateInput">
                <input type="text" id="dob" name="dob" value={this.state.dob_temp ? this.state.dob_temp : (this.state.dob ? moment(this.state.dob).format('YYYY-MM-DD') : '')} onChange={this._onChangeNewDob.bind(this)} onBlur={this._onBlurNewDob.bind(this)} placeholder="Birth Date* (YYYY-MM-DD)" pattern="\d{4}[-]\d{2}[-]\d{2}" required />
                <span onClick={() => this.props.showDayPickerPopup(this.state.dob)}></span>
              </div>
              <div>
                <div className="radio radio-inline">
                  <input type="radio" id="gender_male" name="gender" checked={this.state.gender==='Male'} onChange={this._onSelectGender.bind(this, 'gender')} value="Male" required />
                  <label htmlFor="gender_male"><span><span></span></span><span>Male</span></label>
                </div>
                <div className="radio radio-inline">
                  <input type="radio" id="gender_female" name="gender" checked={this.state.gender==='Female'} onChange={this._onSelectGender.bind(this, 'gender')} value="Female" required />
                  <label htmlFor="gender_female"><span><span></span></span><span>Female</span></label>
                </div>
              </div>
            </div>
            <div>
              <div style={{marginTop: '40px'}}>Patient Location / Address</div>
              <div className="PatientAddress">
                <div className="PatientAddressLeft inline">
                  <input type="text" id="postalCode" name="postalCode" value={this.state.postalCode} onChange={this._onChangePostalCode.bind(this)} placeholder="Enter Postal Code*" pattern="[0-9]{6}" required />
                  <input type="text" id="unitNumber" name="unitNumber" valueLink={linkState(this, 'unitNumber')} placeholder="Enter Unit Number" />
                </div>
                <div className="PatientAddressRight inline">
                  <textarea id="address" name="address" valueLink={linkState(this, 'address')} placeholder="Enter Address*" required />
                </div>
              </div>
              <p className="small">This information will only be used to contact you regarding your booking.</p>
            </div>
            <button className="btn btn-primary" type="submit">Save Patient</button>
          </form>
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
            {/*<a href="#" className={this.state.editingPatient || !this.state.patientId ? 'hidden' : ''} onClick={this._onClickEdit.bind(this, 'patient')}><img src={require('../pencil.png')} /></a>*/}
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
      case 'user':
        this.setState({
          fullName: this.props.user.fullName,

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

  _onChangeNewDob(event) {
    this.setState({
      dob_temp: event.target.value
    });
  }

  _onBlurNewDob(event) {
    // validate date (especially for manual keyboard input)
    var d = moment(event.target.value, 'YYYY-MM-DD');
    var valid = d.isValid() && d.isBefore(new Date(), 'day');
    this.setState({
      dob: valid ? d.toDate() : '',
      dob_temp: undefined
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
      this.props.createPatient({
        fullName: this.state.fullName,
        gender: this.state.gender,
        dob: moment(this.state.dob).format('YYYY-MM-DD'),
        addresses: [{
          address: this.state.address,
          postalCode: this.state.postalCode,
          unitNumber: this.state.unitNumber
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
    } else {
      event.preventDefault();
      // alert('Please fill up all required fields.');
      this.props.showAlertPopup('Please fill up all required fields.');
    }
  }

  _onCheckedPatient(event) {
    if (event.target.checked === true) {
      this.setState({
        fullName: this.props.user.fullName
      });
    } else {
      this.setState({
        fullName: undefined
      });
    }
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
    lastPage: state.lastPage,
    order: state.order,
    user: state.user.data,
    patients: state.patients.data,
    patientIds: state.patients.ids
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getPatients: (params) => {
      return dispatch(getPatients(params));
    },
    createPatient: (patient) => {
      return dispatch(createPatient(patient));
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
    showDayPickerPopup: (value) => {
      return dispatch(showDayPickerPopup(value));
    },
    showAlertPopup: (message) => {
      return dispatch(showAlertPopup(message));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingLocationUser);
