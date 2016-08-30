import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import s from './ProfileEditCulturalForm.css';
import Container from '../../Container';
import Link from '../../Link';
import Header from '../../Header';
import history from '../../../core/history';
import util from '../../../core/util';
import { reduxForm } from 'redux-form';
import InlineForm from '../../MultiSelect';
import MultiSelect from '../../MultiSelect';
// react-icons
import FaLock from 'react-icons/lib/fa/lock';


class ProfileEditCulturalForm extends Component {

  render() {
    const {
      fields: {
        userType,
        race,
        religion,
        languages,
        nationality
      },
      invalid,
      handleSubmit,
      submitFailed,
      submitting,
      languageChoice,
    } = this.props;

    console.log('languageChoice', languageChoice);

    const raceChoice = ['Chinese', 'Malay', 'Indian', 'Eurasian', 'Others'];
    const religionChoice = ['Buddhist', 'Christian', 'Free Thinker',
      'Hinduism', 'Islam', 'Taoist', 'Catholic', 'Others', 'non-religion'];
    const nationalityChoice = ['Singaporean', 'Australian', 'Bangladeshis',
      'Cambodian', 'Chinese', 'Indian', 'Indonesian', 'Japanese', 'Korean',
      'Malaysian', 'Sri Lankan', 'Thais', 'Vietnamese', 'Others'];
    return (
      <div className={s.ProfileEditCulturalForm}>

        <form onSubmit={handleSubmit}>
          <div className={s.formSection}>
            <div className="TableRow">
              <div className="TableRowItem1">Race</div>
              <div className="TableRowItem2">
                <div className={cx("select", s.selectInput)}>
                  <span></span>
                  <select id={race} name={race} {...race} value={race.value || ''}>
                    <option value="">-- Select --</option>
                    {raceChoice.map(item => (
                      <option value={item}>{item}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="TableRow">
              <div className="TableRowItem1">Religion</div>
              <div className="TableRowItem2">
                <div className={cx("select", s.selectInput)}>
                  <span></span>
                  <select id={religion} name={religion} {...religion} value={religion.value || ''}>
                    <option value="">-- Select --</option>
                    {religionChoice.map(item => (
                      <option value={item}>{item}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="TableRow">
              <div className="TableRowItem1">Languages</div>
              <div className="TableRowItem2">
                <MultiSelect
                  options={Object.values(languageChoice).map(i => ({ label: i.name, value: i.value }))}
                  {...languages}
                />
              </div>
            </div>

            <div className="TableRow">
              <div className="TableRowItem1">Nationality</div>
              <div className="TableRowItem2">
                <div className={cx("select", s.selectInput)}>
                  <span></span>
                  <select id={nationality} name={nationality} {...nationality} value={nationality.value || ''}>
                    <option value="">-- Select --</option>
                    {nationalityChoice.map(item => (
                      <option value={item}>{item}</option>
                    ))}
                  </select>
                </div>
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

ProfileEditCulturalForm.propTypes = {
  user: PropTypes.object,
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

const reduxFormConfig = {
  form: 'ProfileEditCulturalForm',
  fields: [
    'userType',
    'race',
    'religion',
    'languages',
    'nationality'
  ],
  validate,
}

const mapStateToProps = (state) => {
  const user = state.user && state.user.data;

  return {
    initialValues: {
      race: user && user.race,
      religion: user && user.religion,
      languages: user && Object.values(user.languages).map(i => ({ label: i.name, value: i.id })),
      nationality: user && user.nationality,
    },
    languageChoice: state.config.data && state.config.data.languages,
  }
};

export default reduxForm(reduxFormConfig, mapStateToProps)(ProfileEditCulturalForm);
