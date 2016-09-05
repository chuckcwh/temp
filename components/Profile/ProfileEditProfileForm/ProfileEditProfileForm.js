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
import { changeAvatar } from '../../../actions';


const s3Url = 'https://ebeecare-dev.s3.amazonaws.com/';

class ProfileEditProfileForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      newAvatar: this.props.avatar,
      processing: false,
    }
  }

  onHandleUpload = (e) => {
    e.preventDefault();
    return console.log('fuck');
  };

  _crop = () => {
    this.setState({
      newAvatar: this.refs.cropper.getCroppedCanvas().toDataURL()
    })
  };

  handleFile = (e) => {
    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onload = (upload) => {
      this.setState({
        newAvatar: upload.target.result,
        newAvatarName: file.name,
        filetype: file.type,
      })
    }

    reader.readAsDataURL(file);
  }

  render() {
    const { newAvatar, uploadCheck, file, newAvatarName } = this.state;
    let processing;

    if (this.state.processing) {
      processing = "Processing image, hang tight";
    }

    var crop = {
      x: 20,
      y: 10,
      width: 30,
      height: 10
    }

    return (
      <div className={s.ProfileEditProfileForm}>

        <div>
          <ReactCrop src={newAvatar} crop={crop} />
        </div>



        <p className={s.formUpload}>
          <span className={s.formUploadNote}>Note!</span> Max File Size: 4MB
        </p>


        <form onSubmit={this.handleSubmit} encType="multipart/form-data">
          <input type="file" onChange={this.handleFile} />
          <input disabled={this.state.processing} className='btn btn-primary' type="submit" value="Upload" />
          {processing}
        </form>

        {/*
        <label for="file-upload" className={cx("btn", "btn-primary", s.inputLabel)}>
          <input type="file" className={s.inputfile} onChange={this.handleImgChange} />
          Choose a file
        </label>
        */}

        <span className={s.newAvatarName}>{newAvatarName}</span>

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

const mapStateToProps = (state) => {
  const user = state.user.data;

  return {
    avatar: user && (user.avatar ? `${s3Url}${avatar}` : require('../../../assets/images/noimage.gif')),
  }
}

const mapDispatchToProps = (state) => ({
  changeAvatar: (params) => dispatch(changeAvatar(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEditProfileForm);
