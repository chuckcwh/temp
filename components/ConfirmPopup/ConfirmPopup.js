import React, { Component } from 'react';
import { connect } from 'react-redux';
import Popup from '../Popup';
import s from './ConfirmPopup.css';
import { hideConfirmPopup } from '../../actions';

class ConfirmPopup extends Component {

  onClickOk = () => {
    this.props.hideConfirmPopup();
    this.props.onConfirmed && this.props.onConfirmed();
    this.props.accept && this.props.accept();
  };

  onClickCancel = () => {
    this.props.hideConfirmPopup();
  };

  render() {
    return (
      <div className={s.confirmPopup}>
        <Popup
          css={s}
          title="Confirmation"
          isOpen={this.props.visible}
          onCloseClicked={this.onClickCancel}
        >
          {this.props.message}
          {this.props.children}
          <div className={s.confirmPopupFooter}>
            <a className="btn btn-primary btn-small" href="#" onClick={this.onClickOk}>OK</a>
            <a className="btn btn-primary btn-small" href="#" onClick={this.onClickCancel}>Cancel</a>
          </div>
        </Popup>
      </div>
    );
  }

}

ConfirmPopup.propTypes = {
  children: React.PropTypes.node,
  onConfirmed: React.PropTypes.func,

  visible: React.PropTypes.bool,
  message: React.PropTypes.node,
  accept: React.PropTypes.func,

  hideConfirmPopup: React.PropTypes.func,
};

const mapStateToProps = (state) => ({
  visible: state.modal.confirm.visible,
  message: state.modal.confirm.message,
  accept: state.modal.confirm.accept,
});

const mapDispatchToProps = (dispatch) => ({
  hideConfirmPopup: () => dispatch(hideConfirmPopup()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmPopup);
