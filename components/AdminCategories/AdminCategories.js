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
import { InfiniteLoader, AutoSizer, Table, Column } from 'react-virtualized';
import { getPromos } from '../../actions';
// react-icons
import FaCaretDown from 'react-icons/lib/fa/caret-down';
import FaCaretSquareODown from 'react-icons/lib/fa/caret-square-o-down';
import FaCaretSquareOUp from 'react-icons/lib/fa/caret-square-o-up';


const filterChoice = ['code', 'name'];

class AdminCategories extends Component {

  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      sortDirection: {},
      filterKwd: null,
      filterField: filterChoice[0],
    }
  }

  componentDidMount() {
    this.props.getPromos({
      count: 10,
      page: this.state.page,
    });
  }

  isRowLoaded = ({ index }) => {
    return !!Object.values(this.props.promos)[index];
  }

  loadMoreRows = ({startIndex, stopIndex}) => {
    const { sortDirection, filterKwd, filterField } = this.state;
    this.setState({page: this.state.page + 1});

    const data = {
      count: 10,
      page: this.state.page,
    }

    if (Object.keys(sortDirection).length !== 0) {
      data['sorting'] = sortDirection;
    }
    if (filterKwd) {
      data['filter'] = {[filterField]: filterKwd};
    }

    return this.props.getPromos(data, true);
  }

  setHeaderLabel = ({dataKey, label}) => {
    const {sortDirection} = this.state;
    const arrow = sortDirection[dataKey] === 1 ? <FaCaretSquareODown /> : sortDirection[dataKey] === -1 ? <FaCaretSquareOUp />  : <FaCaretDown />;
    return (
      <div>{label}  {arrow}</div>
  )}

  onFilterData = (e) => {
    e.preventDefault();

    const { sortDirection, filterField } = this.state;
    const { value } = e.target;
    this.setState({page: 1, filterKwd: value});

    const data = {
      count: 10,
      page: 1,
      filter: {[filterField]: value},
    }

    if (Object.keys(sortDirection).length !== 0) {
      data['sorting'] = sortDirection;
    }

    this.props.getPromos(data);
  }

  onClearSortFilter = () => {
    this.setState({
      page: 1,
      sortDirection: {},
      filterKwd: null,
      filterField: filterChoice[0],
    });

    this.refs.filterField.value = filterChoice[0];
    this.refs.filterKwd.value = "";
    this.props.getPromos({
      count: 10,
      page: 1,
    });
  }

  render() {
    const { add, edit, promoId } = this.props.params;
    const { user, promos } = this.props;
    const { sortDirection, filterField, filterKwd } = this.state;

    return (
      <div className={s.adminCategories}>
        <Header title="Category Management" />
        <Container>

          {user && add && <AdminCategoriesForm />}

          {user && edit && <AdminCategoriesForm edit={true} promoId={promoId} />}

          {user && !add && !edit && (
            <div>
              <div className={s.addLink}>
                <Link
                  className={cx('btn', 'btn-primary')}
                  to="/admin-promocodes/add">
                  New Promo Code
                </Link>
              </div>

              <div className={s.filter}>
                <div className={s.inlineField}>
                  <div className={cx("select", s.filterInput)}>
                    <span></span>
                    <select ref="filterField" className={s.filterInputInner} name={filterField} onChange={(e) => this.setState({filterField: e.target.value})}>
                      {filterChoice && filterChoice.map(item => (
                        <option key={filterChoice.indexOf(item)} value={item}>{item}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className={s.inlineField}>
                  <input ref="filterKwd" type="text" className={s.textInput} placeholder="Filter keyword" onChange={this.onFilterData} />
                </div>
                <div className={s.inlineField}>
                  <span type="text" className={s.clearSortFilter} onClick={this.onClearSortFilter}>
                    clear sort & filter
                  </span>
                </div>
              </div>

              <InfiniteLoader
                isRowLoaded={this.isRowLoaded}
                loadMoreRows={this.loadMoreRows}
                rowCount={10000}
              >
                {({ onRowsRendered, registerChild }) => (

                  <AutoSizer disableHeight>
                    {({width}) => (
                      <Table
                        ref={registerChild}
                        className={s.tableList}
                        height={400}
                        width={width}

                        headerClassName={s.tableListHeader}
                        headerHeight={30}
                        sort={({sortBy}) => {
                          this.props.getPromos({
                            count: 10,
                            page: 1,
                            sorting: {...sortDirection, [sortBy]: sortDirection[sortBy] === -1 ? 1 : sortDirection[sortBy] === 1 ? -1 : -1},
                          });
                          this.setState({page: 1, sortDirection: {...sortDirection, [sortBy]: sortDirection[sortBy] === -1 ? 1 : sortDirection[sortBy] === 1 ? -1 : -1}});
                        }}

                        onRowsRendered={onRowsRendered}
                        noRowsRenderer={() => (<div>No data</div>)}
                        rowHeight={50}
                        rowClassName={s.tableListRow}
                        rowCount={Object.values(promos).length}
                        rowGetter={({index}) => Object.values(promos)[index]}
                      >
                        <Column
                          label="#code"
                          headerRenderer={this.setHeaderLabel}
                          dataKey="code"
                          width={150}
                        />
                        <Column
                          label="name"
                          headerRenderer={this.setHeaderLabel}
                          dataKey="name"
                          width={150}
                        />
                        <Column
                          label="label"
                          headerRenderer={this.setHeaderLabel}
                          dataKey="isActive"
                          cellRenderer={({cellData}) => cellData ? (
                            <div className={s.tableListRadio}>
                              Active
                            </div>
                          ) : null}
                          width={100}
                        />
                        <Column
                          label="start"
                          headerRenderer={this.setHeaderLabel}
                          dataKey="dateTimeStart"
                          cellRenderer={({rowData}) => moment(rowData.dateTimeStart).format('YYYY-MM-DD')}
                          width={130}
                        />
                        <Column
                          label="end"
                          headerRenderer={this.setHeaderLabel}
                          dataKey="dateTimeEnd"
                          cellRenderer={({rowData}) => moment(rowData.dateTimeEnd).format('YYYY-MM-DD')}
                          width={130}
                        />
                        <Column
                          label="discount"
                          headerRenderer={this.setHeaderLabel}
                          dataKey="discountRate"
                          cellRenderer={({rowData}) => `${rowData.discountRate} ${rowData.discountType}`}
                          width={150}
                        />
                        <Column
                          label="view"
                          headerRenderer={({label}) => <div className={s.headerLabel}>{label}</div>}
                          dataKey="_id"
                          cellRenderer={({cellData}) => (
                              <Link className={cx('btn', s.tableListToEdit)} to={`/admin-promocodes/edit/${cellData}`}>
                                Edit
                              </Link>
                          )}
                          disableSort={true}
                          width={100}
                        />
                        <Column
                          label="description"
                          headerRenderer={({label}) => <div className={s.headerLabel}>{label}</div>}
                          dataKey="description"
                          disableSort={true}
                          width={500}
                        />
                      </Table>
                    )}
                  </AutoSizer>
                )}
              </InfiniteLoader>

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
  promos: state.promos.data,
});

const mapDispatchToProps = (dispatch) => ({
  getPromos: (params, extend) => dispatch(getPromos(params, extend)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminCategories);
