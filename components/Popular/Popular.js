import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import classNames from 'classnames';
import s from './Popular.css';
import Container from '../Container';
import Link from '../Link';
import { fetchServices } from '../../actions';

class Popular extends Component {

  componentDidMount() {
    this.props.fetchServices();
  }

  render() {
    const { services, servicesIsFetching, categories } = this.props;
    const rankedCategories = categories && Object.values(categories).sort((a, b) => {
      return b.popularity - a.popularity;
    }).slice(0, 8);
    return (
      <div className={s.popular}>
        <Container>
          <h1 className="text-center">Popular Services</h1>
          <Loader className="spinner" loaded={!servicesIsFetching}>
            <div className={s.popularList}>
              {
                rankedCategories && rankedCategories.map((category, index) => {
                  return (
                    <div className={classNames(s.popularItem, (index === 7 ? s.lastItem : undefined))} key={category._id}>
                      <Link to={`/services/${category.slug ? category.slug : category.id}`}>
                        <div className={classNames('service-icon', category.iconClassName)}></div>
                      </Link>
                      <Link to={`/services/${category.slug ? category.slug : category.id}`}>
                        <div className={s.popularItemTitle}>{category.name}</div>
                      </Link>
                    </div>
                  );
                })
              }
              <div className={classNames(s.popularItem, s.popularItemQuestion)}>
                <Link to="/services">
                  <div className="service-icon questionmark"></div>
                </Link>
                <Link to="/services">
                  <div className={s.popularItemTitle}>Still not sure what you need?</div>
                </Link>
              </div>
            </div>
          </Loader>
        </Container>
      </div>
    );
  }

}

Popular.propTypes = {
  services: React.PropTypes.object,
  servicesIsFetching: React.PropTypes.bool,
  categories: React.PropTypes.object,
  
  fetchServices: React.PropTypes.func,
};

const mapStateToProps = (state) => ({
  services: state.services.data,
  servicesIsFetching: state.services.isFetching,
  categories: state.services.categories,
});

const mapDispatchToProps = (dispatch) => ({
  fetchServices: () => dispatch(fetchServices()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Popular);
