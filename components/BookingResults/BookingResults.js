import React, { Component } from 'react';
import assign from 'object-assign';
import request from 'superagent';
import moment from 'moment';
import linkState from 'react-link-state';
import Loader from 'react-loader';
import './BookingResults.scss';
import Link from '../Link';
import AlertPopup from '../AlertPopup';
import ConfirmPopup from '../ConfirmPopup';
import BookingActions from '../../actions/BookingActions';
import Location from '../../core/Location';
import Util from '../../core/Util';

export default class BookingResults extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sessions: undefined,
      slots: undefined,
      promoCode: undefined,
      showPromoButton: false,
      disablePromo: false,
      agree: false
    };
  }

  componentDidMount() {
    // Reset sum displayed on sidebar
    BookingActions.setSum();

    this.serverRequest1 = request
      .get(Util.host + '/api/getAvailableSchedule')
      .query({
        service: this.props.booking.service,
        'dates[]': this.props.booking.dates.map(date => {
          return moment(date).format('YYYY-MM-DD');
        }),
        preferredPostalCode: this.props.booking.location.postalCode,
        'preferredTimes[]': this.props.booking.timeslots   // hack to send PHP style arrays
      })
      .auth(Util.authKey, Util.authSecret)
      .end((err, res) => {
        if (err) {
          return console.error(Util.host + '/api/getAvailableSchedule', status, err.toString());
        }
        if (res.body && res.body.timeSlots && Array.isArray(res.body.timeSlots)) {
          // console.log(res.body.timeSlots);
          var sessions = [], checkedData = [], sum = 0;
          for (var i = 0; i < res.body.timeSlots.length; i++) {
            var timeslot = res.body.timeSlots[i];
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
              sum += Util.calcRate(sessions[i], this.props.booking.promoCode, this.props.booking.service);
            } else {
              session.disabled = true;
            }
          }
          var state = assign({
            slots: res.body.timeSlots,
            sessions: sessions
          }, checkedData);
          this.setState(state);
          BookingActions.setSum(sum);
        } else {
          console.error('Failed to obtain timeslots data.');
        }
      });
  }

  componentWillUnmount() {
    this.serverRequest1 && this.serverRequest1.abort();
  }

  render() {
    var checkedLink = key => {
      return linkState(this, key);
    };
    var handleChange = key => {
      return e => {
        checkedLink(key).requestChange(e.target.checked);

        this._updateSum();
      };
    }
    var promoButton;
    if (this.state.showPromoButton) {
      if (this.props.booking.promoCode) {
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
        <Loader className="spinner" loaded={this.state.sessions ? true : false}>
          <div>
          {
            this.state.sessions && this.state.sessions.map((session, index) => {
              var promo, rate, discountedRate, priceText;
              promo = this.props.booking.promoCode;
              rate = session.price;
              if (promo) {
                discountedRate = Util.calcRate(session, this.props.booking.promoCode, this.props.booking.service).toFixed(2);
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
          <form ref={(c) => this._promoForm = c}>
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
        <AlertPopup ref={(c) => this._alertPopup = c} />
        <ConfirmPopup ref={(c) => this._confirmPopup = c}>
          <div>
            <form ref={(c) => this._agreeForm = c}>
              <input className="AgreeCheckbox" type="checkbox" id="agree" name="agree" checked={this.state.agree} onChange={this._onCheckedAgree.bind(this)} required />
              <label className="AgreeCheckboxLabel" htmlFor="agree">
                <span></span><span>By making this booking, I agree to the <a href="/terms-of-service" target="_blank">Terms of Service</a> and <a href="/privacy-policy" target="_blank">Privacy Policy</a>.</span>
              </label>
            </form>
          </div>
        </ConfirmPopup>
        <AlertPopup ref={(c) => this._rejectPopup = c} />
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

      this.serverRequest2 = request
        .get(Util.host + '/api/checkPromocode')
        .query({
          code: this.state.promoCode
        })
        .auth(Util.authKey, Util.authSecret)
        .end((err, res) => {
          if (err) {
            return console.error(Util.host + '/api/checkPromocode', status, err.toString());
          }
          // console.log(res.body);
          if (res.body && res.body.status === 1 && res.body.promoCode && res.body.promoCode.status === 'Active') {
            // console.log(res.body.timeSlots);
            this.setState({
              promoCode: res.body.promoCode.code,
              disablePromo: true
            });
            BookingActions.setPromoCode(res.body.promoCode);

            this._updateSum();
          } else {
            this._alertPopup.show('Your promotion code is not valid.');
            console.error('Failed to obtain promo code data.');

            this.setState({promoCode: undefined});
          }
        });
    } else {
      this._alertPopup.show('Please enter your promotion code.');

      this.setState({promoCode: undefined});
    }
  }

  _onRemovePromo(event) {
    event.preventDefault();
    this.setState({
      promoCode: undefined,
      disablePromo: false
    });
    BookingActions.setPromoCode();

    this._updateSum();
  }

  _onCheckedAgree(event) {
    this.setState({
      agree: event.target.checked
    });
  }

  _onNext(event) {
    var sessions = [];
    for (var i = 0; i < this.state.sessions.length; i++) {
      if (this.state['session'+i]) {
        sessions.push(this.state.sessions[i]);
      }
    }

    if (sessions.length === 0) {
      // alert('Please choose at least one session.');
      this._alertPopup.show('Please select at least one session.');
      return event.preventDefault();
    }

    this.setState({ agree: false });
    
    // if (confirm('Would you like to confirm the sessions?')) {
    this._confirmPopup.show(() => {
      if (this._agreeForm.checkValidity()) {
        // Link.handleClick(event);
        Location.push({ pathname: '/booking4' });

        // console.log(sessions);
        BookingActions.setSessions(sessions);
        // console.log(this.state);
        BookingActions.setLast('booking3c');
      } else {
        this._rejectPopup.show('To continue, please accept our Terms of Service and Privacy Policy.');
      }
    });
      
    // } else {
    event.preventDefault();
    // }
  }

  _updateSum() {
    var sum = 0;
    for (var i = 0; i < this.state.sessions.length; i++) {
      if (this.state['session'+i]) {
        sum += Util.calcRate(this.state.sessions[i], this.props.booking.promoCode, this.props.booking.service);
      }
    }
    // this.props.booking.sum = this.state.sum;
    BookingActions.setSum(sum);
  }

}
