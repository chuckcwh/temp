import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import s from './ProfileNurseEdit.css';
import Container from '../../Container';
import Link from '../../Link';
import Header from '../../Header';
import history from '../../../core/history';
import util from '../../../core/util';
import SideTabList from '../../SideTabList';
import SideTab from '../../SideTab';


class ProfileNurseEdit extends Component {

  render() {
    const { user } = this.props;
    const { fullName, gender, dob, addresses, race, religion, languages, nationality } = user.clients[0];


    return (
      <div className={s.profileClient}>
        <Container>
          this is profile nurse edit

        </Container>
      </div>
    );
  }

}

ProfileNurseEdit.propTypes = {
  user: React.PropTypes.object,
};

export default ProfileNurseEdit;
