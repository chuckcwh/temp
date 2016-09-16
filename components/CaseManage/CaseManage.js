import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import s from './CaseManage.css';
import Container from '../Container';
import Link from '../Link';
import Header from '../Header';
import history from '../../core/history';
// Sub Component
import CaseManageAddForm from './CaseManageAddForm/CaseManageAddForm';


class CaseManage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentIndex: 0,
    }
  }

  render() {
    const { add } = this.props.params;
    const { user } = this.props;

    return (
      <div className="s.case-manage">
        <Header title="Case Manage" />
        <Container>

          {user && add && <CaseManageAddForm />}

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

CaseManage.propTypes = {
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
};

const mapStateToProps = (state) => ({
  user: state.user.data,
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(CaseManage);
