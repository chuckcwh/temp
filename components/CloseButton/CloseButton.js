import React from 'react';
import s from './CloseButton.css';

const CloseButton = (props) => (
  <a onClick={() => props.onCloseClicked()} role="button" className={s.closeButton}>&times;</a>
);

CloseButton.propTypes = {
  onCloseClicked: React.PropTypes.func,
};

export default CloseButton;
