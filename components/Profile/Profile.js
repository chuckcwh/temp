import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import classNames from 'classnames';
import moment from 'moment';
import s from './Profile.css';
import Container from '../Container';
import Link from '../Link';
import Header from '../Header';
import history from '../../core/history';
import util from '../../core/util';
// sub components
import ProfileBase from './ProfileBase/ProfileBase';
import ProfileEdit from './ProfileEdit/ProfileEdit';

// import ProfileNurse from './ProfileNurse/ProfileNurse';
// import ProfileNurseEdit from './ProfileNurseEdit/ProfileNurseEdit';

// react-icons
import MdAccessiblity from 'react-icons/lib/md/accessibility';
import MdPerson from 'react-icons/lib/md/person';
import MdLocationOn from 'react-icons/lib/md/location-on';
import TiWorld from 'react-icons/lib/ti/world';
import FaComment from 'react-icons/lib/fa/comment';
import FaFlag from 'react-icons/lib/fa/flag';


const dataUrl = 'https://ebeecare-dev.s3.amazonaws.com/';

class Profile extends Component {

  render() {
    const { params, user } = this.props;
    const { edit } = params;
    let content;

    if (user) {
      const { fullName, gender, dob, addresses, race, religion, languages, nationality } = user.clients[0] || user.nurses[0];
      const profile = {
        photo: user.picture ? `${dataUrl}${user.picture}` : require('../../assets/images/noimage.gif'),
        gender: gender ? (<p><MdAccessiblity /> {gender}</p>) : null,
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
            return (<p><MdPerson /> {returnAgeGroup}</p>)
          }
        },
        address: addresses ? (<p><MdLocationOn/> {addresses[0].region}</p>) : null,
        raceReligion: function() {
          const returnReligion = religion ? ` - ${religion}`: null;
          return (race || returnReligion) ? (<p><TiWorld /> {`${race}${returnReligion}`}</p>) : null;
        },
        languages: function() {
          let callBack = [];
          languages.map(lang => callBack.push(lang.name));
          return (<p><FaComment /> {`${callBack.join(', ')}`}</p>)
        },
        nationality: nationality ? (<p><FaFlag /> {nationality}</p>) : null,
        fullName,
      }


      if (user.type === 'Client' && !edit) {
        content = (
          <div>
            <ProfileBase profile={profile} />
          </div>
        )
      } else if (user.type === 'Client' && edit) {
        content = (
          <ProfileEdit />
        )
      }

    }








    // else if (user && user.type === 'Nurse' && !edit) {
    //   content = (
    //     <div>
    //       <ProfileBase profile={profile} />
    //     </div>
    //   )
    // } else if (user && user.type === 'Nurse' && edit) {
    //   content = (
    //     <ProfileNurseEdit />
    //   )
    // }

    return (
      <div className={s.profile}>
        <Header title={`${user && user.clients && user.clients[0].fullName || user && user.nurses && user.nurses[0].fullName}'s Profile`} />
        <Container>
          {content}
        </Container>
      </div>
    );
  }

}

Profile.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = (state) => ({
  user: state.user.data
});

export default connect(mapStateToProps)(Profile);
