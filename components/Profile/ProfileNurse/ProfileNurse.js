import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import s from './ProfileNurse.css';
import Container from '../../Container';
import Link from '../../Link';
import history from '../../../core/history';
import util from '../../../core/util';

// react-icons
import MdAccessiblity from 'react-icons/lib/md/accessibility';
import MdPerson from 'react-icons/lib/md/person';
import MdLocationOn from 'react-icons/lib/md/location-on';
import TiWorld from 'react-icons/lib/ti/world';
import FaComment from 'react-icons/lib/fa/comment';
import FaFlag from 'react-icons/lib/fa/flag';
import { ProfileDetail } from '../ProfileBase/ProfileBase';


const dataUrl = 'https://ebeecare-dev.s3.amazonaws.com/';

class ProfileNurse extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { user } = this.props;
    const { fullName, gender, dob, addresses, race, religion, languages, nationality, ratings } = user.nurses && user.nurses[0];

    const profile = {
      photo: user.picture ? `${dataUrl}${user.picture}` : require('../../../assets/images/noimage.gif'),

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

    return (
      <div className={s.profileNurse}>
        <ProfileDetail profile={profile} />


      </div>
    );
  }

}

ProfileNurse.propTypes = {
  // params: React.PropTypes.object,
  //
  user: React.PropTypes.object,
  // allServices: React.PropTypes.object,
  // allServicesFetching: React.PropTypes.bool,
  // servicesTree: React.PropTypes.array,
  // servicesTreeHash: React.PropTypes.object,
  // servicesSubtypesHash: React.PropTypes.object,
  // servicesSubtypesHashBySlug: React.PropTypes.object,
  // patients: React.PropTypes.object,
  // patientsFetching: React.PropTypes.bool,
  // patientIds: React.PropTypes.array,
  // cazes: React.PropTypes.object,
  // cazesFetching: React.PropTypes.bool,
  // cazeIds: React.PropTypes.array,
  //
  // fetchServices: React.PropTypes.func,
  // setOrderService: React.PropTypes.func,
  // setLastPage: React.PropTypes.func,
};

const mapStateToProps = (state) => ({
  user: state.user.data,
  // allServices: state.allServices.data,
  // allServicesFetching: state.allServices.isFetching,
  // servicesTree: state.allServices.dashboardTree,
  // servicesTreeHash: state.allServices.dashboardTreeHash,
  // servicesSubtypesHash: state.allServices.subTypesHash,
  // servicesSubtypesHashBySlug: state.allServices.subTypesHashBySlug,
  // patients: state.user.data && state.user.data.clients && state.user.data.clients.length
  //   && state.user.data.clients[0] && state.user.data.clients[0].id
  //   && state.patientsByClient[state.user.data.clients[0].id]
  //   && state.patientsByClient[state.user.data.clients[0].id].data,
  // patientsFetching: state.user.data && state.user.data.clients && state.user.data.clients.length
  //   && state.user.data.clients[0] && state.user.data.clients[0].id
  //   && state.patientsByClient[state.user.data.clients[0].id]
  //   && state.patientsByClient[state.user.data.clients[0].id].isFetching,
  // patientIds: state.user.data && state.user.data.clients && state.user.data.clients.length
  //   && state.user.data.clients[0] && state.user.data.clients[0].id
  //   && state.patientsByClient[state.user.data.clients[0].id]
  //   && state.patientsByClient[state.user.data.clients[0].id].ids,
  // cazes: state.user.data && state.user.data.clients && state.user.data.clients.length
  //   && state.user.data.clients[0] && state.user.data.clients[0].id
  //   && state.cazesByClient[state.user.data.clients[0].id]
  //   && state.cazesByClient[state.user.data.clients[0].id].data,
  // cazesFetching: state.user.data && state.user.data.clients && state.user.data.clients.length
  //   && state.user.data.clients[0] && state.user.data.clients[0].id
  //   && state.cazesByClient[state.user.data.clients[0].id]
  //   && state.cazesByClient[state.user.data.clients[0].id].isFetching,
  // cazeIds: state.user.data && state.user.data.clients && state.user.data.clients.length
  //   && state.user.data.clients[0] && state.user.data.clients[0].id
  //   && state.cazesByClient[state.user.data.clients[0].id]
  //   && state.cazesByClient[state.user.data.clients[0].id].ids,
});

const mapDispatchToProps = (dispatch) => ({
  // fetchServices: () => dispatch(fetchServices()),
  // getPatients: (params) => dispatch(getPatients(params)),
  // getCases: (params) => dispatch(getCases(params)),
  // setOrderService: (service) => dispatch(setOrderService(service)),
  // setLastPage: (page) => dispatch(setLastPage(page)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileNurse);
