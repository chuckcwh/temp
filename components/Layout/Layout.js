import React, { PropTypes } from 'react';
import '../../assets/fonts/proxima-nova.css';
import s from './Layout.css';
import Navigation from '../Navigation';
import Footer from '../Footer';
import AlertPopup from '../AlertPopup';
import history from '../../core/history';

const Layout = (props) => {
  const location = history.getCurrentLocation();
  if (location && location.query && location.query.widget === 'true') {
    return (
      <div className={s.layout}>
        <div className={s.body}>
          {props.children}
        </div>
        <AlertPopup />
      </div>
    );
  }
  return (
    <div className={s.layout}>
      <Navigation location={location} pullRight />
      <div className={s.body}>
        {props.children}
      </div>
      <Footer />
      <AlertPopup />
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Layout;
