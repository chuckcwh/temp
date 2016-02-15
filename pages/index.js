import React, { Component } from 'react';
import Container from '../components/Container/Container';

export default class extends Component {

  render() {
    var avatar = image => {
      return '<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"><g><clipPath id="hex-mask"><polygon fill="#ff0000" points="60,0 120,30 120,90 60,120 0,90 0,30"/></clipPath></g><image clip-path="url(#hex-mask)" height="120" width="120" xlink:href="' + image + '" /></svg>';
    }
    return (
      <div>
        <div className="Banner">
          <div className="Banner-item" id="Banner-item-1" style={{backgroundImage: "url(home-banner-1.jpg)"}}>
            <div className="Banner-item-text-wrapper text-center">
              <div className="Banner-item-text Banner-item-text-1">The Best Homecare Option</div>
              <div className="Banner-item-text Banner-item-text-2">Family Caregivers</div>
              <div className="Banner-item-text Banner-item-text-3">From SGD 30 / Visit</div>
              <a href="/booking1" className="btn btn-primary Banner-item-button Banner-item-text-4">Book A Caregiver</a>
            
            </div>
          </div>
        </div>
        <div className="Lead">
          <Container>
            <h1 className="text-center">A family caregiver for every needing family</h1>
            <p className="text-center featured">As caregivers ourselves, we understand the stress and urgency involved, often in the busiest period of the day in the mornings. Let our healthcare professionals assist you in reducing your load and in supporting you to get your loved ones ready to start the day!</p>
            <div className="Features-list">
              <div className="Features-item">
                <img src="home-features-1.png" className="Features-item-icon" />
                <div className="Features-item-title">Short-hours care</div>
                <div>No minimum hours required!</div>
              </div>
              <div className="Features-item">
                <img src="home-features-2.png" className="Features-item-icon" />
                <div className="Features-item-title">Hassle-Free</div>
                <div>Let us handle the coordination for you!</div>
              </div>
              <div className="Features-item">
                <img src="home-features-3.png" className="Features-item-icon" />
                <div className="Features-item-title">Customised Care</div>
                <div>Every patient has different needs</div>
              </div>
              <div className="Features-item">
                <img src="home-features-4.png" className="Features-item-icon" />
                <div className="Features-item-title">Verified Caregivers</div>
                <div>By both eBeeCare and community</div>
              </div>
            </div>
          </Container>
        </div>
        <div className="Actions">
          <Container>
            <div className="Actions-list">
              <div className="Actions-item">
                <img src="home-actions-1.png" />
                <div className="Actions-item-title">Book A Caregiver Online</div>
                <a href="" className="btn Actions-item-button">Book A Caregiver</a>
              </div>
              <div className="Actions-item">
                <img src="home-actions-1.png" />
                <div className="Actions-item-title">Sign up now & Get a Free Home Visit!</div>
                <a href="/free-campaign" className="btn Actions-item-button" disabled={true}>Proceed</a>
              </div>
              <div className="Actions-item">
                <img src="home-actions-2.png" />
                <div className="Actions-item-title">Call Ebeecare Hotline</div>
                <a href="#" className="btn Actions-item-button" disabled={true}>9733 6938</a>
              </div>

            </div>
          </Container>
        </div>
        <div className="Testimonials">
          <Container>
            <h1 className="text-center">Our Customers Say...</h1>
            <div className="Testimonials-list">
              <div className="Testimonials-item">
                <div className="Testimonials-wrapper">
                  <div className="Testimonials-item-text">Consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.</div>
                  <div className="Testimonials-item-name">Mr. Goh Mun</div>
                  <div className="Testimonials-item-avatar" dangerouslySetInnerHTML={{__html: avatar('https://graph.facebook.com/574555853/picture?width=240&height=240')}}>
                  </div>
                </div>
                <div></div>
              </div>
              <div className="Testimonials-item">
                <div className="Testimonials-wrapper">
                  <div className="Testimonials-item-text">Nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.</div>
                  <div className="Testimonials-item-name">Ms. Sherly Li</div>
                  <div className="Testimonials-item-avatar" dangerouslySetInnerHTML={{__html: avatar('https://graph.facebook.com/100010858146192/picture?width=240&height=240')}}>
                  </div>
                </div>
                <div></div>
              </div>
              <div className="Testimonials-item">
                <div className="Testimonials-wrapper">
                  <div className="Testimonials-item-text">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut </div>
                  <div className="Testimonials-item-name">Mrs. Erika Tan</div>
                  <div className="Testimonials-item-avatar" dangerouslySetInnerHTML={{__html: avatar('https://graph.facebook.com/100010744992918/picture?width=240&height=240')}}>
                  </div>
                </div>
                <div></div>
              </div>
            </div>
          </Container>
        </div>
      </div>
    );
  }

}
