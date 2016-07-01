import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import classNames from 'classnames';
import Select from 'react-select';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './Banner.scss';
import Link from '../Link';
import { fetchServices } from '../../actions';
import Location from '../../core/Location';
import Loader from 'react-loader';

const bgImagesCount = 2;

class Banner extends Component {

  constructor(props) {
    super(props);
    this.state = {
      bgImageIndex: 0,
      bgImages: [0],
      option: null
    };
  }

  componentWillReceiveProps(props) {
    const { allServices } = props;
  }

  componentDidMount() {
    // this._startSlideshow();
    this.props.fetchServices();
  }

  render() {
    let serviceOptions = [];
    const { allServices, allServicesFetching } = this.props;
    if(allServices) {
      const allServicesArr = Object.values(allServices);
      allServicesArr.forEach((service) => {
        let serviceOption = {}
        serviceOption.label = service.name;
        serviceOption.value = service.id;
        serviceOptions.push(serviceOption);
      });
    }

    return (
      <div className="Banner">
        <div className="SliderWrapper">
          <Slider dots={true} infinite={true} speed={1000} autoplay={true} autoplaySpeed={10000} slidesToShow={1} slidesToScroll={1} arrows={false}>
            <div className={classNames('Banner-bg', 'Banner-bg-0')}>
              <div className="Banner-bg-text">GERIATRIC CARE</div>
            </div>
            <div className={classNames('Banner-bg', 'Banner-bg-1')}>
              <div className="Banner-bg-text">MOTHER CARE</div>
            </div>
          </Slider>
        </div>
        <div className="Banner-item" id="Banner-item-1">
          <div className="Banner-item-text-wrapper text-center">
            <div className="Banner-item-text Banner-item-text-1">The Best Homecare Option</div>
            <div className="Banner-item-text Banner-item-text-2">Family Caregivers</div>
            <div className="Banner-item-text Banner-item-text-3">From SGD 30 / Visit</div>
            <div className="Banner-item-search">
              <div className="Banner-item-input">
                <Loader className="spinner" loaded={!allServicesFetching}>
                  <Select
                    name="service-search"
                    placeholder="Select service"
                    value={this.state.option ? this.state.option.value : this.state.option}
                    onChange={(val) => this.setState({option: val})}
                    options={serviceOptions}
                  />
                </Loader>
              </div>
              <a href="/booking1" className="btn btn-secondary Banner-item-button" onClick={this._onClickSubmit.bind(this)}>FIND A CAREGIVER</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  _startSlideshow() {
    window.setInterval(this._swopSlide.bind(this), 10000);
  }

  _swopSlide() {
    var newBgImageIndex = ((this.state.bgImageIndex + 1) % bgImagesCount);
    var newBgImages = this.state.bgImages.slice();
    newBgImages.splice(0, 1, newBgImageIndex);
    this.setState({
      bgImageIndex: newBgImageIndex,
      bgImages: newBgImages
    });
  }

  _onClickSubmit(event) {
    event.preventDefault();

    if (this.state.option) {
      Location.push({ pathname: '/booking1', query: {sid: this.state.option.value} });
    }
  }
}

const mapStateToProps = (state) => {
  return {
    allServices: state.allServices.data,
    allServicesFetching: state.allServices.isFetching
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchServices: () => {
      return dispatch(fetchServices());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Banner);
