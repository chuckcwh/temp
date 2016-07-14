import React, { Component } from 'react';
import { connect } from 'react-redux';
import Popup from '../Popup';
import s from './ConfirmPopup.css';
import { hideConfirmPopup } from '../../actions';

class ConfirmPopup extends Component {

  render() {
    return (
      <div className={s.confirmPopup}>
        <Popup css={s} title="Confirmation" isOpen={this.props.visible} onCloseClicked={this._onClickCancel.bind(this)}>
          {this.props.message}
          {this.props.children}
          <div className={s.confirmPopupFooter}>
            <a className="btn btn-primary btn-small" href="#" onClick={this._onClickOk.bind(this)}>OK</a>
            <a className="btn btn-primary btn-small" href="#" onClick={this._onClickCancel.bind(this)}>Cancel</a>
          </div>
        </Popup>
      </div>
    );
  }

  _onClickOk(event) {
    this.props.hideConfirmPopup();
    this.props.onConfirmed && this.props.onConfirmed();
    this.props.accept && this.props.accept();
  }

  _onClickCancel(event) {
    this.props.hideConfirmPopup();
  }

}

ConfirmPopup.propTypes = {
  onConfirmed: React.PropTypes.func
};

const mapStateToProps = (state) => {
  return {
    visible: state.modal.confirm.visible,
    message: state.modal.confirm.message,
    accept: state.modal.confirm.accept
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    hideConfirmPopup: () => {
      return dispatch(hideConfirmPopup());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmPopup);
