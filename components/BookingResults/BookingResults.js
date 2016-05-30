import React, { Component } from 'react';
import { connect } from 'react-redux';
import assign from 'object-assign';
import moment from 'moment';
import linkState from 'react-link-state';
import Loader from 'react-loader';
import './BookingResults.scss';
import Link from '../Link';
import ConfirmPopup from '../ConfirmPopup';
import { getSessions, getPromo, setOrderSum, setOrderPromoCode, setOrderSessions, setLastPage, showAlertPopup, showConfirmPopup } from '../../actions';
import Location from '../../core/Location';
import Util from '../../core/Util';

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
        sessions[i] = assign(session, {date: timeslot.date});
        if (session.time) {
          checkedData['session'+i] = true;
          sum += Util.calcRate(sessions[i], this.props.order.promoCode, this.props.order.service);
        } else {
          session.disabled = true;
        }
      }
      var state = assign({
        sessions: sessions
      }, checkedData);
      this.setState(state);
      this.props.setOrderSum(sum);
    }
    if (this.props.order.promoCode !== nextProps.order.promoCode) {
      this._updateSum(nextProps);
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
    var promoButton;
    if (this.state.showPromoButton) {
      if (this.props.order.promoCode) {
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
      <div className="BookingResults">
        <Loader className="spinner" loaded={this.props.sessionsFetching ? false : true}>
          <div>
          {
            this.state.sessions && this.state.sessions.map((session, index) => {
              var promo, rate, discountedRate, priceText;
              promo = this.props.order.promoCode;
              rate = session.price;
              if (promo) {
                discountedRate = Util.calcRate(session, this.props.order.promoCode, this.props.order.service).toFixed(2);
                if (discountedRate == rate) {
                  // empty discountedRate if there is actually no discount
                  discountedRate = null;
                }
              }
              if (promo && discountedRate) {
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
                <div className="BookingResultsItem" key={index}>
                  <input className="BookingResultsCheckbox" type="checkbox" id={index} name="time" checked={checkedLink('session'+index).value} disabled={session.disabled} onChange={handleChange('session'+index)} />
                  <label className="BookingResultsCheckboxLabel" htmlFor={index}>
                    <span></span>
                    <div className="BookingResultsCheckboxLabelMetaWrapper">
                      <div className="BookingResultsCheckboxLabelMeta">
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
            <div className="BookingPromoSection">
              <div>
                <input type="text" id="promoCode" name="promoCode" value={this.state.promoCode} onChange={this._onKeyPromo.bind(this)} placeholder="Promotion Code (Optional)" maxLength="50" disabled={this.state.disablePromo} required />
              </div>
              <div>
                {promoButton}
              </div>
            </div>
          </form>
          <p></p>
          <div className="text-center">
            <a href="/booking4" className="btn btn-primary" onClick={this._onNext.bind(this)}>BOOK NOW</a>
          </div>
        </Loader>
        <ConfirmPopup onConfirmed={this._onConfirmed.bind(this)}>
          <div>
            <form ref={(c) => this._agreeForm = c}>
              <input className="AgreeCheckbox" type="checkbox" id="agree" name="agree" checked={this.state.agree} onChange={this._onCheckedAgree.bind(this)} required />
              <label className="AgreeCheckboxLabel" htmlFor="agree">
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

      Location.push({ pathname: '/booking4', query: this.props.location && this.props.location.query });

      // console.log(sessions);
      this.props.setOrderSessions(sessions);
      // console.log(this.state);
      Util.isNextLastPage('booking3c', this.props.lastPage) && this.props.setLastPage('booking3c');
    } else {
      this.props.showAlertPopup('To continue, please accept our Terms of Service and Privacy Policy.');
    }
  }

  _onNext(event) {
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

    this.props.showConfirmPopup();

    event.preventDefault();
  }

  _updateSum(props) {
    var sum = 0;
    for (var i = 0; i < this.state.sessions.length; i++) {
      if (this.state['session'+i]) {
        sum += Util.calcRate(this.state.sessions[i], props.order.promoCode, props.order.service);
      }
    }
    props.setOrderSum(sum);
  }

}

const mapStateToProps = (state) => {
  return {
    location: state.router && state.router.location,
    lastPage: state.lastPage,
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
    showAlertPopup: (message) => {
      return dispatch(showAlertPopup(message));
    },
    showConfirmPopup: () => {
      return dispatch(showConfirmPopup());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingResults);
