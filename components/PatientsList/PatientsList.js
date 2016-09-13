import React, { Component } from 'react';
import s from './PatientsList.css';
import { connect } from 'react-redux';
import moment from 'moment';
import Link from '../Link';
import Container from '../Container';
import Header from '../Header';
import ConfirmPopup from '../ConfirmPopup';
import DashboardTableButton from '../DashboardTableButton';
import Loader from 'react-loader';
import FaUser from 'react-icons/lib/fa/user';
import FaMedkit from 'react-icons/lib/fa/medkit';
import FaSitemap from 'react-icons/lib/fa/sitemap';
import FaArrowCircleRight from 'react-icons/lib/fa/arrow-circle-right';
import { PATIENT_DELETE_SUCCESS, getPatients, deletePatient, showConfirmPopup } from '../../actions';
import { configToName } from '../../core/util';

class PatientsList extends Component {

  componentDidMount() {
    this.props.user
      && this.props.user._id
      && this.props.getPatients({ userId: this.props.user._id });
  }

  componentWillReceiveProps(props) {
    if (props.user !== this.props.user) {
      props.user
        && props.user.id
        && props.getPatients({ userId: props.user._id });
    }
  }

  handleDelete = (patientId) => () => {
    this.props.showConfirmPopup(`Are you sure you want to delete patient ${this.props.patients && this.props.patients[patientId] && this.props.patients[patientId].name}?`,
    () => {
      this.props.deletePatient({
        userId: this.props.user._id,
        patientId: patientId,
      });
    });
  };

  render() {
    const { config, patients } = this.props;
    return (
      <div className={s.patients}>
        <Header title="Manage Patients" />
        <Container>
          <Loader className="spinner" loaded={!this.props.patientsFetching}>
            <div className={s.addPatient}>
              <div>
                {patients && Object.values(patients).length} Patient(s)
              </div>
              <div>
                <Link className="btn-small btn-primary" to="/patients/add">
                  <span className={s.addPatientBtn}>
                    Add Patient <FaArrowCircleRight />
                  </span>
                </Link>
              </div>
            </div>
            {
              patients && Object.values(patients).map((patient) => {
                return (
                  <div className={s.patientBlock} key={patient._id}>
                    <div className={s.patientText}>
                      <h3>{patient.name}</h3>
                      {patient.gender && <span>
                        <FaUser />
                        &nbsp;{configToName(config, 'gendersByValue', patient.gender)}, {patient && patient.dob && (new Date().getFullYear() - patient.dob.split('-')[0])} years old
                      </span>}
                      {patient.mainDiagnosis && <span>
                        <FaMedkit /> {patient.mainDiagnosis}
                      </span>}
                      {patient.relationship && <span>
                        <FaSitemap /> {patient.relationship}
                      </span>}
                    </div>
                    <div className={s.patientVisit}>
                      <div className={s.patientVisitDetails}>
                        <p>Total Visits</p>
                        <span>{patient.totalVisits}</span>
                      </div>
                      <div className={s.patientVisitDetails}>
                        <p>Last Visit Date</p>
                        <span>{patient.lastVisitedDate ? moment(patient.lastVisitedDate).format('ll') : '-'}</span>
                      </div>
                    </div>
                    <div className={s.patientAction}>
                      <DashboardTableButton color="green" to={`/patients/${patient._id}`}>
                        <span className={s.patientBtnText}>Edit</span>
                      </DashboardTableButton>
                      <DashboardTableButton color="red" onClick={this.handleDelete(patient._id)}>
                        <span className={s.patientBtnText}>Delete</span>
                      </DashboardTableButton>
                    </div>
                  </div>
                );
              })
            }
          </Loader>
        </Container>
        <ConfirmPopup />
      </div>
    );
  }
}


PatientsList.propTypes = {
  config: React.PropTypes.object,
  user: React.PropTypes.object,
  patients: React.PropTypes.object,
  patientsFetching: React.PropTypes.bool,

  getPatients: React.PropTypes.func.isRequired,
  deletePatient: React.PropTypes.func.isRequired,
  showConfirmPopup: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  config: state.config.data,
  user: state.user.data,
  patients: state.user.data && state.user.data._id
    && state.patientsByClient[state.user.data._id]
    && state.patientsByClient[state.user.data._id].data,
  patientsFetching: state.user.data && state.user.data._id
    && state.patientsByClient[state.user.data._id]
    && state.patientsByClient[state.user.data._id].isFetching,
});

const mapDispatchToProps = (dispatch) => ({
  getPatients: (params) => dispatch(getPatients(params)),
  deletePatient: (params) => dispatch(deletePatient(params)),
  showConfirmPopup: (message, accept) => dispatch(showConfirmPopup(message, accept)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PatientsList);
