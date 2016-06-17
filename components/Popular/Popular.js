import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import './Popular.scss';
import Container from '../Container';
import { getRankedSubcategories } from '../../actions';

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
                  return (
                    <div className="Popular-item" key={subcategory.id}>
                      <div className="service-icon heart" />
                      <div className="Popular-item-title">{subcategory.name}</div>
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