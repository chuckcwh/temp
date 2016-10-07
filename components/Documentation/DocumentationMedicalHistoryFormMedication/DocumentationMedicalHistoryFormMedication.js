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
    // const { route, medication, dose, doseUnit, cycle, duration, durationUnit, instruction } = this.props;
    const { medications } = this.props;
    const medicationChoice = {
      route: [{name: 'ORAL', value: 'ORAL'}, {name: '(IV) INTRAVENOUSLY', value: '(IV) INTRAVENOUSLY'}],
      doseUnit: [{name: 'EA', value: 'EA'}, {name: 'VIAL', value: 'VIAL'}],
      cycle: [{name: 'H, HOURLY', value: 'H, HOURLY'}, {name: '2H, 2 HOURLY', value: '2H, 2 HOURLY'}],
      durationUnit: [{name: 'DAY', value: 'DAY'}, {name: 'WEEK', value: 'WEEK'}, {name: 'MONTH', value: 'MONTH'}],
    }

    return (
      <div className={s.documentationMedicalHistoryFormMedication}>
        <h2>Medications</h2>

        <table >
          <thead className={s.headerRow}>
            <tr>
              <th></th>
              <th>Route</th>
              <th>Medication</th>
              <th>Dose</th>
              <th>Unit</th>
              <th>Cycle</th>
              <th>Duration</th>
              <th>Unit</th>
              <th>Instructions</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {medications.map((med, index) => (
              <tr key={index} className={s.bodyRow}>
                <td className={cx(s.indexColumn)}>
                  {`${index + 1}.`}
                </td>

                <td className={s.selectInputColumn}>
                  <div className={cx("select", s.selectInputField)}>
                    <span></span>
                    <select className={s.selectInput} id={med.route} name={med.route} {...med.route}>
                      {medicationChoice.route && medicationChoice.route.map((item, index) => (
                        <option key={index} value={item.value}>{item.name}</option>
                      ))}
                    </select>
                  </div>
                </td>

                <td className={cx(s.textInputColumn, s.medicationColumn)}>
                  <input className={s.textInput} type="text" {...med.medication} />
                </td>

                <td className={s.textInputColumn}>
                  <input className={s.textInput} type="text" {...med.dose}/>
                </td>

                <td className={s.selectInputColumn}>
                  <div className={cx("select", s.selectInputField)}>
                    <span></span>
                    <select className={s.selectInput}  id={"medicationDoseUnit"} name={"medicationDoseUnit"} {...med.doseUnit}>
                      {medicationChoice.doseUnit && medicationChoice.doseUnit.map((item, index) => (
                        <option key={index} value={item.value}>{item.name}</option>
                      ))}
                    </select>
                  </div>
                </td>

                <td className={s.selectInputColumn}>
                  <div className={cx("select", s.selectInputField)}>
                    <span></span>
                    <select className={s.selectInput} id={"medicationCycle"} name={"medicationCycle"} {...med.cycle}>
                      {medicationChoice.cycle && medicationChoice.cycle.map((item, index) => (
                        <option key={index} value={item.value}>{item.name}</option>
                      ))}
                    </select>
                  </div>
                </td>

                <td className={s.textInputColumn}>
                  <input className={s.textInput} type="text" {...med.duration} />
                </td>

                <td className={s.selectInputColumn}>
                  <div className={cx("select", s.selectInputField)}>
                    <span></span>
                    <select className={s.selectInput} id={med.durationUnit} name={med.durationUnit} {...med.durationUnit}>
                      {medicationChoice.durationUnit && medicationChoice.durationUnit.map((item, index) => (
                        <option key={index} value={item.value}>{item.name}</option>
                      ))}
                    </select>
                  </div>
                </td>

                <td className={s.textareaColumn}>
                  <textarea className={s.textareaInput} id="medicationInstruction" name="medicationInstruction" placeholder="(e.g. timing)" {...med.instruction}/>
                </td>

                <td className={s.minusBtnColumn}>
                  <button
                    className={cx('btn btn-primary', s.multiTextFieldBtn)}
                    onClick={e => {
                      e.preventDefault();
                      if (medications.length === 1) {
                        medications.addField();
                      }
                      medications.removeField(index);
                    }}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={s.addRow}>
          <button
            className={cx('btn btn-primary', s.multiTextFieldBtn)}
            onClick={e => {
              e.preventDefault();
              medications.addField();
            }}>
            <FaPlus /> Add Row
          </button>
        </div>

      </div>
    );
  }
}


DocumentationMedicalHistoryFormMedication.propTypes = {

};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
  // resetForm: () => dispatch(reset('documentationMedicalHistoryForm')),
  addValue: addArrayValue,
});

export default connect(mapStateToProps, mapDispatchToProps)(DocumentationMedicalHistoryFormMedication);
