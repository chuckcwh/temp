import React, { Component } from 'react';
import { connect } from 'react-redux';
import Popup from '../Popup';
import s from './AlertPopup.css';
import { hideAlertPopup } from '../../actions';

class AlertPopup extends Component {

  closePopup = () => {
    this.props.hideAlertPopup();
  };

  render() {
    return (
      <div className={s.alertPopup}>
        <Popup css={s} title="Alert" isOpen={this.props.visible} onCloseClicked={this.closePopup}>
          {this.props.message}
          {this.props.children}
          <div className={s.alertPopupFooter}>
            <a className="btn btn-primary btn-small" href="#" onClick={this.closePopup}>OK</a>
          </div>
        </Popup>
      </div>
    );
  }

}

AlertPopup.propTypes = {
  children: React.PropTypes.node,

  visible: React.PropTypes.bool,
  message: React.PropTypes.node,

  hideAlertPopup: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  visible: state.modal.alert && state.modal.alert.visible,
  message: state.modal.alert && state.modal.alert.message,
});

const mapDispatchToProps = (dispatch) => ({
  hideAlertPopup: () => dispatch(hideAlertPopup()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AlertPopup);
