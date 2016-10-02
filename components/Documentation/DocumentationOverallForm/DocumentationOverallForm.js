import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import s from './DocumentationOverallForm.css';
import Container from '../../Container';
import Link from '../../Link';
import Header from '../../Header';
import history from '../../../core/history';
import { getUserName, configToName } from '../../../core/util';
import { getSession, showConfirmPopup, fetchServices } from '../../../actions';
import ConfirmPopup from '../../ConfirmPopup';
import { Grid, Row, Col } from 'react-flexbox-grid';


class DocumentationOverallForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
    }
  }

  componentDidMount() {

  }


  render() {
    return (
      <form className={s.documentationOverallForm} onSubmit={this.props.onFormSubmit}>
        <h2>Overall</h2>

        <p>Overall Assessment is an efficient and effective instrument for obtaining the information necessary to prevent health alterations in the older adult patient. Familiarity with these commonly-occurring disorders helps the nurse prevent unnecessary iatrogenesis and promote optimal function of the aging patient. Flagging conditions for further assessment allows the nurse to implement preventative and therapeutic interventions.</p>
        <p className={s.red}>It is compulsory that you complete this Overall Assessment</p>

      </form>
    );
  }
}

DocumentationOverallForm.propTypes = {

};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(DocumentationOverallForm);
