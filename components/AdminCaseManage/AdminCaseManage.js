import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import 'react-virtualized/styles.css';
import s from './AdminCaseManage.css';
import Container from '../Container';
import Link from '../Link';
import Header from '../Header';
import { InfiniteLoader, AutoSizer, Table, Column } from 'react-virtualized';
import { getSessions } from '../../actions';
// Sub Component
import AdminCaseManageForm from './AdminCaseManageForm/AdminCaseManageForm';


class AdminCaseManage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      page: 1,
    }
  }

  componentDidMount() {
    this.props.getSessions({
      count: 10,
      page: this.state.page
    }, true);
  }

  render() {
    const { add } = this.props.params;
    const { user } = this.props;

    return (
      <div className="s.case-manage">
        <Header title="Case Manage" />
        <Container>

          {user && add && <AdminCaseManageForm />}

          {user && !add && (
            <div>
              <Link
                className={cx('btn', 'btn-primary', s.addLink)}
                to="/case-manage/add">
                New Case
              </Link>
            </div>
          )}

        </Container>
      </div>
    );
  }
}

AdminCaseManage.propTypes = {
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
};

const mapStateToProps = (state) => ({
  user: state.user.data,
  sessions: state.promos.data,
});

const mapDispatchToProps = (dispatch) => ({
  getSessions: (params, extend) => dispatch(getSessions(params, extend)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminCaseManage);
