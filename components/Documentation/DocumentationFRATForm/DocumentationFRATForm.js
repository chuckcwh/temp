import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import s from './DocumentationFRATForm.css';
import Container from '../../Container';
import Link from '../../Link';
import Header from '../../Header';
import history from '../../../core/history';
import { getUserName, configToName } from '../../../core/util';
import { getSession, showConfirmPopup, fetchServices } from '../../../actions';
import ConfirmPopup from '../../ConfirmPopup';
import { Grid, Row, Col } from 'react-flexbox-grid';


class DocumentationFRATForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
    }
  }

  componentDidMount() {

  }


  render() {
    return (
      <div className={s.documentationFRATForm}>
        FRAT form
      </div>
    );
  }
}

DocumentationFRATForm.propTypes = {

};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(DocumentationFRATForm);
