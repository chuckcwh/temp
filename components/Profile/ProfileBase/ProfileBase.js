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
// react-icons
import MdAccessiblity from 'react-icons/lib/md/accessibility';
import MdPerson from 'react-icons/lib/md/person';
import MdLocationOn from 'react-icons/lib/md/location-on';
import TiWorld from 'react-icons/lib/ti/world';
import FaComment from 'react-icons/lib/fa/comment';
import FaFlag from 'react-icons/lib/fa/flag';


const s3Url = 'https://ebeecare-dev.s3.amazonaws.com/';

export class ProfileBase extends Component {

  getAgeGroup = (dob) => {
    let ageGroup;
    const years = moment().diff(dob, 'years');
    if (years === 0) {
      ageGroup = `0 years old`;
    } else if (years % 10 === 0) {
      const loYears = years - 9;
      ageGroup = `${loYears} - ${years} years old`;
    } else {
      const loYears = (Math.floor(years / 10) * 10) + 1;
      const hiYears = loYears + 9;
      ageGroup = `${loYears} - ${hiYears} years old`;
    }
    return ageGroup
  };

  render() {
    const { avatar, gender, dob, address, race, religion, languages, nationality, name } = this.props;

    const profile = {
      gender: gender && (<p><MdAccessiblity /> {gender}</p>),
      ageGroup: dob && (<p><MdPerson /> {this.getAgeGroup(dob)}</p>),
      address: address && address.neighborhood && (<p><MdLocationOn/> {address.neighborhood}</p>),
      raceReligion: (race || religion) && (<p><TiWorld /> {race}{race && religion && ' - '}{religion}</p>),
      languages: languages && languages.length && (<p><FaComment /> {`${languages.join(', ')}`}</p>),
      nationality: nationality && (<p><FaFlag /> {nationality}</p>),
      name,
      avatar
    }

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
                  <img src={profile.avatar} className={s.profileImg} />
                </div>
                <p>{profile.name}</p>
              </div>
              <div className={s.infoSection}>
                <h3>{profile.name}</h3>
                {profile.gender}
                {profile.ageGroup}
                {profile.address}
                {profile.raceReligion}
                {profile.languages}
                {profile.nationality}
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

const mapStateToProps = (state) => {
  const user = state.user.data;
  const config = state.config.data;
  const gendersByValue = config && config.gendersByValue;
  const raceByValue = config && config.raceByValue;
  const religionsByValue = config && config.religionsByValue;
  const languagesByValue = config && config.languagesByValue;
  const countriesByValue = config && config.countriesByValue;

  return {
    avatar: user && (user.avatar ? `${s3Url}${avatar}` : require('../../../assets/images/noimage.gif')),
    gender: user && user.gender && gendersByValue && gendersByValue[user.gender].name,
    dob: user && user.dob,
    address: user && user.address,
    race: user && user.race && raceByValue && raceByValue[user.race].name,
    religion: user && user.religion && religionsByValue && religionsByValue[user.religion].name,
    languages: user && user.languages  && languagesByValue && user.languages.map(item => (languagesByValue[item].name)),
    nationality: user && user.nationality && countriesByValue && countriesByValue[user.nationality].name,
    name: user && user.name,
}};

export default connect(mapStateToProps)(ProfileBase);
