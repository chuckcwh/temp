import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import s from './ProfileClientEdit.css';
import Container from '../../Container';
import Link from '../../Link';
import Header from '../../Header';
import history from '../../../core/history';
import util from '../../../core/util';
import SideTabList from '../../SideTabList';
import SideTab from '../../SideTab';
// react-icons
import MdPerson from 'react-icons/lib/md/person';
import MdHome from 'react-icons/lib/md/home';
import FaComments from 'react-icons/lib/fa/comments';
import FaImage from 'react-icons/lib/fa/image';
import FaLock from 'react-icons/lib/fa/lock';


class ProfileClientEdit extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTabIndex: 0,
    };
  }

  handleTabSelect() {
    this.setState({ selectedTabIndex: index });
  }

  render() {
    const { user } = this.props;
    const { fullName, gender, dob, addresses, race, religion, languages, nationality } = user.clients[0];

    return (
      <div className={s.profileClientEdit}>
        <Container>
          this is profile edit
          <div className={s.editWrapper}>
            <div className={s.sideBar}>
              <div className={s.userImage}></div>
              <SideTabList
                onSelect={this.handleTabSelect}
                selectedIndex={this.state.selectedTabIndex}
                selectable
                >
                <SideTab><MdPerson /><span>Basic Details</span></SideTab>
                <SideTab><MdHome /><span>Residential Details</span></SideTab>
                <SideTab><FaComments /><span>Cultural Details</span></SideTab>
                <SideTab><FaImage /><span>Profile Picture</span></SideTab>
                <SideTab><FaLock /><span>Password</span></SideTab>
              </SideTabList>
            </div>
            <div className={s.editPanel}>
              WTF the main panel
            </div>
          </div>
        </Container>
      </div>
    );
  }

}

ProfileClientEdit.propTypes = {
  user: React.PropTypes.object,
};

export default ProfileClientEdit;
