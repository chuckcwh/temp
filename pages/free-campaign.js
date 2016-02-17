import React, { Component } from 'react';
import Container from '../components/Container/Container';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.scss';
import 'whatwg-fetch';

export default class extends Component {

  constructor(props) {
    super(props);
    this.state = {startDate: moment()};
    this.handleChange = this.handleChange.bind(this);
  };
    
  handleChange(date) {
    this.setState({
      startDate: date
    });
  };
  
  radioButtonsClicked(value){
     //alert(value);
    var buttons = document.getElementsByName("meantesting-passed");
    for(var i = 0; i < buttons.length; i++) {
       if(buttons[i].value == value) {
           buttons[i].checked = true;
       }else{
           buttons[i].checked = false;
       }
    }
  };
  
  submitForm(){
    var fullname =  document.getElementById("fullname").value;
    var email =  document.getElementById("email").value;
    var mobile =  document.getElementById("mobile").value;
    var date =  this.state.startDate;
    var timeSelect =  document.getElementById("time");
    var time =  timeSelect.options[timeSelect.selectedIndex].value;
    var postal =  document.getElementById("postal").value;
    var floor =  document.getElementById("floor").value;
    var unit =  document.getElementById("unit").value;
    var address =  document.getElementById("address").value;
    var medicalSelect =  document.getElementById("medical");
    var medical =  medicalSelect.options[medicalSelect.selectedIndex].value;
    var family =  document.getElementById("family").checked;
    var meantesting = document.getElementsByName('meantesting-passed');
    var meantesting_val = "";
    for(var i = 0; i < meantesting.length; i++){
        if(meantesting[i].checked){
            meantesting_val = meantesting[i].value;
            break;
        }
    }
    var referral_code = document.getElementById('referral').value;
    var messages = [];
  
    if (fullname.trim() == ""){
        messages.push("Invalid/Blank name");
    }
    if (email.trim() == "" || email.indexOf("@") < 1 ){
        messages.push("Invalid/Blank email");
    }
    if (mobile.trim() == "" || mobile.toString().length != 8 ){
        messages.push("Invalid/Blank mobile");
    }
    if (date == null ){
        messages.push("Invalid/Blank date");
    }
    if (time.trim() == "" ){
        messages.push("Please select a valid time slot");
    }
    
    if (postal.trim() == "" ){
        messages.push("Invalid/Blank postal code");
    }
    if (floor.trim() == "" ){
        messages.push("Invalid/Blank floor");
    }
    if (unit.trim() == "" ){
        messages.push("Invalid/Blank unit");
    }
    if (address.trim() == "" ){
        messages.push("Invalid/Blank address");
    }
    if (medical.trim() == ""){
        messages.push("Please select a medical condition");
    }
    if (meantesting_val.trim() == ""){
        messages.push("Please select a valid mean testing.");
    }
    
    if (messages.length > 0 ){
        
        alert(messages.join('\n'));
    } else {
        //remove the extra letters

        var timeSplitted = time.split("-");
        
        var startTime = timeSplitted[0];
        var endTime = timeSplitted[1];
        var startDateTime = date.clone().startOf('day').hours(startTime).minutes(0).seconds(0);
        var endDateTime = date.clone().startOf('day').hours(endTime).minutes(0).seconds(0);
        var startDTString = startDateTime.format("YYYY-MM-DD HH:mm:ss")
        var endDTString = endDateTime.format("YYYY-MM-DD HH:mm:ss")
        console.log(startDTString + " - "+ endDTString);
        var jsonParams = {
            "fullName" : fullname,
            "email" : email,
            "mobile" : mobile,
            "date" : date,
            "time" : time,
            "dateTimeStart" : startDTString,
            "dateTimeEnd": endDTString,
            "postal" : postal,
            "floor" : floor,
            "unit" : unit,
            "address" : address,
            "medical" : medical,
            "family" : family,
            "meantesting_val" : meantesting_val,
            "referral" : referral_code
        }
        console.log("everything "+ JSON.stringify(jsonParams) );
        fetch('http://161.202.19.121/api/registerFreeCampaignUsers', {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Basic '+ btoa("secret:secret0nlyWeilsonKnowsShhh852~")
          },
          body: JSON.stringify(jsonParams)
        }).then(function(response) {
          return response.json();
        }).then(function(data) {
            
            if(data.status == 1){
                alert("Successful call : " + data.message);
            }else{
               alert("Unsuccessful call : " + data.message); 
            }
        }).catch(function() {
          console.log("Error ");
        });
    }
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
                        <input className="input fill-width" type="text" name="fullname" id="fullname" placeholder="Enter Full Name*"></input>
                    </div>
                    <div className="item">
                        <input className="input fill-width" type="email" name="email" id="email" placeholder="Enter Email*"></input>
                    </div>
                    <div className="item">
                        <input className="input fill-width" type="number" name="mobile" id="mobile" placeholder="Enter Mobile Phone*"></input>
                    </div>
                    <div className="item">
                        <DatePicker
                            className="input"
                            selected={this.state.startDate}
                            onChange={this.handleChange.bind(this)}
                            isClearable={true} 
                            placeholderText='Select date'/>
                       
