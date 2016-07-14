import React, { Component, PropTypes } from 'react';
import s from './Container.css';

class Container extends Component {

  // static propTypes = {
  //   children: PropTypes.element.isRequired,
  // };

  render() {
    return (
      <div className={s.container}>
        {this.props.children}
      </div>
    );
  }

}

export default Container;
