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
    const { selectable } = this.props;
    return (
      <li className={cx(s.sideTab, this.props.selected ? s.sideTabActive : null)}>
        <a
          className={cx(s.sideTabLink, !selectable ? s.sideTabLinkDisabled : undefined)}
          href="#"
          onClick={selectable ? this.props.onSelect : (e) => e.preventDefault()}
        >
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
  selectable: React.PropTypes.bool,
};

SideTab.defaultProps = {
  onSelect: () => {},
  selected: false,
  selectable: true,
};

export default SideTab;
