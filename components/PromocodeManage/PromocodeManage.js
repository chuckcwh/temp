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
import { InfiniteLoader, VirtualScroll } from 'react-virtualized';
import { getPromos } from '../../actions';
// Sub Component
import PromocodeManageAddForm from './PromocodeManageAddForm/PromocodeManageAddForm';


class PromocodeManage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      pageIndex: 1,
      itemsPerLoading: 2,

      loadedRowsMap: {},
      loadedRowCount: 0,
      loadingRowCount: 0,
      renderScrollToIndex: null,
    }
  }

  isRowLoaded = ({index}) => {
    const {loadedRowsMap} = this.state;
    return !!loadedRowsMap[index];
  };

  loadMoreRows = ({startIndex, stopIndex}) => {
    const { pageIndex, itemPerLoading } = this.state;

    this.
    this.props.getPromos({
      count: itemsPerLoading,
      page: pageIndex,
      sorting: null,
    });
    this.setState({pageIndex: pageIndex + 1})
  };

  render() {
    const { add } = this.props.params;
    const { user, promos } = this.props;
    const { pageIndex, loadedRowCount, loadingRowCount, randomScrollToIndex } = this.state;

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
                isRowLoaded={this.isRowLoaded}
                loadMoreRows={this.loadMoreRows}
                rowCount={10000}
              >
                {({ onRowsRendered, registerChild }) => {
                  <VirtualScroll
                    ref={registerChild}
                    width={300}
                    height={200}
                    onRowsRendered={onRowsRendered}
                    rowCount={promos.length}
                    rowHeight={20}
                    rowRenderer={
                      ({index}) => promos[index].name
                    }
                  />
                }}
              </InfiniteLoader>


              <div>

              </div>
            </div>
          )}

        </Container>
      </div>
    );
  }
}

PromocodeManage.propTypes = {
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
};

const mapStateToProps = (state) => ({
  user: state.user.data,
  promos: state.promos.data,
});

const mapDispatchToProps = (dispatch) => ({
  getPromos: (params) => dispatch(getPromos(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PromocodeManage);
