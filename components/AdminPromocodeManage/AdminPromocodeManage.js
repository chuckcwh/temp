import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import 'react-virtualized/styles.css';
import s from './AdminPromocodeManage.css';
import Container from '../Container';
import Link from '../Link';
import Header from '../Header';
import { InfiniteLoader, AutoSizer, Table, Column } from 'react-virtualized';
import { getPromos } from '../../actions';
// Sub Component
import AdminPromocodeManageForm from './AdminPromocodeManageForm/AdminPromocodeManageForm';


class AdminPromocodeManage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      page: 1,
    }
  }

  componentDidMount() {
    this.props.getPromos({
      count: 7,
      page: this.state.page,
    }, true);
  }

  isRowLoaded = ({ index }) => {
    return !!Object.values(this.props.promos)[index];
  };

  loadMoreRows = ({startIndex, stopIndex}) => {
    this.setState({page: this.state.page + 1});

    return this.props.getPromos({
      count: 7,
      page: this.state.page,
    }, true);
  }

  render() {
    const { add, edit, promoId } = this.props.params;
    const { user, promos } = this.props;

    return (
      <div className={s.adminPromocodeManage}>
        <Header title={add && "Add PromoCode" || edit && "Edit PromoCode" || "PromoCode Management"} />
        <Container>

          {user && add && <AdminPromocodeManageForm />}

          {user && edit && <AdminPromocodeManageForm edit={true} promoId={promoId} />}

          {user && !add && !edit && (
            <div>
              <div className={s.addLink}>
                <Link
                  className={cx('btn', 'btn-primary')}
                  to="/promocode-manage/add">
                  New Promo Code
                </Link>
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
                          console.log('sortBy', sortBy);
                          this.setState({page: 1});
                          this.props.getPromos({
                            count: 7,
                            page: 1,
                            sorting: {sortBy: 1},
                          }, false);
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
                          dataKey="code"
                          width={150}
                        />
                        <Column
                          label="name"
                          dataKey="name"
                          width={150}
                        />
                        <Column
                          label="label"
                          dataKey="isActive"
                          cellRenderer={({cellData}) => cellData ? (
                            <div className={s.tableListRadio}>
                              Active
                            </div>
                          ) : null}
                          width={80}
                        />
                        <Column
                          label="start"
                          dataKey="dateTimeStart"
                          cellRenderer={({rowData}) => moment(rowData.dateTimeStart).format('YYYY-MM-DD')}
                          width={130}
                        />
                        <Column
                          label="end"
                          dataKey="dateTimeEnd"
                          cellRenderer={({rowData}) => moment(rowData.dateTimeEnd).format('YYYY-MM-DD')}
                          width={130}
                        />
                        <Column
                          label="discount"
                          dataKey="discountRate"
                          cellRenderer={({rowData}) => `${rowData.discountRate} ${rowData.discountType}`}
                          width={120}
                        />
                        <Column
                          label="view"
                          dataKey="_id"
                          cellRenderer={({cellData}) => {
                            return (
                              <Link className={cx('btn', s.tableListToEdit)} to={`/promocode-manage/edit/${cellData}`}>
                                Edit
                              </Link>
                          )}}
                          width={100}
                        />
                        <Column
                          label="description"
                          dataKey="description"
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

AdminPromocodeManage.propTypes = {
};

const mapStateToProps = (state) => ({
  user: state.user.data,
  promos: state.promos.data,
});

const mapDispatchToProps = (dispatch) => ({
  getPromos: (params, extend) => dispatch(getPromos(params, extend)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminPromocodeManage);
