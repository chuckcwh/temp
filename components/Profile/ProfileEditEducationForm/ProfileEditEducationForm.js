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
// sub component
import ProfileEditEducationFormSub from '../ProfileEditEducationFormSub/ProfileEditEducationFormSub';
// react-icons
import FaLock from 'react-icons/lib/fa/lock';


class ProfileEditEducationForm extends Component {

  constructor(props) {
    super(props);

    this.state = {}
  }

  // componentWillMount() {
  //   this.updateNewForms(this.state.newFormsNum);
  // }
  //
  // updateNewForms() {
  //   const {}
  //   return
  // }
  onAddForm = () => {};


  // {educations && educations.map(item => {
  //   <ProfileEditEducationFormSub />
  // })}
  render() {
    const {
      educations
      // handleSubmit,
      // submitFailed,
      // submitting,
    } = this.props;

    return (
      <div className={s.ProfileEditEducationForm}>

        {educations && educations.map(item => (
          <ProfileEditEducationFormSub
            key={item._id}
            initialValues={{
              institute: item.institute,
              typeOfCert: item.typeOfCert,
              course: item.course,
              country: item.country,
              gradDate: moment(item.gradDate).format('MM/YYYY'),
            }}
          />
        ))}

        <ProfileEditEducationFormSub />

        <button className={cx("btn", "btn-primary", s.addForm)} onClick={this.onAddForm}>
          Add New Education Details
        </button>

      </div>
    );
  }

}


ProfileEditEducationForm.propTypes = {
  user: PropTypes.object,
  // handleSubmit: PropTypes.func.isRequired,
  // invalid: PropTypes.bool.isRequired,
  // submitFailed: PropTypes.bool.isRequired,
  // submitting: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const user = state.user.data;

  return {
    educations: user && user.educations,
  }
};

export default connect(mapStateToProps)(ProfileEditEducationForm);
