import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import s from './ProfileNurseEditBasicForm.css';
import Container from '../../Container';
import Link from '../../Link';
import Header from '../../Header';
import history from '../../../core/history';
import util from '../../../core/util';
import { reduxForm } from 'redux-form';
import InlineForm from '../../MultiSelect';
import { showDayPickerPopup } from '../../../actions';
import DayPickerPopup from '../../DayPickerPopup';
import MultiSelect from '../../MultiSelect';
// react-icons
import FaLock from 'react-icons/lib/fa/lock';


class ProfileNurseEditBasicForm extends Component {

  render() {
    const {
      fields: { fullName, gender, dob, idNumber, idType, nurseType, nurseSkills, email },
      invalid,
      handleSubmit,
      submitFailed,
      submitting,
      showDayPickerPopup,
    } = this.props;

    const idTypeChoice = ['Singaporean Pink IC', 'Singaporean Blue IC', 'Others'];
    const nurseTypeChoice = [""];
    const nurseSkillChoice = [{ label: 'Caregiver Training', value: 'Caregiver Training' }, { label: 'General Accompany', value: 'General Accompany' }];

    return (
      <div className={s.ProfileNurseEditBasicForm}>
        <DayPickerPopup title="Date of Birth" />

        <form onSubmit={handleSubmit}>
          <div className={s.formSection}>
            <div className="TableRow">
              <div className="TableRowItem1">Full Name (as per NRIC)</div>
              <div className="TableRowItem2">
                <input type="text" {...fullName} />
                {fullName.touched && fullName.error && <div className={s.formError}>{fullName.error}</div>}
              </div>
            </div>

            <div className="TableRow">
              <div className="TableRowItem1">Gender</div>

              <div className="TableRowItem2">
                <div className={cx("select", s.selectInput)}>
                  <span></span>
                  <select id={gender} name={gender} {...gender} value={gender.value || 'male'}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
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
                    <span onClick={() => this.props.showDayPickerPopup(dob.value, 'ProfileNurseEditBasicForm')}></span>
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
                    {idTypeChoice.map(item => (
                      <option value={item}>{item}</option>
                    ))}
                  </select>
                </div>
                {idType.touched && idType.error && <div className={s.formError}>{idType.error}</div>}
              </div>
            </div>

            <div className="TableRow">
              <div className="TableRowItem1">nurseType</div>
              <div className="TableRowItem2">
                <div className={cx("select", s.selectInput)}>
                  <span></span>
                  <select id={nurseType} name={nurseType} {...nurseType} value={nurseType.value || ''}>
                    <option value="">-- Select --</option>
                    {nurseTypeChoice.map(item => (
                      <option value={item}>{item}</option>
                    ))}
                  </select>
                </div>
                {nurseType.touched && nurseType.error && <div className={s.formError}>{nurseType.error}</div>}
              </div>
            </div>

            <div className="TableRow">
              <div className="TableRowItem1">Nursing Skills</div>
              <div className="TableRowItem2">
                <MultiSelect
                  options={nurseSkillChoice}
                  {...nurseSkills}
                />
              {nurseSkills.touched && nurseSkills.error && <div className={s.formError}>{nurseSkills.error}</div>}
              </div>
            </div>

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

ProfileNurseEditBasicForm.propTypes = {
  user: PropTypes.object,
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

const reduxFormConfig = {
  form: 'ProfileNurseEditBasicForm',
  fields: ['fullName', 'gender', 'dob', 'idNumber', 'idType', 'nurseType', 'nurseSkills', 'email'],
  validate,
}

const mapStateToProps = (state) => {
  const user = state.user.data;
  console.log('type', user.nurses[0].skills);
  return {
    initialValues: {
      fullName: user.nurses[0].fullName || undefined,
      gender: user.nurses[0].gender || undefined,
      dob: user.nurses[0].dob || undefined,
      idNumber: user.nurses[0].IDnum || undefined,
      idType: user.nurses[0].IDtype || undefined,
      nurseType: user.nurses[0].typeOfNurse || undefined,
      nurseSkills: user.nurses[0].skills.map(i => ({ label: i, value: i })) || undefined,
      email: user.email || undefined,
    }
  }
};

const mapDispatchToProps = (dispatch) => ({
  showDayPickerPopup: (value, source) => dispatch(showDayPickerPopup(value, source)),
})

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(ProfileNurseEditBasicForm);
