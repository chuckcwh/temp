import React from 'react';
import classNames from 'classnames';
import s from './DashboardStatButton.css';
import Link from '../Link';

const DashboardStatButton = ({ to, onClick, color, icon, text, stat }) => {
  let content = (
    <div className={classNames(s.dashboardStat, color)}>
      <div className={classNames(s.dashboardStatVisual, icon)}></div>
      <div className={s.dashboardStatDetails}>
        <div className={s.dashboardStatDetailsDesc}>{text}</div>
      </div>
      <div className={s.dashboardStatMore}>{stat}</div>
    </div>
  );
  if (to) {
    return (
      <Link className={s.dashboardStatButton} to={to}>
        {content}
      </Link>
    );  
  }
  return (
    <a className={s.dashboardStatButton} onClick={onClick}>
      {content}
    </a>
  );
};

DashboardStatButton.propTypes = {
  to: React.PropTypes.string,
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
