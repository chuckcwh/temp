import React, { Component } from 'react';
import classNames from 'classnames';
import s from './Popup.css';

class Popup extends Component {

  componentWillUpdate(nextProps) {
    if (nextProps.isOpen && !this.props.isOpen && this.props.beforeOpen) {
      this.props.beforeOpen();
    }

    if (!nextProps.isOpen && this.props.isOpen && this.props.beforeClose) {
      this.props.beforeClose();
    }
  }

  componentDidUpdate(prevProps) {
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
    if (this.props.onOverlayClicked) {
      this.props.onOverlayClicked();
    }
  }

  render() {
    // Combines with parent's styles for override
    const css = Object.keys(s).reduce((result, style) => {
      result[style] = (this.props.css && this.props.css[style]) ? [
        s[style],
        this.props.css[style],
      ].join(' ') : s[style];
      return result;
    }, {});

    let overlay,
      closeButton;

    if (this.props.showOverlay) {
      overlay = (
        <div
          onClick={() => this.onOverlayClicked()}
          className={classNames(css.popupOverlay, (this.props.isOpen ? css.popupOverlayVisible : ''))}
        ></div>
      );
    }

    if (!this.props.hideCloseButton) {
      closeButton = (
        <a onClick={() => this.onCloseClicked()} role="button" className={css.popupCloseButton}>&times;</a>
      );
    }

    return (
      <section className={css.popup}>
        {overlay}
        <div className={classNames(css.popupDialog, (this.props.isOpen ? css.popupDialogVisible : ''))}>
          {closeButton}
          <h2 className={css.popupTitle}>{this.props.title}</h2>
          {this.props.children}
        </div>
      </section>
    );
  }
}

Popup.displayName = 'Popup';

Popup.propTypes = {
  children: React.PropTypes.node,
  css: React.PropTypes.object,

  isOpen: React.PropTypes.bool.isRequired,
  afterClose: React.PropTypes.func,
  afterOpen: React.PropTypes.func,
  beforeClose: React.PropTypes.func,
  beforeOpen: React.PropTypes.func,
  closeButtonStyle: React.PropTypes.object,
  dialogStyles: React.PropTypes.object,
  hideCloseButton: React.PropTypes.bool,
  hideOnOverlayClicked: React.PropTypes.bool,
  onCloseClicked: React.PropTypes.func,
  onOverlayClicked: React.PropTypes.func,
  overlayStyles: React.PropTypes.object,
  showOverlay: React.PropTypes.bool,
  title: React.PropTypes.string,
  titleStyle: React.PropTypes.object,
};

Popup.defaultProps = {
  title: '',
  showOverlay: true,
  hideOnOverlayClicked: true,
};

export default Popup;
