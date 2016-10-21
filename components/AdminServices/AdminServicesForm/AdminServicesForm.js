import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DayPicker, { DateUtils } from 'react-day-picker';
import some from 'lodash/some';
import remove from 'lodash/remove';
import cx from 'classnames';
import moment from 'moment';
import { reduxForm, addArrayValue, destroy, initialize } from 'redux-form';
import 'react-day-picker/lib/style.css';
import s from './AdminServicesForm.css';
import { isAdmin } from '../../../core/util';
import history from '../../../core/history';
import DayPickerPopup from '../../DayPickerPopup';
import MultiSelect from '../../MultiSelect';
import { Grid, Row, Col } from 'react-flexbox-grid';
import ConfirmPopup from '../../ConfirmPopup';
import {
  SERVICE_CREATE_SUCCESS,
  SERVICE_EDIT_SUCCESS,
  SERVICE_DELETE_SUCCESS,
  createService,
  editService,
  deleteService,
  showAlertPopup,
  showConfirmPopup,
} from '../../../actions';
// react-icons
import FaPlus from 'react-icons/lib/fa/plus';
import FaMinus from 'react-icons/lib/fa/minus';


class AdminServicesForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const { fields: { classes, keywords } } = this.props;

    classes.addField();
    keywords.addField();
  }

  onDeleteService = (values) => {
    const { showAlertPopup, updateServiceList, deleteService, showConfirmPopup } = this.props;

    showConfirmPopup(
      'Are you sure you want to delete?',
      () => {
        deleteService({serviceId: values._id}).then(res => {
          if (res.type === SERVICE_DELETE_SUCCESS) {
            showAlertPopup('Service delete success!');
            updateServiceList();
            history.push({ pathname: '/admin-services' });
          } else {
            showAlertPopup('Service delete failed.');
          }
        });
      }
    )
  }

  processedData = (values) => {
    const { _id, name, description, order, categories, parentCategory, classes, keywords, skills } = values;
    return {
      serviceId: _id,
      name,
      categories: categories && categories.split(','),
      parentCategory,
      classes: classes && classes.filter(item => Object.values(item).filter(i => !!i).length),
      description,
      keywords: keywords && keywords.filter(keyword => !!keyword),
      order,
      skills: skills && skills.split(','),
    }
  }

  onEditService = (values) => {
    const { showAlertPopup, resetForm, updateServiceList, editService } = this.props;

    editService(this.processedData(values)).then(res => {
      if (res.type === SERVICE_EDIT_SUCCESS) {
        showAlertPopup('Service edit success!');
        updateServiceList();
      } else {
        showAlertPopup('Service edit failure');
      }
    });
  }

  onSubmit = (values) => {
    const { showAlertPopup, destroyForm, initializeForm, updateServiceList, createService } = this.props;

    createService(this.processedData(values)).then(res => {
      if (res.type === SERVICE_CREATE_SUCCESS) {
        showAlertPopup('Service create success!');
        updateServiceList();
        destroyForm();
        initializeForm({order: 0});
        classes.addField();
        keywords.addField();
      } else {
        showAlertPopup('Service create failed.');
      }
    });
  }

  render() {
    const {
      fields: {
        name,
        categories,
        parentCategory,
        classes,
        skills,
        keywords,
        order,
        description,
      },
      edit,
      categoryChoice,
      skillChoice,

      invalid,
      handleSubmit,
      submitFailed,
      submitting,
    } = this.props;

    const classChoice = [];
    const keywordChoice = [];

    return (
      <form className={s.adminServicesForm} onSubmit={handleSubmit(this.onSubmit)}>
        <Grid fluid>
          <Row className={s.mainCat}>
            <ConfirmPopup />

            <Col xs={12} md={6} className={s.mainCatCol}>
              <div className={s.mainCatContainer}>
                <p>Name*</p>
                <div className={s.inputField}>
                  <input type="text" className={s.textInput} {...name} />
                  {name.touched && name.error && <div className={s.formError}>{name.error}</div>}
                </div>
              </div>

              <div className={s.mainCatContainer}>
                <p>Categories*</p>
                <div className={s.inputField}>
                  <MultiSelect
                    className={s.multiSelect}
                    options={categoryChoice && Object.values(categoryChoice).map(item => ({value: item._id, label: item.name}))}
                    {...categories}
                  />
                  {categories.touched && categories.error && <div className={s.formError}>{categories.error}</div>}
                </div>
              </div>

              <div className={s.mainCatContainer}>
                <p>Parent category <span className={s.orange}>(one of chosen categories)</span>*</p>
                <div className={s.inputField}>
                  <div className={cx("select", s.selectionInput)}>
                    <span></span>
                    <select id="parentCategory" name="parentCategory" {...parentCategory} >
                      <option value="">-- SELECT --</option>
                      {categories.value && categories.value.split(',').map((item, index) => (
                        <option value={categoryChoice[item]._id}>{categoryChoice[item].name}</option>
                      ))}
                    </select>
                  </div>
                  {parentCategory.touched && parentCategory.error && <div className={s.formError}>{parentCategory.error}</div>}
                </div>
              </div>

              <div className={s.mainCatContainer}>
                <p>Classes*</p>
                <div className={s.inputField}>
                  {classes.map((item, index) => (
                    <div key={index} className={s.classesContainer}>
                      <span>{index + 1}.</span>
                      <input type="text" className={s.textInput} {...item.duration} /> hr(s)
                      <input type="number" className={s.numberInput} {...item.price} /> SGD
                      <button
                        className={cx('btn btn-primary', s.multiFieldBtn)}
                        onClick={e => {
                          e.preventDefault();
                          classes.removeField(index);
                      }}>
                        <FaMinus />
                      </button>
                    </div>
                  ))}
                  <button
                    className={cx('btn btn-primary', s.multiFieldBtn)}
                    onClick={e => {
                      e.preventDefault();
                      classes.addField({index: classes.length + 1});
                    }}>
                    <FaPlus /> Add
                  </button>
                  {classes.touched && classes.error && <div className={s.formError}>{classes.error}</div>}
                </div>
              </div>
            </Col>

            <Col xs={12} md={6} className={s.mainCatCol}>

              <div className={s.mainCatContainer}>
                <p>Skills</p>
                <div className={s.inputField}>
                  <MultiSelect
                    className={s.multiSelect}
                    options={skillChoice}
                    {...skills}
                  />
                  {skills.touched && skills.error && <div className={s.formError}>{skills.error}</div>}
                </div>
              </div>

              <div className={s.mainCatContainer}>
                <p>Keywords</p>
                <div className={s.inputField}>
                  <div className={s.keywordsContainer}>
                    {keywords.map((item, index) => (
                      <div key={index}>
                        <span>{index + 1}.</span>
                        <input type="text" className={s.textInput} {...item} />
                        <button
                          className={cx('btn btn-primary', s.multiFieldBtn)}
                          onClick={e => {
                            e.preventDefault();
                            keywords.removeField(index);
                        }}>
                          <FaMinus />
                        </button>
                      </div>
                    ))}
                    {keywords.touched && keywords.error && <div className={s.formError}>{keywords.error}</div>}
                    <button
                      className={cx("btn btn-primary", s.multiFieldBtn)}
                      onClick={e => {
                        e.preventDefault();
                        keywords.addField({index: keywords.length + 1});
                      }}>
                      <FaPlus /> Add
                      </button>
                  </div>
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
            <button className="btn btn-primary" disabled={invalid || submitting} onClick={handleSubmit(this.onEditService)}>Update</button>&nbsp;&nbsp;
            <button className="btn btn-secondary" onClick={handleSubmit(this.onDeleteService)}>Delete</button>
          </div>
        ) : (
          <div className={s.formSectionSubmit}>
            {submitFailed && invalid && <div className={s.formError}>You have one or more form field errors.</div>}
            <button className="btn btn-primary" type="submit" disabled={invalid || submitting}>Add Service</button>
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

  if (!values.categories) {
    errors.categories = 'Required';
  }

  if (!values.parentCategory) {
    errors.parentCategory = 'Required';
  }

  if (!values.classes) {
    errors.classes = 'Required';
  }

  return errors
}


AdminServicesForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  destroyForm: PropTypes.func.isRequired,
  initializeForm: PropTypes.func.isRequired,

  createService: PropTypes.func,
  editService: PropTypes.func,
  deleteService: PropTypes.func,
  showAlertPopup: PropTypes.func,
  showConfirmPopup: PropTypes.func,
};

const reduxFormConfig = {
  form: 'adminServicesForm',
  fields: [
    '_id',    // for edit use
    'name',
    'categories',
    'classes[].duration',
    'classes[].price',
    'description',
    'keywords[]',
    'order',
    'parentCategory',
    'skills',
  ],
  validate,
}

const mapStateToProps = (state, ownProps) => ({
  categoryChoice: state.services.categories,
  skillChoice: state.config.data && state.config.data.skillChoices,
  initialValues: ownProps.initialValues || {
    order: 0,
  }
});

const mapDispatchToProps = (dispatch) => ({
  createService: (params) => dispatch(createService(params)),
  editService: (params) => dispatch(editService(params)),
  deleteService: (params) => dispatch(deleteService(params)),

  destroyForm: () => dispatch(destroy('adminServicesForm')),
  initializeForm: () => dispatch(initialize('adminServicesForm')),
  showAlertPopup: (body) => dispatch(showAlertPopup(body)),
  showConfirmPopup: (body, accept) => dispatch(showConfirmPopup(body, accept)),
  addValue: addArrayValue,
});

export default reduxForm(reduxFormConfig, mapStateToProps, mapDispatchToProps)(AdminServicesForm);
