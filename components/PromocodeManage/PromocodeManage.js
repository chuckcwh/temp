import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import 'react-virtualized/styles.css';
import s from './PromocodeManage.css';
import Container from '../Container';
import Link from '../Link';
import Header from '../Header';
import history from '../../core/history';
import { InfiniteLoader, AutoSizer, List, Table, Column } from 'react-virtualized';
import { getPromos } from '../../actions';
// Sub Component
import PromocodeManageAddForm from './PromocodeManageAddForm/PromocodeManageAddForm';


const STATUS_LOADING = 1
const STATUS_LOADED = 2

class PromocodeManage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loadedRowsMap: {},
      loadedRowCount: 0,
      loadingRowCount: 0,
      renderScrollToIndex: null,
    }

    this.loadMoreRows = this.loadMoreRows.bind(this);
  }

  async loadMoreRows({startIndex, stopIndex}) {
    // const {loadedRowsMap, loadingRowCount} = this.state;
    //
    // const increment = stopIndex - startIndex + 1;
    //
    // for (var i = startIndex; i <= stopIndex; i++) {
    //   loadedRowsMap[i] = STATUS_LOADING;
    // }
    //
    // this.setState({
    //   loadingRowCount: loadingRowCount + increment
    // })

    return await this.props.getPromos({
      count: 5,
      page: 1,
    });

  }

  rowRenderer = ({index, key, style}) => {
    const {promos} = this.props;
    console.log('index', index);
    console.log('promos', promos);

    return promos
  }

  render() {
    const { add } = this.props.params;
    const { user, promos } = this.props;
    const { loadedRowCount, loadingRowCount, randomScrollToIndex, loadedRowsMap } = this.state;

    return (
      <div className={s.promocodeManage}>
        <Header title="PromoCode Management" />
        <Container>

          {user && add && <PromocodeManageAddForm />}

          {user && !add && (
            <div>
              <div className={s.addLink}>
                <Link
                  className={cx('btn', 'btn-primary')}
                  to="/promocode-manage/add">
                  New Promo Code
                </Link>
              </div>

              <InfiniteLoader
                isRowLoaded={({index}) => !!loadedRowsMap[index]}
                loadMoreRows={this.loadMoreRows}
                rowCount={promos.length ? promos.total : 1}
              >
                {({ onRowsRendered, registerChild }) => (

                  <Table
                    ref='Table'
                    width={500}
                    height={200}
                    headerHeight={20}
                    noRowsRenderer={() => <div>No data</div>}
                    rowHeight={30}
                    rowCount={promos.length ? promos.total : 1}
                    rowGetter={({index}) => promos.length ? promos[index] : {}}
                    rowRenderer={this.rowRenderer}
                  >
                    <Column
                      label='code'
                      dataKey='code'
                      width={100}
                    />
                    <Column
                      label='name'
                      dataKey='name'
                      width={100}
                    />
                  </Table>

                )}
              </InfiniteLoader>


            </div>
          )}

        </Container>
      </div>
    );
  }
}

PromocodeManage.propTypes = {
};

const mapStateToProps = (state) => ({
  user: state.user.data,
  promos: state.promos.data || [],
});

const mapDispatchToProps = (dispatch) => ({
  getPromos: (params) => dispatch(getPromos(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PromocodeManage);
