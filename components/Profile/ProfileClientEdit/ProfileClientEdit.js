import React, { Component, PropTypes } from 'react';
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
// Sub Components
import ProfileClientEditBasic from '../ProfileClientEditBasic/ProfileClientEditBasic';
// React-icons
import MdPerson from 'react-icons/lib/md/person';
import MdHome from 'react-icons/lib/md/home';
import FaComments from 'react-icons/lib/fa/comments';
import FaImage from 'react-icons/lib/fa/image';
import FaLock from 'react-icons/lib/fa/lock';


const dataUrl = 'https://ebeecare-dev.s3.amazonaws.com/';

class ProfileClientEdit extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedTabIndex: 0
    }
  }

  handleTabSelect(index) {
    this.setState({ selectedTabIndex: index })
  }

  render() {
    const { user } = this.props;
    const { fullName, gender, dob, addresses, race, religion, languages, nationality } = user.clients[0];
    const { selectedTabIndex } = this.state;

    return (
      <div className={s.profileClientEdit}>
        <Container>
          <div className={s.editWrapper}>
            <div className={s.sideBar}>
              <div className={s.userImage}>
                <img src={`${dataUrl}${user.picture}`} />
              </div>
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
            </div>
            <div className={s.editPanel}>
              <div>
                {selectedTabIndex === 0 && (<ProfileClientEditBasic />)}
                {selectedTabIndex === 1 && (<p>Residential Details</p>)}
                {selectedTabIndex === 2 && (<p>Cultural Details</p>)}
                {selectedTabIndex === 3 && (<p>Profile Picture</p>)}
                {selectedTabIndex === 4 && (<p>Password</p>)}
              </div>
            </div>
          </div>
        </Container>
      </div>

    );
  }

}

ProfileClientEdit.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = (state) => ({
  user: state.user.data,
});

export default connect(mapStateToProps)(ProfileClientEdit);
