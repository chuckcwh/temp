import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import s from './ProfileEditAchievementForm.css';
import Container from '../../Container';
import Link from '../../Link';
import Header from '../../Header';
import history from '../../../core/history';
import util from '../../../core/util';
import { Grid, Row, Col } from 'react-flexbox-grid';
// sub component
import ProfileEditAchievementFormSub from '../ProfileEditAchievementFormSub/ProfileEditAchievementFormSub';
// react-icons
import FaLock from 'react-icons/lib/fa/lock';


class ProfileEditAchievementForm extends Component {

  constructor(props) {
    super(props);

    this.state = {}
  }

  onAddForm = () => {};

  render() {
    const { achievements } = this.props;
    console.log('achievements', achievements);
    return (
      <div className={s.profileEditAchievementForm}>

        {achievements && achievements.map(item => (
          <ProfileEditAchievementFormSub
            key={item._id}
            initialValues={{
              title: item.title,
              organization: item.organization,
              dateObtained: moment(item.dateObtained).format('MM/YYYY'),
              description: item.description,
            }}
          />
        ))}

        <ProfileEditAchievementFormSub />

        <button className={cx("btn", "btn-primary", s.addForm)} onClick={this.onAddForm}>
          Add New Education Details
        </button>

      </div>
    );
  }

}


ProfileEditAchievementForm.propTypes = {
  user: PropTypes.object,
  // handleSubmit: PropTypes.func.isRequired,
  // invalid: PropTypes.bool.isRequired,
  // submitFailed: PropTypes.bool.isRequired,
  // submitting: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const user = state.user.data;

  return {
    achievements: user && user.achievements,
  }
};

export default connect(mapStateToProps)(ProfileEditAchievementForm);
