import React, { Component } from 'react';
import s from './Patients.css';
import { getPatients, getEngagedSessions } from '../../actions';
import { connect } from 'react-redux';
import Container from '../Container';
import Header from '../Header';
import DashboardTableButton from '../DashboardTableButton';
import LabelButton from '../LabelButton';
import Loader from 'react-loader';
import FaUser from 'react-icons/lib/fa/user';
import FaMedkit from 'react-icons/lib/fa/medkit';
import FaSitemap from 'react-icons/lib/fa/sitemap';
import FaArrowCircleRight from 'react-icons/lib/fa/arrow-circle-right';

class Patients extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.client
      && this.props.client.id
      && this.props.getPatients({ cid: this.props.client.id });
  }

   render() {
    const { patients } = this.props;
    return (
      <div>
        <Header />
        <Container>
          <Loader className="spinner" loaded={!this.props.patientsFetching}>
            <div className={s.addPatient}>
              <div>
                {patients && Object.values(patients).length} Patient(s)
              </div>
              <div>
                <a href="" className="btn-small btn-primary">
                <span className={s.addPatientBtn}>
                  Add Patient <FaArrowCircleRight />
                </span>
                </a>
              </div>
            </div>
            {
              patients && Object.values(patients).map((patient) => {
                const currentYear = new Date().getFullYear();
                const age = currentYear - patient.dob.split("-")[0];
                return (
                  <div className={s.patientBlock} key={patient.id}>
                    <div className={s.patientText}>
                      <h3>{patient.fullName}</h3>
                      <span>
                        <FaUser/> {patient.gender == "" ? '- ' : patient.gender}, {age} years old 
                      </span>
                      <span>
                        <FaMedkit/> {patient.mainDiagnosis == "" ? '- ' : patient.mainDiagnosis} 
                      </span>
                      <span>
                        <FaSitemap/> {patient.relationship == "" ? '- ' : patient.relationship} 
                      </span>
                    </div>
                    <div className={s.patientVisit}>
                      <div className={s.patientVisitDetails}>
                        <p>Total Visits</p>
                        <span>{patient.totalVisited}</span>
                      </div>
                      <div className={s.patientVisitDetails}>
                        <p>Last Visit Date</p>
                        <span>{patient.lastVisited == null ? '-' : patient.lastVisited.dateEngaged.split(" ")[0]}</span>
                      </div>
                    </div>
                    <div className={s.patientAction}>
                      <DashboardTableButton color="green">
                        <span className={s.patientBtnText}>Manage</span>
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


Patients.propTypes = {
  user: React.PropTypes.object,
  getPatientsByClient: React.PropTypes.object,
  getPatients: React.PropTypes.func.isRequired,
  patientsFetching: React.PropTypes.bool,
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

export default connect(mapStateToProps, mapDispatchToProps)(Patients);
