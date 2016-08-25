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
import { fetchLanguages } from '../../../actions';
// Sub Components
import ProfileNurseEditBasicForm from '../ProfileNurseEditBasicForm/ProfileNurseEditBasicForm';
// import ProfileNurseEditResidentialForm from '../ProfileNurseEditResidentialForm/ProfileNurseEditResidentialForm';
// import ProfileNurseEditCulturalForm from '../ProfileNurseEditCulturalForm/ProfileNurseEditCulturalForm';
// import ProfileNurseEditProfileForm from '../ProfileNurseEditProfileForm/ProfileNurseEditProfileForm';
// import ProfileNurseEditPasswordForm from '../ProfileNurseEditPasswordForm/ProfileNurseEditPasswordForm';
// React-icons
import MdPerson from 'react-icons/lib/md/person';
import MdHome from 'react-icons/lib/md/home';
import FaComments from 'react-icons/lib/fa/comments';
import FaImage from 'react-icons/lib/fa/image';
import FaLock from 'react-icons/lib/fa/lock';
import FaBook from 'react-icons/lib/fa/book';
import FaBriefcase from 'react-icons/lib/fa/briefcase';
import FaTrophy from 'react-icons/lib/fa/trophy';


const dataUrl = 'https://ebeecare-dev.s3.amazonaws.com/';

class ProfileNurseEdit extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedTabIndex: 0
    }
  }

  componentDidMount() {
    this.props.fetchLanguages();
  }

  handleTabSelect(index) {
    this.setState({ selectedTabIndex: index })
  }

  render() {
    const { user, languageChoice } = this.props;
    const { selectedTabIndex } = this.state;

    return (
      <div className={s.profileNurseEdit}>
        <Container>
          <div className={s.editWrapper}>
            <div className={s.sideBar}>
              <div className={s.userImage}>
                <img src={user.picture ? `${dataUrl}${user.picture}` : require('../../../assets/images/noimage.gif')} />
              </div>
              <SideTabList
                onSelect={this.handleTabSelect.bind(this)}
                selectedIndex={this.state.selectedTabIndex}
                selectable
              >
                <SideTab><MdPerson /><span>Basic Details</span></SideTab>
                <SideTab><MdHome /><span>Residential Details</span></SideTab>
                <SideTab><FaComments /><span>Cultural Details</span></SideTab>
                <SideTab><FaBook /><span>Education History</span></SideTab>
                <SideTab><FaBriefcase /><span>Employment History</span></SideTab>
                <SideTab><FaTrophy /><span>Achievements</span></SideTab>
                <SideTab><FaImage /><span>Profile Picture</span></SideTab>
                <SideTab><FaLock /><span>Password</span></SideTab>
              </SideTabList>
            </div>
            <div className={s.editPanel}>
              <div className={s.editPanelContainer}>
                {selectedTabIndex === 0 && (<ProfileNurseEditBasicForm />)}
                {/*
                {selectedTabIndex === 0 && (<ProfileNurseEditBasicForm />)}
                {selectedTabIndex === 1 && (<ProfileNurseEditResidentialForm />)}
                {selectedTabIndex === 2 && (<ProfileNurseEditCulturalForm languageChoice={languageChoice} />)}
                {selectedTabIndex === 3 && (<ProfileNurseEditProfileForm />)}
                {selectedTabIndex === 4 && (<ProfileNurseEditPasswordForm />)}
                */}
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

}

ProfileNurseEdit.propTypes = {
  user: React.PropTypes.object,
};

const mapStateToProps = (state) => ({
  user: state.user.data,
  languageChoice: state.languages.data || undefined,
});

const mapDispatchToProps = (dispatch) => ({
  fetchLanguages: () => dispatch(fetchLanguages()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileNurseEdit);
