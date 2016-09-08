import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import linkState from 'react-link-state';
import Loader from 'react-loader';
import s from './BookingResults.css';
import ConfirmPopup from '../ConfirmPopup';
import { getAvailableSchedules, getPromo, setOrderSum, setOrderPromoCode, setOrderSessions, setLastPage,
  createBookingWithOptions, showAlertPopup, showConfirmPopup } from '../../actions';
import history from '../../core/history';
import { isNextLastPage, calcRate, configToName } from '../../core/util';

class BookingResults extends Component {

  constructor(props) {
    super(props);
    const { order } = props;
    this.state = {
      schedules: undefined,
      slots: undefined,
      promoCode: order && order.promoCode && order.promoCode.code,
      showPromoButton: (order && order.promoCode && order.promoCode.code && order.promoCode.code.length),
      disablePromo: (order && order.promoCode),
      agree: false,
    };
  }

  componentDidMount() {
    const { services, order } = this.props;
    // Reset sum displayed on sidebar
    this.props.setOrderSum(null);

    this.props.getAvailableSchedules({
      serviceId: order.service,
      classId: services[order.service].classes[order.serviceClass]._id,
      dates: order.dates.map(date => moment(date).format('YYYY-MM-DD')),
      preferredTimes: order.timeslots,
    }).then((res) => {
      if (res.response && res.response.status < 1) {
        // console.error('Failed to obtain timeslots data.');
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.schedules !== nextProps.schedules) {
      const schedules = [];
      const checkedData = [];
      let sum = 0;
      for (let i = 0; i < nextProps.schedules.length; i++) {
        const timeslot = nextProps.schedules[i];
        let session = {};
        for (let j = 0; j < timeslot.slots.length; j++) {
          if (timeslot.slots[j].selected && timeslot.slots[j].preferred) {
            session = timeslot.slots[j];
            break;
          }
        }
        if (!session.time) {
          for (let j = 0; j < timeslot.slots.length; j++) {
            if (timeslot.slots[j].selected) {
              session = timeslot.slots[j];
              break;
            }
          }
        }
        schedules[i] = Object.assign(session, { date: timeslot.date });
        if (session.time) {
          checkedData[`session${i}`] = true;
          sum += calcRate(schedules[i], this.props.order.promoCode, this.props.order.service);
        } else {
          session.disabled = true;
        }
      }
      this.setState(Object.assign({
        schedules,
      }, checkedData));
      this.props.setOrderSum(sum);
    }
    if (this.props.order.promoCode !== nextProps.order.promoCode) {
      this.updateSum(nextProps);
    }
    if (this.props.order.sessions !== nextProps.order.sessions) {
      this.props.createBookingWithOptions({
        services: nextProps.services,
        order: nextProps.order,
        user: nextProps.user,
      });
      const location = history.getCurrentLocation();
      history.push({ pathname: '/booking5', query: location && location.query });
    }
  }

  onKeyPromo = (event) => {
    if (event.target.value && event.target.value.length) {
      this.setState({
        promoCode: event.target.value,
        showPromoButton: true,
      });
    } else {
      this.setState({
        promoCode: event.target.value,
        showPromoButton: false,
      });
    }
  };

  onApplyPromo = (event) => {
    if (this.promoForm.checkValidity()) {
      event.preventDefault();

      this.props.getPromo({
        code: this.state.promoCode,
      }).then((res) => {
        if (res.response && res.response.promoCode && res.response.promoCode.status === 'Active') {
          this.setState({
            promoCode: res.response.promoCode.code,
            disablePromo: true,
          });
          this.props.setOrderPromoCode(res.response.promoCode);
        } else {
          this.props.showAlertPopup('Your promotion code is not valid.');
          // console.error('Failed to obtain promo code data.');

          this.setState({ promoCode: undefined });
        }
      });
    } else {
      this.props.showAlertPopup('Please enter your promotion code.');

      this.setState({ promoCode: undefined });
    }
  };

  onRemovePromo = (event) => {
    event.preventDefault();
    this.setState({
      promoCode: undefined,
      disablePromo: false,
    });
    this.props.setOrderPromoCode(null);
  };

  onCheckedAgree = (event) => {
    this.setState({
      agree: event.target.checked,
    });
  };

  onConfirmed = () => {
    if (this.agreeForm.checkValidity()) {
      const schedules = [];
      for (let i = 0; i < this.state.schedules.length; i++) {
        if (this.state[`session${i}`]) {
          schedules.push(this.state.schedules[i]);
        }
      }

      // console.log(schedules);
      this.props.setOrderSessions(schedules);
      // console.log(this.state);
      isNextLastPage('booking3c', this.props.lastPage) && this.props.setLastPage('booking3c');

      // Delay execution till order is updated
      // this.props.createCaseWithOrder(this.props.order);
      // history.push({ pathname: '/booking5', query: location && location.query });
    } else {
      this.props.showAlertPopup('To continue, please accept our Terms of Service and Privacy Policy.');
    }
  };

  onNext = (event) => {
    const location = history.getCurrentLocation();

    const schedules = [];
    for (let i = 0; i < this.state.schedules.length; i++) {
      if (this.state[`session${i}`]) {
        schedules.push(this.state.schedules[i]);
      }
    }

    if (schedules.length === 0) {
      this.props.showAlertPopup('Please select at least one session.');
      event.preventDefault();
      return;
    }

    this.setState({ agree: false });

    event.preventDefault();

    if (this.props.isLoggedIn) {
      this.props.showConfirmPopup();
    } else {
      history.push({ pathname: '/booking4', query: location && location.query });

      // console.log(schedules);
      this.props.setOrderSessions(schedules);
      // console.log(this.state);
      isNextLastPage('booking3c', this.props.lastPage) && this.props.setLastPage('booking3c');
    }
  };

  updateSum(props) {
    let sum = 0;
    for (let i = 0; i < this.state.schedules.length; i++) {
      if (this.state[`session${i}`]) {
        sum += calcRate(this.state.schedules[i], props.order.promoCode, props.order.service);
      }
    }
    props.setOrderSum(sum);
  }

  render() {
    const checkedLink = key => linkState(this, key);
    const handleChange = key => e => {
      checkedLink(key).requestChange(e.target.checked);

      this.updateSum(this.props);
    };
    const { config, isLoggedIn, order } = this.props;
    const orderPromoCode = order && order.promoCode;
    let promoButton;
    if (this.state.showPromoButton) {
      if (order.promoCode) {
        promoButton = (
          <button className="btn btn-primary btn-small" onClick={this.onRemovePromo}>Remove</button>
        );
      } else {
        promoButton = (
          <button className="btn btn-primary btn-small" onClick={this.onApplyPromo}>Apply</button>
        );
      }
    }
    return (
      <div className={s.bookingResults}>
        <Loader className="spinner" loaded={!this.props.schedulesFetching}>
          <div>
          {
            this.state.schedules && this.state.schedules.map((session, index) => {
              let discountedRate,
                priceText;
              const rate = session.price;
              if (orderPromoCode) {
                discountedRate = calcRate(session, order.promoCode, order.service);
                if (discountedRate === rate) {
                  // empty discountedRate if there is actually no discount
                  discountedRate = null;
                }
              }
              if (orderPromoCode && discountedRate) {
                priceText = (
                  <span>
                    <span className="strike-through nowrap">$ {!isNaN(rate) && parseFloat(rate).toFixed(2)}</span>
                    <span className="nowrap"> $ {!isNaN(discountedRate) && parseFloat(discountedRate).toFixed(2)}</span>
                  </span>
                );
              } else {
                priceText = (
                  <span className="nowrap">$ {!isNaN(rate) && parseFloat(rate).toFixed(2)}</span>
                );
              }
              return (
                <div className={s.bookingResultsItem} key={index}>
                  <input
                    className={s.bookingResultsCheckbox}
                    type="checkbox"
                    id={index}
                    name="time"
                    checked={checkedLink(`session${index}`).value}
                    disabled={session.disabled}
                    onChange={handleChange(`session${index}`)}
                  />
                  <label className={s.bookingResultsCheckboxLabel} htmlFor={index}>
                    <span></span>
                    <div className={s.bookingResultsCheckboxLabelMetaWrapper}>
                      <div className={s.bookingResultsCheckboxLabelMeta}>
                        <span>{session ? moment(session.date, 'YYYY-MM-DD').format('DD MMM') : ''}</span>
                        <span>{session.time ? configToName(config, 'timeSlotsByValue', session.time) : 'Not Available'}</span>
                        <span>{session.time ? priceText : ''}</span>
                      </div>
                    </div>
                  </label>
                </div>
              );
            })
          }
          </div>
          <form ref={(c) => (this.promoForm = c)} autoComplete="off">
            <div className={s.bookingPromoSection}>
              <div>
                <input
                  type="text"
                  id="promoCode"
                  name="promoCode"
                  value={this.state.promoCode || ''}
                  onChange={this.onKeyPromo}
                  placeholder="Promotion Code (Optional)"
                  maxLength="50"
                  disabled={this.state.disablePromo}
                  required
                />
              </div>
              <div>
                {promoButton}
              </div>
            </div>
          </form>
          <p></p>
          <div className="text-center">
            <a href="#" className="btn btn-primary" onClick={this.onNext}>{isLoggedIn ? 'BOOK NOW' : 'NEXT'}</a>
          </div>
        </Loader>
        <ConfirmPopup onConfirmed={this.onConfirmed}>
          <div>
            <form ref={(c) => (this.agreeForm = c)}>
              <input
                className={s.agreeCheckbox}
                type="checkbox"
                id="agree"
                name="agree"
                checked={this.state.agree}
                onChange={this.onCheckedAgree}
                required
              />
              <label className={s.agreeCheckboxLabel} htmlFor="agree">
                <span></span>
                <span>
                  By making this booking, I agree to the
                  &nbsp;<a href="/terms-of-service" target="blank">Terms of Service</a>&nbsp;
                  and
                  &nbsp;<a href="/privacy-policy" target="blank">Privacy Policy</a>
                  .</span>
              </label>
            </form>
          </div>
        </ConfirmPopup>
      </div>
    );
  }

}

BookingResults.propTypes = {
  config: React.PropTypes.object,
  lastPage: React.PropTypes.string,
  user: React.PropTypes.object,
  isLoggedIn: React.PropTypes.bool,
  services: React.PropTypes.object,
  order: React.PropTypes.object,
  schedules: React.PropTypes.array,
  schedulesFetching: React.PropTypes.bool,

  getAvailableSchedules: React.PropTypes.func.isRequired,
  getPromo: React.PropTypes.func.isRequired,
  setOrderSum: React.PropTypes.func.isRequired,
  setOrderPromoCode: React.PropTypes.func.isRequired,
  setOrderSessions: React.PropTypes.func.isRequired,
  setLastPage: React.PropTypes.func.isRequired,
  createBookingWithOptions: React.PropTypes.func.isRequired,
  showAlertPopup: React.PropTypes.func.isRequired,
  showConfirmPopup: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  config: state.config.data,
  lastPage: state.lastPage,
  user: state.user.data,
  isLoggedIn: !!(state.user.data && state.user.data._id),
  services: state.services.data,
  order: state.order,
  schedules: state.availableSchedules.data,
  schedulesFetching: state.availableSchedules.isFetching,
});

const mapDispatchToProps = (dispatch) => ({
  getAvailableSchedules: (params) => dispatch(getAvailableSchedules(params)),
  getPromo: (params) => dispatch(getPromo(params)),
  setOrderSum: (sum) => dispatch(setOrderSum(sum)),
  setOrderPromoCode: (promoCode) => dispatch(setOrderPromoCode(promoCode)),
  setOrderSessions: (schedules) => dispatch(setOrderSessions(schedules)),
  setLastPage: (page) => dispatch(setLastPage(page)),
  createBookingWithOptions: (params) => dispatch(createBookingWithOptions(params)),
  showAlertPopup: (message) => dispatch(showAlertPopup(message)),
  showConfirmPopup: () => dispatch(showConfirmPopup()),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookingResults);
