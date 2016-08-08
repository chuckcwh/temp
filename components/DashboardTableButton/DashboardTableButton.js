import React from 'react';
import classNames from 'classnames';
import s from './DashboardTableButton.css';

const DashboardTableButton = (props) => (
  <button
    onClick={props.onClick}
    role="button"
    className={classNames(s.dashboardTableButton, s[props.color])}
  >
    {props.children}
  </button>
);

DashboardTableButton.displayName = 'DashboardTableButton';

DashboardTableButton.propTypes = {
  children: React.PropTypes.node,

  color: React.PropTypes.string.isRequired,

  onClick: React.PropTypes.func,
};

DashboardTableButton.defaultProps = {
  onClick: () => {},
};

export default DashboardTableButton;
