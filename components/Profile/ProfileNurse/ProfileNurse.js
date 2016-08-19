import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import classNames from 'classnames';
import moment from 'moment';
import s from './ProfileNurse.css';
import Container from '../../Container';
import Link from '../../Link';
import Header from '../../Header';
import history from '../../../core/history';
import util from '../../../core/util';


class ProfileNurse extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { user } = this.props;
    return (
      <div className={s.profile}>
        <Header title={`${user.username}'s Profile`} />
        <Container>
          This is nurse.
        </Container>
      </div>
    );
  }

}

ProfileNurse.propTypes = {
  // params: React.PropTypes.object,
  //
  user: React.PropTypes.object,
  // allServices: React.PropTypes.object,
  // allServicesFetching: React.PropTypes.bool,
  // servicesTree: React.PropTypes.array,
  // servicesTreeHash: React.PropTypes.object,
  // servicesSubtypesHash: React.PropTypes.object,
  // servicesSubtypesHashBySlug: React.PropTypes.object,
  // patients: React.PropTypes.object,
  // patientsFetching: React.PropTypes.bool,
  // patientIds: React.PropTypes.array,
  // cazes: React.PropTypes.object,
  // cazesFetching: React.PropTypes.bool,
  // cazeIds: React.PropTypes.array,
  //
  // fetchServices: React.PropTypes.func,
  // setOrderService: React.PropTypes.func,
  // setLastPage: React.PropTypes.func,
};

const mapStateToProps = (state) => ({
  user: state.user.data,
  // allServices: state.allServices.data,
  // allServicesFetching: state.allServices.isFetching,
  // servicesTree: state.allServices.dashboardTree,
  // servicesTreeHash: state.allServices.dashboardTreeHash,
  // servicesSubtypesHash: state.allServices.subTypesHash,
  // servicesSubtypesHashBySlug: state.allServices.subTypesHashBySlug,
  // patients: state.user.data && state.user.data.clients && state.user.data.clients.length
  //   && state.user.data.clients[0] && state.user.data.clients[0].id
  //   && state.patientsByClient[state.user.data.clients[0].id]
  //   && state.patientsByClient[state.user.data.clients[0].id].data,
  // patientsFetching: state.user.data && state.user.data.clients && state.user.data.clients.length
  //   && state.user.data.clients[0] && state.user.data.clients[0].id
  //   && state.patientsByClient[state.user.data.clients[0].id]
  //   && state.patientsByClient[state.user.data.clients[0].id].isFetching,
  // patientIds: state.user.data && state.user.data.clients && state.user.data.clients.length
  //   && state.user.data.clients[0] && state.user.data.clients[0].id
  //   && state.patientsByClient[state.user.data.clients[0].id]
  //   && state.patientsByClient[state.user.data.clients[0].id].ids,
  // cazes: state.user.data && state.user.data.clients && state.user.data.clients.length
  //   && state.user.data.clients[0] && state.user.data.clients[0].id
  //   && state.cazesByClient[state.user.data.clients[0].id]
  //   && state.cazesByClient[state.user.data.clients[0].id].data,
  // cazesFetching: state.user.data && state.user.data.clients && state.user.data.clients.length
  //   && state.user.data.clients[0] && state.user.data.clients[0].id
  //   && state.cazesByClient[state.user.data.clients[0].id]
  //   && state.cazesByClient[state.user.data.clients[0].id].isFetching,
  // cazeIds: state.user.data && state.user.data.clients && state.user.data.clients.length
  //   && state.user.data.clients[0] && state.user.data.clients[0].id
  //   && state.cazesByClient[state.user.data.clients[0].id]
  //   && state.cazesByClient[state.user.data.clients[0].id].ids,
});

const mapDispatchToProps = (dispatch) => ({
  // fetchServices: () => dispatch(fetchServices()),
  // getPatients: (params) => dispatch(getPatients(params)),
  // getCases: (params) => dispatch(getCases(params)),
  // setOrderService: (service) => dispatch(setOrderService(service)),
  // setLastPage: (page) => dispatch(setLastPage(page)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileNurse);
