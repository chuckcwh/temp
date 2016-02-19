import React, { Component } from 'react';
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
    );
  }

}
