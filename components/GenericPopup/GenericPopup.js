import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import s from './GenericPopup.css';
import Container from '../Container';
import Link from '../Link';
import Popup from '../Popup';
import { hideGenericPopup } from '../../actions';
import history from '../../core/history';


class GenericPopup extends Component {

  constructor(props) {
    super(props);

    this.state = {}
  }

  render() {
    // TODO: need Loader

    return (
      <div className={s.genericPopup}>
        <Popup
          css={s}
          isOpen={this.props.visible}
          onCloseClicked={this.props.hideGenericPopup}
          onOverlayClicked={this.props.hideGenericPopup}
        >
          {this.props.children}
        </Popup>
      </div>
    );
  }
}

GenericPopup.propTypes = {
};

const mapStateToProps = (state) => ({
  visible: state.modal.generic.visible,
});

const mapDispatchToProps = (dispatch) => ({
  hideGenericPopup: () => dispatch(hideGenericPopup()),
});

export default connect(mapStateToProps, mapDispatchToProps)(GenericPopup);
