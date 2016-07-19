import React, { Component } from 'react';
import s from './CloseButton.css';

class CloseButton extends Component {

  render() {
    return (
      <a onClick={() => this.props.onCloseClicked()} role="button" className={s.closeButton}>&times;</a>
    );
  }
}

CloseButton.displayName = 'CloseButton';

CloseButton.propTypes = {
  onCloseClicked: React.PropTypes.func
};

export default CloseButton;
