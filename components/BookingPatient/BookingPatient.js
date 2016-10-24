import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import s from './BookingPatient.css';
import Container from '../Container';
import BookingPatientForm from '../BookingPatientForm';
import DayPickerPopup from '../DayPickerPopup';
import ConfirmPopup from '../ConfirmPopup';
import { S3_UPLOAD_URL_SUCCESS, S3_UPLOAD_SUCCESS, setOrderBooker, setLastPage,
  createBookingWithOptions, showLoginPopup, showDayPickerPopup,
  showAlertPopup, showConfirmPopup, getS3UploadUrl, uploadS3 } from '../../actions';
import history from '../../core/history';
import { getUniqueId, isNextLastPage } from '../../core/util';

class BookingPatient extends Component {

  constructor(props) {
    super(props);
    this.state = {
      agree: false,
      uploading: undefined,
    };
  }

  componentWillMount() {
    this.agreeId = getUniqueId();
  }

  componentWillReceiveProps(props) {
    if (props.order.booker !== this.props.order.booker) {
      const location = history.getCurrentLocation();
      props.createBookingWithOptions({
        services: props.services,
        order: props.order,
        location,
      });
      isNextLastPage('booking4', props.lastPage) && props.setLastPage('booking4');
      history.push({ pathname: '/booking5', query: location && location.query });
    }
  }

  onCheckedAgree = (event) => {
    this.setState({
      agree: event.target.checked,
    });
  };

  onConfirmed = () => {
    if (this.agreeForm.checkValidity()) {
      if (!this.formValues) return;
      const values = this.formValues;
      Promise.all((values.additionalInfoImages || []).map(file => new Promise((resolve, reject) => {
        this.setState({ uploading: true });
        this.props.getS3UploadUrl({
          fileType: file.type,
          acl: 'private',
        }).then((res) => {
          const { signedRequest, url } = res.response;
          if (res && res.type === S3_UPLOAD_URL_SUCCESS) {
            this.props.uploadS3(signedRequest, file).then(res => {
              if (res && res.type === S3_UPLOAD_SUCCESS) {
                resolve(url);
              } else {
                reject();
              }
            });
          } else {
            reject();
          }
        });
      }))).then(additionalInfoImages => {
        this.setState({ uploading: false });
        const user = {
          clientName: values.clientName,
          clientEmail: values.clientEmail,
          clientContact: values.clientContact,
          patientName: values.patientName,
          patientDob: values.patientDob,
          patientContact: values.patientContact,
          patientIdNum: values.patientIdNum,
          patientGender: values.patientGender,
          additionalInfo: values.additionalInfo,
          additionalInfoImages,
          isPatient: values.isPatient,
        };
        // console.log(user);
        this.props.setOrderBooker(user);
      });

      // Delay execution till order is officially updated
      // this.props.createBookingWithOptions(this.props.order, location);
      // util.isNextLastPage('booking4', this.props.lastPage) && this.props.setLastPage('booking4');
      // history.push({ pathname: '/booking5', query: location && location.query });
    } else {
      this.props.showAlertPopup('To continue, please accept our Terms of Service and Privacy Policy.');
    }
  };

  onNext = (values) => {
    this.formValues = values;
    return new Promise((resolve) => {
      this.props.showConfirmPopup();

      resolve();
    });
  }

  render() {
    const { uploading } = this.state;
    return (
      <div className={s.bookingPatient}>
        <Loader className="spinner" loaded={!uploading}>
          <Container>
            <div className={s.bookingPatientWrapper}>
              <div className={s.bookingPatientBody}>
                <BookingPatientForm
                  showDayPickerPopup={this.props.showDayPickerPopup}
                  showLoginPopup={this.props.showLoginPopup}
                  showAlertPopup={this.props.showAlertPopup}
                  onNext={this.onNext}
                />
              </div>
              {this.props.children}
            </div>
          </Container>
        </Loader>
        <DayPickerPopup
          title="Date of Birth"
          toMonth={new Date()}
        />
        <ConfirmPopup onConfirmed={this.onConfirmed}>
          <div>
            <form ref={(c) => (this.agreeForm = c)}>
              <input
                className={s.agreeCheckbox}
                type="checkbox"
                id={this.agreeId}
                checked={this.state.agree}
                onChange={this.onCheckedAgree}
                required
              />
              <label className={s.agreeCheckboxLabel} htmlFor={this.agreeId}>
                <span></span>
                <span>
                  By making this booking, I agree to the&nbsp;
                  <a href="/terms-of-service" target="_blank">Terms of Service</a> and&nbsp;
                  <a href="/privacy-policy" target="_blank">Privacy Policy</a>.
                </span>
              </label>
            </form>
          </div>
        </ConfirmPopup>
      </div>
    );
  }

}

BookingPatient.propTypes = {
  children: React.PropTypes.node.isRequired,

  services: React.PropTypes.object,
  lastPage: React.PropTypes.string,
  order: React.PropTypes.object,

  setOrderBooker: React.PropTypes.func.isRequired,
  setLastPage: React.PropTypes.func.isRequired,
  createBookingWithOptions: React.PropTypes.func.isRequired,
  showLoginPopup: React.PropTypes.func.isRequired,
  showDayPickerPopup: React.PropTypes.func.isRequired,
  showAlertPopup: React.PropTypes.func.isRequired,
  showConfirmPopup: React.PropTypes.func.isRequired,
  getS3UploadUrl: React.PropTypes.func.isRequired,
  uploadS3: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  services: state.services.data,
  lastPage: state.lastPage,
  order: state.order,
});

const mapDispatchToProps = (dispatch) => ({
  setOrderBooker: (booker) => dispatch(setOrderBooker(booker)),
  setLastPage: (page) => dispatch(setLastPage(page)),
  createBookingWithOptions: (options) => dispatch(createBookingWithOptions(options)),
  showLoginPopup: () => dispatch(showLoginPopup()),
  showDayPickerPopup: (value, source) => dispatch(showDayPickerPopup(value, source)),
  showAlertPopup: (message) => dispatch(showAlertPopup(message)),
  showConfirmPopup: () => dispatch(showConfirmPopup()),
  getS3UploadUrl: (params) => dispatch(getS3UploadUrl(params)),
  uploadS3: (signedUrl, data) => dispatch(uploadS3(signedUrl, data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookingPatient);
