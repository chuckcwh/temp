import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import moment from 'moment';
import s from './DocumentationModules.css';
import Link from '../../Link';
import { getUserName, configToName } from '../../../core/util';


export class YesNoSwitch extends Component {
  render() {
    const { fieldName, field } = this.props;

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
  render() {
    const { fieldName, field, items } = this.props;

    return (
      <span className={s.selectionContainer}>
        {items.map((item, index) => (
          <div className={s.isActiveInput} key={index}>
            <input
              type="radio"
              name={`${fieldName}_${item.value}`}
              id={`${fieldName}_${item.value}`}
              {...field}
              value={item.value}
              checked={field.value === item.value}
            />
            <label className={s.selectionLabel} htmlFor={`${fieldName}_${item.value}`}><span className={s.labelIcon}><span></span></span><span className={s.labelBody}>{item.label}</span></label>
          </div>
        ))}
      </span>
    );
  }
}

Selections.propTypes = {
};
