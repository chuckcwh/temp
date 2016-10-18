import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import Loader from 'react-loader';
import s from './InlineForm.css';
import MultiSelect from '../MultiSelect';
import { hideInlineForm } from '../../actions';

class InlineForm extends Component {

  componentWillReceiveProps(props) {
    const { fields: { postal } } = this.props;
    const newPostal = props && props.fields && props.fields.postal;
    if (newPostal && postal && newPostal.value.length === 6 && newPostal.value !== postal.value) {
      this.props.fetchAddress && this.props.fetchAddress(newPostal.value);
    }
  }

  handleSubmit = (values, dispatch) => {
    if (this.props.onSave) {
      return this.props.onSave(values, dispatch).then(() => {
        this.props.hideInlineForm();
      });
    } else if (this.props.ok) {
      return this.props.ok(values, dispatch).then(() => {
        this.props.hideInlineForm();
      });
    }
    return new Promise((resolve) => {
      this.props.hideInlineForm();
      resolve();
    });

    // this.props.onSave && this.props.onSave.apply(this, arguments).then(() => {
    //   this.props.hideInlineForm();
    // });
    // this.props.ok && this.props.ok.apply(this, arguments).then(() => {
    //   this.props.hideInlineForm();
    // });
  };

  handleCancel = (event) => {
    event.preventDefault();

    this.props.hideInlineForm && this.props.hideInlineForm();
    this.props.onCancel && this.props.onCancel();
    this.props.cancel && this.props.cancel();
  };

  render() {
    const {
      fields,
      invalid,
      handleSubmit,
      // onCancel,
      // onBlur,
      // onChange,
      pristine,
      submitFailed,
      submitting,
      error,
      inputs,
    } = this.props;
    return (
      <form className={s.inlineForm} onSubmit={handleSubmit(this.handleSubmit)}>
        <Loader className="spinner" loaded={!submitting}>
          {Object.keys(fields).map(name => {
            const field = fields[name];
            const input = inputs[name];
            let inputField;
            switch (input.type) {
              case 'text':
              case 'email':
              case 'hidden':
                inputField = (
                  <input type={input.type} id={name} name={name} placeholder={input.placeholder || input.label} {...field} />
                );
                break;
              case 'date':
                inputField = (
                  <div className="DateInput">
                    <input type="text" id={name} name={name} placeholder={input.placeholder || input.label} {...field} />
                    <span
                      onClick={() =>
                        this.props.showDayPickerPopup && this.props.showDayPickerPopup(field.value, 'inlineForm')}
                    ></span>
                  </div>
                );
                break;
              case 'select':
                inputField = (
                  <div className="select">
                    <span></span>
                    <select id={name} name={name} {...field} value={field.value || ''}>
                      <option value="">-- Select --</option>
                      {
                        input.options.map((option) => (
                          <option value={option.value} key={option.value}>{option.label}</option>
                        ))
                      }
                    </select>
                  </div>
                );
                break;
              case 'multiselect':
                inputField = (
                  <MultiSelect
                    options={input.options}
                    {...field}
                  />
                );
                break;
              default:
                break;
            }
            return (
              <div className="TableRow" key={name}>
                <div className="TableRowItem1">{input.label}</div>
                <div className="TableRowItem3">
                  {inputField}
                  {field.touched && field.error && <div className={s.inlineFormError}>{field.error}</div>}
                </div>
              </div>
            );
          })}
          {submitFailed && invalid && <div className={s.inlineFormError}>{error}</div>}
          <div>
            <button className="btn btn-primary" type="submit" disabled={submitting || pristine}>Save</button>
            <button className="btn btn-primary" onClick={this.handleCancel}>Cancel</button>
          </div>
        </Loader>
      </form>
    );
  }

}

InlineForm.propTypes = {
  fetchAddress: PropTypes.func,
  showDayPickerPopup: PropTypes.func,

  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  inputs: PropTypes.object.isRequired,

  initialValues: PropTypes.object,
  validate: PropTypes.func,
  ok: PropTypes.func,
  cancel: PropTypes.func,

  hideInlineForm: PropTypes.func,
};

const reduxFormConfig = {
  form: 'inlineForm',
  destroyOnUnmount: true,
};

const mapStateToProps = (state) => {
  const initialValues = Object.keys(state.inlineForm.inputs).reduce((result, field) => {
    if (state.inlineForm.inputs[field] && state.inlineForm.inputs[field].initialValue) {
      result[field] = state.inlineForm.inputs[field].initialValue;
    }
    return result;
  }, {});
  return {
    initialValues,
    fields: Object.keys(state.inlineForm.inputs),
    inputs: state.inlineForm.inputs,
    validate: state.inlineForm.validate,
    ok: state.inlineForm.ok,
    cancel: state.inlineForm.cancel,
  };
};

const mapDispatchToProps = (dispatch) => ({
  hideInlineForm: () => dispatch(hideInlineForm()),
});

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(InlineForm);
