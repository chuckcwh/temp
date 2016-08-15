import React from 'react';
// import s from './Patients.css';
import PatientsList from '../PatientsList';
import PatientsUpdate from '../PatientsUpdate';

const Patients = ({ action }) => {
  switch (action) {
    case 'list':
      return <PatientsList />;
    case 'add':
    case 'edit':
      return <PatientsUpdate action={action} />;
    default:
      return;
  }
}

Patients.propTypes = {
  action: React.PropTypes.string.isRequired,
};

export default Patients;
