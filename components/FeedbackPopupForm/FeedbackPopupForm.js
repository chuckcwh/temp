import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import s from './FeedbackPopupForm.css';
import Container from '../Container';
import Link from '../Link';
import Popup from '../Popup';
import { SESSION_FEEDBACK_CREATE_SUCCESS, createSessionFeedback, getSessions, hideFeedbackPopupForm } from '../../actions';
import history from '../../core/history';
import { reduxForm } from 'redux-form';
import MultiSelect from '../MultiSelect';
import ReactStars from 'react-stars';


class FeedbackPopupForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      submitFailed: false,
    }
  }

  onFormSubmit = (values) => {
    console.log('values', values);
    const { sessionId, createSessionFeedback, feedbackFieldSelection, onFeedbackSuccess } = this.props;
    const { feedbackFields, topics, content } = values;

    const data = {
      sessionId,
      fields: values.feedbackFields.filter(item => item.value).map(field => ({
        name: feedbackFieldSelection.filter(selection => selection.name === field.name)[0].value,
        value: field.value,
      })),
      topics: topics && topics.split(','),
      content,
    }

    createSessionFeedback(data).then(res => {
      if (res.type === SESSION_FEEDBACK_CREATE_SUCCESS) {
        this.props.onFeedbackSuccess();
      } else {
        this.setState({ submitFailed: true})
      }
    })
  }

  render() {
    const {
      fields: {
        feedbackFields,
        topics,
        content,
      },
      topicChoice,
      isAdmin,

      invalid,
      handleSubmit,
      pristine,
      submitFailed,
      submitting,
    } = this.props;
    const { submitResult } = this.state;

    return (
      <form className={s.feedbackPopupForm} onSubmit={handleSubmit(this.onFormSubmit)}>
        <Popup
          css={s}
          isOpen={this.props.visible}
          onCloseClicked={this.props.hideFeedbackPopupForm}
          onOverlayClicked={this.props.hideFeedbackPopupForm}
        >
          <h2 className={s.title}>Feedback</h2>
          <div className={s.ratingContainer}>
            {feedbackFields && feedbackFields.map((field, index) => (
              <div key={index} className={s.ratingField}>
                <span>{field.name.value}</span>
                <div className={s.ratingStars}>
                  <ReactStars
                    count={5}
                    size={24}
                    color2={'#fdbc1d'}
                    {...field.value}
                    disabled={isAdmin}
                    />
                </div>
              </div>
            ))}
          </div>
          <div className={s.feedbackContainer}>
            <h3>Feedback</h3>
            <div className={s.inputContainer}>
              <div className={s.inputField}>
                <MultiSelect
                  className={s.multiSelect}
                  options={topicChoice}
                  {...topics}
                  disabled={isAdmin}
                />
              </div>
              <div className={s.inputField}>
                {isAdmin ? (
                  <p><strong>Comment:</strong><br/>{content.value}</p>
                ) : (
                  <textarea className={s.content} {...content} disabled={isAdmin} />
                )}
              </div>
            </div>
          </div>

          {submitFailed && (<p className={s.red}>Submit failed.</p>)}
          {!isAdmin && (
            <button className={cx("btn btn-default", s.submitBtn)} disabled={submitting || invalid}>
              Submit
            </button>
          )}
        </Popup>
      </form>
    );
  }
}

const validate = values => {
  const errors = {};

  if (!values.feedbackFields.length && !values.feedbackFields.filter(item => item.value) && !values.topics && !values.content) {
    errors.overall = 'Required';
  }

  return errors;
};

FeedbackPopupForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

const reduxFormConfig = {
  form: 'feedbackPopupForm',
  fields: [
    'feedbackFields[].name',
    'feedbackFields[].value',
    'topics',
    'content',
  ],
  validate,
};

const mapStateToProps = (state) => {
  const feedbackFieldSelection = state.config.data && state.config.data.feedbackFields;
  const { params } = state.modal.feedback;

  return {
    visible: state.modal.feedback.visible,
    sessionId: params && params.sessionId,
    userId: params && params.userId,
    isAdmin: params && params.isAdmin,
    topicChoice: state.config.data && state.config.data.feedbackTopics && state.config.data.feedbackTopics.map(item => ({value: item.value, label: item.name})),
    feedbackFieldSelection,

    initialValues: (params && params.feedbackData) ? {
      feedbackFields: feedbackFieldSelection && feedbackFieldSelection.map(item => ({
        name: item.name,
        value: params.feedbackData.fields && params.feedbackData.fields.filter(field => field.name === item.value)[0].value,
      })),
      topics: params.feedbackData.topics.join(','),
      content: params.feedbackData.content,
    } : {
      feedbackFields: feedbackFieldSelection && feedbackFieldSelection.map(item => ({ name: item.name, value: "" })),
    }
}};

const mapDispatchToProps = (dispatch) => ({
  hideFeedbackPopupForm: () => dispatch(hideFeedbackPopupForm()),
  createSessionFeedback: (params) => dispatch(createSessionFeedback(params)),
});

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(FeedbackPopupForm);