                    </div>
                    <div className="item">
                        <select name="time" id="time" className="input fill-width" defaultValue="" >
                            <option value="" hidden className="place_holder">Select Time*</option>
                            <option value="7-9">7am - 9 am</option>
                            <option value="9-11">9am - 11am</option>
                            <option value="11-1">11am - 1pm</option>
                            <option value="13-15">1pm - 3pm</option>
                            <option value="15-17">3pm - 5pm</option>
                            <option value="17-19">5pm - 7pm</option>
                            <option value="19-21">7pm - 9pm</option>
                            <option value="21-23">9pm - 11pm</option>
                        </select>
                    </div>
                    <div className="item">
                        <input className="input fill-width" type="text" name="postal" id="postal" placeholder="Postal Code*"></input>
                    </div>
                    <div className="item">
                        <input type="number" name="floor" id="floor"  placeholder="Floor*" className="input col4"></input>
                        &nbsp;-&nbsp;
                        <input type="number" name="unit" id="unit" placeholder="Unit number*" className="input col2"></input>
                    </div>
                    <div className="item">
                        <textarea className="input fill-width" name="address" id="address" placeholder="Address*"></textarea>
                    </div>
                    <div className="item">
                        <select name="medical" id="medical" className="input fill-width" defaultValue="" >
                            <option value="" disabled hidden className="place_holder">Select medical condition*</option>
                            <option value="cancer">Cancer</option>
                            <option value="diabetes">Diabetes</option>
                            <option value="disabled">Disabled</option>
                            <option value="others">Others</option>
                        </select>
                    </div>
                    <div className="item">
                        <label className="input fill-width"><input type="checkbox" name="family" id="family"/>&nbsp;Stay with family members</label>
                    </div>
                    <div className="item">
                        <p className="col1">Mean testing passed?</p> 
                          <input type="radio" name="meantesting-passed" value="yes" onClick={this.radioButtonsClicked.bind(this, "yes")} />&nbsp;Yes&nbsp;&nbsp;
                          <input type="radio" name="meantesting-passed" value="no" onClick={this.radioButtonsClicked.bind(this, "no")}  />&nbsp;No&nbsp;&nbsp;
                          <input type="radio" name="meantesting-passed" value="unknown" onClick={this.radioButtonsClicked.bind(this, "unknown")}  />&nbsp;Unknown&nbsp;&nbsp;
                    </div>
                    <div className="item">
                        <input className="input fill-width" type="text" name="referral" id="referral" placeholder="Referral/ Invite Code"></input>
                    </div>
                    <div className="submit" onClick={this.submitForm.bind(this)} >
                        Sign Up
                    </div>
                </div>
            </div>
        </div>   
        <div className="content-details-bottom">
            <div className="content-details-left">
                <div className="how-it-work-info">
                    
                    <div className="details">
                        <h2>HOW IT WORK?</h2>
                        <p>Step 1: Sign up with us and book a slot for home visit.</p>
                        <p>Step 2: Email will send to you with booking confirmation.</p>
                        <p>Step 3: We will inform you the visit one week before</p>
                    </div>
                    <img src="PrettyNurse.png"/>
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
