import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import './Popular.scss';
import Container from '../Container';
import Link from '../Link';
import { getRankedSubcategories } from '../../actions';
import Location from '../../core/Location';

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
                rankedSubcategories && rankedSubcategories.map((subcategory) => {
                  let subcatClass;
                  switch (subcategory.id) {
                    case 11:
                      subcatClass = 'headheart';
                      break;
                    case 13:
                      subcatClass = 'elderly';
                      break;
                    case 14:
                      subcatClass = 'needle';
                      break;
                    case 15:
                      subcatClass = 'drip';
                      break;
                    case 27:
                      subcatClass = 'housecall';
                      break;
                    case 17:
                      subcatClass = 'syringe';
                      break;
                    case 20:
                      subcatClass = 'diabetic';
                      break;
                    case 21:
                      subcatClass = 'bandage';
                      break;
                    case 23:
                      subcatClass = 'report';
                      break;
                    case 24:
                      subcatClass = 'headdots';
                      break;
                    case 27:
                      subcatClass = 'housecall';
                      break;
                    case 29:
                      subcatClass = 'stethoscope';
                      break;
                    case 30:
                      subcatClass = 'headheart';
                      break;
                    case 31:
                      subcatClass = 'heart';
                      break;
                    default:
                      subcatClass = 'ebeecare';
                  }
                  return (
                    <div className="Popular-item" key={subcategory.id}>
                      <a href={'/services?subcat=' + subcategory.id} onClick={this._onClickSubcat.bind(this, {subcat: subcategory, subcatClass: subcatClass, rankedSubcategories: rankedSubcategories})}><div className={'service-icon ' + subcatClass} /></a>
                      <a href={'/services?subcat=' + subcategory.id} onClick={this._onClickSubcat.bind(this, {subcat: subcategory, subcatClass: subcatClass, rankedSubcategories: rankedSubcategories})}><div className="Popular-item-title">{subcategory.name}</div></a>
                    </div>
                  )
                })
              }
              <div className="Popular-item Popular-item-question">
                <div className="Popular-item-question-icon">
                  <img src={require('../../assets/images/question-mark-icon.png')} />
                </div>
                <div className="Popular-item-title">Still not sure what you need?</div>
              </div>
            </div>
          </Loader>
        </Container>
      </div>
    );
  }

  _onClickSubcat(state, event) {
    event.preventDefault();

    Location.push({ pathname: '/services', query: { subcat: state.subcat.id }, state: {subcatClass: state.subcatClass, rankedSubcategories: state.rankedSubcategories} });
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
