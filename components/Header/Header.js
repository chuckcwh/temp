import React from 'react';
import { connect } from 'react-redux';
import s from './Header.css';
import Container from '../Container';
import Link from '../Link';
import util from '../../core/util';

const imgProfile = require('../../assets/images/profile.png');
const imgMoney = require('../../assets/images/money.png');

const Header = ({ title, user }) => {
  return (
    <div className={s.header}>
      <Container>
        <div className={s.headerBar}>
          <div className={s.headerTitle}>{title}</div>
          <div className={s.headerMenu}>
            <div className={s.headerMenuItem}>
              <img src={imgProfile} alt="Profile" />
              <div className={s.headerMenuItemContent}>
                <div className={s.headerMenuItemText}>
                  Welcome,
                </div>
                <div className={s.headerMenuItemText}>
                  <Link to="/profile">{user && user.name}</Link>
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
                    <Link to="/credits">
                      {`SGD ${user && user.credit && parseFloat(user.credit.current).toFixed(2)}`}
                    </Link>
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
  title: React.PropTypes.string,

  user: React.PropTypes.object,
};

const mapStateToProps = (state) => ({
  user: state.user.data,
});

export default connect(mapStateToProps)(Header);
