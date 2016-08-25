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
import util from '../../../core/util';
import SideTabList from '../../SideTabList';
import SideTab from '../../SideTab';
import { fetchLanguages } from '../../../actions';
// Sub Components
import ProfileEditBasicForm from '../ProfileEditBasicForm/ProfileEditBasicForm';
import ProfileEditResidentialForm from '../ProfileEditResidentialForm/ProfileEditResidentialForm';
import ProfileEditCulturalForm from '../ProfileEditCulturalForm/ProfileEditCulturalForm';
import ProfileEditProfileForm from '../ProfileEditProfileForm/ProfileEditProfileForm';
import ProfileEditPasswordForm from '../ProfileEditPasswordForm/ProfileEditPasswordForm';
// React-icons
import MdPerson from 'react-icons/lib/md/person';
import MdHome from 'react-icons/lib/md/home';
import FaComments from 'react-icons/lib/fa/comments';
import FaImage from 'react-icons/lib/fa/image';
import FaLock from 'react-icons/lib/fa/lock';


const dataUrl = 'https://ebeecare-dev.s3.amazonaws.com/';

class ProfileEdit extends Component {

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
    let tabs;
    let content;

    if (user && user.clients) {
      tabs = (
        <SideTabList
          onSelect={this.handleTabSelect.bind(this)}
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
          {selectedTabIndex === 2 && (<ProfileEditCulturalForm languageChoice={languageChoice} />)}
          {selectedTabIndex === 3 && (<ProfileEditProfileForm />)}
          {selectedTabIndex === 4 && (<ProfileEditPasswordForm />)}
        </div>
      )
    }

    return (
      <div className={s.profileEdit}>
        <Container>
          <div className={s.editWrapper}>
            <div className={s.sideBar}>
              <div className={s.userImage}>
                <img src={user.picture ? `${dataUrl}${user.picture}` : require('../../../assets/images/noimage.gif')} />
              </div>
              {tabs}
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
  languageChoice: state.languages.data || undefined,
});

const mapDispatchToProps = (dispatch) => ({
  fetchLanguages: () => dispatch(fetchLanguages()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEdit);
