import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import classNames from 'classnames';
import moment from 'moment';
import s from './PromocodeManage.css';
import Container from '../Container';
import Link from '../Link';
import Header from '../Header';
import history from '../../core/history';
import { getUserName } from '../../core/util';

class PromocodeManage extends Component {

  render() {
    return (
      <div className="s.promocode-manage">
        <Header title="Promocode Manage" />
        <Container>
          <div>
            promocode manage
          </div>
        </Container>
      </div>
    );
  }
}

PromocodeManage.propTypes = {
};

const mapStateToProps = (state) => ({
  user: state.user.data,
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(PromocodeManage);
