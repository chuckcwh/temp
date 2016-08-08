import React from 'react';
import classNames from 'classnames';
import s from './DashboardStatButton.css';

const DashboardStatButton = ({ onClick, color, icon, text, stat }) => (
  <a className={s.dashboardStatButton} onClick={onClick}>
    <div className={classNames(s.dashboardStat, color)}>
      <div className={classNames(s.dashboardStatVisual, icon)}></div>
      <div className={s.dashboardStatDetails}>
        <div className={s.dashboardStatDetailsDesc}>{text}</div>
      </div>
      <div className={s.dashboardStatMore}>{stat}</div>
    </div>
  </a>
);

DashboardStatButton.propTypes = {
  onClick: React.PropTypes.func,
  color: React.PropTypes.string,
  icon: React.PropTypes.string,
  text: React.PropTypes.string,
  stat: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),
};

DashboardStatButton.defaultProps = {
  onClick: (e) => { e.preventDefault(); },
};

export default DashboardStatButton;
