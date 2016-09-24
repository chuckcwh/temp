import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import classNames from 'classnames';
import Select from 'react-select';
import Loader from 'react-loader';
import 'react-select/dist/react-select.css';
import s from './Banner.css';
import { fetchServices, setOrderService, setOrderServiceClass, setLastPage, showAlertPopup } from '../../actions';
import history from '../../core/history';
import util from '../../core/util';

const bgImagesCount = 2;

class Banner extends Component {

  constructor(props) {
    super(props);
    this.state = {
      bgImageIndex: 0,
      bgImages: [0],
      option: null,
    };
  }

  componentDidMount() {
    // this.startSlideshow();
    this.props.fetchServices();
  }

  onClickSubmit = (event) => {
    event.preventDefault();

    if (this.state.option) {
      const values = this.state.option.split(':');
      this.props.setOrderService(values[0]);
      this.props.setOrderServiceClass(values[1]);
      util.isNextLastPage('booking1', this.props.lastPage) && this.props.setLastPage('booking1');

      history.push({ pathname: '/booking2' });
    } else {
      this.props.showAlertPopup('Please select a service.');
    }
  };

  swopSlide = () => {
    const newBgImageIndex = ((this.state.bgImageIndex + 1) % bgImagesCount);
    const newBgImages = this.state.bgImages.slice();
    newBgImages.splice(0, 1, newBgImageIndex);
    this.setState({
      bgImageIndex: newBgImageIndex,
      bgImages: newBgImages,
    });
  };

  startSlideshow = () => {
    window.setInterval(this.swopSlide.bind(this), 10000);
  };

  render() {
    const { rankedServices, servicesFetching } = this.props;

    const selectOptions = rankedServices && rankedServices.reduce((result, service) => {
      Object.values(service.classes).forEach((serviceClass) => {
        result.push({
          label: `${service.name} (${parseFloat(serviceClass.duration)} ` +
            `hr${parseFloat(serviceClass.duration) > 1 ? 's' : ''})`,
          value: `${service._id}:${serviceClass._id}`,
        });
      });
      return result;
    }, []) || [];

    return (
      <div className={s.banner}>
        <div className={s.sliderWrapper}>
          <Slider dots infinite speed={1000} autoplay autoplaySpeed={10000} slidesToShow={1} slidesToScroll={1} arrows={false}>
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
                <Loader className="spinner" loaded={!servicesFetching}>
                  <Select
                    placeholder="Select Service"
                    value={(this.state.option && this.state.option.value) ? this.state.option.value : this.state.option}
                    onChange={(val) => this.setState({ option: val })}
                    options={selectOptions}
                  />
                </Loader>
              </div>
              {!servicesFetching &&
                <a
                  href="/booking1"
                  className={classNames('btn', 'btn-secondary', s.bannerItemButton)}
                  onClick={this.onClickSubmit}
                >FIND A CAREGIVER</a>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }

}

Banner.propTypes = {
  services: React.PropTypes.object,
  servicesFetching: React.PropTypes.bool,
  rankedServices: React.PropTypes.array,
  lastPage: React.PropTypes.string,

  fetchServices: React.PropTypes.func,
  setOrderService: React.PropTypes.func,
  setOrderServiceClass: React.PropTypes.func,
  setLastPage: React.PropTypes.func,
  showAlertPopup: React.PropTypes.func,
};

const mapStateToProps = (state) => ({
  services: state.services.data,
  servicesFetching: state.services.isFetching,
  rankedServices: state.services.rankedServices,
  lastPage: state.lastPage,
});

const mapDispatchToProps = (dispatch) => ({
  fetchServices: () => dispatch(fetchServices()),
  setOrderService: (service) => dispatch(setOrderService(service)),
  setOrderServiceClass: (serviceClass) => dispatch(setOrderServiceClass(serviceClass)),
  setLastPage: (page) => dispatch(setLastPage(page)),
  showAlertPopup: (msg) => dispatch(showAlertPopup(msg)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Banner);
