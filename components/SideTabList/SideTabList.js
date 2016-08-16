import React, { Component } from 'react';
import SideTab from '../SideTab';
import s from './SideTabList.css';

class SideTabList extends Component {

  constructor(props) {
    super(props);
  }

  handleSelect = (index) => (event) => {
    event.preventDefault();
    this.props.onSelect(index, this.state.selectedIndex);
  };

  render() {
    const { children, selectable, selectedIndex } = this.props;
    return (
      <ul className={s.sideTabList}>
        {
          React.Children.map(children, (child, index) =>
            React.cloneElement(child, {
              onSelect: this.handleSelect(index),
              selected: selectedIndex === index,
              selectable: selectable,
            })
          )
        }
      </ul>
    );
  }

}

SideTabList.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.instanceOf(SideTab),
    React.PropTypes.arrayOf(React.PropTypes.instanceOf(SideTab)),
  ]),

  onSelect: React.PropTypes.func,
  selectedIndex: React.PropTypes.number,
  selectable: React.PropTypes.bool,
};

SideTabList.defaultProps = {
  onSelect: () => {},
  selectedIndex: undefined,
  selectable: true,
};

export default SideTabList;
