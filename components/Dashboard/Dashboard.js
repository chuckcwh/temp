import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Loader from 'react-loader';
import s from './Dashboard.css';
import Container from '../Container';
import Link from '../Link';
import Header from '../Header';
import ServiceCard from '../ServiceCard';
import { fetchServices, setOrderService, setLastPage } from '../../actions';
import history from '../../core/history';
import util from '../../core/util';
import shuffle from 'lodash/shuffle';
import groupBy from 'lodash/groupBy';

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
    const { params, allServices, servicesTree, servicesTreeHash,
      servicesSubtypesHash, servicesSubtypesHashBySlug, allServicesFetching } = this.props;
    const { filter } = this.state;

    return (
      <div className={s.dashboard}>
        <Header />
        <Loader className="spinner" loaded={true}>
          
        </Loader>
      </div>
    );
  }

}

Dashboard.propTypes = {
  params: React.PropTypes.object,

  lastPage: React.PropTypes.string,
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
  lastPage: state.lastPage,
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
