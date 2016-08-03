import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Loader from 'react-loader';
import s from './Dashboard.css';
import Container from '../Container';
import Link from '../Link';
import Header from '../Header';
import ServiceCard from '../ServiceCard';
import DashboardStatButton from '../DashboardStatButton';
import DashboardNextAppt from '../DashboardNextAppt';
import { fetchServices, setOrderService, setLastPage } from '../../actions';
import history from '../../core/history';
import util from '../../core/util';
import shuffle from 'lodash/shuffle';

class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // filter: util.ALL_SERVICES,
    };
  }

  componentDidMount() {
    // this.props.fetchServices();
  }

  render() {
    const { user } = this.props;
    const { filter } = this.state;
    let dashboardStats,
      dashboardBody;
    if (user) {
      if (user.type === 'Client') {
        dashboardStats = (
          <div className={s.dashboardStatsWrapper}>
            <DashboardStatButton
              className="blah"
              color="blue"
              icon="bell"
              text="Next Appointment"
              stat={`0`}
            />
            <DashboardStatButton
              color="green"
              icon="hourglass"
              text="Pending Confirmation"
              stat={`0`}
            />
            <DashboardStatButton
              color="red"
              icon="coin"
              text="Pending Payment"
              stat={`$ ${0}`}
            />
            <DashboardStatButton
              color="orange"
              icon="checklist"
              text="Appointments"
              stat={`146`}
            />
          </div>
        );
        dashboardBody = (
          <div className={s.dashboardBody}>
            <DashboardNextAppt />

            <div className="dashboard-pending-confirmation"></div>

            <div className="dashboard-all-appointment"></div>

            <div className="dashboard-pending-payment"></div>
          </div>
        );
      } else if (user.type === 'Nurse') {
        dashboardStats = (
          <div className={s.dashboardStatsWrapper}>
            <DashboardStatButton
              color="blue"
              icon="bell"
              text="Available Cases"
              stat={`0`}
            />
            <DashboardStatButton
              color="orange"
              icon="hourglass"
              text="Ongoing Cases"
              stat={`0`}
            />
            <DashboardStatButton
              color="green"
              icon="checklist"
              text="Completed Cases"
              stat={`0`}
            />
            <DashboardStatButton
              color="red"
              icon="coin"
              text="Total Credits"
              stat={`$ ${0}`}
            />
          </div>
        );
      }
    }
    return (
      <div className={s.dashboard}>
        <Header />
        <Container>
          <div>
            {dashboardStats}
            {dashboardBody}
          </div>
        </Container>
      </div>
    );
  }

}

Dashboard.propTypes = {
  params: React.PropTypes.object,

  user: React.PropTypes.object,
  allServices: React.PropTypes.object,
  allServicesFetching: React.PropTypes.bool,
  servicesTree: React.PropTypes.array,
  servicesTreeHash: React.PropTypes.object,
  servicesSubtypesHash: React.PropTypes.object,
  servicesSubtypesHashBySlug: React.PropTypes.object,

  fetchServices: React.PropTypes.func,
  setOrderService: React.PropTypes.func,
  setLastPage: React.PropTypes.func,
};

const mapStateToProps = (state) => ({
  user: state.user.data,
  allServices: state.allServices.data,
  allServicesFetching: state.allServices.isFetching,
  servicesTree: state.allServices.dashboardTree,
  servicesTreeHash: state.allServices.dashboardTreeHash,
  servicesSubtypesHash: state.allServices.subTypesHash,
  servicesSubtypesHashBySlug: state.allServices.subTypesHashBySlug,
});

const mapDispatchToProps = (dispatch) => ({
  fetchServices: () => dispatch(fetchServices()),
  setOrderService: (service) => dispatch(setOrderService(service)),
  setLastPage: (page) => dispatch(setLastPage(page)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
