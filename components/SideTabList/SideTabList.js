import React, { Component } from 'react';
import SideTab from '../SideTab';
import s from './SideTabList.css';

class SideTabList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: props.selectedIndex,
    };
  }

  handleSelect = (index) => (event) => {
    event.preventDefault();
    this.props.onSelect(index, this.state.selectedIndex);
    this.setState({ selectedIndex: index });
  };

  render() {
    const { children } = this.props;
    return (
      <ul className={s.sideTabList}>
        {
          React.Children.map(children, (child, index) =>
            React.cloneElement(child, {
              onSelect: this.handleSelect(index),
              selected: this.state.selectedIndex === index,
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
};

SideTabList.defaultProps = {
  onSelect: () => {},
  selectedIndex: undefined,
};

export default SideTabList;
