import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import 'react-virtualized/styles.css';
import s from './AdminCasesEditForm.css';
import Container from '../../Container';
import Link from '../../Link';
import Header from '../../Header';
import { reduxForm } from 'redux-form';
import history from '../../../core/history';
import {
  getSession,
  fetchServices,
  showFeedbackPopupForm,
  hideFeedbackPopupForm,
} from '../../../actions';
import { InfiniteLoader, AutoSizer, Table, Column } from 'react-virtualized';
import { formatSessionAlias, configToName } from '../../../core/util';
import { Grid, Row, Col } from 'react-flexbox-grid';
import FeedbackPopupForm from '../../FeedbackPopupForm';
// react-icons
import FaCheck from 'react-icons/lib/fa/check';

class AdminCasesEditForm extends Component {

  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {
    const { getSession, fetchServices } = this.props;
    const { sessionId } = this.props.params;

    fetchServices();
    getSession({ sessionId }).then(res => {
      if (res.type === 'SESSION_FAILURE') {
        history.push({ pathname: '/admin-cases' });
      }
    });
  }

  onFormSubmit = (values) => {
    console.log('edit form', values);
  }

  render() {
    const {
      fields: {
        _id,
      },
      session,
      services,
      config,

      invalid,
      handleSubmit,
      submitFailed,
      submitting,
    } = this.props;

    const detail = {
      title: () => {
        const serviceName = session.service && Object.keys(services).length > 0 && services[session.service].name;
        const serviceClassName = session.serviceClass && Object.keys(services).length > 0 && services[session.service].classes[session.serviceClass].duration;
        return serviceName ? `${serviceName} (${serviceClassName} hr${parseFloat(serviceClassName) > 1 ? 's' : ''})` : '';
      },
      patient: {
        name: session.patient && session.patient.name || '-',
        age: session.patient && moment().diff(session.patient.dob, 'years') ? moment().diff(session.patient.dob, 'years') : 0,
        dob: session.patient && moment(session.patient.dob).format('YYYY-MM-DD') || '-',
        gender: session.patient && configToName(config, 'gendersByValue', session.patient.gender) || '-',
        diagnosis: session.patient && session.patient.diagnosis || '-',
        mobility: session.patient && session.patient.mobility || '-',
        note: session.patient && session.patient.specialNotes || '-',
      },
      client: {
        name: session.client && session.client.name || '-',
        mobile: session.client && session.client.contact || '-',
        email: session.client && session.client.email || '-',
      },
      provider: {},
    }

    return (
      <form className={s.adminCasesEditForm} onSubmit={handleSubmit(this.onFormSubmit)}>
        <Header title="Case Detail" />
        <Container>
          <FeedbackPopupForm onFeedbackSuccess={() => console.log('oh yeh!')}/>

          <h2>{detail.title()}</h2>

          <Grid fluid>
            <Row className={s.caseDetail}>
              <Col xs={12} md={4} className={s.detailSection}>
                <h2>CASE DETAILS</h2>
                <ul>
                  <li><span className={s.title}>Type:</span>{session.isAdhoc ? 'Ad-hoc' : 'Registered User'}</li>
                  <li><span className={s.title}>Alias:</span>{formatSessionAlias(session.alias)}</li>
                  <li><span className={s.title}>Price:</span>{`$ ${session.price} SGD`}</li>
                  <li><span className={s.title}>Provider Price:</span>{`$ ${session.providerPrice} SGD`}</li>
                  <li><span className={s.title}>Date:</span><span className={s.inlineBlock}>{moment(session.date).format('YYYY-MM-DD (ddd)')}</span></li>
                  <li><span className={s.title}>Time:</span><span className={s.inlineBlock}>{configToName(config, 'timeSlotsByValue', session.timeSlot)}</span></li>
                  <li><span className={s.title}>Note:</span><span className={s.inlineBlock}>{session.additionalInfo || '-'}</span></li>
                </ul>
              </Col>

              <Col xs={12} md={4} className={s.detailSection}>
                <h2>CASE LOCATION</h2>
                <ul className={s.caseDetailList}>
                  <li><span className={s.title}>Postal:</span>{session.address && session.address.postal || '-'}</li>
                  <li><span className={s.title}>Region:</span>{session.address && session.address.region || '-'}</li>
                  <li><span className={s.title}>Neighborhood:</span>{session.address && session.address.neighborhood || '-'}</li>
                  <li><span className={s.title}>Address:</span><span className={s.inlineBlock}>{session.address && session.address.description || '-'}</span></li>
                  <li><span className={s.title}>Unit:</span>{session.address && session.address.unit || '-'}</li>
                </ul>
              </Col>

              <Col xs={12} md={4} className={s.detailSection}>
                <h2>CASE STATUS</h2>
                <ul>
                  <li><span className={s.title}>Status:</span>{configToName(config, 'sessionStatusesByValue',session.status)}</li>
                  <li><span className={s.title}>Applications:</span>{session.applications && session.applications.length}</li>
                  <li><span className={s.title}>Transactions:</span>{session.applications && session.transactions.length}</li>
                  <li><span className={s.title}>Paid:</span>{session.isPaid ? "Yes" : "No"}</li>
                  <li><span className={s.title}>Refund:</span>{session.isRefund ? "Yes" : "No"}</li>
                  <li>
                    <div
                      className={cx('btn', s.tableListSign, s.tableListSignDoc, !session.documentation && s.tableListSignDocNo)}
                      onClick={() => history.push({ pathname: `/sessions/${session._id}/documentation` })}
                    >
                      Doc{session.documentation && (<span className={s.textAlign_textBottom}> <FaCheck /></span>)}
                    </div>
                    <div
                      className={cx('btn', s.tableListSign, s.tableListSignDoc, !session.clientFeedback && s.tableListSignDocNo)}
                      onClick={() => session.clientFeedback && this.props.showFeedbackPopupForm({
                        sessionId: session._id,
                        feedbackData: session.clientFeedback,
                        isAdmin: true,
                      })}
                    >
                      Feedback{session.clientFeedback && (<span className={s.textAlign_textBottom}> <FaCheck /></span>)}
                    </div>
                  </li>
                </ul>
              </Col>
            </Row>

            <Row className={s.personDetail}>
              <Col xs={12} md={4} className={s.detailSection}>
                <h2>PATIENT</h2>
                <ul>
                  <li><span className={s.title}>Name:</span>{detail.patient.name}</li>
                  <li><span className={s.title}>Age:</span>{detail.patient.age}</li>
                  <li><span className={s.title}>DOB:</span>{detail.patient.dob}</li>
                  <li><span className={s.title}>Gender:</span>{detail.patient.gender}</li>
                  <li><span className={s.title}>Main Diagnosis:</span><span className={s.inlineBlock}>{detail.patient.diagnosis}</span></li>
                  <li><span className={s.title}>Mobility:</span><span className={s.inlineBlock}>{detail.patient.mobility}</span></li>
                  <li><span className={s.title}>Special Note:</span><span className={s.inlineBlock}>{detail.patient.note}</span></li>
                </ul>
              </Col>

              <Col xs={12} md={4} className={s.detailSection}>
                <h2>SERVICE PROVIDER</h2>
                <ul>
                  <li><span className={s.title}>Name:</span></li>
                  <li><span className={s.title}>Paid Price:</span></li>
                </ul>
              </Col>

              <Col xs={12} md={4} className={s.detailSection}>
                <h2>CLIENT</h2>
                <ul>
                  <li><span className={s.title}>Name:</span>{detail.client.name}</li>
                  <li><span className={s.title}>Mobile:</span>{detail.client.mobile}</li>
                  <li><span className={s.title}>Email:</span>{detail.client.email}</li>
                </ul>
              </Col>
            </Row>
          </Grid>
        </Container>
      </form>
    );
  }
}

const validate = values => {
  const errors = {};

  // if (!values.name) {
  //   errors.name = 'Required';
  // }

  return errors
}

AdminCasesEditForm.propTypes = {
  // initialValues: PropTypes.object.isRequired,
  // user: PropTypes.object.isRequired,
  // session: PropTypes.object.isRequired,
  // config: PropTypes.object.isRequired,
  // services: PropTypes.object.isRequired,

  getSession: PropTypes.func.isRequired,
  fetchServices: PropTypes.func.isRequired,
};

const reduxFormConfig = {
  form: 'adminCasesEditForm',
  fields: [
    '_id',    // for edit use
  ],
  validate,
}

const mapStateToProps = (state) => {
  return {
    // initialValues: {},

    user: state.user.data,
    session: state.session.data,
    config: state.config.data,
    services: state.services.data,
}};

const mapDispatchToProps = (dispatch) => ({
  fetchServices: () => dispatch(fetchServices()),
  getSession: (params) => dispatch(getSession(params)),
  showFeedbackPopupForm: (params) => dispatch(showFeedbackPopupForm(params)),
  hideFeedbackPopupForm: () => dispatch(hideFeedbackPopupForm()),
});

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(AdminCasesEditForm);
