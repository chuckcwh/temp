import React, { Component } from 'react';
import classNames from 'classnames';
import './Popup.scss';

class Popup extends Component {

  constructor(props){
    super(props);
    this.state = { isVisible: false };
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.isVisible && !this.state.isVisible && this.props.beforeOpen) {
      this.props.beforeOpen();
    }

    if (!nextState.isVisible && this.state.isVisible && this.props.beforeClose) {
      this.props.beforeClose();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.isVisible && this.state.isVisible && this.props.afterOpen) {
      this.props.afterOpen();
    }

    if (prevState.isVisible && !this.state.isVisible && this.props.afterClose) {
      this.props.afterClose();
    }
  }

  show() {
    this.setState({isVisible: true});
  }

  hide() {
    this.setState({isVisible: false});
  }

  onOverlayClicked() {
    if (this.props.hideOnOverlayClicked) {
      this.hide();
      if (this.props.onOverlayClicked) {
        this.props.onOverlayClicked();
      }
    }

    if (this.props.onOverlayClicked) {
      this.props.onOverlayClicked();
    }
 }

  render() {
    var overlay, closeButton;

    if (this.props.showOverlay) {
      overlay = (<div onClick={() => this.onOverlayClicked()} className={classNames('PopupOverlay', (this.state.isVisible ? 'visible' : ''))}></div>);
    }

    if (!this.props.hideCloseButton) {
      closeButton = (<a onClick={() => this.hide()} role="button" className="PopupCloseButton">&times;</a>);
    }

    return (
      <section className="Popup">
        {overlay}
        <div className={classNames('PopupDialog', (this.state.isVisible ? 'visible' : ''))}>
          {closeButton}
          <h2 className="PopupTitle">{this.props.title}</h2>
          {this.props.children}
        </div>
      </section>
    )
  }
}

Popup.displayName = 'Popup';

Popup.propTypes = {
  afterClose: React.PropTypes.func,
  afterOpen: React.PropTypes.func,
  beforeClose: React.PropTypes.func,
  beforeOpen: React.PropTypes.func,
  closeButtonStyle: React.PropTypes.object,
  dialogStyles: React.PropTypes.object,
  hideOnOverlayClicked: React.PropTypes.bool,
  onOverlayClicked: React.PropTypes.func,
  overlayStyles: React.PropTypes.object,
  showOverlay: React.PropTypes.bool,
  title: React.PropTypes.string,
  titleStyle: React.PropTypes.object
};

Popup.defaultProps = {
  title: '',
  showOverlay: true,
  hideOnOverlayClicked: true
};

export default Popup;