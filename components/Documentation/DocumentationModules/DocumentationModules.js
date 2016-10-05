import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import moment from 'moment';
import s from './DocumentationModules.css';
import Link from '../../Link';
import { getUserName, configToName } from '../../../core/util';


export class YesNoSwitch extends Component {

  constructor(props) {
    super(props);

    this.state = {
      select: this.props.fieldInitValue || false,
    }
  }

  render() {
    const { fieldName, field } = this.props;
    const { select } = this.state;

    return (
      <div className={s.yesNoContainer}>
        <button
          className={cx('btn', s.yesNoInput, s.yesChoice, !!field.value === true && s.yesCheck)}
          onClick={e => {
            e.preventDefault();

            this.props.changeFieldValue(fieldName, true);
          }}>
          Yes
        </button>
        <button
          className={cx('btn', s.yesNoInput, s.noChoice, !!field.value === false && s.noCheck)}
          onClick={e => {
            e.preventDefault();

            this.props.changeFieldValue(fieldName, false);
          }}>
          No
        </button>
      </div>
    );
  }
}

YesNoSwitch.propTypes = {
};


export class Selections extends Component {

  constructor(props) {
    super(props);

    this.state = {
    }
  }

  render() {
    const { fieldName, field, items } = this.props;

    return (
      <span>
        {items.map(item => (
          <div className={s.isActiveInput} key={items.indexOf(item)}>
            <input
              type="radio"
              name={`${fieldName}_${item.value}`}
              id={`${fieldName}_${item.value}`}
              {...field}
              value={item.value}
              checked={field.value === item.value}
            />
            <label htmlFor={`${fieldName}_${item.value}`}><span><span></span></span><span>{item.label}</span></label>
          </div>
        ))}
      </span>
    );
  }
}

Selections.propTypes = {
};
// const mapStateToProps = (state) => ({
//
// });
//
// const mapDispatchToProps = (dispatch) => ({
//   resetForm: () => dispatch(reset('DocumentationModules')),
//   changefieldName: (field, value) => dispatch(change('documentationNGTForm', field, value)),
// });
//
// export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(DocumentationModules);
