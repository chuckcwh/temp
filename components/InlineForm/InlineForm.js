import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import Loader from 'react-loader';
import './InlineForm.scss';
import MultiSelect from '../MultiSelect';
import { hideInlineForm } from '../../actions';

class InlineForm extends Component {

  componentWillReceiveProps(props) {
    const { fields: { postalCode } } = this.props;
    const newPostalCode = props && props.fields && props.fields.postalCode;
    if (newPostalCode && postalCode && newPostalCode.value.length === 6 && newPostalCode.value !== postalCode.value) {
      this.props.fetchAddress && this.props.fetchAddress(newPostalCode.value);
    }
  }

  render() {
    const { 
      fields,
      invalid,
      handleSubmit, 
      onCancel,
      onBlur,
      onChange,
      pristine,
      submitFailed,
      submitting,
      error,
      inputs
    } = this.props;
    return (
      <form className="InlineForm" onSubmit={handleSubmit(this._handleSubmit.bind(this))}>
        <Loader className="spinner" loaded={submitting ? false : true}>
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
              case 'select':
                inputField = (
                  <div className="select">
                    <span></span>
                    <select id={name} name={name} {...field} value={field.value || ''}>
                      <option value="">-- Select --</option>
                      {
                        input.options.map((option) => {
                          return (
                            <option value={option.value}>{option.label}</option>
                          )
                        })
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
                )
                break;
            }
            return (
              <div className="TableRow" key={name}>
                <div className="TableRowItem1">{input.label}</div>
                <div className="TableRowItem3">
                  {inputField}
                  {field.touched && field.error && <div className="InlineFormError">{field.error}</div>}
                </div>
              </div>
            )
          })}
          {submitFailed && invalid && <div className="InlineFormError">{error}</div>}
          <div>
            <button className="btn btn-primary" type="submit" disabled={submitting || pristine}>Save</button>
            <button className="btn btn-primary" onClick={this._handleCancel.bind(this)}>Cancel</button>
          </div>
        </Loader>
      </form>
    );
  }

  _handleSubmit() {
    if (this.props.onSave) {
      return this.props.onSave.apply(this, arguments).then(() => {
        this.props.hideInlineForm();
      });
    } else if (this.props.ok) {
      return this.props.ok.apply(this, arguments).then(() => {
        this.props.hideInlineForm();
      });
    } else return new Promise((resolve, reject) => {
      this.props.hideInlineForm();
      resolve();
    });
    
    // this.props.onSave && this.props.onSave.apply(this, arguments).then(() => {
    //   this.props.hideInlineForm();
    // });
    // this.props.ok && this.props.ok.apply(this, arguments).then(() => {
    //   this.props.hideInlineForm();
    // });
  }

  _handleCancel(event) {
    event.preventDefault();

    this.props.hideInlineForm && this.props.hideInlineForm();
    this.props.onCancel && this.props.onCancel();
    this.props.cancel && this.props.cancel();
  }

}

InlineForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  inputs: PropTypes.object.isRequired
}

const reduxFormConfig = {
  form: 'inlineForm',
  destroyOnUnmount: true
}

const mapStateToProps = (state) => {
  const initialValues = {};
  if (state.inlineForm && state.inlineForm.inputs) {
    for (var field in state.inlineForm.inputs) {
      state.inlineForm.inputs[field] && (initialValues[field] = state.inlineForm.inputs[field]['initialValue']);
    }
  }
  return {
    fields: Object.keys(state.inlineForm.inputs),
    inputs: state.inlineForm.inputs,
    initialValues: initialValues,
    validate: state.inlineForm.validate,
    ok: state.inlineForm.ok,
    cancel: state.inlineForm.cancel
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    hideInlineForm: () => {
      return dispatch(hideInlineForm());
    }
  }
}

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(InlineForm);
