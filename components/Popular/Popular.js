import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import './Popular.scss';
import Container from '../Container';
import Link from '../Link';
import { getRankedSubcategories } from '../../actions';
import Location from '../../core/Location';
import Util from '../../core/Util';

class Popular extends Component {

  componentDidMount() {
    this.props.getRankedSubcategories();
  }

  render() {
    const { rankedSubcategories, rankedSubcategoriesFetching } = this.props;
    return (
      <div className="Popular">
        <Container>
          <h1 className="text-center">Popular Services</h1>
          <Loader className="spinner" loaded={!rankedSubcategoriesFetching}>
            <div className="Popular-list">
              {
                rankedSubcategories && rankedSubcategories.map((subcategory, index) => {
                  const subcatClass = Util.getServiceIconClass(subcategory.id);
                  return (
                    <div className={'Popular-item' + (index === 7 ? ' last-item' : '')} key={subcategory.id}>
                      <a href={'/services?subcat=' + subcategory.id} onClick={this._onClickSubcat.bind(this, {subcat: subcategory, subcatClass: subcatClass, rankedSubcategories: rankedSubcategories})}><div className={'service-icon ' + subcatClass}></div></a>
                      <a href={'/services?subcat=' + subcategory.id} onClick={this._onClickSubcat.bind(this, {subcat: subcategory, subcatClass: subcatClass, rankedSubcategories: rankedSubcategories})}><div className="Popular-item-title">{subcategory.name}</div></a>
                    </div>
                  )
                })
              }
              <div className="Popular-item Popular-item-question">
                <a href='/services' onClick={this._onClickAllServices.bind(this)}><div className="service-icon questionmark"></div></a>
                <a href='/services' onClick={this._onClickAllServices.bind(this)}><div className="Popular-item-title">Still not sure what you need?</div></a>
              </div>
            </div>
          </Loader>
        </Container>
      </div>
    );
  }

  _onClickSubcat(state, event) {
    event.preventDefault();

    Location.push({ pathname: '/services', query: { subcat: state.subcat.id } });
  }

  _onClickAllServices(event) {
    event.preventDefault();

    Location.push({ pathname: '/services'});
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
