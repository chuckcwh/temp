import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import s from './DocumentationMedicalHistoryFormMedication.css';
import Link from '../../Link';
import { getUserName, configToName } from '../../../core/util';
import { getSession, showConfirmPopup, fetchServices } from '../../../actions';
import { reduxForm, addArrayValue, reset } from 'redux-form';
import { InfiniteLoader, AutoSizer, Table, Column } from 'react-virtualized';
// react-icons
import FaPlus from 'react-icons/lib/fa/plus';
import FaTrash from 'react-icons/lib/fa/trash';


class DocumentationMedicalHistoryFormMedication extends Component {

  render() {
    const {
      // fields
      route,
      medication,
      dose,
      doseUnit,
      cycle,
      duration,
      durationUnit,
      instructions,
      // form vars
      medIndex,
      medLength,
      addField,
      removeField,
      // selection choices
      medicationChoice,
    } = this.props;

    // const medicationChoice = {
    //   route: [{name: 'ORAL', value: 'ORAL'}, {name: '(IV) INTRAVENOUSLY', value: '(IV) INTRAVENOUSLY'}],
    //   doseUnit: [{name: 'EA', value: 'EA'}, {name: 'VIAL', value: 'VIAL'}],
    //   cycle: [{name: 'H, HOURLY', value: 'H, HOURLY'}, {name: '2H, 2 HOURLY', value: '2H, 2 HOURLY'}],
    //   durationUnit: [{name: 'DAY', value: 'DAY'}, {name: 'WEEK', value: 'WEEK'}, {name: 'MONTH', value: 'MONTH'}],
    // }

    return (
      <tr className={s.documentationMedicalHistoryFormMedication}>
        <td className={cx(s.indexColumn)}>
          {`${medIndex + 1}.`}
        </td>

        <td className={s.selectInputColumn}>
          <div className={cx("select", s.selectInputField)}>
            <span></span>
            <select className={s.selectInput} id="route" name="route" {...route}>
              <option value="">---</option>
              {medicationChoice.route && medicationChoice.route.map((item, index) => (
                <option key={index} value={item.value}>{item.name}</option>
              ))}
            </select>
          </div>
        </td>

        <td className={cx(s.textInputColumn, s.medicationColumn)}>
          <input className={s.textInput} type="text" {...medication} />
        </td>

        <td className={s.textInputColumn}>
          <input className={s.textInput} type="text" {...dose}/>
        </td>

        <td className={s.selectInputColumn}>
          <div className={cx("select", s.selectInputField)}>
            <span></span>
            <select className={s.selectInput}  id="medicationDoseUnit" name="medicationDoseUnit" {...doseUnit}>
              <option value="">---</option>
              {medicationChoice.doseUnit && medicationChoice.doseUnit.map((item, index) => (
                <option key={index} value={item.value}>{item.name}</option>
              ))}
            </select>
          </div>
        </td>

        <td className={s.selectInputColumn}>
          <div className={cx("select", s.selectInputField)}>
            <span></span>
            <select className={s.selectInput} id="medicationCycle" name="medicationCycle" {...cycle}>
              <option value="">---</option>
              {medicationChoice.cycle && medicationChoice.cycle.map((item, index) => (
                <option key={index} value={item.value}>{item.name}</option>
              ))}
            </select>
          </div>
        </td>

        <td className={s.textInputColumn}>
          <input className={s.textInput} type="text" {...duration} />
        </td>

        <td className={s.selectInputColumn}>
          <div className={cx("select", s.selectInputField)}>
            <span></span>
            <select className={s.selectInput} id="durationUnit" name="durationUnit" {...durationUnit}>
              <option value="">---</option>
              {medicationChoice.durationUnit && medicationChoice.durationUnit.map((item, index) => (
                <option key={index} value={item.value}>{item.name}</option>
              ))}
            </select>
          </div>
        </td>

        <td className={s.textareaColumn}>
          <textarea className={s.textareaInput} id="medicationInstructions" name="medicationInstructions" placeholder="(e.g. timing)" {...instructions}/>
        </td>

        <td className={s.minusBtnColumn}>
          <button
            className={cx('btn btn-primary', s.multiTextFieldBtn)}
            onClick={this.props.removeField}>
            <FaTrash />
          </button>
        </td>
      </tr>
    );
  }
}

DocumentationMedicalHistoryFormMedication.propTypes = {
};

const mapStateToProps = (state) => ({
  medicationChoice: {
    route: state.config.data && state.config.data.medHistMedicationsRoutes,
    doseUnit: state.config.data && state.config.data.medHistMedicationsUnits,
    cycle: state.config.data && state.config.data.medHistMedicationsCycles,
    durationUnit: state.config.data && state.config.data.medHistMedicationsDurationUnits,
  }
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(DocumentationMedicalHistoryFormMedication);
