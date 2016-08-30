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
import { showDayPickerPopup } from '../../../actions';
import DayPickerPopup from '../../DayPickerPopup';
import MultiSelect from '../../MultiSelect';
// react-icons
import FaLock from 'react-icons/lib/fa/lock';


class ProfileEditBasicForm extends Component {

  render() {
    const {
      fields: {
        name,
        gender,
        dob,
        idNumber,
        idType,
        occupation,
        maritalStatus,
        providerType,
        providerSkills,
        email
      },
      genderChoice,
      user,
      invalid,
      handleSubmit,
      submitFailed,
      submitting,
      showDayPickerPopup,
    } = this.props;

    const idTypeChoice = ['Singaporean Pink IC', 'Singaporean Blue IC', 'Others'];
    const providerTypeChoice = ['N/A'];
    const providerSkillsChoice = [{label: 'Caregiver Training', value: 'Caregiver Training'}, {label: 'General Accompany', value: 'General Accompany'}];
    // const

    return (
      <div className={s.ProfileEditBasicForm}>
        <DayPickerPopup title="Date of Birth" />

        <form onSubmit={handleSubmit}>
          <div className={s.formSection}>
            <div className="TableRow">
              <div className="TableRowItem1">Full Name (as per NRIC)</div>
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
                    <input type="text" id="dob" name="dob" placeholder="Birth Date* (YYYY-MM-DD)" {...dob} />
                    <span onClick={() => this.props.showDayPickerPopup(dob.value, 'ProfileEditBasicForm')}></span>
                  </div>
                </div>
            </div>

            <div className="TableRow">
              <div className="TableRowItem1">Identification Number</div>
              <div className="TableRowItem2">
                <input type="text" {...idNumber} />
                {idNumber.touched && idNumber.error && <div className={s.formError}>{idNumber.error}</div>}
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
                      <option key={idTypeChoice.indexOf(item)} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
                {idType.touched && idType.error && <div className={s.formError}>{idType.error}</div>}
              </div>
            </div>

            {isClient(user) && (
              <div>
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
              </div>
            )}

            {isProvider(user) && (
              <div>
                <div className="TableRow">
                  <div className="TableRowItem1">Provider Type</div>
                  <div className="TableRowItem2">
                    <div className={cx("select", s.selectInput)}>
                      <span></span>
                      <select id={providerType} name={providerType} {...providerType} value={providerType.value || ''}>
                        <option value="">-- Select --</option>
                        {providerTypeChoice && providerTypeChoice.map(item => (
                          <option key={providerTypeChoice.indexOf(item)} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>
                    {providerType.touched && providerType.error && <div className={s.formError}>{providerType.error}</div>}
                  </div>
                </div>

                <div className="TableRow">
                  <div className="TableRowItem1">Provider Skills</div>
                  <div className="TableRowItem2">
                    <MultiSelect
                      options={providerSkillsChoice}
                      {...providerSkills}
                    />
                    {maritalStatus.touched && maritalStatus.error && <div className={s.formError}>{maritalStatus.error}</div>}
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
  // if (!values.withdrawAmt) {
  //   errors.withdrawAmt = 'Required';
  // } else if (!/\d+/i.test(values.withdrawAmt)) {
  //   errors.withdrawAmt = 'Invalid withdraw amount';
  // }
}

ProfileEditBasicForm.propTypes = {
  user: PropTypes.object,
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

const reduxFormConfig = {
  form: 'ProfileEditBasicForm',
  fields: [
    'userType', // for form validate, not real field
    'name',
    'gender',
    'dob',
    'idNumber',
    'idType',
    'occupation',
    'maritalStatus',
    'providerType',
    'providerSkills',
    'email'
  ],
  validate,
}

const mapStateToProps = (state) => {
  const user = state.user.data;

  return {
    initialValues: {
      userType: user && user.role, // for form validate, not real field
      name: user && user.name,
      gender: user && user.gender,
      dob: user && user.dob && moment(user.dob).format("YYYY-MM-DD"),
      idNumber: user && user.client && user.client.nric || user && user.provider && user.provider.nric,
      // idType: client && client.IDtype || provider && provider.IDtype,
      // occupation: client && client.occupation, // client only
      // maritalStatus: client && client.maritalStatus, // client only
      // providerType: user && user.typeOfprovider, // provider only
      // providerSkills: user && user.provider && user.provider.skills, // provider only
      email: user && user.email,
    },
    genderChoice: state.config.data && state.config.data.genders,
    user,
  }
};

const mapDispatchToProps = (dispatch) => ({
  showDayPickerPopup: (value, source) => dispatch(showDayPickerPopup(value, source)),
})

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(ProfileEditBasicForm);
