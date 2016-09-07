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
import { editUserAchievement, createUserAchievement, deleteUserAchievement } from '../../../actions';
// sub component
import ProfileEditAchievementFormSub from '../ProfileEditAchievementFormSub/ProfileEditAchievementFormSub';
// react-icons
import FaLock from 'react-icons/lib/fa/lock';


class ProfileEditAchievementForm extends Component {

  onChangeForm = (values) => {
    // console.log('change form', values);
    return new Promise((res, rej) => {
      this.props.editUserAchievement({
        userId: this.props.userId,
        achievementId: values.achievementId,
        title: values.title,
        organization: values.organization,
        dateObtained: moment(values.dateObtained, 'MM/YYYY').format(),
        description: values.description,
        isVerified: false,
      }).then((res) => {
        console.log('response', res);
      })
    })
  }

  onDelForm = (achievementId) => {
    // console.log('delete form', achievementId);
    return new Promise((resolve, reject) => {
      this.props.deleteUserAchievement({
        userId: this.props.userId,
        achievementId,
      }).then((res) => {
        console.log('response', res);
      })
    })
  };

  onAddForm = (values) => {
    // console.log('add form', values);
    return new Promise((res, rej) => {
      this.props.createUserAchievement({
        userId: this.props.userId,
        title: values.title,
        organization: values.organization,
        dateObtained: moment(values.dateObtained, 'MM/YYYY').format(),
        description: values.description,
        isVerified: false,
      }).then((res) => {
        console.log('response', res);
      })
    })
  };

  render() {
    const { achievements, userId } = this.props;

    return (
      <div className={s.profileEditAchievementForm}>

        {achievements && Object.values(achievements).map(item => (
          <ProfileEditAchievementFormSub
            key={item._id}
            formKey={item._id}
            initialValues={{
              achievementId: item._id,
              title: item.title,
              organization: item.organization,
              dateObtained: moment(item.dateObtained).format('MM/YYYY'),
              description: item.description,
            }}
            onNext={this.onChangeForm}
            onDelete={this.onDelForm}
          />
        ))}

        <ProfileEditAchievementFormSub
          formKey='new'
          onNext={this.onAddForm}
          initialValues={{
            achievementId: 'new',
          }}
          newForm
        />

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
    userId: user && user._id,
    achievements: user && user.achievements,
  }
};

const mapDispatchToProps = (dispatch) => ({
  createUserAchievement: (params) => dispatch(createUserAchievement(params)),
  editUserAchievement: (params) => dispatch(editUserAchievement(params)),
  deleteUserAchievement: (params) => dispatch(deleteUserAchievement(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEditAchievementForm);
