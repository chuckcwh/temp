import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import '../../assets/fonts/proxima-nova.css';
import s from './Layout.css';
import Container from '../Container';
import Navigation from '../Navigation';
import Footer from '../Footer';
import history from '../../core/history';

export default class Layout extends Component {

  static propTypes = {
    children: PropTypes.element.isRequired,
  };

  render() {
    const location = history.getCurrentLocation();
    if (location && location.query && location.query.widget == 'true') {
      return (
        <div className={s.layout}>
          <div className={s.body}>
            {this.props.children}
          </div>
        </div>
      );
    } else {
      return (
        <div className={s.layout}>
          <Navigation pullRight={true} />
          <div className={s.body}>
            {this.props.children}
          </div>
          <Footer />
        </div>
      );
    }
  }
}