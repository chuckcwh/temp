import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import s from './ProfileEdit.css';
import Container from '../../Container';
import Link from '../../Link';
import Header from '../../Header';
import history from '../../../core/history';
import { isAdmin, isClient, isProvider, getUserName } from '../../../core/util';
import SideTabList from '../../SideTabList';
import SideTab from '../../SideTab';
import { fetchLanguages } from '../../../actions';
import imgBlankAvatar from '../../../assets/images/noimage.gif';
// Sub Components
import ProfileEditBasicForm from '../ProfileEditBasicForm/ProfileEditBasicForm';
import ProfileEditResidentialForm from '../ProfileEditResidentialForm/ProfileEditResidentialForm';
import ProfileEditCulturalForm from '../ProfileEditCulturalForm/ProfileEditCulturalForm';
import ProfileEditProfileForm from '../ProfileEditProfileForm/ProfileEditProfileForm';
import ProfileEditPasswordForm from '../ProfileEditPasswordForm/ProfileEditPasswordForm';
import ProfileEditEducationForm from '../ProfileEditEducationForm/ProfileEditEducationForm';
import ProfileEditEmploymentForm from '../ProfileEditEmploymentForm/ProfileEditEmploymentForm';
import ProfileEditAchievementForm from '../ProfileEditAchievementForm/ProfileEditAchievementForm';
// React-icons
import MdPerson from 'react-icons/lib/md/person';
import MdHome from 'react-icons/lib/md/home';
import FaComments from 'react-icons/lib/fa/comments';
import FaImage from 'react-icons/lib/fa/image';
import FaLock from 'react-icons/lib/fa/lock';
import FaBook from 'react-icons/lib/fa/book';
import FaBriefcase from 'react-icons/lib/fa/briefcase';
import FaTrophy from 'react-icons/lib/fa/trophy';


class ProfileEdit extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedTabIndex: 0
    }
  }

  handleTabSelect = (index) => {
    this.setState({ selectedTabIndex: index })
  };

  render() {
    const { user, userFetching } = this.props;
    const { selectedTabIndex } = this.state;
    let content;
    let sideTab;

    if (isClient(user)) {
      sideTab = (
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
      )

      content = (
        <div className={s.editPanelContainer}>
          {selectedTabIndex === 0 && (<ProfileEditBasicForm />)}
          {selectedTabIndex === 1 && (<ProfileEditResidentialForm />)}
          {selectedTabIndex === 2 && (<ProfileEditCulturalForm />)}
          {selectedTabIndex === 3 && (<ProfileEditProfileForm />)}
          {selectedTabIndex === 4 && (<ProfileEditPasswordForm />)}
        </div>
      )
    } else if (isProvider(user)) {
      sideTab = (
        <SideTabList
          onSelect={this.handleTabSelect}
          selectedIndex={this.state.selectedTabIndex}
          selectable
        >
          <SideTab><MdPerson /><span>Basic Details</span></SideTab>
          <SideTab><MdHome /><span>Residential Details</span></SideTab>
          <SideTab><FaComments /><span>Cultural Details</span></SideTab>
          <SideTab><FaBook /><span>Education History</span></SideTab>,
          <SideTab><FaBriefcase /><span>Employment History</span></SideTab>,
          <SideTab><FaTrophy /><span>Achievements</span></SideTab>
          <SideTab><FaImage /><span>Profile Picture</span></SideTab>
          <SideTab><FaLock /><span>Password</span></SideTab>
        </SideTabList>
      )

      content = (
        <div className={s.editPanelContainer}>
          {selectedTabIndex === 0 && (<ProfileEditBasicForm />)}
          {selectedTabIndex === 1 && (<ProfileEditResidentialForm />)}
          {selectedTabIndex === 2 && (<ProfileEditCulturalForm />)}
          {selectedTabIndex === 3 && (<ProfileEditEducationForm />)}
          {selectedTabIndex === 4 && (<ProfileEditEmploymentForm />)}
          {selectedTabIndex === 5 && (<ProfileEditAchievementForm />)}
          {selectedTabIndex === 6 && (<ProfileEditProfileForm />)}
          {selectedTabIndex === 7 && (<ProfileEditPasswordForm />)}
        </div>
      )
    }

    return (
      <div className={s.profileEdit}>
        <Container>
          <div className={s.editWrapper}>

            <div className={s.sideBar}>
              <Loader className="spinner" loaded={!userFetching}>
                <div className={s.userImage}>
                  <img src={user.avatar ? user.avatar : imgBlankAvatar} key={user.avatar ? user.avatar : 'noimage'} />
                </div>

                {sideTab}
              </Loader>
            </div>

            <div className={s.editPanel}>
              {content}
            </div>

          </div>
        </Container>
      </div>

    );
  }

}

ProfileEdit.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = (state) => ({
  user: state.user.data,
  userFetching: state.user.isFetching,
});

export default connect(mapStateToProps)(ProfileEdit);
