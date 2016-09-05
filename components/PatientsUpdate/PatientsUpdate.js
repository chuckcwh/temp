import React, { Component } from 'react';
import s from './PatientsUpdate.css';
import { getPatients } from '../../actions';
import { connect } from 'react-redux';
import Container from '../Container';
import Header from '../Header';
import PatientsForm from '../PatientsForm';
import Loader from 'react-loader';
import history from '../../core/history';

class PatientsUpdate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTabIndex: 0,
    };
  }

  componentDidMount() {
    if (this.props.action === 'edit') {
      this.props.user
        && this.props.user._id
        && this.props.getPatients({ userId: this.props.user._id });
    }
  }

  componentWillReceiveProps(props) {
    if (this.props.action === 'edit') {
      if (props.user && !this.props.user) {
        props.user
          && props.user._id
          && props.getPatients({ userId: props.user._id });
      }
    }
  }

  handleTabSelect = (index) => {
    this.setState({ selectedTabIndex: index });
  };

  render() {
    const { params, action, patients } = this.props;
    let form,
      patientName;
    switch (action) {
      case 'add':
        form = <PatientsForm action={action} />;
        break;
      case 'edit':
        form = <PatientsForm action={action} />;
        patientName = patients && params.patientId && patients[params.patientId] && patients[params.patientId].name;
        break;
      default:
        break;
    }
    return (
      <div className={s.patientsUpdate}>
        <Header title={`${action === 'edit' ? 'Edit ' : 'Add '}Patient${action === 'edit' ? `: ${patientName}` : ''}`} />
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
  params: React.PropTypes.object,
  action: React.PropTypes.string.isRequired,

  user: React.PropTypes.object,
  patients: React.PropTypes.object,
  patientsFetching: React.PropTypes.bool,

  getPatients: React.PropTypes.func.isRequired,
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
  getPatients: (params) => dispatch(getPatients(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PatientsUpdate);
