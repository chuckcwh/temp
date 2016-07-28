import React from 'react';
import classNames from 'classnames';
import s from './LabelButton.css';

const LabelButton = (props) => (
  <a
    onClick={props.onClick}
    role="button"
    className={classNames(s.labelButton, props.selected ? s.labelButtonSelected : undefined)}
  >
    {props.children}
  </a>
);

LabelButton.displayName = 'LabelButton';

LabelButton.propTypes = {
  children: React.PropTypes.node,

  selected: React.PropTypes.bool,
  onClick: React.PropTypes.func,
};

LabelButton.defaultProps = {
  selected: false,
  onClick: () => {},
};

export default LabelButton;
