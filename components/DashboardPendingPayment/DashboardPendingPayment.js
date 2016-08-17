import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Loader from 'react-loader';
import moment from 'moment';
import s from './DashboardPendingPayment.css';
import 'react-day-picker/lib/style.css';
import Container from '../Container';
import Link from '../Link';
import Header from '../Header';
import ServiceCard from '../ServiceCard';
// import { fetchServices, getPatients, getCases } from '../../actions';
import history from '../../core/history';
import util from '../../core/util';
import shuffle from 'lodash/shuffle';
import DashboardDataTable from '../DashboardDataTable';

import { dummyData } from './dummyData.js';  // need to be replaced by real data


class DashboardPendingPayment extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // this.props.fetchServices();
    // this.props.user && this.props.getPatients({
    //   cid: this.props.user.clients[0].id,
    // });
    // this.props.user && this.props.getCases({
    //   cid: this.props.user.clients[0].id,
    // });
  }

  render() {
    const { user, cazes, confirmedApptSessions } = this.props;
    // const addCazeUrl = `${bookingSite}booking1?uid=${request.user.id}&token=${request.user.token}`;

    return (
      <div className={s.dashboardPendingPayment}>

        <Loader className="spinner" loaded={!this.props.cazesFetching}>
          <div className={s.cases}>
            <DashboardDataTable tableData={dummyData} dataActions={['View', 'Cancel', 'Pay']}/>
          </div>
        </Loader>

      </div>
    );
  }

}

DashboardPendingPayment.propTypes = {
  confirmedApptSessions: React.PropTypes.array.isRequired,

  user: React.PropTypes.object,
  allServices: React.PropTypes.object,
  allServicesFetching: React.PropTypes.bool,
  servicesTree: React.PropTypes.array,
  servicesTreeHash: React.PropTypes.object,
  servicesSubtypesHash: React.PropTypes.object,
  servicesSubtypesHashBySlug: React.PropTypes.object,
  patients: React.PropTypes.object,
  patientsFetching: React.PropTypes.bool,
  patientIds: React.PropTypes.array,
  cazes: React.PropTypes.object,
  cazesFetching: React.PropTypes.bool,
  cazeIds: React.PropTypes.array,

  fetchServices: React.PropTypes.func,
  getPatients: React.PropTypes.func,
  getCases: React.PropTypes.func,
};

const mapStateToProps = (state) => ({
  // user: state.user.data,
  // cazesByClient: (clientId) => {
  //   return state.cazesByClient[clientId] && state.cazesByClient[clientId].data;
  // },
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
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPendingPayment);
