import React, { Component } from 'react';
import classNames from 'classnames';
import s from './LabelButton.css';

class LabelButton extends Component {

  render() {
    const { selected, onClick } = this.props;
    return (
      <a onClick={onClick} role="button" className={classNames(s.labelButton, selected ? s.labelButtonSelected : undefined)}>
        {this.props.children}
      </a>
    );
  }
}

LabelButton.displayName = 'LabelButton';

LabelButton.propTypes = {
  selected: React.PropTypes.bool,
  onClick: React.PropTypes.func
};

LabelButton.defaultProps = {
  selected: false,
  onClick: () => {}
};

export default LabelButton;
