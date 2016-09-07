import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import s from './ProfileEditEducationForm.css';
import Container from '../../Container';
import Link from '../../Link';
import Header from '../../Header';
import history from '../../../core/history';
import util from '../../../core/util';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { editUserEducation, createUserEducation, deleteUserEducation } from '../../../actions';
// sub component
import ProfileEditEducationFormSub from '../ProfileEditEducationFormSub/ProfileEditEducationFormSub';
// react-icons
import FaLock from 'react-icons/lib/fa/lock';


class ProfileEditEducationForm extends Component {

  constructor(props) {
    super(props);

    this.state = {}
  }

  onChangeForm = (values) => {
    console.log('form values', values);
    return new Promise((resolve, reject) => {
      this.props.editUserEducation({
        userId: this.props.userId,
        educationId: values.educationId,
        country: values.country,
        course: values.course,
        gradDate: moment(values.gradDate, 'MM/YYYY').format(),
        institute: values.institute,
        isVerified: false,
        typeOfCert: values.typeOfCert,
      }).then((res) => {
        console.log('response', res);
      })
    })
  };

  onDelForm = (educationId) => {
    console.log('delete action', educationId);
    return new Promise((resolve, reject) => {
      this.props.deleteUserEducation({
        userId: this.props.userId,
        educationId,
      }).then((res) => {
        console.log('response', res);
      })
    })
  };

  onAddForm = (values) => {
    console.log('new form', values);
    return new Promise((resolve, reject) => {
      this.props.createUserEducation({
        userId: this.props.userId,
        country: values.country,
        course: values.course,
        gradDate: moment(values.gradDate, 'MM/YYYY').format(),
        institute: values.institute,
        isVerified: false,
        typeOfCert: values.typeOfCert,
      }).then((res) => {
        console.log('response', res);
      })
    })
  };

  render() {
    const { educations, userId } = this.props;

    return (
      <div className={s.ProfileEditEducationForm}>

        {educations && Object.values(educations).map(item => (
          <ProfileEditEducationFormSub
            key={item._id}
            formKey={item._id}
            initialValues={{
              educationId: item._id,
              institute: item.institute,
              typeOfCert: item.typeOfCert,
              course: item.course,
              country: item.country,
              gradDate: moment(item.gradDate).format('MM/YYYY'),
            }}
            onNext={this.onChangeForm}
            onDelete={this.onDelForm}
          />
        ))}

        <ProfileEditEducationFormSub
          formKey='new'
          onNext={this.onAddForm}
          newForm
        />

      </div>
    );
  }

}


ProfileEditEducationForm.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = (state) => {
  const user = state.user.data;

  return {
    userId: user && user._id,
    educations: user && user.educations,
  }
};

const mapDispatchToProps = (dispatch) => ({
  createUserEducation: (params) => dispatch(createUserEducation(params)),
  editUserEducation: (params) => dispatch(editUserEducation(params)),
  deleteUserEducation: (params) => dispatch(deleteUserEducation(params)),

});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEditEducationForm);
