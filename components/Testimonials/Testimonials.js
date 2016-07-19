import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import s from './Testimonials.css';
import Container from '../Container';
import Link from '../Link';

export default class Testimonials extends Component {

  render() {
    return (
      <div className={s.testimonials}>
        <Container>
          <h1 className="text-center">Our Customers Say...</h1>
          <div className={s.testimonialsList}>
            <Slider dots={true} speed={1000} autoplay={false} slidesToScroll={1} arrows={false} 
              responsive={[
                {
                  breakpoint: 640,
                  settings: {
                    slidesToShow: 1,
                    infinite: true
                  }
                },
                {
                  breakpoint: 960,
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
              <div className={s.testimonialsSliderItem}>
                <div className={s.testimonialsItem}>
                  <div className={s.testimonialsWrapper}>
                    <div className={s.testimonialsItemText}>I tried out a few nutritionists from eBeeCare (for free) before I found Mark (a nutritionist whom I am now engaging on a long term basis).</div>
                    <div className={s.testimonialsItemName}>Ho Qun Tea</div>
                    <div className={s.testimonialsItemAvatar}>
                      <img src={require('../../assets/images/ho_qun_tea.jpg')} />
                    </div>
                  </div>
                  <div></div>
                </div>
              </div>
              <div className={s.testimonialsSliderItem}>
                <div className={s.testimonialsItem}>
                  <div className={s.testimonialsWrapper}>
                    <div className={s.testimonialsItemText}>We never knew wound care procedure could be done at home! Thanks to eBeeCare, now we do not need to take leave to bring my mum to hospital for simple wound dressing.</div>
                    <div className={s.testimonialsItemName}>Goh Chng Ying</div>
                    <div className={s.testimonialsItemAvatar}>
                      <img src={require('../../assets/images/goh_chng_ying.jpg')} />
                    </div>
                  </div>
                  <div></div>
                </div>
              </div>
              <div className={s.testimonialsSliderItem}>
                <div className={s.testimonialsItem}>
                  <div className={s.testimonialsWrapper}>
                    <div className={s.testimonialsItemText}>It is so convenient to get a professional nurse from eBeeCare, even for last minute requests; and their price is very competitive.</div>
                    <div className={s.testimonialsItemName}>Cindy Chng</div>
                    <div className={s.testimonialsItemAvatar}>
                      <img src={require('../../assets/images/cindy_chng.jpg')} />
                    </div>
                  </div>
                  <div></div>
                </div>
              </div>
            </Slider>
          </div>
          <div className={s.testimonialsFooter}>
            <Link to="/booking1" className="btn btn-secondary">FIND A CAREGIVER</Link>
          </div>
        </Container>
      </div>
    );
  }
}