import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import s from './ProfileEditEmploymentForm.css';
import Container from '../../Container';
import Link from '../../Link';
import Header from '../../Header';
import history from '../../../core/history';
import util from '../../../core/util';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { editUserExperience, createUserExperience, deleteUserExperience } from '../../../actions';
// sub component
import ProfileEditEmploymentFormSub from '../ProfileEditEmploymentFormSub/ProfileEditEmploymentFormSub';
// react-icons
import FaLock from 'react-icons/lib/fa/lock';


class ProfileEditEmploymentForm extends Component {

  onChangeForm = (values) => {
    // console.log('change form', values);
    return new Promise((res, rej) => {
      this.props.editUserExperience({
        userId: this.props.userId,
        experienceId: values.experienceId,
        country: values.country,
        description: values.description,
        employer: values.employer,
        startDate: moment(values.startDate, 'MM/YYYY').format(),
        endDate: moment(values.endDate, 'MM/YYYY').format(),
        position: values.position,
        isVerified: false,
      }).then((res) => {
        console.log('response', res);
      })
    })
  }

  onDelForm = (experienceId) => {
    // console.log('delete form', experienceId);
    return new Promise((resolve, reject) => {
      this.props.deleteUserExperience({
        userId: this.props.userId,
        experienceId,
      }).then((res) => {
        console.log('response', res);
      })
    })
  };

  onAddForm = (values) => {
    // console.log('add form', values);
    return new Promise((res, rej) => {
      this.props.createUserExperience({
        userId: this.props.userId,
        country: values.country,
        description: values.description,
        employer: values.employer,
        startDate: moment(values.startDate, 'MM/YYYY').format(),
        endDate: moment(values.endDate, 'MM/YYYY').format(),
        position: values.position,
        isVerified: false,
      }).then((res) => {
        console.log('response', res);
      })
    })
  };

  render() {
    const { experiences, userId } = this.props;

    return (
      <div className={s.profileEditEmploymentForm}>

        {experiences && Object.values(experiences).map(item => (
          <ProfileEditEmploymentFormSub
            key={item._id}
            formKey={item._id}
            initialValues={{
              experienceId: item._id,
              country: item.country,
              description: item.description,
              employer: item.employer,
              endDate: moment(item.endDate).format('MM/YYYY'),
              position: item.position,
              startDate: moment(item.startDate).format('MM/YYYY'),
            }}
            onNext={this.onChangeForm}
            onDelete={this.onDelForm}
          />
        ))}

        <ProfileEditEmploymentFormSub
          formKey='new'
          onNext={this.onAddForm}
          initialValues={{
            experienceId: 'new',
          }}
          newForm
        />

      </div>
    );
  }

}


ProfileEditEmploymentForm.propTypes = {
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
    experiences: user && user.experiences,
  }
};

const mapDispatchToProps = (dispatch) => ({
  createUserExperience: (params) => dispatch(createUserExperience(params)),
  editUserExperience: (params) => dispatch(editUserExperience(params)),
  deleteUserExperience: (params) => dispatch(deleteUserExperience(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEditEmploymentForm);
