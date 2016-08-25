import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import cx from 'classnames';
import moment from 'moment';
import s from './ProfileEditProfileForm.css';
import Container from '../../Container';
import Link from '../../Link';
import Header from '../../Header';
import history from '../../../core/history';
import util from '../../../core/util';
import ReactCrop from 'react-image-crop';


const dataUrl = 'https://ebeecare-dev.s3.amazonaws.com/';

class ProfileEditProfileForm extends Component {

  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {
    const { user } = this.props;
    this.setState({ avatarImg: `${dataUrl}${user.picture}` })
  }

  handleImgChange = (e) => {
    e.preventDefault();
    console.log('choose file');

    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    console.log('files', files[0].name);

    const reader = new FileReader();
    let newFile;

    return reader.onloadend = (e) => {
      this.setState({
        file: file[0],
        newFileName: files[0].name,
        avatarImg: e.target.result
      })
    }
  };

  onHandleUpload = (e) => {
    e.preventDefault();
    return console.log('fuck');
  };

  render() {
    const { user } = this.props;
    const { avatarImg, uploadCheck, file, newFileName } = this.state;

    return (
      <div className={s.ProfileEditProfileForm}>

        <div className={s.formMain}>
          <img className={s.avatarImg} src={avatarImg} />
        </div>


        <p className={s.formUpload}>
          <span className={s.formUploadNote}>Note!</span> Max File Size: 4MB
        </p>

        <label for="file-upload" className={cx("btn", "btn-primary", s.inputLabel)}>
          <input type="file" id="file-upload" className={s.inputfile} ref='fileInput' onChange={this.handleImgChange}/>
          Choose a file
        </label>

        {newFileName ? (<p>{newFileName}</p>) : ""}
        {uploadCheck && <div className={s.formError}>You have image errors.</div>}

        <div>
          <button
            className={cx("btn btn-primary", s.formSubmit)}
            onClick={this.onHandleUpload}>Save Changes
          </button>
        </div>


      </div>
    );
  }

}

const validate = values => {
  const errors = {};
  // if (!values.withdrawAmt) {
  //   errors.withdrawAmt = 'Required';
  // } else if (!/\d+/i.test(values.withdrawAmt)) {
  //   errors.withdrawAmt = 'Invalid withdraw amount';
  // }
}

ProfileEditProfileForm.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = (state) => ({
  user: state.user.data
});


export default connect(mapStateToProps)(ProfileEditProfileForm);
