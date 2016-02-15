import React, { Component } from 'react';
import Container from '../components/Container/Container';
    /*
import DatePicker from 'react-datepicker';
import moment from 'moment';
                
                        <DatePicker
                        selected={this.state.startDate}
                        onChange={this.handleChange} > </DatePicker>
                    */

export default class extends Component {

  getInitialState() {
    return {
      startDate: moment()
    };
  };

  handleChange(date) {
    this.setState({
      startDate: date
    });
  };
     
  render() {
    return (
      <div>
        <div className="top-header-label">
            <h2><b> Sign Up for a FREE Home Nursing Visit Today! </b></h2>
        </div>
        <Container>
        <div className="content-details-top">
            <div className="content-details-left">
                <h3><b>WHAT WE OFFERING</b></h3>
                <p>eBeeCare free home nursing visit program aims to enhance the lives of older people staying in their own house.  Our beneficent elderly will enjoy half an hour to one-hour home safety inspection, chat and laugh over a cuppa to enhance a lonely person’s life and give them social contact with someone outside their normal routine and environment. </p>
                <h3><b>SERVICE INCLUDED IN A HOME VISIT</b></h3>
                <ul>
                    <li>Home safety inspection.</li>
                    <li>Medication adherence consultation.</li>
                    <li>Basic health screening.</li>
                    <li>Mental wellness consultation.</li>
                </ul>
                <h3><b>WHO IS PROVIDING THE SERVICE?</b></h3>
                <p>All service providers in this programs are registered healthcare professional, with have minimum two years’ experience with local or private hospitals. Many of them are on volunteer basis. </p>
                <p className="special-text"><i>“Research has shown that people who volunteer often live longer.” </i>- Allen Klein</p>
            </div>
            
            <div className="content-details-right">
                <div className="sign-up-form">
                    <div className="header">
                        Sign Up & get a FREE Home Nursing Visit
                    </div>
                    <div className="item">
                        <input type="text" name="salutation" placeholder="Salutation"> </input>
                    </div>
                    <div className="item">
                        <input type="text" name="name" placeholder="Enter Full Name*"> </input>
                    </div>
                    <div className="item">
                        <input type="email" name="email" placeholder="Enter Email*"> </input>
                    </div>
                    <div className="item">
                        <input type="number" name="mobile" placeholder="Enter Mobile Phone*"> </input>
                    </div>
                    <div className="item">

                        <input type="text" name="mobile" placeholder="Date*"> </input>
                    </div>
                    <div className="item">
                        <input type="text" name="time" placeholder="Time"> </input>
                    </div>
                    <div className="item">
                        <input type="text" name="referral" placeholder="Referral/ Invite Code"> </input>
                    </div>
                    <div className="submit">
                        Sign Up
                    </div>
                </div>
            </div>
        </div>   
        <div className="content-details-bottom">
            <div className="content-details-left">
                <div className="how-it-work-info">
                    <img src="PrettyNurse.png"/>
                    <div className="details">
                        <h2>HOW IT WORK?</h2>
                        <p>Step 1: Sign up with us and book a slot for home visit.</p>
                        <p>Step 2: Email will send to you with booking confirmation.</p>
                        <p>Step 3: We will inform you the visit one week before</p>
                    </div>
                </div>
            </div>
            <div className="content-details-right">
                <div className="nurse-comment-section">
                    <img src="PrettyNurseIcon.png" />
                    <div className="content">
                        <div className="comment">
                        "I enjoyed the volunteer work with our senior at their home."
                        </div>
                        <div className="name">
                            Fatimah Naroni (Staff nurse)
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </Container>
      </div>
    );
  }

}
