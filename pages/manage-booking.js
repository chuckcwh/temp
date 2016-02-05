import React, { Component } from 'react';
import Container from '../components/Container/Container';



export default class extends Component {
    
  clickTab(index) {
        var tabs = document.getElementsByClassName("mytab");
        
        for (var i = 0; i < tabs.length; i++) {
            var tab = tabs[i];
            var newClassName = "";
            var classes = tab.className.split(" ");
            for(var j = 0; j < classes.length; j++) {
                if(classes[j] !== "active") {
                    newClassName += classes[j] + " ";
                }
            }
            tab.className = newClassName;
          if (i === index - 1){
              tab.className += 'active ';
          }
        }
        var loginContainer = document.getElementById("loginFormContainer");
        var bookingContainer = document.getElementById("getBookingFormContainer");
        console.log(index)
        if(index == 1){
            loginContainer.style.display = "none";
            bookingContainer.style.display = "block";
        }else{
            loginContainer.style.display = "block";
            bookingContainer.style.display = "none";
        }
  };
  
  getBooking(){
    var bookingId = document.getElementById("bookingId").value;
    var email =  document.getElementById("email_adhoc").value;
  };
  
  render() {
    var avatar = image => {
      return '<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"><g><clipPath id="hex-mask"><polygon fill="#ff0000" points="60,0 120,30 120,90 60,120 0,90 0,30"/></clipPath></g><image clip-path="url(#hex-mask)" height="120" width="120" xlink:href="' + image + '" /></svg>';
    }
    return (

    
        <div className="page-padding">
            <Container>
                <div className="modal" id="modal-one" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-header">
                            <h2>Modal</h2>
                            <a href="#close" className="btn-close" aria-hidden="true" style={{color:'#000'}}>×</a> 
                        </div>
                        <div className="modal-body">
                            <p>One modal example here! :D</p>
                        </div>
                        <div className="modal-footer">
                            <a href="#close" className="btn" style={{color:'#000'}}>Nice!</a>  
                        </div>
                    </div>
                </div>
                <div id="form1" className="card_shadow">
                    <div className="flexi-layout myTabLayout">
                        <div className="mytab active col2" id="bookingTab" value={1} onClick={this.clickTab.bind(this, 1)}>
                            Booking
                        </div>
                        <div className="mytab col2" id="loginTab" value={2} onClick={this.clickTab.bind(this, 2)}>
                            Login
                        </div>
                    </div>
                    <div className="flexi-layout" >
                        <div id="getBookingFormContainer" className="myForm">
                            <div name="getBookingForm" id="getBookingForm" >
                                <div className="flexi-layout">
                                    <div className="col1">
                                        <div className="formItem" >
                                            <p className="formLabel" ><b>Booking reference id</b></p>
                                            <input className="formInput" type="text" placeholder="ID" name="bookingId" id="bookingId"/>
                                        </div>
                                        <div className="formItem">
                                            <p className="formLabel" ><b>Email</b></p>
                                            <input className="formInput" type="email" placeholder="Email" id="email_adhoc" name="email_adhoc"/>
                                        </div>
                                    </div>
                                    <div className="col1">
                                        <a type="submit" className="btn-primary" id="getBookingBtn" onClick={this.getBooking.bind(this)} href="#modal-one" >
                                            Find Booking <i className="fa fa-arrow-circle-right"></i>
                                        </a>            
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="loginFormContainer" className="myForm" style={{display:'none'}}>
                            <form className="form-vertical " action="/login/" id="loginForm" method="POST">
                                <div className="formItem" >
                                    <p className="formLabel" ><b>Email</b></p>
                                    <input className="formInput" type="text" placeholder="Email" name="email"/>
                                </div>
                                <div className="formItem" >
                                    <p className="formLabel" ><b>Password</b></p>
                                    <input className="formInput" type="password" placeholder="Password" name="password"/>
                                    
                                </div>
                                <div className="formItem" >
                                    <a href="/reset/" style={{color:'#000'}}>Forgot Password?</a>
                                </div>
                                <div className="formItem" >
                                    <label className="checkbox" style={{display:'inline-block'}}>
                                        <input type="checkbox" name="remember" /> Remember me
                                    </label>
                                </div>
                                <div className="formItem" >
                                    <a type="submit" className="btn-primary" >
                                    Login <i className="fa fa-arrow-circle-right"></i>
                                    </a>
                                 </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
  }
}
