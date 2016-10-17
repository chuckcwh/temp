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
import { editUser } from '../../../actions';
// react-icons
import FaLock from 'react-icons/lib/fa/lock';


class ProfileEditCulturalForm extends Component {

  onSubmit = (values) => {
    return new Promise((resolve, reject) => {
      this.props.editUser({
        _id: values._id,
        race: values.race,
        religion: values.religion,
        languages: typeof(values.languages) === 'string' ? (values.languages && values.languages.split(',')) : values.languages,
        nationality: values.nationality,
      }).then((res) => {
        // console.log('response', res);
      })
    })
  };

  render() {
    const {
      fields: {
        race,
        religion,
        languages,
        nationality,
      },
      languageChoice,
      raceChoice,
      religionChoice,
      nationalityChoice,

      invalid,
      handleSubmit,
      submitFailed,
      submitting,
    } = this.props;

    return (
      <div className={s.ProfileEditCulturalForm}>

        <form onSubmit={handleSubmit(this.onSubmit)}>
          <div className={s.formSection}>
            <div className="TableRow">
              <div className="TableRowItem1">Race</div>
              <div className="TableRowItem2">
                <div className={cx("select", s.selectInput)}>
                  <span></span>
                  <select id={race} name={race} {...race} value={race.value || ''}>
                    <option value="">-- Select --</option>
                    {raceChoice && raceChoice.map((item, index) => (
                      <option key={index} value={item.value}>{item.name}</option>
                    ))}
                  </select>
                </div>
                {race.touched && race.error && <div className={s.formError}>{race.error}</div>}
              </div>
            </div>

            <div className="TableRow">
              <div className="TableRowItem1">Religion</div>
              <div className="TableRowItem2">
                <div className={cx("select", s.selectInput)}>
                  <span></span>
                  <select id={religion} name={religion} {...religion} value={religion.value || ''}>
                    <option value="">-- Select --</option>
                    {religionChoice && religionChoice.map((item, index) => (
                      <option key={index} value={item.value}>{item.name}</option>
                    ))}
                  </select>
                </div>
                {religion.touched && religion.error && <div className={s.formError}>{religion.error}</div>}
              </div>
            </div>

            <div className="TableRow">
              <div className="TableRowItem1">Languages</div>
              <div className="TableRowItem2">
                <MultiSelect
                  options={languageChoice && Object.values(languageChoice).map(i => ({ label: i.name, value: i.value }))}
                  {...languages}
                />
              {languages.touched && languages.error && <div className={s.formError}>{languages.error}</div>}
              </div>
            </div>

            <div className="TableRow">
              <div className="TableRowItem1">Nationality</div>
              <div className="TableRowItem2">
                <div className={cx("select", s.selectInput)}>
                  <span></span>
                  <select id={nationality} name={nationality} {...nationality} value={nationality.value || ''}>
                    <option value="">-- Select --</option>
                    {nationalityChoice && nationalityChoice.map((item, index) => (
                      <option key={index} value={item.value}>{item.name}</option>
                    ))}
                  </select>
                </div>
                {nationality.touched && nationality.error && <div className={s.formError}>{nationality.error}</div>}
              </div>
            </div>

          </div>

          <div className={s.formSectionSubmit}>
            {submitFailed && invalid && <div className={s.formError}>You have one or more form field errors.</div>}
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
  return errors
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
    'race',
    'religion',
    'languages',
    'nationality',
    '_id',
  ],
  validate,
}

const mapStateToProps = (state) => {
  const user = state.user && state.user.data;

  return {
    initialValues: {
      race: user && user.race,
      religion: user && user.religion,
      languages: user && user.languages,
      nationality: user && user.nationality,
      _id: user && user._id,
    },
    languageChoice: state.config.data && state.config.data.languages,
    raceChoice: state.config.data && state.config.data.races,
    religionChoice: state.config.data && state.config.data.religions,
    nationalityChoice: state.config.data && state.config.data.countries,
  }
};

const mapDispatchToProps = (dispatch) => ({
  editUser: (params) => dispatch(editUser(params)),
})

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(ProfileEditCulturalForm);
