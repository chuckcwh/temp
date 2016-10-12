import React, { Component } from 'react';
import { connect } from 'react-redux';
import Banner from '../Banner';
import Popular from '../Popular';
import Partners from '../Partners';
import Testimonials from '../Testimonials';
import Features from '../Features';
import Actions from '../Actions';
import Download from '../Download';
import AlertPopup from '../AlertPopup';
import history from '../../core/history';

class Home extends Component {
  
  componentDidMount() {
    const { user } = this.props;
    if (user && user._id) {
      history.push('/dashboard');
    }
  }

  componentWillReceiveProps(newProps) {
    const { user } = newProps;
    if (user && user._id) {
      history.push('/dashboard');
    }
  }

  render() {
    return (
      <div>
        <Banner />
        <Popular />
        <Partners />
        <Testimonials />
        <Features />
        <Actions />
        <Download />
        <AlertPopup />
      </div>
    );
  }
}

Home.propTypes = {
  user: React.PropTypes.object,
};

const mapStateToProps = (state) => ({
  user: state.user.data,
});

export default connect(mapStateToProps)(Home);
