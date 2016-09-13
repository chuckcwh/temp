import React, { Component } from 'react';
import s from './PatientsForm.css';
import { PATIENT_CREATE_SUCCESS, PATIENT_EDIT_SUCCESS,
  createPatient, editPatient, fetchLanguages, fetchAddress, getPatients, showDayPickerPopup } from '../../actions';
import { connect } from 'react-redux';
import moment from 'moment';
import Link from '../Link';
import Container from '../Container';
import Header from '../Header';
import DashboardTableButton from '../DashboardTableButton';
import SideTabList from '../SideTabList';
import SideTab from '../SideTab';
import DayPickerPopup from '../DayPickerPopup';
import Loader from 'react-loader';
import FaUser from 'react-icons/lib/fa/user';
import FaHome from 'react-icons/lib/fa/home';
import FaComments from 'react-icons/lib/fa/comments';
import FaMedkit from 'react-icons/lib/fa/medkit';
import PatientsFormFirst from '../PatientsFormFirst';
import PatientsFormSecond from '../PatientsFormSecond';
import PatientsFormThird from '../PatientsFormThird';
import PatientsFormFourth from '../PatientsFormFourth';

class PatientsForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTabIndex: 0,
    };
  }

  handleTabSelect = (index) => {
    this.setState({ selectedTabIndex: index });
  };

  nextPage = () => {
    this.setState({ selectedTabIndex: this.state.selectedTabIndex + 1 });
  };

  previousPage = () => {
    this.setState({ selectedTabIndex: this.state.selectedTabIndex - 1 });
  };

  handleSave = (formIndex) => (values) => {
    return new Promise((resolve, reject) => {
      if (this.props.action === 'add') {
        const { postal, unit, description, lat, lng, region, neighborhood, ...rest } = values;
        this.props.createPatient({
          ...rest,
          address: {
            postal,
            unit,
            description,
            region,
          },
          userId: this.props.user._id,
        }).then(res => {
          if (res && res.type === PATIENT_CREATE_SUCCESS) {
            resolve();
          } else {
            reject();
          }
        });
      } else if (this.props.action === 'edit') {
        if (formIndex === 2) {
          this.props.editPatient({
            address: { ...values },
            userId: this.props.user._id,
            patientId: this.props.params.patientId,
          }).then(res => {
            if (res && res.type === PATIENT_EDIT_SUCCESS) {
              resolve();
            } else {
              reject();
            }
          });
        } else {
          this.props.editPatient({
            ...values,
            userId: this.props.user._id,
            patientId: this.props.params.patientId,
          }).then(res => {
            if (res && res.type === PATIENT_EDIT_SUCCESS) {
              resolve();
            } else {
              reject();
            }
          });
        }
      } else reject('Invalid form action');
    });
  };

  render() {
    const { params, action, patients, showDayPickerPopup, fetchAddress } = this.props;
    const { selectedTabIndex } = this.state;
    return (
      <div className={s.patientsForm}>
        <div className={s.patientsFormWrapper}>
          <div className={s.patientsFormTabs}>
            <SideTabList
              onSelect={this.handleTabSelect}
              selectedIndex={this.state.selectedTabIndex}
              selectable={action === 'edit' ? true : false}
            >
              <SideTab><FaUser /><span>Basic Details</span></SideTab>
              <SideTab><FaHome /><span>Residential Details</span></SideTab>
              <SideTab><FaComments /><span>Cultural Details</span></SideTab>
              <SideTab><FaMedkit /><span>Medical Details</span></SideTab>
            </SideTabList>
          </div>
          <div className={s.patientsFormPanel}>
            {action === 'add' && selectedTabIndex === 0 &&
              <PatientsFormFirst
                params={params}
                action={action}
                onSubmit={this.nextPage}
                showDayPickerPopup={showDayPickerPopup}
                form="patientsForm"
                destroyOnUnmount={false}
              />
            }
            {action === 'add' && selectedTabIndex === 1 &&
              <PatientsFormSecond
                params={params}
                action={action}
                previousPage={this.previousPage}
                onSubmit={this.nextPage}
                fetchAddress={fetchAddress}
                form="patientsForm"
                destroyOnUnmount={false}
              />
            }
            {action === 'add' && selectedTabIndex === 2 &&
              <PatientsFormThird
                params={params}
                action={action}
                previousPage={this.previousPage}
                onSubmit={this.nextPage}
                form="patientsForm"
                destroyOnUnmount={false}
              />
            }
            {action === 'add' && selectedTabIndex === 3 &&
              <PatientsFormFourth
                params={params}
                action={action}
                previousPage={this.previousPage}
                fields={
                  [
                    'name',
                    'gender',
                    'dob',
                    'idNum',
                    'idType',
                    'maritalStatus',
                    'relationship',
                    'sameAddress',
                    'postal',
                    'unit',
                    'description',
                    'region',
                    'race',
                    'religion',
                    'languages',
                    'mobility',
                    'diagnosis',
                    'specialNotes',
                  ]
                }
                onSubmit={this.handleSave(4)}
                form="patientsForm"
                destroyOnUnmount={false}
              />
            }
            {action === 'edit' && selectedTabIndex === 0 &&
              <PatientsFormFirst
                params={params}
                action={action}
                onSubmit={this.handleSave(1)}
                showDayPickerPopup={showDayPickerPopup}
                form="patientsFormFirst"
                destroyOnUnmount={true}
              />
            }
            {action === 'edit' && selectedTabIndex === 1 &&
              <PatientsFormSecond
                params={params}
                action={action}
                previousPage={this.previousPage}
                onSubmit={this.handleSave(2)}
                fetchAddress={fetchAddress}
                form="patientsFormSecond"
                destroyOnUnmount={true}
              />
            }
            {action === 'edit' && selectedTabIndex === 2 &&
              <PatientsFormThird
                params={params}
                action={action}
                previousPage={this.previousPage}
                onSubmit={this.handleSave(3)}
                form="patientsFormThird"
                destroyOnUnmount={true}
              />
            }
            {action === 'edit' && selectedTabIndex === 3 &&
              <PatientsFormFourth
                params={params}
                action={action}
                previousPage={this.previousPage}
                fields={
                  [
                    'mobility',
                    'diagnosis',
                    'specialNotes',
                  ]
                }
                onSubmit={this.handleSave(4)}
                form="patientsFormFourth"
                destroyOnUnmount={true}
              />
            }
          </div>
        </div>
        <DayPickerPopup title="Date of Birth" />
      </div>
    );
  }
}

PatientsForm.propTypes = {
  params: React.PropTypes.object,
  action: React.PropTypes.string.isRequired,

  user: React.PropTypes.object,
  patients: React.PropTypes.object,
  patientsFetching: React.PropTypes.bool,

  createPatient: React.PropTypes.func.isRequired,
  editPatient: React.PropTypes.func.isRequired,
  fetchAddress: React.PropTypes.func.isRequired,
  getPatients: React.PropTypes.func.isRequired,
  showDayPickerPopup: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user.data,
  patients: state.user.data && state.user.data._id
    && state.patientsByClient[state.user.data._id]
    && state.patientsByClient[state.user.data._id].data,
  patientsFetching: state.user.data && state.user.data._id
    && state.patientsByClient[state.user.data._id]
    && state.patientsByClient[state.user.data._id].isFetching,
});

const mapDispatchToProps = (dispatch) => ({
  createPatient: (params) => dispatch(createPatient(params)),
  editPatient: (params) => dispatch(editPatient(params)),
  fetchAddress: (postalCode) => dispatch(fetchAddress(postalCode)),
  getPatients: (params) => dispatch(getPatients(params)),
  showDayPickerPopup: (value, source) => dispatch(showDayPickerPopup(value, source)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PatientsForm);
