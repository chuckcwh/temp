import React, { Component, PropTypes } from 'react';
import { FaFacebook, FaTwitter } from 'react-icons/lib/fa';
import './Footer.scss';
import Container from '../Container';

class Footer extends Component {

  // static propTypes = {
  //   children: PropTypes.element.isRequired,
  // };

  render() {
    return (
      <div className="Footer">
        <Container>
          <div className="Footer-list">
            <div className="Footer-item">
              <div>71 Ayer Rajah Crescent<br/>#04-11 S(139951)</div>
              <a href="https://www.google.com.sg/maps/place/71+Ayer+Rajah+Crescent,+Singapore+139951/@1.2967471,103.7844749,17z/data=!3m1!4b1!4m2!3m1!1s0x31da1a4fd6a29643:0x1cbb8a56dd8c9ccf!6m1!1e1" className="btn Footer-maps-button" target="_blank">
                <img src={require('./map.png')} />
                <span className="Footer-maps-label">Find Location</span>
              </a>
            </div>
            <div className="Footer-item">
              <div className="Footer-tel">9733 6938</div>
              <div><a href="mailto:contact@ebeecare.com">contact@ebeecare.com</a></div>
            </div>
            <div className="Footer-item">
              <div>
                <span>Find us on:</span>
                <a href="https://www.facebook.com/ebeecare/" className="Footer-social-media"><FaFacebook /></a>
                <a href="https://twitter.com/ebeecaresg" className="Footer-social-media"><FaTwitter /></a>
                {/*
                <a href="" className="Footer-social-media"><i className="fa fa-instagram"></i></a>
                <a href="" className="Footer-social-media"><i className="fa fa-google-plus"></i></a>
                <a href="" className="Footer-social-media"><i className="fa fa-linkedin"></i></a>
                */}
              </div>
            </div>
          </div>
          <div className="Copyright">
            <div>© Copyright {(new Date()).getFullYear()} by eBeeCare Pte. Ltd. (201415751N). </div>
            <div>All Rights Reserved.</div>
          </div>
        </Container>
      </div>
    );
  }

}

export default Footer;
