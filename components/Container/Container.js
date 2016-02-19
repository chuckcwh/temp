import React, { Component, PropTypes } from 'react';
import './Container.scss';

class Container extends Component {

  // static propTypes = {
  //   children: PropTypes.element.isRequired,
  // };

  render() {
    return (
      <div className="Container">
        {this.props.children}
      </div>
    );
  }

}

export default Container;
