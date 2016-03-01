import React, { Component } from 'react';
import linkState from 'react-link-state';
import classNames from 'classNames';
import './BookingLocation.scss';
import Container from '../Container';
import Link from '../Link';
import BookingActions from '../../actions/BookingActions';

export default class BookingLocation extends Component {

  mixins: [LinkedStateMixin]

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="BookingLocation">
        <Container>
          <div className="BookingLocationWrapper">
            <div className="BookingLocationBody">
              <div className="BookingLocationBodySection">
                <span>I&apos;m an existing customer</span>
                <a href="/booking2" className="btn btn-primary btn-small btn-inline">LOGIN</a>
                <span>or</span>
                <a href="/booking2" className="btn btn-primary btn-small btn-inline">REGISTER</a>
              </div>
              <div className="BookingLocationBodySection">
                <div>Continue booking as guest</div>
                <input type="email" name="email" ref="email" placeholder="Enter Email*" />
                <div className="select">
                  <span></span>
                  <select name="salutation">
                    <option value="">Salutation</option>
                  </select>
                </div>
                <input type="text" name="tel" ref="mobilePhone" placeholder="Enter Mobile Phone*" />
                <input type="text" name="name" ref="name" placeholder="Enter Full Name*" />
              </div>
              <div className="BookingLocationBodySection">
                <div>Patient Details</div>
                <div>
                  <input type="text" name="patientName" placeholder="Patient Name*" />
                  <input type="text" name="patientDob" placeholder="Patient Date of Birth" />
                </div>
                <div>
                  <div className="radio radio-inline">
                    <input type="radio" id="radioGenderMale" name="gender" value="male" />
                    <label htmlFor="radioGenderMale"><span><span></span></span><span>Male</span></label>
                  </div>
                  <div className="radio radio-inline">
                    <input type="radio" id="radioGenderFemale" name="gender" value="female" />
                    <label htmlFor="radioGenderFemale"><span><span></span></span><span>Female</span></label>
                  </div>
                </div>
                <div style={{marginTop: '40px'}}>
                  <div>Additional Info:</div>
                  <textarea name="additionalInfo" />
                </div>
              </div>
              <div className="BookingLocationBodySection">
                <div>Patient Location / Address</div>
                <div className="PatientAddress">
                  <div className="PatientAddressLeft inline">
                    <input type="text" name="postalCode" valueLink={linkState(this, 'postalCode')} placeholder="Enter Postal Code*" required />
                    <input type="text" name="unit" placeholder="Enter Unit Number" />
                  </div>
                  <div className="PatientAddressRight inline">
                    <textarea name="address" placeholder="Enter Address*" />
                  </div>
                </div>
                <p className="small">This information will only be used to contact you about your booking.</p>
                <a href="/booking3a" className="btn btn-primary" onClick={this._onNext.bind(this)}>NEXT</a>
              </div>
            </div>
            {this.props.children}
            {/*}
            <div className="BookingLocationFooter">
              <a href="/booking2" className="btn btn-primary">NEXT</a>
            </div>
            */}
          </div>
        </Container>

      </div>
    );
  }

  _onNext(event) {
    Link.handleClick(event);

    var location = {
      postalCode: this.state.postalCode
    };
    this.props.query.location = location;
    // BookingActions.setLocation(location);
    // BookingActions.setService(this.state.selectedService);
  }

}
