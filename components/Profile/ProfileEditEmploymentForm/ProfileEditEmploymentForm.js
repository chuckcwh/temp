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
// sub component
import ProfileEditEmploymentFormSub from '../ProfileEditEmploymentFormSub/ProfileEditEmploymentFormSub';
// react-icons
import FaLock from 'react-icons/lib/fa/lock';


class ProfileEditEmploymentForm extends Component {

  constructor(props) {
    super(props);

    this.state = {}
  }

  onAddForm = () => {};

  render() {
    const { experiences } = this.props;
    console.log('experiences',experiences);

    return (
      <div className={s.profileEditEmploymentForm}>

        {experiences && experiences.map(item => (
          <ProfileEditEmploymentFormSub
            key={item._id}
            initialValues={{
              country: item.country,
              description: item.description,
              employer: item.employer,
              endDate: moment(item.endDate).format('MM/YYYY'),
              position: item.position,
              startDate: moment(item.startDate).format('MM/YYYY'),
            }}
          />
        ))}

        <ProfileEditEmploymentFormSub />

        <button className={cx("btn", "btn-primary", s.addForm)} onClick={this.onAddForm}>
          Add New Education Details
        </button>

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
    experiences: user && user.experiences,
  }
};

export default connect(mapStateToProps)(ProfileEditEmploymentForm);
