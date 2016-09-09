import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import s from './PromocodeManage.css';
import Container from '../Container';
import Link from '../Link';
import Header from '../Header';
import history from '../../core/history';
import Waypoint from 'react-waypoint';
import { getUserName } from '../../core/util';
// Sub Component
import PromocodeManageAddForm from './PromocodeManageAddForm/PromocodeManageAddForm';


class PromocodeManage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentIndex: 0,
    }
  }

  _handleWaypointEnter = () => {
    console.log('enter');
  };

  _handelWaypointLeave = () => {
    console.log('leave');
  };

  render() {
    const { add } = this.props.params;
    const { user } = this.props;

    return (
      <div className="s.promocodeManage">
        <Header title="PromoCode Management" />
        <Container>

          {user && add && <PromocodeManageAddForm />}

          {user && !add && (
            <div>
              <Link
              className={cx('btn', 'btn-primary', s.addLink)}
              to="/promocode-manage/add">
              New Promo Code
              </Link>

              <div>
                <Waypoint
                onEnter={this._handleWaypointEnter}
                onLeave={this._handleWaypointLeave}
                />
              </div>
            </div>
          )}
        </Container>
      </div>
    );
  }
}

PromocodeManage.propTypes = {
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
};

const mapStateToProps = (state) => ({
  user: state.user.data,
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(PromocodeManage);
