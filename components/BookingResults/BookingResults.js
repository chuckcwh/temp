import React, { Component } from 'react';
import request from 'superagent';
import moment from 'moment';
import linkState from 'react-link-state';
import Loader from 'react-loader';
import './BookingResults.scss';
import Link from '../Link';
import AlertPopup from '../AlertPopup';
import ConfirmPopup from '../ConfirmPopup';
import BookingActions from '../../actions/BookingActions';
import Location from '../../lib/Location';

export default class BookingResults extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sessions: undefined,
      slots: undefined
    };
  }

  componentDidMount() {
    // Reset sum displayed on sidebar
    BookingActions.setSum();

    this.serverRequest = request
      .get('http://161.202.19.121/api/getAvailableSchedule')
      .query({
        service: this.props.booking.service,
        dateStart: this.props.booking.range.start.format('YYYY-MM-DD'),
        dateEnd: this.props.booking.range.end.format('YYYY-MM-DD'),
        preferredPostalCode: this.props.booking.location.postalCode,
        'preferredTimes[]': this.props.booking.timeslots   // hack to send PHP style arrays
      })
      .auth('secret', 'secret0nlyWeilsonKnowsShhh852~')
      .end((err, res) => {
        if (err) {
          return console.error('http://161.202.19.121/api/getAvailableSchedule', status, err.toString());
        }
        if (res.body && res.body.timeSlots && Array.isArray(res.body.timeSlots)) {
          // console.log(res.body.timeSlots);
          var sessions = [], checkedData = [], sum = 0;
          for (var i = 0; i < res.body.timeSlots.length; i++) {
            var timeslot = res.body.timeSlots[i];
            var session = {};
            for (var j = 0; j < timeslot.slots.length; j++) {
              if (timeslot.slots[j]['preferred']) {
                session = timeslot.slots[j];
                break;
              }
            }
            sessions[i] = Object.assign(session, {date: timeslot.date});
            checkedData['session'+i] = true;
            sum += parseFloat(sessions[i]['price']);
          }
          var state = Object.assign({
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
    this.serverRequest && this.serverRequest.abort();
  }

  render() {
    var checkedLink = key => {
      return linkState(this, key);
    };
    var handleChange = key => {
      return e => {
        checkedLink(key).requestChange(e.target.checked);

        var sum = 0;
        for (var i = 0; i < this.state.sessions.length; i++) {
          if (this.state['session'+i]) {
            sum += parseFloat(this.state.sessions[i].price);
          }
        }
        // this.props.booking.sum = this.state.sum;
        BookingActions.setSum(sum);
      };
    }
    return (
      <div className="BookingResults">
        <Loader className="spinner" loaded={this.state.sessions ? true : false}>
          <div>
          {
            this.state.sessions && this.state.sessions.map((session, index) => {
              return (
                <div className="BookingResultsItem" key={index}>
                  <input className="BookingResultsCheckbox" type="checkbox" id={index} name="time" checked={checkedLink('session'+index).value} onChange={handleChange('session'+index)} />
                  <label className="BookingResultsCheckboxLabel" htmlFor={index}>
                    <span></span>
                    <div className="BookingResultsCheckboxLabelMetaWrapper">
                      <div className="BookingResultsCheckboxLabelMeta">
                        <span>{session ? moment(session.date, 'YYYY-MM-DD').format('DD MMM') : ''}</span>
                        <span>{session ? session.time : 'Not Available'}</span>
                        <span>{session ? '$ ' + session.price : ''}</span>
                      </div>
                    </div>
                  </label>
                </div>
              );
            })
          }
          </div>
          <p></p>
          <div className="text-center">
            <a href="/booking4" className="btn btn-primary" onClick={this._onNext.bind(this)}>BOOK NOW</a>
          </div>
        </Loader>
        <AlertPopup ref={(c) => this._alertPopup = c}>
          Please select at least one session.
        </AlertPopup>
        <ConfirmPopup ref={(c) => this._confirmPopup = c}>
          <div>
            <form ref={(c) => this._agreeForm = c}>
              <input className="AgreeCheckbox" type="checkbox" id="agree" name="agree" value={false} required />
              <label className="AgreeCheckboxLabel" htmlFor="agree">
                <span></span><span>By making this booking, I agree to the <a href="/terms-of-service" target="_blank">Terms of Service</a> and <a href="/privacy-policy" target="_blank">Privacy Policy</a>.</span>
              </label>
            </form>
          </div>
        </ConfirmPopup>
        <AlertPopup ref={(c) => this._rejectPopup = c}>
          To continue, please accept our Terms of Service and Privacy Policy.
        </AlertPopup>
      </div>
    );
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
      this._alertPopup.show();
      return event.preventDefault();
    }
    
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
        this._rejectPopup.show();
      }
    });
      
    // } else {
    event.preventDefault();
    // }
  }

}
