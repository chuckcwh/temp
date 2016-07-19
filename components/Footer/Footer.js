import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import FaFacebook from 'react-icons/lib/fa/facebook';
import FaTwitter from 'react-icons/lib/fa/twitter';
import FaInstagram from 'react-icons/lib/fa/instagram';
import s from './Footer.css';
import Container from '../Container';
import Link from '../Link';

class Footer extends Component {

  // static propTypes = {
  //   children: PropTypes.element.isRequired,
  // };

  render() {
    return (
      <div className={s.footer}>
        <Container>
          <div className={s.footerList}>
            <div className={s.footerItem}>
            <div>71 Ayer Rajah Crescent<br/>#04-11 S(139951)</div>
              <a href="https://www.google.com.sg/maps/place/71+Ayer+Rajah+Crescent,+Singapore+139951/@1.2967471,103.7844749,17z/data=!3m1!4b1!4m2!3m1!1s0x31da1a4fd6a29643:0x1cbb8a56dd8c9ccf!6m1!1e1" className={classNames('btn', s.footerMapsButton)} target="_blank">
                <img src={require('./map.png')} />
                <span className={s.footerMapsLabel}>Find Location</span>
              </a>
            </div>
            <div className={s.footerItem}>
              <ul className={s.footerNav}>
                <li className={s.footerNavItem}>
                  <a className={s.navigationLink} href="http://smarteredu.org/smarteredu/institution/smarter-edx/eBeecare/">Learn@eBeeACADEMY</a>
                </li>
              </ul>
              <div className={s.footerTel}>6514 9729</div>
              <div><a href="mailto:contact@ebeecare.com">contact@ebeecare.com</a></div>
            </div>
            <div className={s.footerItem}>
              <div>
                <span>Find us on:</span>
                <a href="https://www.facebook.com/ebeecare/" className={s.footerSocialMedia}><FaFacebook /></a>
                <a href="https://twitter.com/ebeecaresg" className={s.footerSocialMedia}><FaTwitter /></a>
                <a href="https://www.instagram.com/ebeecare_official/" className={s.footerSocialMedia}><FaInstagram /></a>
                {/*
                <a href="" className={s.footerSocialMedia}><i className="fa fa-google-plus"></i></a>
                <a href="" className={s.footerSocialMedia}><i className="fa fa-linkedin"></i></a>
                */}
              </div>
            </div>
          </div>
          <div className={s.footerCopyright}>
            <div>© Copyright {(new Date()).getFullYear()} by eBeeCare Pte. Ltd. (201415751N). </div>
            <div>All Rights Reserved.</div>
          </div>
        </Container>
      </div>
    );
  }

}

export default Footer;
