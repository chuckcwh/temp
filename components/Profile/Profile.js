import React, { Component } from 'react';
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
import ProfileClient from './ProfileClient/ProfileClient';
import ProfileClientEdit from './ProfileClientEdit/ProfileClientEdit';
import ProfileNurse from './ProfileNurse/ProfileNurse';
import ProfileNurseEdit from './ProfileNurseEdit/ProfileNurseEdit';


class Profile extends Component {

  render() {
    const { params, user } = this.props;
    const { edit } = params;

    let content;

    if (user.type === 'Client' && !edit) {
      content = (
        <ProfileClient user={user}/>
      )
    } else if (user.type === 'Client' && edit) {
      content = (
        <ProfileClientEdit user={user}/>
      )
    } else if (user.type === 'Nurse' && !edit) {
      content = (
        <ProfileNurse user={user}/>
      )
    } else if (user.type === 'Nurse' && edit) {
      content = (
        <ProfileNurseEdit user={user}/>
      )
    }

    return (
      <div className={s.profile}>
        <Header title={`${user && user.username}'s Profile`} />
        <Container>
          {content}
        </Container>
      </div>
    );
  }

}

Profile.propTypes = {
  user: React.PropTypes.object,
};

const mapStateToProps = (state) => ({
  user: state.user.data,
});

export default connect(mapStateToProps)(Profile);
