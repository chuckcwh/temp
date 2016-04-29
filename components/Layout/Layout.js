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
    if (this.props.location && this.props.location.query && this.props.location.query.widget == 'true') {
      return (
        <div className="Layout">
          <div className="Body">
            {this.props.children}
          </div>
        </div>
      );
    } else {
      return (
        <div className="Layout">
          <Navigation path={this.props.path} pullRight={true} />
          <div className="Body">
            {this.props.children}
          </div>
          <Footer path={this.props.path} />
        </div>
      );
    }
  }

}

export default Layout;
