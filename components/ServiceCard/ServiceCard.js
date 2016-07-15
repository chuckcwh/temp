import React, { Component } from 'react';
import Loader from 'react-loader';
import s from './ServiceCard.css';
import LabelButton from '../LabelButton';
import reduce from 'lodash/reduce';

/* Reusable Component */
export default class ServiceCard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: 0
    };
  }

  render() {
    const { serviceGroup, allServices, allServicesFetching } = this.props;
    const service = reduce(serviceGroup, (result, value) => {
      result['name'] = value['name'];
      result['description'] = value['description'];
      (result['id'] || (result['id'] = [])).push(value['id']);
      (result['duration'] || (result['duration'] = [])).push(value['duration']);
      (result['price'] || (result['price'] = [])).push(value['price']);
      return result;
    }, {});
    return (
      <div className={s.serviceCard}>
        <Loader className="spinner" loaded={allServicesFetching ? false : true}>
          <h3 className={s.serviceCardTitle}>{service.name}</h3>
          <div className={s.serviceCardBody}>
            <div className={s.serviceCardBodyDescription}>{service.description}</div>
            <div className={s.serviceCardBodyPrice}>{`Starting from SGD ${service.price[this.state.selected]}`}</div>
            <div className={s.serviceCardBodyDuration}>
              <span>Duration: </span>
              {
                service.duration.map((duration, key) => {
                  return (
                    <LabelButton selected={this.state.selected === key} onClick={() => { this.setState({ selected: key }) }} key={service.id[this.state.selected]}>{`${parseFloat(duration)} hr${duration > 1 ? 's' : ''}`}</LabelButton>
                  );
                })
              }
            </div>
            <div className={s.serviceCardBodyFooter}>
              <button className="btn btn-primary btn-small" onClick={(e) => { this.props.onBook(service.id[this.state.selected], e) }}>Book Service</button>
            </div>
          </div>
        </Loader>
      </div>
    );
  }

}

ServiceCard.propTypes = {
  serviceGroup: React.PropTypes.array.isRequired,
  allServices: React.PropTypes.object.isRequired,
  allServicesFetching: React.PropTypes.bool.isRequired,
  onBook: React.PropTypes.func
};

ServiceCard.defaultProps = {
  onBook: () => {}
};

export default ServiceCard;
