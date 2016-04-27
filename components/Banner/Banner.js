import React, { Component } from 'react';
import classNames from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './Banner.scss';
import Link from '../Link';

const bgImagesCount = 2;

export default class Banner extends Component {

  constructor(props) {
    super(props);
    this.state = {
      bgImageIndex: 0,
      bgImages: []
    };
  }

  componentDidMount() {
    this._startSlideshow();
  }

  render() {
    return (
      <div className="Banner">
        <ReactCSSTransitionGroup transitionName="Banner-bg" transitionEnterTimeout={1000} transitionLeaveTimeout={1000}>
          {
            this.state.bgImages.map((i) => {
              return (
                <div className={classNames('Banner-bg', 'Banner-bg-' + i)} key={'Banner-bg-' + i} />
              );
            })
          }
        </ReactCSSTransitionGroup>
        <div className={classNames('Banner-item', 'Banner-item-' + this.state.bgImageIndex)} id="Banner-item-1">
          <div className="Banner-item-text-wrapper text-center">
            <div className="Banner-item-text Banner-item-text-1">The Best Homecare Option</div>
            <div className="Banner-item-text Banner-item-text-2">Family Caregivers</div>
            <div className="Banner-item-text Banner-item-text-3">From SGD 30 / Visit</div>
            <a href="/booking1" className="btn btn-primary Banner-item-button Banner-item-text-4" onClick={Link.handleClick}>BOOK A CAREGIVER</a>
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

}
