import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import s from './ProfileEditResidentialForm.css';
import Container from '../../Container';
import Link from '../../Link';
import Header from '../../Header';
import history from '../../../core/history';
import util from '../../../core/util';
import { reduxForm } from 'redux-form';
import InlineForm from '../../MultiSelect';
// react-icons
import FaLock from 'react-icons/lib/fa/lock';


class ProfileEditResidentialForm extends Component {

  render() {
    const {
      fields: {
        userType,
        postal,
        unit,
        des,
        neighborhood,
        region,
      },
      neighborhoodChoice,
      regionChoice,
      invalid,
      handleSubmit,
      submitFailed,
      submitting,
    } = this.props;

    return (
      <div className={s.ProfileEditResidentialForm}>
        <form onSubmit={handleSubmit}>
          <div className={s.formSection}>
            <div className="TableRow">
              <div className="TableRowItem1">Postal Code</div>
              <div className="TableRowItem2">
                <input type="text" {...postal} />
                {postal.touched && postal.error && <div className={s.formError}>{postal.error}</div>}
              </div>
            </div>

            <div className="TableRow">
              <div className="TableRowItem1">Unit Number</div>
              <div className="TableRowItem2">
                <input type="text" {...unit} />
                {unit.touched && unit.error && <div className={s.formError}>{unit.error}</div>}
              </div>
            </div>

            <div className="TableRow">
              <div className="TableRowItem1">Address</div>
              <div className="TableRowItem2">
                <textarea className={s.addrInput} id="des" name="des" placeholder="Enter Address" {...des} />
                {des.touched && des.error && <div className={s.bookingLocationFormError}>{des.error}</div>}
              </div>
            </div>

            <div className="TableRow">
              <div className="TableRowItem1">Neighborhood</div>
              <div className="TableRowItem2">
                <div className={cx("select", s.selectInput)}>
                  <span></span>
                  <select id={neighborhood} name={neighborhood} {...neighborhood} value={neighborhood.value}>
                    <option value="">-- Select --</option>
                    {neighborhoodChoice && neighborhoodChoice.map(item => (
                      <option key={neighborhoodChoice.indexOf(item)} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
                {neighborhood.touched && neighborhood.error && <div className={s.formError}>{neighborhood.error}</div>}
              </div>
            </div>

            <div className="TableRow">
              <div className="TableRowItem1">Region</div>
              <div className="TableRowItem2">
                <input type="text" {...region} />
                {region.touched && region.error && <div className={s.formError}>{region.error}</div>}
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

ProfileEditResidentialForm.propTypes = {
  user: PropTypes.object,
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

const reduxFormConfig = {
  form: 'ProfileEditResidentialForm',
  fields: [
    'userType', // for form validate, not real field
    'postal',
    'unit',
    'des',
    'neighborhood',
    'region',
  ],
  validate,
}

const mapStateToProps = (state) => {
  const user = state.user.data;

  return {
    initialValues: {
      userType: user && user.role, // for form validate, not real field
      postal: user && user.address && user.address.postal,
      unit: user && user.address && user.address.unit,
      des: user && user.address && user.address.description,
      neighborhood: user && user.address && user.address.neighborhood,
      region: user && user.address && user.address.region,
    },
    neighborhoodChoice: state.config.neighborhoods,
    regionChoice: state.config.regions,
  }
};

export default reduxForm(reduxFormConfig, mapStateToProps)(ProfileEditResidentialForm);
