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
        <div className="NavWrapper">
          <Container>
            <Navigation path={this.props.path} />
          </Container>
        </div>
        {this.props.children}
        <Footer />
      </div>
    );
  }

}

export default Layout;
