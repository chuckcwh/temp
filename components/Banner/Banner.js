import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import classNames from 'classnames';
import Select from 'react-select';
import Loader from 'react-loader';
import 'react-select/dist/react-select.css';
import s from './Banner.css';
import Link from '../Link';
import { fetchServices, getRankedServices, setOrderService, setLastPage, showAlertPopup } from '../../actions';
import history from '../../core/history';
import util from '../../core/util';

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
    this.props.getRankedServices();
  }

  render() {
    let serviceOptions = [];
    const { allServices, allServicesFetching, rankedServices, rankedServicesFetching } = this.props;

    return (
      <div className={s.banner}>
        <div className={s.sliderWrapper}>
          <Slider dots={true} infinite={true} speed={1000} autoplay={true} autoplaySpeed={10000} slidesToShow={1} slidesToScroll={1} arrows={false}>
            <div className={classNames(s.bannerBg, s.bannerBg0)}>
              <div className={s.bannerBgText}>GERIATRIC CARE</div>
            </div>
            <div className={classNames(s.bannerBg, s.bannerBg1)}>
              <div className={s.bannerBgText}>MOTHER CARE</div>
            </div>
          </Slider>
        </div>
        <div className={classNames(s.bannerItem, s.bannerItem1)}>
          <div className={classNames(s.bannerItemTextWrapper, 'text-center')}>
            <div className={classNames(s.bannerItemText, s.bannerItemText1)}>The Best Homecare Option</div>
            <div className={classNames(s.bannerItemText, s.bannerItemText2)}>Family Caregivers</div>
            <div className={classNames(s.bannerItemText, s.bannerItemText3)}>From SGD 30 / Visit</div>
            <div className={s.bannerItemSearch}>
              <div className={s.bannerItemInput}>
                <Loader className="spinner" loaded={!rankedServicesFetching}>
                  <Select
                    name="service-search"
                    placeholder="Select Service"
                    value={(this.state.option && this.state.option.value) ? this.state.option.value : this.state.option}
                    onChange={(val) => this.setState({option: val})}
                    options={rankedServices && rankedServices.map(service => { return { label: service.name, value: service.id } })}
                  />
                </Loader>
              </div>
              {!rankedServicesFetching && <a href="/booking1" className={classNames('btn', 'btn-secondary', s.bannerItemButton)} onClick={this._onClickSubmit.bind(this)}>FIND A CAREGIVER</a>}
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
      this.props.setOrderService(parseInt(this.state.option));
      util.isNextLastPage('booking1', this.props.lastPage) && this.props.setLastPage('booking1');

      history.push({ pathname: '/booking2' });
    } else {
      this.props.showAlertPopup('Please select a service.');
    }
  }
}

const mapStateToProps = (state) => {
  return {
    allServices: state.allServices.data,
    allServicesFetching: state.allServices.isFetching,
    rankedServices: state.rankedServices.data,
    rankedServicesFetching: state.rankedServices.isFetching,
    lastPage: state.lastPage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchServices: () => {
      return dispatch(fetchServices());
    },
    getRankedServices: () => {
      return dispatch(getRankedServices());
    },
    setOrderService: (service) => {
      return dispatch(setOrderService(service));
    },
    setLastPage: (page) => {
      return dispatch(setLastPage(page));
    },
    showAlertPopup: (msg) => {
      return dispatch(showAlertPopup(msg));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Banner);
