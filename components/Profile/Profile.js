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
import { getUserName } from '../../core/util';
// sub components
import ProfileBase from './ProfileBase/ProfileBase';
import ProfileEdit from './ProfileEdit/ProfileEdit';

// react-icons
import MdAccessiblity from 'react-icons/lib/md/accessibility';
import MdPerson from 'react-icons/lib/md/person';
import MdLocationOn from 'react-icons/lib/md/location-on';
import TiWorld from 'react-icons/lib/ti/world';
import FaComment from 'react-icons/lib/fa/comment';
import FaFlag from 'react-icons/lib/fa/flag';


const s3Url = 'https://ebeecare-dev.s3.amazonaws.com/';

class Profile extends Component {

  render() {
    const { params, user } = this.props;
    const { edit } = params;
    let profile;

    if (user) {
      const { avatar, gender, dob, address, race, religion, languages, nationality, name } = user;
      profile = {
        photo: avatar ? `${s3Url}${avatar}` : require('../../assets/images/noimage.gif'),
        gender: gender && (<p><MdAccessiblity /> {gender}</p>),
        ageGroup: function() {
          let returnAgeGroup;
          if (dob) {
            const years = moment().diff(dob, 'years');
            if (years % 10 === 0) {
              const loYears = years - 9;
              returnAgeGroup = `${loYears} - ${years} years old`;
            } else {
              const loYears = (Math.floor(years / 10) * 10) + 1;
              const hiYears = loYears + 9;
              returnAgeGroup = `${loYears} - ${hiYears} years old`;
            }
            return (<p><MdPerson /> {returnAgeGroup}</p>)
          }
        },
        address: address && (<p><MdLocationOn/> {address.neighborhood}</p>),
        raceReligion: function() {
          const returnReligion = religion && ` - ${religion}`;
          return (race || returnReligion) && (<p><TiWorld /> {`${race}${returnReligion}`}</p>);
        },
        languages: function() {
          const langNames = [];
          languages.map(lang => langNames.push(lang.name));
          return langNames.length ? (<p><FaComment /> {`${langNames.join(', ')}`}</p>) : null;
        },
        nationality: nationality && (<p><FaFlag /> {nationality}</p>),
        name,
      }
    }

    return (
      <div className={s.profile}>
        <Header title={`${getUserName(user)}'s Profile`} />
        <Container>
          {user && edit && (<ProfileEdit />)}
          {user && !edit && (<div><ProfileBase profile={profile} /></div>)}
        </Container>
      </div>
    )
  }

}

Profile.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = (state) => ({
    user: state.user.data,
});

export default connect(mapStateToProps)(Profile);
