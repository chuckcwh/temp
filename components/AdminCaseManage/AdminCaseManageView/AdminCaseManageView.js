import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import 'react-virtualized/styles.css';
import s from './AdminCaseManageView.css';
import Container from '../../Container';
import Link from '../../Link';
import Header from '../../Header';
import { InfiniteLoader, AutoSizer, Table, Column } from 'react-virtualized';
// import { getSessions } from '../../../actions';
import { formatSessionAlias, configToName } from '../../../core/util';
// Sub Component
import AdminCaseManageForm from '../AdminCaseManageForm/AdminCaseManageForm';
// react-icons
import FaCaretDown from 'react-icons/lib/fa/caret-down';
import FaCaretSquareODown from 'react-icons/lib/fa/caret-square-o-down';
import FaCaretSquareOUp from 'react-icons/lib/fa/caret-square-o-up';


class AdminCaseManageView extends Component {

  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {

  }


  render() {
    // const { add, edit, sessionId } = this.props.params;
    const { user , config } = this.props;

    return (
      <div className={s.adminCaseManageView}>
        <Header title="Booking Detail" />
        <Container>

          <div>Session detail</div>

        </Container>
      </div>
    );
  }
}

AdminCaseManageView.propTypes = {
};

const mapStateToProps = (state) => ({
  user: state.user.data,
  // sessions: state.sessions.data,
  config: state.config.data,
});

const mapDispatchToProps = (dispatch) => ({
  // getSessions: (params, extend) => dispatch(getSessions(params, extend)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminCaseManageView);
