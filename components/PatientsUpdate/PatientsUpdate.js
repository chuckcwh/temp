import React, { Component } from 'react';
import s from './PatientsUpdate.css';
import { getPatients } from '../../actions';
import { connect } from 'react-redux';
import moment from 'moment';
import Link from '../Link';
import Container from '../Container';
import Header from '../Header';
import DashboardTableButton from '../DashboardTableButton';
import PatientsForm from '../PatientsForm';
import Loader from 'react-loader';

class PatientsUpdate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTabIndex: 0,
    };
  }

  componentDidMount() {
    if (this.props.action === 'edit') {
      this.props.client
        && this.props.client.id
        && this.props.getPatients({ cid: this.props.client.id });
    }
  }

  componentWillReceiveProps(props) {
    if (this.props.action === 'edit') {
      if (props.client && !this.props.client) {
        props.client
          && props.client.id
          && props.getPatients({ cid: props.client.id });
      }
    }
  }

  handleTabSelect = (index) => {
    this.setState({ selectedTabIndex: index });
  };

  render() {
    const { action, patients } = this.props;
    let form;
    switch (action) {
      case 'add':
        form = <PatientsForm action={action} />;
        break;
      case 'edit':
        form = <PatientsForm action={action} />;
        break;
      default:
        break;
    }
    return (
      <div className={s.patientsUpdate}>
        <Header title={`${action === 'edit' ? 'Edit ' : 'Add '}Patient${action === 'edit' ? ': ' : ''}`} />
        <Container>
          <Loader className="spinner" loaded={!this.props.patientsFetching}>
            {form}
          </Loader>
        </Container>
      </div>
    );
  }
}


PatientsUpdate.propTypes = {
  action: React.PropTypes.string.isRequired,

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

export default connect(mapStateToProps, mapDispatchToProps)(PatientsUpdate);
