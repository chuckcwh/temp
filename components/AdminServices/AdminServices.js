import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import 'react-virtualized/styles.css';
import s from './AdminServices.css';
import Container from '../Container';
import Link from '../Link';
import Header from '../Header';
import { isAdmin } from '../../core/util';
import ConfirmPopup from '../ConfirmPopup';
import { AutoSizer, Table, Column } from 'react-virtualized';
import {
  SERVICES_SUCCESS,
  SERVICE_DELETE_SUCCESS,
  fetchServices,
  deleteService,
  showAlertPopup,
  showConfirmPopup,
} from '../../actions';
// sub-component
import AdminServicesForm from './AdminServicesForm/AdminServicesForm';
// react-icons
import FaCaretDown from 'react-icons/lib/fa/caret-down';
import FaCaretSquareODown from 'react-icons/lib/fa/caret-square-o-down';
import FaCaretSquareOUp from 'react-icons/lib/fa/caret-square-o-up';


const filterChoice = ['code', 'name'];

class AdminServices extends Component {

  constructor(props) {
    super(props);

    this.state = {
      renderServices: [],
    }
  }

  componentDidMount() {
    this.updateServiceList();
  }

  updateServiceList() {
    this.props.fetchServices().then(res => {
      if (res.type === SERVICES_SUCCESS) {
        this.setState({renderServices: Object.values(this.props.services)})
      }
    });
  }

  onDeleteService = (serviceId) => {
    const { fields, deleteService } = this.props;

    deleteService({serviceId}).then(res => {
      if (res.type === SERVICE_DELETE_SUCCESS) {
        showAlertPopup('Service delete success!');
        this.updateCategoryList();
      } else {
        showAlertPopup('Service delete failed.');
      }
    });
  }

  renderFilterSelections = (selections) => {
    return selections && selections.map((item, index) => (
      <div className={s.isActiveInput} key={index}>
        <input
          type="radio"
          name="filter_service"
          id={`filter_${item.name}`}
          value={item.value}
          onChange={e => {
            const data = Object.values(this.props.services);
            if (item.value === '') {
              this.setState({renderServices: data});
            } else {
              this.setState({renderServices: data.filter(cat => cat.cType === item.value)});
            }
          }}
        />
        <label className={s.selectionLabel} htmlFor={`filter_${item.name}`}><span><span></span></span><span>{item.name}</span></label>
      </div>
    ))
  }

  render() {
    const { add, edit, serviceId } = this.props.params;
    const { user, showConfirmPopup, categories } = this.props;
    const { renderServices } = this.state;
    const serviceSelections = [];

    return (
      <div className={s.adminServices}>
        <Header title="Service Management" />
        <Container>
          <ConfirmPopup />

          {isAdmin(user) && add && (
            <AdminServicesForm
              updateServiceList={() => this.updateServiceList()}
            />
          )}

          {isAdmin(user) && edit && (
            <AdminServicesForm
              edit={true}
              serviceId={serviceId}
              updateServiceList={() => this.updateServiceList()}
            />
          )}

          {isAdmin(user) && !add && !edit && (
            <div>
              <div className={s.addLink}>
                <Link
                  className={cx('btn', 'btn-primary')}
                  to="/admin-services/add">
                  New Service
                </Link>
              </div>

              <div>
                {this.renderFilterSelections(serviceSelections)}
              </div>

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
                    rowCount={renderServices.length}
                    rowGetter={({index}) => renderServices[index]}
                  >
                    <Column
                      label="parent category"
                      headerRenderer={({label}) => <div className={s.headerLabel}>{label}</div>}
                      dataKey="parentCategory"
                      cellRenderer={({cellData}) => categories[cellData].name}
                      width={200}
                    />
                    <Column
                      label="name"
                      headerRenderer={({label}) => <div className={s.headerLabel}>{label}</div>}
                      dataKey="name"
                      width={200}
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
                          <Link className={cx('btn', s.tableListBtn, s.orange)} to={`/admin-services/edit/${cellData}`}>
                            Edit
                          </Link>
                          <div className={cx('btn', s.tableListBtn, s.red)}
                            onClick={() => showConfirmPopup("Are you sure you want to delete?", this.onDeleteServicey(cellData))}>
                            Delete
                          </div>
                        </div>
                      )}
                      disableSort={true}
                      width={170}
                    />
                    <Column
                      label="description"
                      headerRenderer={({label}) => <div className={s.headerLabel}>{label}</div>}
                      dataKey="description"
                      width={400}
                    />
                  </Table>
                )}
              </AutoSizer>

            </div>
          )}

        </Container>
      </div>
    );
  }
}

AdminServices.propTypes = {
};

const mapStateToProps = (state) => ({
  user: state.user.data,
  services: state.services.data,
  categories: state.services.categories,
});

const mapDispatchToProps = (dispatch) => ({
  fetchServices: () => dispatch(fetchServices()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminServices);
