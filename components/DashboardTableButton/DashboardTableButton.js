import React from 'react';
import classNames from 'classnames';
import s from './DashboardTableButton.css';
import Link from '../Link';

const DashboardTableButton = (props) => {
  if (props.to) {
    return (
      <Link
        to={props.to}
        className={classNames(s.dashboardTableButton, s[props.color])}
      >
        {props.children}
      </Link>
    );
  } else {
    return (
      <button
        onClick={props.onClick}
        role="button"
        className={classNames(s.dashboardTableButton, s[props.color])}
      >
        {props.children}
      </button>
    );
  }
};

DashboardTableButton.displayName = 'DashboardTableButton';

DashboardTableButton.propTypes = {
  children: React.PropTypes.node,

  color: React.PropTypes.string,

  onClick: React.PropTypes.func,
  to: React.PropTypes.string,
};

DashboardTableButton.defaultProps = {
  onClick: () => {},
};

export default DashboardTableButton;
