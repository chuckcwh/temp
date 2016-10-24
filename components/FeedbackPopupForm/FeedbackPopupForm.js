import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import s from './FeedbackPopupForm.css';
import Container from '../Container';
import Link from '../Link';
import Popup from '../Popup';
import { hideFeedbackPopupForm } from '../../actions';
import history from '../../core/history';
import { reduxForm } from 'redux-form';


class FeedbackPopupForm extends Component {

  constructor(props) {
    super(props);

    this.state = {}
  }

  render() {
    const {
      fields: {
        overall,
        quality,
        feedbackTags,
        feedbackComment,
      },

      invalid,
      handleSubmit,
      pristine,
      submitFailed,
      submitting,
    } = this.props;

    const feedbackTagChoice = [
      {value: "refund", label: "Refund"},
      {value: "service", label: "Service"},
      {value: "other", label: "Other"},
    ]

    return (
      <div className={s.feedbackPopupForm}>
        <Popup
          css={s}
          isOpen={this.props.visible}
          onCloseClicked={this.props.hideFeedbackPopupForm}
          onOverlayClicked={this.props.hideFeedbackPopupForm}
        >
          <h2 className={s.title}>Feedback</h2>
          <div className={s.ratingField}>
            <div>
              <span>Overall</span>

            </div>
            <div>
              <span>Service Quality</span>

            </div>
          </div>
          <div>
            <h3>Feedback</h3>
            <div>
              <div>
                <input />
              </div>
            </div>
          </div>
        </Popup>
      </div>
    );
  }
}

const validate = values => {
  const errors = {};

  // if (!values.bankCode) {
  //   errors.bankCode = 'Required';
  // }

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
    'overall',
    'quality',
    'feedbackTags',
    'feedbackComment',
  ],
  validate,
};

const mapStateToProps = (state) => ({
  visible: state.modal.feedback.visible,
});

const mapDispatchToProps = (dispatch) => ({
  hideFeedbackPopupForm: () => dispatch(hideFeedbackPopupForm()),
});

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(FeedbackPopupForm);
