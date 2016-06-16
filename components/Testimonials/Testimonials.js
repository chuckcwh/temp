import React, { Component } from 'react';
import Slider from 'react-slick';
import './Testimonials.scss';
import Container from '../Container';

export default class Testimonials extends Component {

  render() {
    var avatar = image => {
      return '<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"><g><clipPath id="hex-mask"><polygon fill="#ff0000" points="60,0 120,30 120,90 60,120 0,90 0,30"/></clipPath></g><image clip-path="url(#hex-mask)" height="120" width="120" xlink:href="' + image + '" /></svg>';
    }
    return (
      <div className="Testimonials">
        <Container>
          <h1 className="text-center">Our Customers Say...</h1>
          <div className="Testimonials-list">
            <Slider dots={true} speed={1000} autoplay={false} slidesToScroll={1} arrows={false} 
              responsive={[
                {
                  breakpoint: 800,
                  settings: {
                    slidesToShow: 1,
                    infinite: true
                  }
                },
                {
                  breakpoint: 1200,
                  settings: {
                    slidesToShow: 2,
                    infinite: true
                  }
                },
                {
                  breakpoint: 100000,
                  settings: {
                    slidesToShow: 3,
                    infinite: false,
                    draggable: false
                  }
                }
              ]}>
              <div className="Testimonials-slider-item">
                <div className="Testimonials-item">
                  <div className="Testimonials-wrapper">
                    <div className="Testimonials-item-text">I tried out a few nutritionists from eBeeCare (for free) before I found Mark (a nutritionist whom I am now engaging on a long term basis).</div>
                    <div className="Testimonials-item-name">Ho Qun Tea</div>
                    <div className="Testimonials-item-avatar">
                      <img src={require('../../assets/images/ho_qun_tea.jpg')} />
                    </div>
                  </div>
                  <div></div>
                </div>
              </div>
              <div className="Testimonials-slider-item">
                <div className="Testimonials-item">
                  <div className="Testimonials-wrapper">
                    <div className="Testimonials-item-text">We never knew wound care procedure could be done at home! Thanks to eBeeCare, now we do not need to take leave to bring my mum to hospital for simple wound dressing.</div>
                    <div className="Testimonials-item-name">Goh Chng Ying</div>
                    <div className="Testimonials-item-avatar">
                      <img src={require('../../assets/images/goh_chng_ying.jpg')} />
                    </div>
                  </div>
                  <div></div>
                </div>
              </div>
              <div className="Testimonials-slider-item">
                <div className="Testimonials-item">
                  <div className="Testimonials-wrapper">
                    <div className="Testimonials-item-text">It is so convenient to get a professional nurse from eBeeCare, even for last minute requests; and their price is very competitive.</div>
                    <div className="Testimonials-item-name">Cindy Chng</div>
                    <div className="Testimonials-item-avatar">
                      <img src={require('../../assets/images/cindy_chng.jpg')} />
                    </div>
                  </div>
                  <div></div>
                </div>
              </div>
            </Slider>
          </div>
        </Container>
      </div>
    );
  }

}
