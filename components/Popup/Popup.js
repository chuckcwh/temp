import React, { Component } from 'react';
import classNames from 'classnames';
import './Popup.scss';

class Popup extends Component {

  constructor(props){
    super(props);
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.isOpen && !this.props.isOpen && this.props.beforeOpen) {
      this.props.beforeOpen();
    }

    if (!nextProps.isOpen && this.props.isOpen && this.props.beforeClose) {
      this.props.beforeClose();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.isOpen && this.props.isOpen && this.props.afterOpen) {
      this.props.afterOpen();
    }

    if (prevProps.isOpen && !this.props.isOpen && this.props.afterClose) {
      this.props.afterClose();
    }
  }

  onCloseClicked() {
    if (this.props.onCloseClicked) {
      this.props.onCloseClicked();
    }
  }

  onOverlayClicked() {
    // if (this.props.hideOnOverlayClicked) {
    //   this.hide();
    //   if (this.props.onOverlayClicked) {
    //     this.props.onOverlayClicked();
    //   }
    // }

    if (this.props.onOverlayClicked) {
      this.props.onOverlayClicked();
    }
 }

  render() {
    var overlay, closeButton;

    if (this.props.showOverlay) {
      overlay = (<div onClick={() => this.onOverlayClicked()} className={classNames('PopupOverlay', (this.props.isOpen ? 'visible' : ''))}></div>);
    }

    if (!this.props.hideCloseButton) {
      closeButton = (<a onClick={() => this.onCloseClicked()} role="button" className="PopupCloseButton">&times;</a>);
    }

    return (
      <section className="Popup">
        {overlay}
        <div className={classNames('PopupDialog', (this.props.isOpen ? 'visible' : ''))}>
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
  isOpen: React.PropTypes.bool.isRequired,
  afterClose: React.PropTypes.func,
  afterOpen: React.PropTypes.func,
  beforeClose: React.PropTypes.func,
  beforeOpen: React.PropTypes.func,
  closeButtonStyle: React.PropTypes.object,
  dialogStyles: React.PropTypes.object,
  hideOnOverlayClicked: React.PropTypes.bool,
  onCloseClicked: React.PropTypes.func,
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
