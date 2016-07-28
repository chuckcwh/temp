import React, { Component } from 'react';
import { connect } from 'react-redux';
import s from './Actions.css';
import Container from '../Container';
import Link from '../Link';
import { getTotalSessionsCount } from '../../actions';

const imgActions1 = require('./actions-1.png');
const imgActions2 = require('./actions-2.png');

class Actions extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sessionsCount: undefined,
    };
  }

  componentDidMount() {
    // this.startCounter();
  }

  getStatistics = () => {
    this.props.getTotalSessionsCount().then((res) => {
      if (res.response && res.response.status < 1) {
        // console.error('Failed to obtain statistics data.');
      }
    });
  };

  startCounter = () => {
    if (typeof window !== 'undefined') {
      if (window.location.hostname.indexOf('localhost') > -1) {
        // just retrieve once only during development, to prevent annoying multiple GET requests
        this.getStatistics();
      } else {
        window.setInterval(this.getStatistics, 5000);
      }
    }
  };

  handleContactUs = (event) => {
    event.preventDefault();

    typeof window !== 'undefined' && window.Tawk_API && window.Tawk_API.toggle();
  };

  render() {
    // let sessionsCountText;
    // if (this.props.totalSessionsCount) {
    //   sessionsCountText = (
    //     <h1 className="text-center">
    //       <span className="lead">{this.props.totalSessionsCount}</span><br />APPOINTMENTS BOOKED!
    //     </h1>
    //   );
    // }
    return (
      <div className={s.actions}>
        <Container>
          {/* <div className="Actions-statistics">
            {sessionsCountText}
          </div> */}
          <div className={s.actionsList}>
            <div className={s.actionsItem}>
              <img src={imgActions1} alt="Find A Caregiver" />
              {/* <div className="Actions-item-title">Book A Caregiver Online</div> */}
              <div className={s.actionsButton}>
                <Link to="/booking1" className={s.actionsItemButton}>Find A Caregiver</Link>
              </div>
            </div>
            <div className={s.actionsItem}>
              <img src={imgActions2} alt="Contact Us" />
              {/* <div className="Actions-item-title">Call Ebeecare Hotline</div> */}
              <div className={s.actionsButton}>
                <a href="#" className={s.actionsItemButton} onClick={this.handleContactUs}>Contact Us</a>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

}

Actions.propTypes = {
  totalSessionsCount: React.PropTypes.number,

  getTotalSessionsCount: React.PropTypes.func,
};

const mapStateToProps = (state) => ({
  totalSessionsCount: state.totalSessionsCount.data,
});

const mapDispatchToProps = (dispatch) => ({
  getTotalSessionsCount: () => dispatch(getTotalSessionsCount()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Actions);
