import React, { Component } from 'react';
import Slider from 'react-slick';
import './Partners.scss';
import Container from '../Container';

export default class Partners extends Component {

  render() {
    return (
      <div className="Partners">
        <Container>
          <div className="Partners-list">
            <Slider dots={false} speed={1000} infinite={false} centerMode={true} autoplay={false} slidesToShow={1} slidesToScroll={1} arrows={true} variableWidth={true} initialSlide={3}
              responsive={[
                {
                  breakpoint: 681,
                  settings: {
                    draggable: true
                  }
                },
                {
                  breakpoint: 100000,
                  settings: {
                    draggable: false
                  }
                }
              ]}
            >
              <div className="Partners-logo" style={{width: 102}}>
                <img src={require('./msf.png')} />
              </div>
              <div className="Partners-logo" style={{width: 80}}>
                <img src={require('./channel-newsasia.png')} />
              </div>
              <div className="Partners-logo" style={{width: 57}}>
                <img src={require('./startup-season3.png')} />
              </div>
              <div className="Partners-logo" style={{width: 177}}>
                <img src={require('./nus.png')} />
              </div>
              <div className="Partners-logo" style={{width: 86}}>
                <img src={require('./raise.png')} />
              </div>
              <div className="Partners-logo" style={{width: 97}}>
                <img src={require('./spring.png')} />
              </div>
              <div className="Partners-logo" style={{width: 82}}>
                <img src={require('./e27.png')} />
              </div>
            </Slider>
          </div>
        </Container>
      </div>
    );
  }

}
