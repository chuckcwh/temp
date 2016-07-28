import React from 'react';
import s from './Container.css';

const Container = (props) => (
  <div className={s.container}>
    {props.children}
  </div>
);

Container.propTypes = {
  children: React.PropTypes.node.isRequired,
};

export default Container;
