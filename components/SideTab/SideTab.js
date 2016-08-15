import React, { Component } from 'react';
import cx from 'classnames';
import s from './SideTab.css';

class SideTab extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: props.selected,
    };
  }

  componentWillReceiveProps(props) {
    this.setState({ selected: props.selected });
  }

  render() {
    return (
      <li className={cx(s.sideTab, this.props.selected ? s.sideTabActive : null)}>
        <a className={s.sideTabLink} href="#" onClick={this.props.onSelect}>
          {this.props.children}
        </a>
      </li>
    );
  }

}

SideTab.propTypes = {
  children: React.PropTypes.node,

  onSelect: React.PropTypes.func,
  selected: React.PropTypes.bool,
};

SideTab.defaultProps = {
  onSelect: () => {},
  selected: false,
};

export default SideTab;
