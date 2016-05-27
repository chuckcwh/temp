import React, { Component } from 'react';
import './CloseButton.scss';

class CloseButton extends Component {

  render() {
    return (
      <a onClick={() => this.props.onCloseClicked()} role="button" className="CloseButton">&times;</a>
    );
  }
}

CloseButton.displayName = 'CloseButton';

CloseButton.propTypes = {
  onCloseClicked: React.PropTypes.func
};

export default CloseButton;
