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
import ProfileNurse from '../ProfileNurse';
import ProfileClient from '../ProfileClient';


class Profile extends Component {

  render() {
    const { user } = this.props;
    let content;

    if (user) {
      if (user.type === 'Client') {
        content = (
          <ProfileClient user={user}/>
        )
      } else if (user.type === 'Nurse') {
        content = (
          <ProfileNurse user={user}/>
        )
      }
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
