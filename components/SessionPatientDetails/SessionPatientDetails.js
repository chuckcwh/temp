import React from 'react';
import Loader from 'react-loader';
import moment from 'moment';
import s from './SessionPatientDetails.css';
import Link from '../Link';
import { configToName } from '../../core/util';

const imgPencil = require('../pencil.png');

const SessionPatientDetails = ({ config, patient, canEdit }) => {
  return (
    <div className={s.sessionPatientDetails}>
      <div className={s.sessionPatientDetailsTitle}>
        <h3>Patient Details</h3>
        {canEdit &&
          <Link to={`/patients/${patient._id}`}>
            <img src={imgPencil} />
          </Link>
        }
      </div>
      <Loader className="spinner" loaded={!!(config && patient)}>
        <div className="TableRow">
          <div className="TableRowItem1">Name</div>
          <div className="TableRowItem3">{patient && patient.name}</div>
        </div>
        <div className="TableRow">
          <div className="TableRowItem1">Gender</div>
          <div className="TableRowItem3">
            {configToName(config, 'gendersByValue', patient && patient.gender)}
          </div>
        </div>
        <div className="TableRow">
          <div className="TableRowItem1">Date of Birth</div>
          <div className="TableRowItem3">
            {patient && patient.dob
              && moment(patient.dob).format('ll')}
          </div>
        </div>
        <div className="TableRow">
          <div className="TableRowItem1">Age</div>
          <div className="TableRowItem3">
            {patient && patient.dob
              && moment().diff(moment(patient.dob), 'years')}
          </div>
        </div>
        {patient && patient.contact &&
          <div className="TableRow">
            <div className="TableRowItem1">Contact</div>
            <div className="TableRowItem3">
              {patient && patient.contact}
            </div>
          </div>
        }
        {patient && patient.diagnosis &&
          <div className="TableRow">
            <div className="TableRowItem1">Main Diagnosis</div>
            <div className="TableRowItem3">
              {patient && patient.diagnosis}
            </div>
          </div>
        }
        {patient && patient.mobility &&
          <div className="TableRow">
            <div className="TableRowItem1">Mobility</div>
            <div className="TableRowItem3">
              {patient && patient.mobility}
            </div>
          </div>
        }
        {patient && patient.specialNotes &&
          <div className="TableRow">
            <div className="TableRowItem1">Special Notes</div>
            <div className="TableRowItem3">
              {patient && patient.specialNotes}
            </div>
          </div>
        }
      </Loader>
    </div>
  );
};

SessionPatientDetails.propTypes = {
  config: React.PropTypes.object.isRequired,
  patient: React.PropTypes.object,
  canEdit: React.PropTypes.bool.isRequired,
};

export default SessionPatientDetails;
