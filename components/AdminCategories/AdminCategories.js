import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import 'react-virtualized/styles.css';
import s from './AdminCategories.css';
import Container from '../Container';
import Link from '../Link';
import Header from '../Header';
import { AutoSizer, Table, Column } from 'react-virtualized';
import { SERVICES_SUCCESS, fetchServices } from '../../actions';
import { isAdmin } from '../../core/util';
// sub-component
import AdminCategoriesForm from './AdminCategoriesForm/AdminCategoriesForm';
// react-icons
import FaCaretDown from 'react-icons/lib/fa/caret-down';
import FaCaretSquareODown from 'react-icons/lib/fa/caret-square-o-down';
import FaCaretSquareOUp from 'react-icons/lib/fa/caret-square-o-up';


const filterChoice = ['code', 'name'];

class AdminCategories extends Component {

  constructor(props) {
    super(props);

    this.state = {
      renderCategories: [],
      filters: {}
    }
  }

  componentDidMount() {
    this.updateCategoryList();
  }

  updateCategoryList() {
    this.props.fetchServices().then(res => {
      if (res.type === SERVICES_SUCCESS) {
        this.setState({renderCategories: Object.values(this.props.categories)})
      }
    });
  }

  renderFilterSelections = (selections) => {
    return selections.map((item, index) => (
      <div className={s.isActiveInput} key={index}>
        <input
          type="radio"
          ref="filter_category"
          name="filter_category"
          id={`filter_${item.name}`}
          value={item.value}
          onChange={e => {
            const data = Object.values(this.props.categories);
            if (item.value === '') {
              this.setState({renderCategories: data});
            } else {
              this.setState({renderCategories: data.filter(cat => cat.cType === item.value)});
            }
          }}
        />
        <label className={s.selectionLabel} htmlFor={`filter_${item.name}`}><span><span></span></span><span>{item.name}</span></label>
      </div>
    ))
  }

  render() {
    const { user } = this.props;
    const { add, edit, categoryId } = this.props.params;
    const { renderCategories } = this.state;
    const categorySelections = [{value: 'category', name: 'Category only'}, {value: "sub-category", name: 'Sub-category only'}, {value: "", name: 'Both'}];

    return (
      <div className={s.adminCategories}>
        <Header title="Category Management" />
        <Container>
          {isAdmin(user) && add && (
            <AdminCategoriesForm updateCategoryList={() => this.updateCategoryList()}/>
          )}

          {isAdmin(user) && edit && (
            <AdminCategoriesForm
              edit={true}
              categoryId={categoryId}
              updateCategoryList={() => this.updateCategoryList()}
            />
          )}

          {isAdmin(user) && !add && !edit && (
            <div>
              <div className={s.addLink}>
                <Link
                  className={cx('btn', 'btn-primary')}
                  to="/admin-categories/add">
                  New Category
                </Link>
              </div>

              <div>
                {this.renderFilterSelections(categorySelections)}
              </div>

              {renderCategories && (
                <AutoSizer disableHeight>
                  {({width}) => (
                    <Table
                      className={s.tableList}
                      height={400}
                      width={width}

                      headerClassName={s.tableListHeader}
                      headerHeight={30}

                      noRowsRenderer={() => (<div>No data</div>)}
                      rowHeight={50}
                      rowClassName={({index}) => index % 2 === 0 ? s.tableListEvenRow : null}
                      rowCount={renderCategories.length}
                      rowGetter={({index}) => renderCategories[index]}
                      >
                      <Column
                        label="cType"
                        headerRenderer={({label}) => <div className={s.headerLabel}>{label}</div>}
                        dataKey="cType"
                        width={130}
                        />
                      <Column
                        label="name"
                        headerRenderer={({label}) => <div className={s.headerLabel}>{label}</div>}
                        dataKey="name"
                        width={250}
                        />
                      <Column
                        label="order"
                        headerRenderer={({label}) => <div className={s.headerLabel}>{label}</div>}
                        dataKey="order"
                        width={60}
                        />
                      <Column
                        label="popularity"
                        headerRenderer={({label}) => <div className={s.headerLabel}>{label}</div>}
                        dataKey="popularity"
                        width={100}
                        />
                      <Column
                        label="view"
                        headerRenderer={({label}) => <div className={s.headerLabel}>{label}</div>}
                        dataKey="_id"
                        cellRenderer={({cellData}) => (
                          <div>
                            <Link className={cx('btn', s.tableListBtn, s.orange)} to={`/admin-categories/edit/${cellData}`}>
                              Edit
                            </Link>
                            <Link className={cx('btn', s.tableListBtn, s.red)} to={`/admin-categories/edit/${cellData}`}>
                              Delete
                            </Link>
                          </div>
                        )}
                        disableSort={true}
                        width={170}
                        />
                      <Column
                        label="description"
                        headerRenderer={({label}) => <div className={s.headerLabel}>{label}</div>}
                        dataKey="description"
                        disableSort={true}
                        width={400}
                        />
                    </Table>
                  )}
                </AutoSizer>
              )}

            </div>
          )}

        </Container>
      </div>
    );
  }
}

AdminCategories.propTypes = {
};

const mapStateToProps = (state) => ({
  user: state.user.data,
  services: state.services.data,
  categories: state.services.categories,
});

const mapDispatchToProps = (dispatch) => ({
  fetchServices: () => dispatch(fetchServices()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminCategories);
