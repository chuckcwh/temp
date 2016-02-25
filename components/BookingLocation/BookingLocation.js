import React, { Component } from 'react';
import classNames from 'classNames';
import './BookingLocation.scss';
import Container from '../Container';
import BookingSidebar from '../BookingSidebar';
import BookingStore from '../../stores/BookingStore';

export default class BookingLocation extends Component {

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
                <input type="email" name="email" placeholder="Enter Email*" />
                <div className="select">
                  <span></span>
                  <select name="salutation">
                    <option value="">Salutation</option>
                  </select>
                </div>
                <input type="text" name="tel" placeholder="Enter Mobile Phone*" />
                <input type="text" name="name" placeholder="Enter Full Name*" />
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
                    <input type="text" name="postal" placeholder="Enter Postal Code*" />
                    <input type="text" name="unit" placeholder="Enter Unit Number" />
                  </div>
                  <div className="PatientAddressRight inline">
                    <textarea name="address" placeholder="Enter Address*" />
                  </div>
                </div>
                <p className="small">This information will only be used to contact you about your booking.</p>
                <a href="/booking3a" className="btn btn-primary">NEXT</a>
              </div>
            </div>
            <BookingSidebar />
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

}
