import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import linkState from 'react-link-state';
import Loader from 'react-loader';
import s from './BookingResults.css';
import Link from '../Link';
import ConfirmPopup from '../ConfirmPopup';
import { getSessions, getPromo, setOrderSum, setOrderPromoCode, setOrderSessions, setLastPage, createCaseWithOrder, showAlertPopup, showConfirmPopup } from '../../actions';
import history from '../../core/history';
import util from '../../core/util';

class BookingResults extends Component {

  constructor(props) {
    super(props);
    const { order } = props;
    this.state = {
      sessions: undefined,
      slots: undefined,
      promoCode: order && order.promoCode && order.promoCode.code,
      showPromoButton: (order && order.promoCode && order.promoCode.code && order.promoCode.code.length) ? true : false,
      disablePromo: (order && order.promoCode) ? true : false,
      agree: false
    };
  }

  componentDidMount() {
    const { order } = this.props;
    // Reset sum displayed on sidebar
    this.props.setOrderSum(null);

    this.props.getSessions({
      service: order.service,
      dates: order.dates.map(date => {
        return moment(date).format('YYYY-MM-DD');
      }),
      preferredPostalCode: order.location.postalCode,
      preferredTimes: order.timeslots   // hack to send PHP style arrays
    }).then((res) => {
      if (res.response && res.response.status < 1) {
        console.error('Failed to obtain timeslots data.');
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.sessions !== nextProps.sessions) {
      var sessions = [], checkedData = [], sum = 0;
      for (var i = 0; i < nextProps.sessions.length; i++) {
        var timeslot = nextProps.sessions[i];
        var session = {};
        for (var j = 0; j < timeslot.slots.length; j++) {
          if (timeslot.slots[j]['selected'] && timeslot.slots[j]['preferred']) {
            session = timeslot.slots[j];
            break;
          }
        }
        if (!session.time) {
          for (var j = 0; j < timeslot.slots.length; j++) {
            if (timeslot.slots[j]['selected']) {
              session = timeslot.slots[j];
              break;
            }
          }
        }
        sessions[i] = Object.assign(session, {date: timeslot.date});
        if (session.time) {
          checkedData['session'+i] = true;
          sum += util.calcRate(sessions[i], this.props.order.promoCode, this.props.order.service);
        } else {
          session.disabled = true;
        }
      }
      var state = Object.assign({
        sessions: sessions
      }, checkedData);
      this.setState(state);
      this.props.setOrderSum(sum);
    }
    if (this.props.order.promoCode !== nextProps.order.promoCode) {
      this._updateSum(nextProps);
    }
    if (this.props.order.sessions !== nextProps.order.sessions) {
      this.props.createCaseWithOrder(nextProps.order);
      const location = history.getCurrentLocation();
      history.push({ pathname: '/booking5', query: location && location.query });
    }
  }

  render() {
    var checkedLink = key => {
      return linkState(this, key);
    };
    var handleChange = key => {
      return e => {
        checkedLink(key).requestChange(e.target.checked);

        this._updateSum(this.props);
      };
    }
    const { order } = this.props;
    const orderPromoCode = order && order.promoCode;
    let promoButton;
    if (this.state.showPromoButton) {
      if (order.promoCode) {
        promoButton = (
          <button className="btn btn-primary btn-small" onClick={this._onRemovePromo.bind(this)}>Remove</button>
        );
      } else {
        promoButton = (
          <button className="btn btn-primary btn-small" onClick={this._onApplyPromo.bind(this)}>Apply</button>
        );
      }
    }
    return (
      <div className={s.bookingResults}>
        <Loader className="spinner" loaded={this.props.sessionsFetching ? false : true}>
          <div>
          {
            this.state.sessions && this.state.sessions.map((session, index) => {
              let rate, discountedRate, priceText;
              rate = session.price;
              if (orderPromoCode) {
                discountedRate = util.calcRate(session, order.promoCode, order.service).toFixed(2);
                if (discountedRate == rate) {
                  // empty discountedRate if there is actually no discount
                  discountedRate = null;
                }
              }
              if (orderPromoCode && discountedRate) {
                priceText = (
                  <span>
                    <span className="strike-through nowrap">$ {rate}</span><span className="nowrap"> $ {discountedRate}</span>
                  </span>
                );
              } else {
                priceText = (
                  <span className="nowrap">$ {rate}</span>
                );
              }
              return (
                <div className={s.bookingResultsItem} key={index}>
                  <input className={s.bookingResultsCheckbox} type="checkbox" id={index} name="time" checked={checkedLink('session'+index).value} disabled={session.disabled} onChange={handleChange('session'+index)} />
                  <label className={s.bookingResultsCheckboxLabel} htmlFor={index}>
                    <span></span>
                    <div className={s.bookingResultsCheckboxLabelMetaWrapper}>
                      <div className={s.bookingResultsCheckboxLabelMeta}>
                        <span>{session ? moment(session.date, 'YYYY-MM-DD').format('DD MMM') : ''}</span>
                        <span>{session.time ? session.time : 'Not Available'}</span>
                        <span>{session.time ? priceText : ''}</span>
                      </div>
                    </div>
                  </label>
                </div>
              );
            })
          }
          </div>
          <form ref={(c) => this._promoForm = c} autoComplete="off">
            <div className={s.bookingPromoSection}>
              <div>
                <input type="text" id="promoCode" name="promoCode" value={this.state.promoCode || ''} onChange={this._onKeyPromo.bind(this)} placeholder="Promotion Code (Optional)" maxLength="50" disabled={this.state.disablePromo} required />
              </div>
              <div>
                {promoButton}
              </div>
            </div>
          </form>
          <p></p>
          <div className="text-center">
            <a href="#" className="btn btn-primary" onClick={this._onNext.bind(this)}>{this.props.user ? 'BOOK NOW' : 'NEXT'}</a>
          </div>
        </Loader>
        <ConfirmPopup onConfirmed={this._onConfirmed.bind(this)}>
          <div>
            <form ref={(c) => this._agreeForm = c}>
              <input className={s.agreeCheckbox} type="checkbox" id="agree" name="agree" checked={this.state.agree} onChange={this._onCheckedAgree.bind(this)} required />
              <label className={s.agreeCheckboxLabel} htmlFor="agree">
                <span></span><span>By making this booking, I agree to the <a href="/terms-of-service" target="_blank">Terms of Service</a> and <a href="/privacy-policy" target="_blank">Privacy Policy</a>.</span>
              </label>
            </form>
          </div>
        </ConfirmPopup>
      </div>
    );
  }

  _onKeyPromo(event) {
    if (event.target.value && event.target.value.length) {
      this.setState({
        promoCode: event.target.value,
        showPromoButton: true
      });
    } else {
      this.setState({
        promoCode: event.target.value,
        showPromoButton: false
      });
    }
  }

  _onApplyPromo(event) {
    if (this._promoForm.checkValidity()) {
      event.preventDefault();

      this.props.getPromo({
        code: this.state.promoCode
      }).then((res) => {
        if (res.response && res.response.promoCode && res.response.promoCode.status === 'Active') {
          this.setState({
            promoCode: res.response.promoCode.code,
            disablePromo: true
          });
          this.props.setOrderPromoCode(res.response.promoCode);
        } else {
          this.props.showAlertPopup('Your promotion code is not valid.');
          console.error('Failed to obtain promo code data.');

          this.setState({promoCode: undefined});
        }
      });
    } else {
      this.props.showAlertPopup('Please enter your promotion code.');

      this.setState({promoCode: undefined});
    }
  }

  _onRemovePromo(event) {
    event.preventDefault();
    this.setState({
      promoCode: undefined,
      disablePromo: false
    });
    this.props.setOrderPromoCode(null);
  }

  _onCheckedAgree(event) {
    this.setState({
      agree: event.target.checked
    });
  }

  _onConfirmed() {
    if (this._agreeForm.checkValidity()) {
      var sessions = [];
      for (var i = 0; i < this.state.sessions.length; i++) {
        if (this.state['session'+i]) {
          sessions.push(this.state.sessions[i]);
        }
      }

      // console.log(sessions);
      this.props.setOrderSessions(sessions);
      // console.log(this.state);
      util.isNextLastPage('booking3c', this.props.lastPage) && this.props.setLastPage('booking3c');

      // Delay execution till order is updated
      // this.props.createCaseWithOrder(this.props.order);
      // history.push({ pathname: '/booking5', query: location && location.query });
    } else {
      this.props.showAlertPopup('To continue, please accept our Terms of Service and Privacy Policy.');
    }
  }

  _onNext(event) {
    const location = history.getCurrentLocation();

    var sessions = [];
    for (var i = 0; i < this.state.sessions.length; i++) {
      if (this.state['session'+i]) {
        sessions.push(this.state.sessions[i]);
      }
    }

    if (sessions.length === 0) {
      this.props.showAlertPopup('Please select at least one session.');
      return event.preventDefault();
    }

    this.setState({ agree: false });

    event.preventDefault();

    if (this.props.user) {
      this.props.showConfirmPopup();
    } else {
      var sessions = [];
      for (var i = 0; i < this.state.sessions.length; i++) {
        if (this.state['session'+i]) {
          sessions.push(this.state.sessions[i]);
        }
      }

      history.push({ pathname: '/booking4', query: location && location.query });

      // console.log(sessions);
      this.props.setOrderSessions(sessions);
      // console.log(this.state);
      util.isNextLastPage('booking3c', this.props.lastPage) && this.props.setLastPage('booking3c');
    }
  }

  _updateSum(props) {
    var sum = 0;
    for (var i = 0; i < this.state.sessions.length; i++) {
      if (this.state['session'+i]) {
        sum += util.calcRate(this.state.sessions[i], props.order.promoCode, props.order.service);
      }
    }
    props.setOrderSum(sum);
  }

}

const mapStateToProps = (state) => {
  return {
    lastPage: state.lastPage,
    user: state.user.data,
    order: state.order,
    sessions: state.sessions.data,
    sessionsFetching: state.sessions.isFetching
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getSessions: (params) => {
      return dispatch(getSessions(params));
    },
    getPromo: (params) => {
      return dispatch(getPromo(params));
    },
    setOrderSum: (sum) => {
      return dispatch(setOrderSum(sum));
    },
    setOrderPromoCode: (promoCode) => {
      return dispatch(setOrderPromoCode(promoCode));
    },
    setOrderSessions: (sessions) => {
      return dispatch(setOrderSessions(sessions));
    },
    setLastPage: (page) => {
      return dispatch(setLastPage(page));
    },
    createCaseWithOrder: (order) => {
      return dispatch(createCaseWithOrder(order));
    },
    showAlertPopup: (message) => {
      return dispatch(showAlertPopup(message));
    },
    showConfirmPopup: () => {
      return dispatch(showConfirmPopup());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingResults);
