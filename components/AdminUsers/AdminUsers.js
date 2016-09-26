import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import classNames from 'classnames';
import moment from 'moment';
import s from './AdminUsers.css';
import Container from '../Container';
import Link from '../Link';
import Header from '../Header';
import history from '../../core/history';
import { getUserName } from '../../core/util';

class AdminUsers extends Component {

  render() {
    return (
      <div className="s.adminUsers">
        <Header title="User Management" />
        <Container>
          <div>
            users management
          </div>
        </Container>
      </div>
    );
  }
}

AdminUsers.propTypes = {
};

const mapStateToProps = (state) => ({
  user: state.user.data,
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminUsers);
