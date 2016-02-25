import React, { Component } from 'react';
import './BookingSidebar.scss';

export default class BookingSidebar extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="BookingSidebar">
        <div className="BookingSidebarTitle">
          Your Booking
        </div>
        <div className="BookingSidebarContent">
          <div className="BookingSidebarService">
            <div className="BookingSidebarItem">Nasogastric Tube (NGT) Feeding</div>
          </div>
          <div className="BookingSidebarDates">
            <div className="BookingSidebarItem">Nasogastric Tube (NGT) Feeding</div>
          </div>
          <div className="BookingSidebarTimings">
            <div className="BookingSidebarItem">Nasogastric Tube (NGT) Feeding</div>
          </div>
          <div className="BookingSidebarSlots">
            <div className="BookingSidebarItem"></div>
          </div>
        </div>
        <div className="BookingSidebarFooter">
          <div className="BookingSidebarPrice">
            <span className="BookingSidebarPriceLabel">Price</span>
            <span className="BookingSidebarPriceCost">SGD 110</span>
          </div>
        </div>
      </div>
    );
  }

}
