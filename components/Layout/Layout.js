import React, { Component, PropTypes } from 'react';
import './Layout.scss';
import Container from '../Container';
import Navigation from '../Navigation';
import Footer from '../Footer';

class Layout extends Component {

  static propTypes = {
    children: PropTypes.element.isRequired,
  };

  render() {
    return (
      <div className="Layout">
        <Navigation path={this.props.path} pullRight={true} />
        <div className="Body">
          {this.props.children}
        </div>
        <Footer />
      </div>
    );
  }

}

export default Layout;
