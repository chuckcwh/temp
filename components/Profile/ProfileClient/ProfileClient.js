import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import s from './ProfileClient.css';
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


const dataUrl = 'https://ebeecare-dev.s3.amazonaws.com/';

class ProfileClient extends Component {

  render() {
    const { user } = this.props;
    const { fullName, gender, dob, addresses, race, religion, languages, nationality } = user.clients[0];

    const profile = {
      photo: `${dataUrl}${user.picture}`,
      gender: gender ? (<p><MdAccessiblity/> {gender}</p>) : null,
      ageGroup: function() {
        let returnAgeGroup;
        if (dob) {
          const years = moment().diff(dob, 'years');
          if (years % 10 === 0) {
            const loYears = years - 9;
            returnAgeGroup = `${loYears}-${years} years old`;
          } else {
            const loYears = (Math.floor(years / 10) * 10) + 1;
            const hiYears = loYears + 9;
            returnAgeGroup = `${loYears}-${hiYears} years old`;
          }
          return (<p><MdPerson/> {returnAgeGroup}</p>)
        }
      },
      address: addresses ? (<p><MdLocationOn/> {addresses[0].region}</p>) : null,
      raceReligion: function() {
        const returnReligion = religion ? ` - ${religion}`: null;
        return (race || returnReligion) ? (<p><TiWorld/> {`${race}${returnReligion}`}</p>) : null;
      },
      languages: function() {
        let callBack = [];
        languages.map(lang => callBack.push(lang.name));
        return (<p><FaComment/> {`${callBack.join(', ')}`}</p>)
      },
      nationality: nationality ? (<p><FaFlag/> {nationality}</p>) : null,
    }

    return (
      <div className={s.profileClient}>
        <Container>
          <div className={s.main}>
            <Link className={cx('btn', 'btn-primary', s.editLink)} to="/profile/edit">Edit Profile</Link>
            <div className={s.sun}></div>
            <div className={s.cloud}></div>

            <div className={s.profileWindow}>
              <div className={s.imgSection}>
                <div className={s.imgContainer}>
                  <div className={s.profileImg}></div>
                </div>
                <p>{fullName}</p>
              </div>
              <div className={s.infoSection}>
                <h3>{fullName}</h3>
                {profile.gender}
                {profile.ageGroup()}
                {profile.address}
                {profile.raceReligion()}
                {profile.languages()}
                {profile.nationality}
              </div>
            </div>

          </div>
        </Container>
      </div>
    );
  }

}

ProfileClient.propTypes = {
  user: React.PropTypes.object,
};

export default ProfileClient;
