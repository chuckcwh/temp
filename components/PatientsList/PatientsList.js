import React, { Component } from 'react';
import s from './PatientsList.css';
import { getPatients } from '../../actions';
import { connect } from 'react-redux';
import moment from 'moment';
import Link from '../Link';
import Container from '../Container';
import Header from '../Header';
import DashboardTableButton from '../DashboardTableButton';
import Loader from 'react-loader';
import FaUser from 'react-icons/lib/fa/user';
import FaMedkit from 'react-icons/lib/fa/medkit';
import FaSitemap from 'react-icons/lib/fa/sitemap';
import FaArrowCircleRight from 'react-icons/lib/fa/arrow-circle-right';

class PatientsList extends Component {

  componentDidMount() {
    this.props.client
      && this.props.client.id
      && this.props.getPatients({ cid: this.props.client.id });
  }

  componentWillReceiveProps(props) {
    if (props.client && !this.props.client) {
      props.client
        && props.client.id
        && props.getPatients({ cid: props.client.id });
    }
  }

  render() {
    const { patients } = this.props;
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
                const currentYear = new Date().getFullYear();
                const age = currentYear - patient.dob.split('-')[0];
                return (
                  <div className={s.patientBlock} key={patient.id}>
                    <div className={s.patientText}>
                      <h3>{patient.fullName}</h3>
                      {patient.gender !== '' && <span>
                        <FaUser /> {patient.gender}, {age} years old
                      </span>}
                      {patient.mainDiagnosis !== '' && <span>
                        <FaMedkit /> {patient.mainDiagnosis}
                      </span>}
                      {patient.relationship !== '' && <span>
                        <FaSitemap /> {patient.relationship}
                      </span>}
                    </div>
                    <div className={s.patientVisit}>
                      <div className={s.patientVisitDetails}>
                        <p>Total Visits</p>
                        <span>{patient.totalVisited}</span>
                      </div>
                      <div className={s.patientVisitDetails}>
                        <p>Last Visit Date</p>
                        <span>{patient.lastVisited == null ? '-' : moment(patient.lastVisited.dateEngaged).format('ll')}</span>
                      </div>
                    </div>
                    <div className={s.patientAction}>
                      <DashboardTableButton color="green" to={`/patients/${patient.id}`}>
                        <span className={s.patientBtnText}>Edit</span>
                      </DashboardTableButton>
                      <DashboardTableButton color="red">
                        <span className={s.patientBtnText}>Delete</span>
                      </DashboardTableButton>
                    </div>
                  </div>
                );
              })
            }
          </Loader>
        </Container>
      </div>
    );
  }
}


PatientsList.propTypes = {
  user: React.PropTypes.object,
  client: React.PropTypes.object,
  patients: React.PropTypes.object,
  patientsFetching: React.PropTypes.bool,
  patientIds: React.PropTypes.array,

  getPatients: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user.data,
  client: state.user.data && state.user.data.clients && state.user.data.clients.length && state.user.data.clients[0],
  patients: state.user.data && state.user.data.clients && state.user.data.clients.length
    && state.user.data.clients[0] && state.user.data.clients[0].id
    && state.patientsByClient[state.user.data.clients[0].id]
    && state.patientsByClient[state.user.data.clients[0].id].data,
  patientsFetching: state.user.data && state.user.data.clients && state.user.data.clients.length
    && state.user.data.clients[0] && state.user.data.clients[0].id
    && state.patientsByClient[state.user.data.clients[0].id]
    && state.patientsByClient[state.user.data.clients[0].id].isFetching,
  patientIds: state.user.data && state.user.data.clients && state.user.data.clients.length
    && state.user.data.clients[0] && state.user.data.clients[0].id
    && state.patientsByClient[state.user.data.clients[0].id]
    && state.patientsByClient[state.user.data.clients[0].id].ids,
});

const mapDispatchToProps = (dispatch) => ({
  getPatients: (params) => dispatch(getPatients(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PatientsList);
