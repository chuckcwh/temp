import React from 'react';
import Slider from 'react-slick';
import s from './Partners.css';
import Container from '../Container';

const image1 = require('./msf.png');
const image2 = require('./channel-newsasia.png');
const image3 = require('./startup-season3.png');
const image4 = require('./nus.png');
const image5 = require('./raiSE.png');
const image6 = require('./spring.png');
const image7 = require('./e27.png');

const Partners = () => (
  <div className={s.partners}>
    <Container>
      <div className={s.partnersList}>
        <Slider
          dots={false}
          speed={1000}
          infinite={false}
          centerMode
          autoplay={false}
          slidesToShow={1}
          slidesToScroll={1}
          arrows
          variableWidth
          initialSlide={3}
          responsive={[
            {
              breakpoint: 681,
              settings: {
                draggable: true,
              },
            },
            {
              breakpoint: 100000,
              settings: {
                draggable: false,
              },
            },
          ]}
        >
          <div className={s.partnersLogo} style={{ width: 102 }}>
            <img src={image1} alt="MSF" />
          </div>
          <div className={s.partnersLogo} style={{ width: 80 }}>
            <img src={image2} alt="Channel Newsasia" />
          </div>
          <div className={s.partnersLogo} style={{ width: 57 }}>
            <img src={image3} alt="Start-up Season 3" />
          </div>
          <div className={s.partnersLogo} style={{ width: 177 }}>
            <img src={image4} alt="NUS" />
          </div>
          <div className={s.partnersLogo} style={{ width: 86 }}>
            <img src={image5} alt="raiSE" />
          </div>
          <div className={s.partnersLogo} style={{ width: 97 }}>
            <img src={image6} alt="SPRING Singapore" />
          </div>
          <div className={s.partnersLogo} style={{ width: 82 }}>
            <img src={image7} alt="e27" />
          </div>
        </Slider>
      </div>
    </Container>
  </div>
);

export default Partners;
