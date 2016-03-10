import React, { Component } from 'react';
import './Banner.scss';
import Link from '../Link';

export default class Banner extends Component {

  render() {
    return (
      <div className="Banner">
        <div className="Banner-item" id="Banner-item-1">
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

}
