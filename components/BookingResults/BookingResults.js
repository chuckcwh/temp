import React, { Component } from 'react';
import moment from 'moment';
import linkState from 'react-link-state';
import Loader from 'react-loader';
import './BookingResults.scss';
import Link from '../Link';
import { serialize } from '../../lib/Utils';
import BookingActions from '../../actions/BookingActions';

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

    var params = {
      service: this.props.booking.service,
      dateStart: this.props.booking.range.start.format('YYYY-MM-DD'),
      dateEnd: this.props.booking.range.end.format('YYYY-MM-DD'),
      preferredPostalCode: this.props.booking.location.postalCode,
      preferredTimes: this.props.booking.timeslots
    };
    // console.log('http://161.202.19.121/api/getAvailableSchedule?' + serialize(params));
    fetch('http://161.202.19.121/api/getAvailableSchedule?' + serialize(params), {
      headers: {
        'Authorization': 'Basic ' + btoa('secret:secret0nlyWeilsonKnowsShhh852~')
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data && data.timeSlots && Array.isArray(data.timeSlots)) {
        // console.log(data.timeSlots);
        var sessions = [], checkedData = [], sum = 0;
        for (var i = 0; i < data.timeSlots.length; i++) {
          var timeslot = data.timeSlots[i];
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
          slots: data.timeSlots,
          sessions: sessions
        }, checkedData);
        this.setState(state);
        BookingActions.setSum(sum);
      } else {
        console.error('Failed to obtain timeslots data.');
      }
    })
    .catch(err => {
      console.error('http://161.202.19.121/api/getAvailableSchedule', status, err.toString());
    });
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
            <a href="/booking4" className="btn btn-primary" onClick={this._onNext.bind(this)}>NEXT</a>
          </div>
        </Loader>
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
      alert('Please choose at least one session.');
      return event.preventDefault();
    }
    
    if (confirm('Would you like to confirm the sessions?')) {
      Link.handleClick(event);

      // console.log(sessions);
      BookingActions.setSessions(sessions);
      // console.log(this.state);
      BookingActions.setLast('booking3c');
    } else {
      event.preventDefault();
    }
  }

}
