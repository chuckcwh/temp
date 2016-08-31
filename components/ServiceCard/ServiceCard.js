import React, { Component } from 'react';
import Loader from 'react-loader';
import s from './ServiceCard.css';
import LabelButton from '../LabelButton';
import reduce from 'lodash/reduce';

/* Reusable Component */
class ServiceCard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: 0,
    };
  }

  render() {
    const { service, servicesFetching } = this.props;
    return (
      <div className={s.serviceCard}>
        <Loader className="spinner" loaded={!servicesFetching}>
          <h3 className={s.serviceCardTitle}>{service.name}</h3>
          <div className={s.serviceCardBody}>
            <div className={s.serviceCardBodyDescription}>{service.description}</div>
            <div className={s.serviceCardBodyPrice}>{`Starting from SGD ${service && service.classes && service.classes[this.state.selected] && service.classes[this.state.selected].price}`}</div>
            <div className={s.serviceCardBodyDuration}>
              <span>Duration: </span>
              {
                service && service.classes && service.classes.map((serviceClass, index) => (
                  <LabelButton
                    selected={this.state.selected === index}
                    onClick={() => { this.setState({ selected: index }); }}
                    key={serviceClass._id}
                  >
                    {`${parseFloat(serviceClass.duration)} hr${serviceClass.duration > 1 ? 's' : ''}`}
                  </LabelButton>
                ))
              }
            </div>
            <div className={s.serviceCardBodyFooter}>
              <button
                className="btn btn-primary btn-small"
                onClick={this.props.onBook(service._id, this.state.selected)}
              >Book Service</button>
            </div>
          </div>
        </Loader>
      </div>
    );
  }

}

ServiceCard.propTypes = {
  service: React.PropTypes.object.isRequired,
  servicesFetching: React.PropTypes.bool.isRequired,
  onBook: React.PropTypes.func,
};

ServiceCard.defaultProps = {
  onBook: () => {},
};

export default ServiceCard;
