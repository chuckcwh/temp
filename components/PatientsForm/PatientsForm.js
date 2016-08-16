import React, { Component } from 'react';
import s from './PatientsForm.css';
import { fetchLanguages, fetchAddress, getPatients, showDayPickerPopup } from '../../actions';
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

  componentDidMount() {
    this.props.fetchLanguages();
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

  render() {
    const { action, patients, showDayPickerPopup, fetchAddress, languages } = this.props;
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
            {selectedTabIndex === 0
              && <PatientsFormFirst action={action} onSubmit={this.nextPage} showDayPickerPopup={showDayPickerPopup} />}
            {selectedTabIndex === 1
              && <PatientsFormSecond action={action} previousPage={this.previousPage} onSubmit={this.nextPage} fetchAddress={fetchAddress} />}
            {selectedTabIndex === 2
              && <PatientsFormThird action={action} previousPage={this.previousPage} onSubmit={this.nextPage} languages={languages} />}
            {selectedTabIndex === 3
              && <PatientsFormFourth action={action} previousPage={this.previousPage} onSubmit={this.nextPage} />}
          </div>
        </div>
        <DayPickerPopup title="Date of Birth" />
      </div>
    );
  }
}


PatientsForm.propTypes = {
  action: React.PropTypes.string.isRequired,

  user: React.PropTypes.object,
  client: React.PropTypes.object,
  patients: React.PropTypes.object,
  patientsFetching: React.PropTypes.bool,
  patientIds: React.PropTypes.array,

  fetchLanguages: React.PropTypes.func.isRequired,
  fetchAddress: React.PropTypes.func.isRequired,
  getPatients: React.PropTypes.func.isRequired,
  showDayPickerPopup: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  languages: state.languages.data,
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
  fetchLanguages: () => dispatch(fetchLanguages()),
  fetchAddress: (postalCode) => dispatch(fetchAddress(postalCode)),
  getPatients: (params) => dispatch(getPatients(params)),
  showDayPickerPopup: (value, source) => dispatch(showDayPickerPopup(value, source)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PatientsForm);
