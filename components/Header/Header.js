import React from 'react';
import { connect } from 'react-redux';
import s from './Header.css';
import Container from '../Container';
import util from '../../core/util';

const imgProfile = require('../../assets/images/profile.png');
const imgMoney = require('../../assets/images/money.png');

const Header = (props) => {
  const { user } = props;
  const userName = util.getUserNameFromUser(user);
  return (
    <div className={s.header}>
      <Container>
        <div className={s.headerBar}>
          <div className={s.headerTitle}>Dashboard</div>
          <div className={s.headerMenu}>
            <div className={s.headerMenuItem}>
              <img src={imgProfile} alt="Profile" />
              <div className={s.headerMenuItemContent}>
                <div className={s.headerMenuItemText}>
                  Welcome,
                </div>
                <div className={s.headerMenuItemText}>
                  <a href="/profile">{userName}</a>
                </div>
              </div>
            </div>
            {user && user.type !== 'Admin' &&
              <div className={s.headerMenuItem}>
                <img src={imgMoney} alt="Credits" />
                <div className={s.headerMenuItemContent}>
                  <div className={s.headerMenuItemText}>
                    Credit Balance
                  </div>
                  <div className={s.headerMenuItemText}>
                    <a href="/credits">{`SGD ${user.credit}`}</a>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </Container>
    </div>
  );
};

Header.propTypes = {
  user: React.PropTypes.object,
};

const mapStateToProps = (state) => ({
  user: state.user.data,
});

export default connect(mapStateToProps)(Header);
