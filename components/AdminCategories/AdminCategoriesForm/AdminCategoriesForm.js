import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DayPicker, { DateUtils } from 'react-day-picker';
import some from 'lodash/some';
import remove from 'lodash/remove';
import cx from 'classnames';
import moment from 'moment';
import { reduxForm } from 'redux-form';
import 'react-day-picker/lib/style.css';
import s from './AdminCategoriesForm.css';
import { isAdmin } from '../../../core/util';
import history from '../../../core/history';
import {
  CATEGORY_CREATE_SUCCESS,
  CATEGORY_FAILURE,
  CATEGORY_EDIT_SUCCESS,
  CATEGORY_DELETE_SUCCESS,
  createCategory,
  getCategory,
  editCategory,
  deleteCategory,
  showAlertPopup,
} from '../../../actions';
import DayPickerPopup from '../../DayPickerPopup';
import MultiSelect from '../../MultiSelect';
import { Grid, Row, Col } from 'react-flexbox-grid';


class AdminCategoriesForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const { getCategory, edit, categoryId } = this.props;

    if (edit) {
      getCategory({ categoryId }).then(res => {
        if (res.type === CATEGORY_FAILURE) {
          history.push({ pathname: '/admin-categories' });
        }
      });
    }
  }

  onDeleteCategory = (e) => {
    e.preventDefault();
    const { fields, deleteCategory } = this.props;

    deleteCategory({categoryId: fields._id.value}).then(res => {
      if (res.type === CATEGORY_DELETE_SUCCESS) {
        showAlertPopup('Category delete success!');
        history.push({ pathname: '/admin-categories' });
      } else {
        showAlertPopup('Category delete failed.');
      }
    });
  }

  onEditCategory = (e) => {
    e.preventDefault();
    const { fields, editCategory, showAlertPopup, updateCategoryList } = this.props;

    const data = {
      categoryId: fields._id.value,
      name: fields.name.value,
      cType: fields.cType.value,
      order: fields.order.value,
      slug: fields.slug.value,
      description: fields.description.value,
      // avatar,
    }

    editCategory(data).then(res => {
      if (res.type === CATEGORY_EDIT_SUCCESS) {
        showAlertPopup('Category edit success!');
        updateCategoryList();
      } else {
        showAlertPopup('Category edit failure');
      }
    });
  }

  onSubmit = (values) => {
    const { showAlertPopup, resetForm, updateCategoryList } = this.props;
    console.log('submit', values);
    const data = {
      name: values.name,
      cType: values.cType,
      order: values.order,
      slug: values.slug,
      description: values.description,
      // avatar,
    }
    this.props.createCategory(data).then(res => {
      if (res.type === CATEGORY_CREATE_SUCCESS) {
        showAlertPopup('Category create success!');
        updateCategoryList();
        resetForm();
      } else {
        showAlertPopup('Category create failed.');
      }
    });
  }

  render() {
    const {
      fields: {
        name,
        cType,
        order,
        slug,
        description,
        avatar, // backend not updated
      },
      edit,

      invalid,
      handleSubmit,
      submitFailed,
      submitting,
    } = this.props;

    return (
      <form className={s.adminCategoriesForm} onSubmit={handleSubmit(this.onSubmit)}>
        <Grid fluid>
          <Row className={s.mainCat}>

            <Col xs={12} md={6} className={s.mainCatCol}>
              <div className={s.mainCatContainer}>
                <p>name*</p>
                <div className={s.inputField}>
                  <input type="text" className={s.textInput} {...name} />
                  {name.touched && name.error && <div className={s.formError}>{name.error}</div>}
                </div>
              </div>

              <div className={s.mainCatContainer}>
                <p>cType</p>
                <div className={s.inputField}>
                  <div className={cx("select", s.selectionInput)}>
                    <span></span>
                    <select id="cType" name="cType" {...cType}>
                      <option value="category">category</option>
                      <option value="sub-category">sub-category</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={s.mainCatContainer}>
                <p>avatar</p>
                <div className={s.inputField}>
                  {avatar.touched && avatar.error && <div className={s.formError}>{avatar.error}</div>}
                </div>
              </div>
            </Col>

            <Col xs={12} md={6} className={s.mainCatCol}>

              <div className={s.mainCatContainer}>
                <p>slug*</p>
                <div className={s.inputField}>
                  <input type="text" className={s.textInput} {...slug} />
                  {slug.touched && slug.error && <div className={s.formError}>{slug.error}</div>}
                </div>
              </div>

              <div className={s.mainCatContainer}>
                <p>Order</p>
                <div className={s.inputField}>
                  <input type="number" className={s.numberInput} {...order} />
                  {order.touched && order.error && <div className={s.formError}>{order.error}</div>}
                </div>
              </div>

              <div className={s.mainCatContainer}>
                <p>Description</p>
                <div className={s.inputField}>
                  <textarea className={s.descriptionInput} id="description" name="description" {...description} />
                  {description.touched && description.error && <div className={s.formError}>{description.error}</div>}
                </div>
              </div>
            </Col>
          </Row>
        </Grid>

        {edit ? (
          <div className={s.formSectionSubmit}>
            {submitFailed && invalid && <div className={s.formError}>You have one or more form field errors.</div>}
            <button className="btn btn-primary" disabled={invalid || submitting} onClick={this.onEditCategory}>Update</button>&nbsp;&nbsp;
            <button className="btn btn-secondary" onClick={this.onDeleteCategory}>Delete</button>
          </div>
        ) : (
          <div className={s.formSectionSubmit}>
            {submitFailed && invalid && <div className={s.formError}>You have one or more form field errors.</div>}
            <button className="btn btn-primary" type="submit" disabled={invalid || submitting}>Add Category</button>
          </div>
        )}
      </form>
    );
  }
}

const validate = values => {
  const errors = {};

  if (!values.name) {
    errors.name = 'Required';
  }

  if (!values.slug) {
    errors.slug = 'Required';
  }

  return errors
}


AdminCategoriesForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,


  resetForm: React.PropTypes.func,
  createCategory: React.PropTypes.func,
};

const reduxFormConfig = {
  form: 'adminCategoriesForm',
  fields: [
    '_id',    // for edit use
    'name',
    'order',
    'cType',
    'description',
    'slug',
    'avatar', // backend not updated
  ],
  validate,
}

const mapStateToProps = (state) => ({
  initialValues: {
    cType: 'category',
    order: 0,
}});

const mapDispatchToProps = (dispatch) => ({
  createCategory: (params) => dispatch(createCategory(params)),
  getCategory: (params) => dispatch(getCategory(params)),
  editCategory: (params) => dispatch(editCategory(params)),
  deleteCategory: (params) => dispatch(deleteCategory(params)),

  resetForm: () => dispatch(reset('adminCategoriesForm')),
  showAlertPopup: (body) => dispatch(showAlertPopup(body)),
});

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(AdminCategoriesForm);
