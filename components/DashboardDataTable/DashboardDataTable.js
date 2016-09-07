import React, { Component } from 'react';
import s from './DashboardDataTable.css';
import DashboardTableButton from '../DashboardTableButton';


const DashboardDataTable = ({ children, css }) => {
  const csss = Object.keys(s).reduce((result, style) => {
    result[style] = (css && css[style]) ? [
      s[style],
      css[style],
    ].join(' ') : s[style];
    return result;
  }, {});

  return (
    <div className={csss.dashboardDataTable}>
      {children}
    </div>
  );
};

DashboardDataTable.propTypes = {
  children: React.PropTypes.node,
  css: React.PropTypes.object,
};

export default DashboardDataTable;
