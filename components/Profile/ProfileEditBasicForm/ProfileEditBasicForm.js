import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import s from './ProfileEditBasicForm.css';
import Container from '../../Container';
import Link from '../../Link';
import Header from '../../Header';
import history from '../../../core/history';
import { isAdmin, isClient, isProvider, getUserName } from '../../../core/util';
import { reduxForm } from 'redux-form';
import InlineForm from '../../MultiSelect';
import { showDayPickerPopup, editUser } from '../../../actions';
import DayPickerPopup from '../../DayPickerPopup';
import MultiSelect from '../../MultiSelect';
// react-icons
import FaLock from 'react-icons/lib/fa/lock';


class ProfileEditBasicForm extends Component {

  onSubmit = (values) => {
    return new Promise((resolve, reject) => {
      this.props.editUser({
        userId: values.userId,
        name: values.name,
        gender: values.gender,
        dob: moment(values.dob).format(),
        idNum: values.idNum,
        idType: values.idType,
        occupation: values.occupation,
        maritalStatus: values.maritalStatus,
        profession: values.profession,
        skills: typeof(values.skills) === 'string' ? (values.skills && values.skills.split(',')) : values.skills,
      }).then((res) => {
        console.log('response', res);
      })
    });
  }

  render() {
    const {
      fields: {
        userId,
        name,
        gender,
        dob,
        idNum,
        idType,
        occupation,
        maritalStatus,
        profession,
        skills,
        email
      },
      genderChoice,
      idTypeChoice,
      professionChoice,
      skillsChoice,
      showDayPickerPopup,
      user,

      invalid,
      handleSubmit,
      submitFailed,
      submitting,
    } = this.props;

    return (
      <div className={s.ProfileEditBasicForm}>
        <DayPickerPopup title="Date of Birth" />

        <form onSubmit={handleSubmit(this.onSubmit)}>
          <div className={s.formSection}>
            <div className="TableRow">
              <div className="TableRowItem1">Full Name (as per NRIC)<sup>*</sup></div>
              <div className="TableRowItem2">
                <input type="text" {...name} />
                {name.touched && name.error && <div className={s.formError}>{name.error}</div>}
              </div>
            </div>

            <div className="TableRow">
              <div className="TableRowItem1">Gender</div>

              <div className="TableRowItem2">
                <div className={cx("select", s.selectInput)}>
                  <span></span>
                  <select id={gender} name={gender} {...gender} value={gender.value}>
                    <option value="">-- Select --</option>
                    {genderChoice && genderChoice.map(item => (
                      <option key={genderChoice.indexOf(item)} value={item.value}>{item.name}</option>
                    ))}
                  </select>
                </div>
                {gender.touched && gender.error && <div className={s.formError}>{gender.error}</div>}
              </div>
            </div>

            <div className="TableRow">
                <div className="TableRowItem1">Date of Birth</div>
                <div className="TableRowItem2">
                  <div className="DateInput">
                    <input type="text" id="dob" name="dob" placeholder="YYYY-MM-DD" {...dob} />
                    <span onClick={() => this.props.showDayPickerPopup(dob.value, 'profileEditBasicForm')}></span>
                  </div>
                  {dob.touched && dob.error && <div className={s.formError}>{dob.error}</div>}
                </div>
            </div>

            <div className="TableRow">
              <div className="TableRowItem1">Identification Number</div>
              <div className="TableRowItem2">
                <input type="text" {...idNum} />
                {idNum.touched && idNum.error && <div className={s.formError}>{idNum.error}</div>}
              </div>
            </div>

            <div className="TableRow">
              <div className="TableRowItem1">Identification type</div>
              <div className="TableRowItem2">
                <div className={cx("select", s.selectInput)}>
                  <span></span>
                  <select id={idType} name={idType} {...idType} value={idType.value || ''}>
                    <option value="">-- Select --</option>
                    {idTypeChoice && idTypeChoice.map(item => (
                      <option key={idTypeChoice.indexOf(item)} value={item.value}>{item.name}</option>
                    ))}
                  </select>
                </div>
                {idType.touched && idType.error && <div className={s.formError}>{idType.error}</div>}
              </div>
            </div>

            <div className="TableRow">
              <div className="TableRowItem1">Occupation</div>
              <div className="TableRowItem2">
                <input type="text" {...occupation} />
                {occupation.touched && occupation.error && <div className={s.formError}>{occupation.error}</div>}
              </div>
            </div>

            <div className="TableRow">
              <div className="TableRowItem1">Marital Status</div>
              <div className="TableRowItem2">
                <div className={cx("select", s.selectInput)}>
                  <span></span>
                  <select id={maritalStatus} name={maritalStatus} {...maritalStatus} value={maritalStatus.value || ''}>
                    <option value="">-- Select --</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
                {maritalStatus.touched && maritalStatus.error && <div className={s.formError}>{maritalStatus.error}</div>}
              </div>
            </div>

            {isProvider(user) && (
              <div>
                <div className="TableRow">
                  <div className="TableRowItem1">Provider Type</div>
                  <div className="TableRowItem2">
                    <div className={cx("select", s.selectInput)}>
                      <span></span>
                      <select id={profession} name={profession} {...profession} value={profession.value || ''}>
                        <option value="">-- Select --</option>
                        {professionChoice && professionChoice.map(item => (
                          <option key={professionChoice.indexOf(item)} value={item.value}>{item.name}</option>
                        ))}
                      </select>
                    </div>
                    {profession.touched && profession.error && <div className={s.formError}>{profession.error}</div>}
                  </div>
                </div>

                <div className="TableRow">
                  <div className="TableRowItem1">Provider Skills</div>
                  <div className="TableRowItem2">
                    <MultiSelect
                      className={s.multiSelect}
                      options={skillsChoice}
                      {...skills}
                    />
                  {skills.touched && skills.error && <div className={s.formError}>{skills.error}</div>}
                  </div>
                </div>
              </div>
            )}

            <div className="TableRow">
              <div className="TableRowItem1">Email</div>
              <div className="TableRowItem2">
                <input type="text" {...email} disabled/>
              </div>
            </div>
          </div>

          <div className={s.formSectionSubmit}>
            {submitFailed && invalid && <div className={s.creditsWithdrawBankFormError}>You have one or more form field errors.</div>}
            <button className="btn btn-primary" type="submit" disabled={invalid || submitting}>Save Changes</button>
          </div>
        </form>
      </div>
    );
  }

}

