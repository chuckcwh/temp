import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import s from './PromocodeManageAddForm.css';
import Container from '../../Container';
import Link from '../../Link';
import Header from '../../Header';
import history from '../../../core/history';
import { getUserName } from '../../../core/util';

class PromocodeManageAddForm extends Component {

  constructor(props) {
    super(props);

    this.state = {}
  }


  render() {
    return (
      <div className="s.promocodeManageAddForm">
        This is add form
      </div>
    );
  }
}

PromocodeManageAddForm.propTypes = {
  // onEnter: PropTypes.func,
  // onLeave: PropTypes.func,
};

const mapStateToProps = (state) => ({
  user: state.user.data,
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(PromocodeManageAddForm);
