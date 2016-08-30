import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import s from './ProfileBase.css';
import Container from '../../Container';
import Link from '../../Link';
import Header from '../../Header';
import history from '../../../core/history';
import util from '../../../core/util';


export class ProfileBase extends Component {

  render() {
    const { name, photo, gender, ageGroup, address, languages, nationality, raceReligion } = this.props.profile;

    return(
      <div className={s.profileBase}>
        <Container>
          <div className={s.main}>
            <Link className={cx('btn', 'btn-primary', s.editLink)} to="/profile/edit">Edit Profile</Link>
            <div className={s.sun}></div>
            <div className={s.cloud}></div>

            <div className={s.profileWindow}>
              <div className={s.imgSection}>
                <div className={s.imgContainer}>
                  <img src={photo} className={s.profileImg} />
                </div>
                <p>{name}</p>
              </div>
              <div className={s.infoSection}>
                <h3>{name}</h3>
                {gender}
                {ageGroup()}
                {address}
                {raceReligion()}
                {languages()}
                {nationality}
              </div>
            </div>

          </div>
        </Container>
      </div>
    )
  }
}


ProfileBase.propTypes = {
  // user: PropTypes.object,
};

export default ProfileBase;
