import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import 'react-virtualized/styles.css';
import s from './AdminBookingsView.css';
import Container from '../../Container';
import Link from '../../Link';
// import { fetchServices, showGenericPopup, showConfirmPopup, getBooking, deleteBooking, createApplication, getUsers } from '../../../actions';


class AdminBookingsViewAssignProvider extends Component {

  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {

  }


  render() {

    return (
      <div className={s.adminBookingsViewAssignProvider}>

      </div>
    );
  }
}

AdminBookingsViewAssignProvider.propTypes = {

};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(AdminBookingsViewAssignProvider);