const validate = values => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Required';
  } else if (values.name.length > 50) {
    errors.name = 'Cannot be more than 50 characters';
  }
  if (!/^\d{4}[-]\d{2}[-]\d{2}$/i.test(values.dob)) {
    errors.dob = 'Invalid date of birth (e.g. YYYY-MM-DD)';
  } else if (moment().isSameOrBefore(values.dob, 'day')) {
    errors.dob = 'Date must be earlier than today';
  }
  return errors
}

ProfileEditBasicForm.propTypes = {
  user: PropTypes.object,
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  showDayPickerPopup: PropTypes.func.isRequired,
};

const reduxFormConfig = {
  form: 'profileEditBasicForm',
  fields: [
    'userId', // for form validate, not real field
    'name',
    'gender',
    'dob',
    'idNum',
    'idType',
    'occupation',
    'maritalStatus',
    'profession',
    'skills',
    'email'
  ],
  validate,
}

const mapStateToProps = (state) => {
  const user = state.user.data;

  return {
    initialValues: {
      userId: user && user._id,
      name: user && user.name,
      gender: user && user.gender,
      dob: user && user.dob && moment(user.dob).format("YYYY-MM-DD"),
      idNum: user && user.idNum,
      idType: user && user.idType,
      occupation: user && user.occupation,
      maritalStatus: user && user.maritalStatus,
      profession: user && user.profession, // provider only
      skills: user && user.skills, // provider only
      email: user && user.email,
    },
    genderChoice: state.config.data && state.config.data.genders,
    idTypeChoice: state.config.data && state.config.data.residences,
    professionChoice: state.config.data && state.config.data.nurseProfessions,  // provider only
    skillsChoice: [{label: 'Caregiver Training', value: 'Caregiver Training'}, {label: 'General Accompany', value: 'General Accompany'}],
    user,
  }
};

const mapDispatchToProps = (dispatch) => ({
  showDayPickerPopup: (value, source) => dispatch(showDayPickerPopup(value, source)),
  editUser: (params) => dispatch(editUser(params)),
})

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(ProfileEditBasicForm);
