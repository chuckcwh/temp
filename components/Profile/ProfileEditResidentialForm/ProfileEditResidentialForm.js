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
import { fetchAddress, editUser } from '../../../actions';
// react-icons
import FaLock from 'react-icons/lib/fa/lock';


class ProfileEditResidentialForm extends Component {

  onSubmit = (values) => {
    return new Promise((resolve,reject) => {
      this.props.fetchAddress(values.postal).then((res) => {
        if (res.type === 'GEOCODE_SUCCESS') {
          return new Promise((resolve, reject) => {
            this.props.editUser({
              _id: values._id,
              address: {
                postal: values.postal,
                unit: values.unit,
                description: values.description,
                neighborhood: values.neighborhood,
                region: values.region,
                country: values.country,
                lat: res.lat,
                lng: res.lng,
              }
            }).then((res) => {
              console.log('response', res);
            })
          })
        }
      });
    });
  }

  render() {
    const {
      fields: {
        postal,
        unit,
        description,
        neighborhood,
        region,
        _id,
        country,
        lat,
        lng,
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
        <form onSubmit={handleSubmit} onSubmit={handleSubmit(this.onSubmit)}>
          <div className={s.formSection}>
            <div className="TableRow">
              <div className="TableRowItem1">Postal Code<sup>*</sup></div>
              <div className="TableRowItem2">
                <input type="text" {...postal} />
                {postal.touched && postal.error && <div className={s.formError}>{postal.error}</div>}
              </div>
            </div>

            <div className="TableRow">
              <div className="TableRowItem1">Unit Number<sup>*</sup></div>
              <div className="TableRowItem2">
                <input type="text" {...unit} />
                {unit.touched && unit.error && <div className={s.formError}>{unit.error}</div>}
              </div>
            </div>

            <div className="TableRow">
              <div className="TableRowItem1">Address<sup>*</sup></div>
              <div className="TableRowItem2">
                <textarea className={s.addrInput} id="description" name="description" placeholder="Enter Address" {...description} />
                {description.touched && description.error && <div className={s.formError}>{description.error}</div>}
              </div>
            </div>

            <div className="TableRow">
              <div className="TableRowItem1">Neighborhood</div>
              <div className="TableRowItem2">
                <input type="text" {...neighborhood} disabled/>
                {/*}
                <div className={cx("select", s.selectInput)}>
                  <span></span>
                  <select id={neighborhood} name={neighborhood} {...neighborhood} value={neighborhood.value} disabled >
                    <option value="">-- Select --</option>
                    {neighborhoodChoice && neighborhoodChoice.map(item => (
                      <option key={neighborhoodChoice.indexOf(item)} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
                {neighborhood.touched && neighborhood.error && <div className={s.formError}>{neighborhood.error}</div>}
                */}
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
  if (!values.postal) {
    errors.postal = 'Required';
  } else if (!/^[0-9]{6}$/i.test(values.postal)) {
    errors.postal = 'Invalid postal code (e.g. 123456)';
  }
  if (!values.unit) {
    errors.unit = 'Required';
  }
  if (!values.description) {
    errors.description = 'Required';
  }
  return errors;
}

ProfileEditResidentialForm.propTypes = {
  fetchAddress: PropTypes.func.isRequired,
  editUser: PropTypes.func.isRequired,
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
    'postal',
    'unit',
    'description',
    'neighborhood',
    'region',
    '_id',
    'country',
    'lat',
    'lng',
  ],
  validate,
}

const mapStateToProps = (state) => {
  const user = state.user.data;

  return {
    initialValues: {
      postal: user && user.address && user.address.postal,
      unit: user && user.address && user.address.unit,
      description: user && user.address && user.address.description,
      neighborhood: user && user.address && user.address.neighborhood,
      region: user && user.address && user.address.region,
      // Following fields are not used directly
      _id: user && user._id,
      country: user && user.address && user.address.country,
      lat: user && user.address && user.address.lat,
      lng: user && user.address && user.address.lng,
    },
    neighborhoodChoice: state.config.data && state.config.data.neighborhoods,
    regionChoice: state.config.data && state.config.data.regions,
  }
};

const mapDispatchToProps = (dispatch) => ({
  fetchAddress: (postal) => dispatch(fetchAddress(postal)),
  editUser: (params) => dispatch(editUser(params)),
})

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(ProfileEditResidentialForm);
