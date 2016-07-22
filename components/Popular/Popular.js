import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import classNames from 'classnames';
import s from './Popular.css';
import Container from '../Container';
import Link from '../Link';
import { getRankedSubcategories } from '../../actions';
import util from '../../core/util';

class Popular extends Component {

  componentDidMount() {
    this.props.getRankedSubcategories();
  }

  render() {
    const { rankedSubcategories, rankedSubcategoriesFetching } = this.props;
    return (
      <div className={s.popular}>
        <Container>
          <h1 className="text-center">Popular Services</h1>
          <Loader className="spinner" loaded={!rankedSubcategoriesFetching}>
            <div className={s.popularList}>
              {
                rankedSubcategories && rankedSubcategories.map((subcategory, index) => {
                  const subcatClass = util.getServiceIconClass(subcategory.id);
                  return (
                    <div className={s.popularItem + (index === 7 ? ' ' + s.lastItem : '')} key={subcategory.id}>
                      <Link to={`/services/${subcategory.slug ? subcategory.slug : subcategory.id}`}><div className={'service-icon ' + subcatClass}></div></Link>
                      <Link to={`/services/${subcategory.slug ? subcategory.slug : subcategory.id}`}><div className={s.popularItemTitle}>{subcategory.name}</div></Link>
                    </div>
                  )
                })
              }
              <div className={classNames(s.popularItem, s.popularItemQuestion)}>
                <Link to='/services'><div className="service-icon questionmark"></div></Link>
                <Link to='/services'><div className={s.popularItemTitle}>Still not sure what you need?</div></Link>
              </div>
            </div>
          </Loader>
        </Container>
      </div>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    rankedSubcategories: state.rankedSubcategories.data && state.rankedSubcategories.data.slice(0, 8),
    rankedSubcategoriesFetching: state.rankedSubcategories.isFetching
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getRankedSubcategories: () => {
      return dispatch(getRankedSubcategories());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Popular);
